import {
  getRenderableItems,
  loadConfig
} from "./config-core.js";

const byId = id => document.getElementById(id);

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}

function renderBrand(config) {
  setText("miniBrandName", config.brand.name);
  setText("miniBrandTagline", config.brand.tagline);
  setText("footerBrandName", config.brand.name);
}

function renderHero(config) {
  setText("heroEyebrow", config.hero.eyebrow);
  setText("heroDescription", config.hero.description);

  const title = byId("brand-title");
  if (title) {
    const highlight = document.createElement("span");
    highlight.textContent = config.hero.highlight;
    title.replaceChildren(
      document.createTextNode(config.hero.title),
      document.createElement("br"),
      highlight
    );
  }

  const benefits = byId("heroBenefits");
  if (benefits) {
    const nodes = config.benefits.map(benefit => {
      const item = document.createElement("span");
      item.textContent = [benefit.icon, benefit.text].filter(Boolean).join(" ");
      return item;
    });
    benefits.replaceChildren(...nodes);
  }
}

function renderWhatsApp(config) {
  const cta = byId("whatsappCta");
  if (!cta) return;

  cta.hidden = !config.whatsapp.visible;
  if (!config.whatsapp.visible) return;

  cta.href = config.whatsapp.url;
  cta.dataset.itemId = config.whatsapp.id;
  setText("whatsappTitle", config.whatsapp.title);
  setText("whatsappSubtitle", config.whatsapp.subtitle);
}

function renderAnnouncement(config) {
  const announcement = byId("announcement");
  if (!announcement) return;

  announcement.hidden = !config.announcement.enabled;
  if (!config.announcement.enabled) return;

  setText("announcementTitle", config.announcement.title);
  setText("announcementDescription", config.announcement.description);
}

function createCard(item, grid = false) {
  const link = document.createElement("a");
  link.className = `link-card${grid ? " grid-card" : ""}`;
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.dataset.itemId = item.id;
  link.style.setProperty("--card-accent", item.accent);

  const icon = document.createElement("span");
  icon.className = "icon-box";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = item.icon;

  const copy = document.createElement("span");
  copy.className = "card-copy";

  const title = document.createElement("strong");
  title.textContent = item.title;

  const subtitle = document.createElement("small");
  subtitle.textContent = item.subtitle;

  copy.append(title, subtitle);

  const end = document.createElement("span");
  end.className = "card-end";
  end.setAttribute("aria-hidden", "true");
  end.textContent = "→";

  link.append(icon, copy, end);
  return link;
}

function renderLinkSection(sectionId, containerId, items, grid = false) {
  const section = byId(sectionId);
  const container = byId(containerId);
  if (!section || !container) return 0;

  const visibleItems = getRenderableItems(items);
  container.replaceChildren(...visibleItems.map(item => createCard(item, grid)));
  section.hidden = visibleItems.length === 0;
  return visibleItems.length;
}

function renderCommunity(config) {
  const count = renderLinkSection(
    "interesses",
    "community-links",
    config.community,
    true
  );

  const interestCta = byId("interestCta");
  if (interestCta) interestCta.hidden = count === 0;
}

function renderStores(config) {
  renderLinkSection("lojas", "store-links", config.stores);
}

function renderSocial(config) {
  renderLinkSection("redes", "social-links", config.social);
}

function renderFooter(config) {
  setText("affiliateNotice", config.footer.affiliateNotice);
  setText("priceNotice", config.footer.priceNotice);
  setText("year", String(new Date().getFullYear()));
}

let toastTimer;

function showToast(message) {
  const toast = byId("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function shareMonkeyPromo(config) {
  const shareLabel = byId("shareLabel");
  const shareData = {
    title: config.share.title,
    text: config.share.text,
    url: window.location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    if (shareLabel) shareLabel.textContent = "Copiado";
    showToast("Link copiado!");
    setTimeout(() => {
      if (shareLabel) shareLabel.textContent = "Compartilhar";
    }, 1800);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error("[MonkeyPromo] Falha ao compartilhar.", error);
      showToast("Não foi possível compartilhar agora.");
    }
  }
}

function render(config) {
  renderBrand(config);
  renderHero(config);
  renderWhatsApp(config);
  renderAnnouncement(config);
  renderCommunity(config);
  renderStores(config);
  renderSocial(config);
  renderFooter(config);

  const shareButton = byId("shareButton");
  if (shareButton) {
    shareButton.addEventListener("click", () => shareMonkeyPromo(config));
  }
}

async function init() {
  const { config } = await loadConfig();
  render(config);
}

init().catch(error => {
  console.error("[MonkeyPromo] Falha inesperada na inicialização. O conteúdo estático foi preservado.", error);
});
