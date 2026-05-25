/**
 * Meta Conversions API — server-side mirror of the browser Pixel Lead event.
 *
 * The browser fires `fbq('track', 'Lead', {}, { eventID })` from the thank-you
 * page; this endpoint fires the same Lead event server-side with the SAME
 * `event_id`. Meta deduplicates the pair (window: a few minutes) so analytics
 * see one conversion, not two — but the server-side leg keeps working when
 * the browser Pixel is blocked (iOS 14+, ad blockers, content-blocking DNS).
 *
 * Match quality stays at the "IP + UA" level for now. Email/phone hashing for
 * better attribution is a follow-up — would need the form to pass user-supplied
 * fields through to the thank-you page.
 *
 * Env vars (set in Vercel project → Settings → Environment Variables):
 *   META_PIXEL_ID     — public-ish; the 15-16 digit dataset ID
 *   META_CAPI_TOKEN   — SECRET; the System User Access Token from Events Manager
 *
 * Verify in Meta Events Manager → Test Events tab. The dedup pair shows up as
 * one event with two sources (browser + server).
 */
import type { APIRoute } from 'astro';

// Force this route to ship as a serverless function, not a static file.
export const prerender = false;

const GRAPH_API_VERSION = 'v19.0';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const pixelId = import.meta.env.META_PIXEL_ID;
  const token = import.meta.env.META_CAPI_TOKEN;

  if (!pixelId || !token) {
    return json({ error: 'CAPI not configured' }, 503);
  }

  let body: { event_id?: string; event_source_url?: string } = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.event_id) {
    return json({ error: 'event_id required for browser/server dedup' }, 400);
  }

  const userAgent = request.headers.get('user-agent') ?? '';
  const fbc = parseCookie(request.headers.get('cookie') ?? '', '_fbc');
  const fbp = parseCookie(request.headers.get('cookie') ?? '', '_fbp');

  const payload = {
    data: [
      {
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url ?? 'https://sncads.com/thank-you/',
        action_source: 'website',
        user_data: {
          client_ip_address: clientAddress,
          client_user_agent: userAgent,
          ...(fbc ? { fbc } : {}),
          ...(fbp ? { fbp } : {}),
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(
    token,
  )}`;

  let metaResult: unknown;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    metaResult = await res.json();
    if (!res.ok) {
      // Bubble Meta's error body so it's visible in Vercel logs; don't 502 on
      // the client (the browser Pixel already fired — server failure shouldn't
      // affect UX).
      console.error('CAPI Meta error', res.status, metaResult);
      return json({ ok: false, status: res.status, meta: metaResult }, 200);
    }
  } catch (err) {
    console.error('CAPI fetch threw', err);
    return json({ ok: false, error: 'fetch_failed' }, 200);
  }

  return json({ ok: true, meta: metaResult }, 200);
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function parseCookie(header: string, name: string): string | undefined {
  const match = header.split(/;\s*/).find((c) => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : undefined;
}
