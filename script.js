/*
  MonkeyPromo Links
  Ative somente destinos que já entregam valor ao visitante.
  Itens com enabled: false ou url vazia ficam totalmente ocultos.
*/

const linkConfig = {
  community: [
    {
      title: "Jardinagem",
      subtitle: "Ofertas para jardim, cultivo e ferramentas",
      icon: "🌱",
      accent: "#58c469",
      url: "",
      enabled: false
    },
    {
      title: "Academia",
      subtitle: "Treino, fitness, roupas e acessórios",
      icon: "🏋️",
      accent: "#5b8cff",
      url: "",
      enabled: false
    },
    {
      title: "Camping",
      subtitle: "Aventura, trilha e vida ao ar livre",
      icon: "🏕️",
      accent: "#e7a52f",
      url: "",
      enabled: false
    },
    {
      title: "Casa & Utilidades",
      subtitle: "Achadinhos úteis para o dia a dia",
      icon: "🏠",
      accent: "#a96bff",
      url: "",
      enabled: false
    }
  ],

  stores: [
    {
      title: "Ofertas da Shopee",
      subtitle: "Seleção MonkeyPromo na Shopee",
      icon: "🛍️",
      accent: "#ee4d2d",
      url: "",
      enabled: false
    },
    {
      title: "Ofertas Mercado Livre",
      subtitle: "Seleção MonkeyPromo no Mercado Livre",
      icon: "🟡",
      accent: "#f4d03f",
      url: "",
      enabled: false
    },
    {
      title: "Achadinhos Amazon",
      subtitle: "Seleção MonkeyPromo na Amazon",
      icon: "📦",
      accent: "#ff9900",
      url: "",
      enabled: false
    },
    {
      title: "Achadinhos TikTok Shop",
      subtitle: "Seleção MonkeyPromo no TikTok Shop",
      icon: "♪",
      accent: "#6ce7e0",
      url: "",
      enabled: false
    }
  ],

  social: [
    {
      title: "Instagram",
      subtitle: "@monkey.promo",
      icon: "◎",
      accent: "#d9659f",
      url: "https://www.instagram.com/monkey.promo/",
      enabled: true
    },
    {
      title: "Telegram",
      subtitle: "Canal oficial MonkeyPromo",
      icon: "✈",
      accent: "#43a6dc",
      url: "",
      enabled: false
    }
  ]
};

const isActive = item => Boolean(item.enabled && item.url && item.url.trim());

function createCard(item, grid = false) {
  const link = document.createElement("a");
  link.className = `link-card${grid ? " grid-card" : ""}`;
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.style.setProperty("--card-accent", item.accent || "#ff762f");

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

function renderSection(sectionId, containerId, items, grid = false) {
  const section = document.getElementById(sectionId);
  const container = document.getElementById(containerId);
  const activeItems = items.filter(isActive);

  container.replaceChildren(...activeItems.map(item => createCard(item, grid)));
  section.hidden = activeItems.length === 0;

  return activeItems.length;
}

const communityCount = renderSection("interesses", "community-links", linkConfig.community, true);
renderSection("lojas", "store-links", linkConfig.stores);
renderSection("redes", "social-links", linkConfig.social);

document.getElementById("interestCta").hidden = communityCount === 0;
document.getElementById("year").textContent = new Date().getFullYear();

const shareButton = document.getElementById("shareButton");
const shareLabel = document.getElementById("shareLabel");
const toast = document.getElementById("toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: "MonkeyPromo — Ofertas, Achadinhos e Cupons",
    text: "O MonkeyPromo caça. Você economiza. Veja achadinhos, cupons e promoções selecionadas.",
    url: "https://monkeypromo.pages.dev/"
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareData.url);
    shareLabel.textContent = "Copiado";
    showToast("Link copiado!");
    setTimeout(() => { shareLabel.textContent = "Compartilhar"; }, 1800);
  } catch (error) {
    if (error?.name !== "AbortError") showToast("Não foi possível compartilhar agora.");
  }
});
