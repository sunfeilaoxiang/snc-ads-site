/**
 * UI strings for shared chrome (header, footer, closing CTA) in both locales.
 * Page body content lives in the page files themselves (one .astro per locale).
 */

export type Locale = "ru" | "en";

interface NavItem {
  label: string;
  path: string;
}

interface FooterCol {
  title: string;
  links: NavItem[];
}

interface UiStrings {
  nav: NavItem[];
  casesLabel: string;
  cta: string;
  menuOpen: string;
  menuClose: string;
  navAria: string;
  mobileNavAria: string;
  langLabel: string;
  langAria: string;
  consent: { text: string; accept: string; decline: string };
  footer: {
    services: FooterCol;
    company: FooterCol;
    contactTitle: string;
    rights: string;
  };
}

export const ui: Record<Locale, UiStrings> = {
  ru: {
    nav: [
      { label: "Услуги", path: "/services" },
      { label: "Подход", path: "/approach" },
      { label: "Инструменты", path: "/tools" },
      { label: "Контакт", path: "/contact" },
    ],
    casesLabel: "Кейсы",
    cta: "Получить аудит",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    navAria: "Основная навигация",
    mobileNavAria: "Мобильная навигация",
    langLabel: "EN",
    langAria: "Switch to English",
    consent: {
      text: "Мы используем аналитические cookie, чтобы видеть, что работает на сайте. Без них сайт работает так же.",
      accept: "Принять",
      decline: "Отклонить",
    },
    footer: {
      services: {
        title: "Услуги",
        links: [
          { label: "Meta Ads — ecommerce", path: "/services" },
          { label: "Meta Ads — lead-gen", path: "/services" },
          { label: "Креатив", path: "/services" },
        ],
      },
      company: {
        title: "Компания",
        links: [
          { label: "Подход", path: "/approach" },
          { label: "Кейсы", path: "/cases" },
          { label: "Контакт", path: "/contact" },
        ],
      },
      contactTitle: "Связь",
      rights: "© {year} SNC Advertising · Riga / EU",
    },
  },
  en: {
    nav: [
      { label: "Services", path: "/services" },
      { label: "Approach", path: "/approach" },
      { label: "Tools", path: "/tools" },
      { label: "Contact", path: "/contact" },
    ],
    casesLabel: "Cases",
    cta: "Get an audit",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    navAria: "Main navigation",
    mobileNavAria: "Mobile navigation",
    langLabel: "RU",
    langAria: "Переключить на русский",
    consent: {
      text: "We use analytics cookies to see what works on the site. Everything works without them, too.",
      accept: "Accept",
      decline: "Decline",
    },
    footer: {
      services: {
        title: "Services",
        links: [
          { label: "Meta Ads — ecommerce", path: "/services" },
          { label: "Meta Ads — lead-gen", path: "/services" },
          { label: "Creative", path: "/services" },
        ],
      },
      company: {
        title: "Company",
        links: [
          { label: "Approach", path: "/approach" },
          { label: "Cases", path: "/cases" },
          { label: "Contact", path: "/contact" },
        ],
      },
      contactTitle: "Contact",
      rights: "© {year} SNC Advertising · Riga / EU",
    },
  },
};
