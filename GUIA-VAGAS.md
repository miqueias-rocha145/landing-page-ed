# Guia de publicação de vagas — E&D

## Arquivos mestres

- `assets/templates/vaga-feed-1080x1350.svg`: feed, site, Facebook e compartilhamento pelo WhatsApp.
- `assets/templates/vaga-story-1080x1920.svg`: Status do WhatsApp e Stories.

Os SVGs são editáveis em ferramentas compatíveis, como Figma, Illustrator ou Inkscape. Preserve a composição e substitua apenas os textos dos grupos identificados no arquivo.

## Campos e limites

- **Código:** único, no padrão `ED-AAAA-000`.
- **Cargo:** no máximo duas linhas.
- **Contrato e jornada:** uma linha por chip. A localização permanece somente no cadastro do site para filtros e acessibilidade.
- **Principais atividades:** até quatro tópicos.
- **Requisitos:** até quatro tópicos.
- **Tópicos:** frases diretas com aproximadamente 55 caracteres no máximo.
- Não inclua salário, remuneração ou a expressão “a combinar”.
- Não inclua nome, marca ou logotipo do hotel contratante.

## Identidade visual

- Azul-marinho principal: `#031328`.
- Azul da marca: `#0EA3E8`.
- Azul intermediário: `#087FBD`.
- Azul claro: `#70CDF5`.
- Fundo claro: `#F3F8FC`.
- Texto secundário: `#40566C`.
- Títulos: Plus Jakarta Sans.
- Textos: Geist.
- Margem segura: 72 px no feed e 96 px no story.

## Exportação

1. Para novas artes de feed, abra `tools/gerador-vagas/index.html` diretamente no Chrome ou Edge. A ferramenta local exporta PNG, formato recomendado para preservar a nitidez dos textos e da logo.
2. Se a exportação for feita manualmente a partir do SVG, use JPEG em sRGB com qualidade aproximada de 85%.
3. Não redimensione: mantenha `1080×1350 px` no feed e `1080×1920 px` no story.
4. Nomeie os arquivos com o código da vaga:
   - `ED-AAAA-000-feed.jpg`
   - `ED-AAAA-000-feed.png`, quando criado pelo gerador local
   - `ED-AAAA-000-story.jpg`
5. Copie os arquivos que serão publicados para `assets/vagas/`.

## Gerador local

O arquivo `tools/gerador-vagas/index.html` é uma ferramenta administrativa local e não é copiado para o Docker. Ele contém os campos do modelo de feed, prévia em tempo real e exportação em PNG 1080×1350 com o código da vaga no nome do arquivo.

Arquivos de prévia, rascunho e exemplo são ignorados pelo Git. As artes finais destinadas ao site devem usar nomes definitivos por código.

## Cadastro no site

Abra `assets/data/vagas.js`, duplique o exemplo e preencha todos os campos. Use o mesmo código nos nomes das imagens. Defina `ativa: true` somente quando os JPEGs estiverem publicados.

- `publicadaEm` controla a ordem, da mais recente para a mais antiga.
- `expiraEm` aceita uma data no formato `AAAA-MM-DD` ou `null`.
- Vagas inativas e vagas após a data de expiração não aparecem no site.
- O site mostra no máximo 24 vagas simultâneas.

Antes de publicar, revise a arte no celular, confira os dados textuais do cadastro e teste o botão do WhatsApp na página `vagas.html`.
