# COVEN — Cloudflare / GitHub

Versão com identidade visual gótica unificada, fundo noturno global e página interativa de Bestiário.

## Estrutura para o GitHub

A raiz do repositório deve continuar assim:

- `README.md`
- `package.json`
- `wrangler.jsonc`
- `public/`

O Cloudflare usa `public/` como diretório de assets.

## Onde editar

- Conteúdo textual, personagens, desafios, locais, episódios, Sete Maravilhas e criaturas do Bestiário: `public/site-data.js`
- Layout e aparência: `public/styles.css`
- Navegação/interações: `public/app.js`
- Fundo noturno global: `public/assets/coven-night-mansion.png`
- Imagens do Bestiário: arquivos `public/assets/bestiary-*.jpg`

## Bestiário

O menu `BESTIÁRIO` abre uma galeria. Ao passar o mouse, o nome da criatura aparece; ao clicar, a ficha muda sem recarregar a página. Os campos disponíveis são Nome, Espécie, Descrição, Ataque, Defesa e Poder.

## Deploy

Para o fluxo Workers já configurado:

`npx wrangler deploy`

O `wrangler.jsonc` continua apontando para `./public`.
