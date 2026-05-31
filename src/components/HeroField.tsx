/**
 * HeroField — Tier 3 WebGL hero moment (MOTION_PLAN §8, the gated/optional tier).
 *
 * The flat Money-Green hero gains a faint *living* surface: a slow low-contrast
 * value-noise drift (texture, not a gradient party) plus a soft sage glow that
 * tracks the cursor — a "signal field" for a performance shop. Cause-effect:
 * the surface responds to the pointer; otherwise it's near-still.
 *
 * Deliberately restrained to respect the austere brand. Heavily gated and
 * perf-budgeted so it can never hurt Lighthouse or feel like circus:
 *   - never mounts on touch, reduced-motion, or without WebGL
 *   - DPR capped at 1, throttled to ~30fps
 *   - paused when the hero scrolls out of view or the tab is hidden
 * If it doesn't mount, the CSS `background: var(--green)` shows underneath —
 * pixel-matched base colour, so the fallback is seamless. Easy to remove: drop
 * the single <HeroField/> line from the hero.
 */
"use client";

import { useEffect, useRef, useState } from "react";

const FRAG = `
precision mediump float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;   // 0..1, y up; (-1,-1) when pointer is away
uniform float uMouseOn;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f*f*(3.0 - 2.0*f);
  float a = hash(i), b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0)), d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);

  // slow drifting low-frequency field — two octaves, kept cheap
  float n = vnoise(p * 2.4 + vec2(uTime * 0.028, uTime * 0.018));
  n += 0.5 * vnoise(p * 4.8 - vec2(uTime * 0.013, 0.0));
  n /= 1.5;

  vec3 base = vec3(0.118, 0.302, 0.227);          // #1e4d3a Money Green
  vec3 col = base * (0.94 + 0.085 * n);           // ±~8% lightness breathing

  // soft sage glow following the cursor (cause-effect; very low intensity)
  if (uMouseOn > 0.5) {
    float d = distance(uv, uMouse);
    float glow = smoothstep(0.42, 0.0, d) * 0.05;
    col += glow * vec3(0.498, 0.659, 0.596);      // sage
  }

  // faint film grain — kills banding, adds texture
  float g = (hash(gl_FragCoord.xy + uTime) * 2.0 - 1.0) * 0.014;
  col += g;

  gl_FragColor = vec4(col, 1.0);
}`;

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

export default function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduce) return;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return; // no WebGL → CSS green stays

    setEnabled(true);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // fullscreen quad (two triangles)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseOn = gl.getUniformLocation(prog, "uMouseOn");

    const mouse = { x: -1, y: -1, on: 0 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        mouse.on = 0;
        return;
      }
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height; // flip to y-up
      mouse.on = 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width)); // DPR capped at 1
      const h = Math.max(1, Math.round(r.height));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // pause when offscreen or tab hidden
    let onScreen = true;
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let raf = 0;
    let last = 0;
    const FRAME = 1000 / 30; // throttle to ~30fps
    const start = performance.now();
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || document.hidden) return;
      if (t - last < FRAME) return;
      last = t;
      gl.uniform1f(uTime, (t - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      io.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-field"
      aria-hidden="true"
      style={{ opacity: enabled ? 1 : 0 }}
    />
  );
}
