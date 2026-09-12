# MonkeyPromo Links

Página oficial de links da marca **MonkeyPromo**, publicada em `https://monkeypromo.pages.dev/` e conectada ao Cloudflare Pages.

## Estrutura

- `index.html` — conteúdo, SEO e metadados sociais
- `style.css` — layout mobile-first e identidade visual
- `script.js` — configuração dos links ativos
- `assets/mascot-monkeypromo.webp` — mascote otimizado para o site
- `assets/og-monkeypromo.jpg` — imagem 1200×630 para compartilhamento

## Ativar categorias, lojas ou redes

Edite somente o item desejado em `script.js`:

```js
url: "https://destino-real.com",
enabled: true
```

Itens sem URL útil ou com `enabled: false` **não aparecem para o visitante**. Se uma seção não tiver nenhum item ativo, a seção também fica oculta automaticamente.

## Publicação

A branch de produção é `main`. O Cloudflare Pages realiza novo deploy quando a branch é atualizada.
