const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

export const DEFAULT_CONFIG = Object.freeze({
  version: 1,
  brand: {
    name: "MonkeyPromo",
    tagline: "achadinhos & ofertas"
  },
  hero: {
    eyebrow: "ACHADINHOS & OFERTAS",
    title: "O MonkeyPromo caça.",
    highlight: "Você economiza.",
    description: "Achadinhos, cupons e promoções selecionados para você não perder tempo procurando."
  },
  benefits: [
    { icon: "⚡", text: "Ofertas frequentes" },
    { icon: "🏷️", text: "Várias lojas" },
    { icon: "🔎", text: "Curadoria MonkeyPromo" }
  ],
  whatsapp: {
    id: "whatsapp-main",
    enabled: true,
    title: "Falar com o MonkeyPromo no WhatsApp",
    subtitle: "Entre em contato pelo WhatsApp oficial",
    url: "https://wa.me/5567981659712?text=Ol%C3%A1%20MonkeyPromo%21%20Vim%20pelo%20Instagram."
  },
  announcement: {
    enabled: true,
    title: "O MonkeyPromo está crescendo",
    description: "Novas categorias, grupos e lojas estão chegando."
  },
  community: [],
  stores: [],
  social: [],
  footer: {
    affiliateNotice: "Alguns links podem ser de afiliado. Você não paga nada a mais por isso e o MonkeyPromo pode receber uma comissão pela indicação.",
    priceNotice: "Preços, cupons e disponibilidade podem mudar. Confira sempre as condições diretamente na loja antes da compra."
  },
  share: {
    title: "MonkeyPromo — Ofertas, Achadinhos e Cupons",
    text: "O MonkeyPromo caça. Você economiza. Veja achadinhos, cupons e promoções selecionadas."
  }
});

const isRecord = value =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const safeString = (value, fallback = "", maxLength = 320) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
};

const safeBoolean = (value, fallback = false) =>
  typeof value === "boolean" ? value : fallback;

const safeOrder = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const safeColor = (value, fallback = "#ff762f") => {
  if (typeof value !== "string") return fallback;
  return HEX_COLOR_PATTERN.test(value.trim()) ? value.trim() : fallback;
};

export function isValidUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    const parsed = new URL(value.trim());
    return ALLOWED_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}

function normalizeBenefit(item) {
  if (!isRecord(item)) return null;
  const text = safeString(item.text, "", 80);
  if (!text) return null;
  return {
    icon: safeString(item.icon, "", 8),
    text
  };
}

function normalizeItem(item, index) {
  if (!isRecord(item)) return null;

  const id = safeString(item.id, "", 80).toLowerCase();
  const title = safeString(item.title, "", 120);
  if (!id || !ID_PATTERN.test(id) || !title) return null;

  return {
    id,
    title,
    subtitle: safeString(item.subtitle, "", 180),
    icon: safeString(item.icon, "", 12),
    accent: safeColor(item.accent),
    url: typeof item.url === "string" ? item.url.trim() : "",
    enabled: safeBoolean(item.enabled, false),
    order: safeOrder(item.order, index + 1),
    _index: index
  };
}

function normalizeItems(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeItem)
    .filter(Boolean);
}

export function sortItems(items) {
  return [...items].sort((a, b) => {
    const orderDiff = a.order - b.order;
    return orderDiff || a._index - b._index;
  });
}

export function getRenderableItems(items) {
  return sortItems(Array.isArray(items) ? items : [])
    .filter(item => item.enabled && isValidUrl(item.url));
}

function normalizeWhatsapp(value) {
  const source = isRecord(value) ? value : {};
  const fallback = DEFAULT_CONFIG.whatsapp;
  const url = typeof source.url === "string" ? source.url.trim() : fallback.url;

  return {
    id: ID_PATTERN.test(safeString(source.id, fallback.id, 80))
      ? safeString(source.id, fallback.id, 80)
      : fallback.id,
    enabled: safeBoolean(source.enabled, fallback.enabled),
    title: safeString(source.title, fallback.title, 140),
    subtitle: safeString(source.subtitle, fallback.subtitle, 180),
    url,
    visible: safeBoolean(source.enabled, fallback.enabled) && isValidUrl(url)
  };
}

export function normalizeConfig(rawConfig) {
  const raw = isRecord(rawConfig) ? rawConfig : {};
  const brand = isRecord(raw.brand) ? raw.brand : {};
  const hero = isRecord(raw.hero) ? raw.hero : {};
  const announcement = isRecord(raw.announcement) ? raw.announcement : {};
  const footer = isRecord(raw.footer) ? raw.footer : {};
  const share = isRecord(raw.share) ? raw.share : {};

  const benefits = Array.isArray(raw.benefits)
    ? raw.benefits.map(normalizeBenefit).filter(Boolean).slice(0, 6)
    : DEFAULT_CONFIG.benefits;

  return {
    version: Number.isInteger(raw.version) ? raw.version : DEFAULT_CONFIG.version,
    brand: {
      name: safeString(brand.name, DEFAULT_CONFIG.brand.name, 80),
      tagline: safeString(brand.tagline, DEFAULT_CONFIG.brand.tagline, 100)
    },
    hero: {
      eyebrow: safeString(hero.eyebrow, DEFAULT_CONFIG.hero.eyebrow, 100),
      title: safeString(hero.title, DEFAULT_CONFIG.hero.title, 120),
      highlight: safeString(hero.highlight, DEFAULT_CONFIG.hero.highlight, 120),
      description: safeString(hero.description, DEFAULT_CONFIG.hero.description, 320)
    },
    benefits: benefits.length ? benefits : DEFAULT_CONFIG.benefits,
    whatsapp: normalizeWhatsapp(raw.whatsapp),
    announcement: {
      enabled: safeBoolean(announcement.enabled, DEFAULT_CONFIG.announcement.enabled),
      title: safeString(announcement.title, DEFAULT_CONFIG.announcement.title, 140),
      description: safeString(
        announcement.description,
        DEFAULT_CONFIG.announcement.description,
        240
      )
    },
    community: normalizeItems(raw.community),
    stores: normalizeItems(raw.stores),
    social: normalizeItems(raw.social),
    footer: {
      affiliateNotice: safeString(
        footer.affiliateNotice,
        DEFAULT_CONFIG.footer.affiliateNotice,
        420
      ),
      priceNotice: safeString(
        footer.priceNotice,
        DEFAULT_CONFIG.footer.priceNotice,
        420
      )
    },
    share: {
      title: safeString(share.title, DEFAULT_CONFIG.share.title, 160),
      text: safeString(share.text, DEFAULT_CONFIG.share.text, 280)
    }
  };
}

export async function loadConfig({
  fetchImpl = globalThis.fetch,
  url = "./site-config.json",
  logger = console
} = {}) {
  try {
    if (typeof fetchImpl !== "function") throw new Error("fetch indisponível");

    const response = await fetchImpl(url, { cache: "no-cache" });
    if (!response?.ok) {
      throw new Error(`site-config.json retornou HTTP ${response?.status ?? "desconhecido"}`);
    }

    const raw = await response.json();
    return { config: normalizeConfig(raw), source: "remote" };
  } catch (error) {
    logger?.error?.("[MonkeyPromo] Falha ao carregar site-config.json. Usando fallback.", error);
    return {
      config: normalizeConfig(DEFAULT_CONFIG),
      source: "fallback",
      error
    };
  }
}
