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
      subtitle: "Ofertas para jardim e cultivo",
      icon: "🌱",
      url: "",
      enabled: false
    },
    {
      title: "Academia",
      subtitle: "Treino, fitness e acessórios",
      icon: "🏋️",
      url: "",
      enabled: false
    },
    {
      title: "Camping",
      subtitle: "Aventura e vida ao ar livre",
      icon: "🏕️",
      url: "",
      enabled: false
    },
    {
      title: "Casa & Utilidades",
      subtitle: "Achadinhos para o dia a dia",
      icon: "🏠",
      url: "",
      enabled: false
    }
  ],

  stores: [
    {
      title: "Shopee",
      subtitle: "Achadinhos e promoções",
      icon: "🛍️",
      url: "",
      enabled: false
    },
    {
      title: "Mercado Livre",
      subtitle: "Ofertas selecionadas",
      icon: "🟡",
      url: "",
      enabled: false
    },
    {
      title: "Amazon",
      subtitle: "Produtos e oportunidades",
      icon: "📦",
      url: "",
      enabled: false
    },
    {
      title: "TikTok Shop",
      subtitle: "Achadinhos em alta",
      icon: "🎵",
      url: "",
      enabled: false
    }
  ],

  social: [
    {
      title: "Instagram",
      subtitle: "@monkey.promo",
      icon: "📸",
      url: "https://www.instagram.com/monkey.promo/",
      enabled: true
    },
    {
      title: "Telegram",
      subtitle: "Canal oficial",
      icon: "✈️",
      url: "",
      enabled: false
    }
  ]
};

function createCard(item, compact = false) {
  const tag = item.enabled && item.url ? "a" : "div";
  const el = document.createElement(tag);

  el.className = `link-card${item.enabled && item.url ? "" : " disabled"}`;

  if (tag === "a") {
    el.href = item.url;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  }

  el.innerHTML = `
    <span class="icon-box" aria-hidden="true">${item.icon}</span>
    <span class="card-copy">
      <strong>${item.title}</strong>
      <small>${item.subtitle}</small>
      ${item.enabled && item.url ? "" : '<span class="badge-soon">Em breve</span>'}
    </span>
    ${compact && item.enabled && item.url ? '<span class="card-end">→</span>' : ""}
  `;

  return el;
}

function renderLinks(containerId, items, compact = false) {
  const container = document.getElementById(containerId);
  items.forEach(item => container.appendChild(createCard(item, compact)));
}

renderLinks("community-links", linkConfig.community);
renderLinks("store-links", linkConfig.stores, true);
renderLinks("social-links", linkConfig.social, true);

document.getElementById("year").textContent = new Date().getFullYear();
