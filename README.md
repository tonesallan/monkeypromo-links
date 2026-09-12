# MonkeyPromo Links

Página pública de links do MonkeyPromo, pensada para uso na bio do Instagram.

## Estrutura

- `index.html` — estrutura da página
- `style.css` — identidade visual e responsividade
- `script.js` — configuração dos botões e links
- `assets/favicon.svg` — favicon provisório

## Como editar links

Abra `script.js` e altere a propriedade `url` do botão desejado.

Para ativar:

```js
url: "https://seu-link-aqui.com",
enabled: true
```

Para deixar como "Em breve":

```js
url: "",
enabled: false
```

## Publicação no Cloudflare Pages

Configuração recomendada:

- Framework preset: `None`
- Build command: deixar vazio
- Build output directory: `/`
- Branch de produção: `main`

O projeto é estático e não precisa de Node.js, banco de dados ou servidor.

## Próximo passo visual

Substituir o avatar de emoji pela arte oficial do macaquinho MonkeyPromo quando o arquivo definitivo for adicionado ao repositório.
