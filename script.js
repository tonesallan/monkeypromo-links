/*
  MonkeyPromo Links
  Para ativar ou trocar um link, altere apenas este arquivo.
  enabled: true  => botão ativo
  enabled: false => mostra "Em breve"
*/

const linkConfig = {
  community: [
    {
      title: "Jardinagem",
      subtitle: "Ofertas para jardim, cultivo e ferramentas",
      icon: "🌱",
      accent: "rgba(88, 196, 105, .28)",
      url: "",
      enabled: false
    },
    {
      title: "Academia",
      subtitle: "Treino, fitness, roupas e acessórios",
      icon: "🏋️",
      accent: "rgba(73, 132, 255, .25)",
      url: "",
      enabled: false
    },
    {
      title: "Camping",
      subtitle: "Aventura, trilha e vida ao ar livre",
      icon: "🏕️",
      accent: "rgba(245, 166, 35, .25)",
      url: "",
      enabled: false
    },
    {
      title: "Casa & Utilidades",
      subtitle: "Achadinhos úteis para o dia a dia",
      icon: "🏠",
      accent: "rgba(173, 101, 255, .22)",
      url: "",
      enabled: false
    }
  ],

  stores: [
    {
      title: "Shopee",
      subtitle: "Achadinhos, cupons e promoções",
      icon: "🛍️",
      accent: "rgba(255, 106, 42, .27)",
      url: "",
      enabled: false
    },
    {
      title: "Mercado Livre",
      subtitle: "Ofertas selecionadas e oportunidades",
      icon: "🟡",
      accent: "rgba(255, 220, 55, .20)",
      url: "",
      enabled: false
    },
    {
      title: "Amazon",
      subtitle: "Produtos, ofertas e achados",
      icon: "📦",
      accent: "rgba(255, 153, 0, .20)",
      url: "",
      enabled: false
    },
    {
      title: "TikTok Shop",
      subtitle: "Produtos em alta e achadinhos",
      icon: "🎵",
      accent: "rgba(54, 226, 214, .18)",
      url: "",
      enabled: false
    }
  ],

  social: [
    {
      title: "Instagram",
      subtitle: "@monkey.promo • acompanhe os novos achadinhos",
      icon: "📸",
      accent: "rgba(225, 48, 108, .23)",
      url: "https://www.instagram.com/monkey.promo/",
      enabled: true
    },
    {
      title: "Telegram",
      subtitle: "Canal oficial de ofertas",
      icon: "✈️",
      accent: "rgba(39, 160, 216, .22)",
      url: "",
      enabled: false
    }
  ]
};

function createCard(item, layout = "list") {
  const isLive = Boolean(item.enabled && item.url);
  const tag = isLive ? "a" : "div";
  const el = document.createElement(tag);

  el.className = `link-card${isLive ? "" : " disabled"}`;
  el.style.setProperty("--card-accent", item.accent || "rgba(255,106,42,.16)");

  if (tag === "a") {
    el.href = item.url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.setAttribute("aria-label", `${item.title}: ${item.subtitle}`);
  }

  const status = isLive
    ? '<span class="status-badge live">Acessar</span>'
    : '<span class="status-badge soon">Em breve</span>';

  if (layout === "grid") {
    el.innerHTML = `
      <span class="card-topline">
        <span class="icon-box" aria-hidden="true">${item.icon}</span>
        ${status}
      </span>
      <span class="card-copy">
        <strong>${item.title}</strong>
        <small>${item.subtitle}</small>
      </span>
    `;
  } else {
    el.innerHTML = `
      <span class="icon-box" aria-hidden="true">${item.icon}</span>
      <span class="card-copy">
        <strong>${item.title}</strong>
        <small>${item.subtitle}</small>
      </span>
      ${isLive ? '<span class="card-end" aria-hidden="true">→</span>' : status}
    `;
  }

  return el;
}

function renderLinks(containerId, items, layout = "list") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(createCard(item, layout)));
  container.appendChild(fragment);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

async function shareMonkeyPromo() {
  const shareData = {
    title: "MonkeyPromo",
    text: "Achadinhos, promoções e grupos de ofertas em um só lugar.",
    url: "https://monkeypromo.pages.dev/"
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    showToast("Link copiado!");
  } catch (error) {
    if (error?.name === "AbortError") return;

    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast("Link copiado!");
    } catch {
      showToast("Copie: monkeypromo.pages.dev");
    }
  }
}

renderLinks("community-links", linkConfig.community, "grid");
renderLinks("store-links", linkConfig.stores);
renderLinks("social-links", linkConfig.social);

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("shareButton")?.addEventListener("click", shareMonkeyPromo);
