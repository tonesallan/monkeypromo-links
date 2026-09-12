# MonkeyPromo Links

Página oficial de links da marca **MonkeyPromo**, publicada em `https://monkeypromo.pages.dev/` e conectada ao Cloudflare Pages.

## Arquitetura

O site continua sendo HTML, CSS e JavaScript simples. A diferença é que o conteúdo editável foi separado do código:

- `site-config.json` — dados editáveis do site;
- `config-core.js` — validação, normalização, ordenação, segurança de URLs e fallback;
- `script.js` — carrega a configuração e renderiza a página;
- `index.html` — estrutura visual e SEO estático;
- `style.css` — aparência e responsividade;
- `assets/mascot-monkeypromo.webp` — mascote;
- `assets/og-monkeypromo.jpg` — imagem de compartilhamento.

A ideia futura é o painel MonkeyPromo gerar ou substituir somente `site-config.json`, sem precisar modificar o HTML, CSS ou JavaScript a cada mudança de grupo, loja ou rede social.

## Regras de exibição

Um item só aparece quando:

```json
{
  "enabled": true,
  "url": "https://destino-valido.com/"
}
```

Também é necessário que a URL use `http://` ou `https://`.

Itens desativados, URLs vazias ou protocolos inseguros como `javascript:` não são renderizados. Se uma seção não tiver nenhum item ativo e válido, ela fica totalmente oculta.

A ordem é controlada pelo campo `order` em ordem crescente. Em caso de empate, a ordem original do JSON é preservada.

## Ativar uma categoria manualmente

Enquanto o painel ainda não estiver integrado, edite somente `site-config.json`.

Exemplo temporário para ativar Jardinagem:

```json
{
  "id": "jardinagem",
  "enabled": true,
  "url": "https://chat.whatsapp.com/exemplo"
}
```

Mantenha os demais campos existentes do item. Depois do deploy, a categoria aparece automaticamente. Para ocultá-la novamente, altere `enabled` para `false`.

## Fallback seguro

Se `site-config.json` estiver ausente, inválido ou não puder ser carregado, o site usa uma configuração mínima interna e preserva:

- marca;
- mascote e hero;
- CTA básico do WhatsApp;
- mensagem institucional;
- rodapé.

O erro é registrado apenas no console. O visitante não recebe stack trace e a página não fica em branco.

## Segurança

- conteúdo de `site-config.json` é tratado como dado, não HTML;
- textos são inseridos com `textContent` ou criação segura de elementos;
- URLs aceitam somente `http:` e `https:`;
- IDs usam slugs estáveis;
- cores dos cards aceitam apenas hexadecimal `#RRGGBB`;
- não existem tokens, chaves, credenciais ou chamadas ao projeto principal.

## Cache

`site-config.json` usa revalidação curta por meio de `_headers` e o carregamento usa `cache: "no-cache"`. Assets estáticos continuam com o comportamento normal do Cloudflare Pages.

## Testes

O site não depende de Node para funcionar. Node é usado somente para executar os testes locais:

```bash
npm test
```

Os testes validam fallback, URLs inseguras, itens desativados, ordenação, WhatsApp e regras de exibição.

## Publicação

A branch de produção é `main`. O Cloudflare Pages realiza um novo deploy quando a branch é atualizada.

Nesta etapa não existe integração com painel, bot, banco de dados ou API.
