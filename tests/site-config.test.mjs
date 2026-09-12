import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CONFIG,
  getRenderableItems,
  isValidUrl,
  loadConfig,
  normalizeConfig
} from "../config-core.js";

test("site-config válido é normalizado", () => {
  const config = normalizeConfig({
    version: 1,
    brand: { name: "MonkeyPromo" },
    whatsapp: {
      id: "whatsapp-main",
      enabled: true,
      title: "WhatsApp",
      subtitle: "Contato",
      url: "https://wa.me/5500000000000"
    }
  });

  assert.equal(config.brand.name, "MonkeyPromo");
  assert.equal(config.whatsapp.visible, true);
});

test("falha de carregamento usa fallback seguro", async () => {
  const logger = { error() {} };
  const result = await loadConfig({
    fetchImpl: async () => { throw new Error("offline"); },
    logger
  });

  assert.equal(result.source, "fallback");
  assert.equal(result.config.brand.name, DEFAULT_CONFIG.brand.name);
  assert.equal(result.config.whatsapp.visible, true);
});

test("enabled=false não é renderizável", () => {
  const items = normalizeConfig({
    community: [{
      id: "jardinagem",
      title: "Jardinagem",
      url: "https://example.com",
      enabled: false,
      order: 1
    }]
  }).community;

  assert.equal(getRenderableItems(items).length, 0);
});

test("URL vazia não é renderizável", () => {
  const items = normalizeConfig({
    community: [{
      id: "jardinagem",
      title: "Jardinagem",
      url: "",
      enabled: true,
      order: 1
    }]
  }).community;

  assert.equal(getRenderableItems(items).length, 0);
});

test("javascript: é rejeitado", () => {
  assert.equal(isValidUrl("javascript:alert(1)"), false);
  assert.equal(isValidUrl("data:text/html,test"), false);
  assert.equal(isValidUrl("file:///tmp/test"), false);
  assert.equal(isValidUrl("vbscript:msgbox(1)"), false);
  assert.equal(isValidUrl("https://example.com"), true);
});

test("seção sem itens ativos produz lista vazia", () => {
  const config = normalizeConfig({ stores: [] });
  assert.deepEqual(getRenderableItems(config.stores), []);
});

test("ordem crescente é respeitada e empate é estável", () => {
  const items = normalizeConfig({
    community: [
      { id: "b", title: "B", url: "https://b.example", enabled: true, order: 2 },
      { id: "a", title: "A", url: "https://a.example", enabled: true, order: 1 },
      { id: "c", title: "C", url: "https://c.example", enabled: true, order: 2 }
    ]
  }).community;

  assert.deepEqual(getRenderableItems(items).map(item => item.id), ["a", "b", "c"]);
});

test("WhatsApp ativo e válido aparece", () => {
  const config = normalizeConfig({
    whatsapp: {
      id: "whatsapp-main",
      enabled: true,
      title: "WhatsApp",
      subtitle: "Contato",
      url: "https://wa.me/5500000000000"
    }
  });

  assert.equal(config.whatsapp.visible, true);
});

test("WhatsApp inativo não aparece", () => {
  const config = normalizeConfig({
    whatsapp: {
      id: "whatsapp-main",
      enabled: false,
      title: "WhatsApp",
      subtitle: "Contato",
      url: "https://wa.me/5500000000000"
    }
  });

  assert.equal(config.whatsapp.visible, false);
});

test("CTA de interesse depende da existência de categoria ativa", () => {
  const inactive = normalizeConfig({
    community: [{
      id: "jardinagem",
      title: "Jardinagem",
      url: "",
      enabled: false,
      order: 1
    }]
  });

  const active = normalizeConfig({
    community: [{
      id: "jardinagem",
      title: "Jardinagem",
      url: "https://example.com/jardinagem",
      enabled: true,
      order: 1
    }]
  });

  assert.equal(getRenderableItems(inactive.community).length > 0, false);
  assert.equal(getRenderableItems(active.community).length > 0, true);
});

test("configuração de compartilhamento é preservada como texto", () => {
  const config = normalizeConfig({
    share: {
      title: "<script>alert(1)</script>",
      text: "texto"
    }
  });

  assert.equal(config.share.title, "<script>alert(1)</script>");
  assert.equal(config.share.text, "texto");
});

test("JSON inválido no fetch não quebra e usa fallback", async () => {
  const result = await loadConfig({
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      async json() { throw new SyntaxError("JSON inválido"); }
    }),
    logger: { error() {} }
  });

  assert.equal(result.source, "fallback");
  assert.equal(result.config.hero.title, DEFAULT_CONFIG.hero.title);
});
