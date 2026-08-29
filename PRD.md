# PRD — Landing Page E&D Mão de Obra e Recursos Humanos

## 1. Visão do produto

Nova landing page institucional e de conversão da E&D Mão de Obra e Recursos Humanos LTDA, agência que recruta e direciona profissionais para hotéis e operações de hospitalidade da região de Porto Seguro.

A página atende dois públicos em uma única experiência:

1. Empresas que precisam contratar mão de obra terceirizada.
2. Candidatos que buscam oportunidades na hotelaria regional.

O produto deve transmitir confiança, agilidade, cuidado com pessoas e domínio da operação hoteleira, preservando integralmente as informações reais já presentes no HTML original.

## 2. Objetivos

- Gerar contatos comerciais qualificados pelo WhatsApp e telefone.
- Captar candidatos pelo WhatsApp com mensagem pré-preenchida.
- Apresentar serviços, diferenciais, segmentos, processo e conformidade da E&D.
- Reforçar presença regional e especialização em hotelaria e hospitalidade.
- Oferecer uma experiência consistente em modo claro, modo escuro, desktop e mobile.

## 3. Públicos e jornadas

### Empresas

Necessidade: cobrir faltas, sazonalidade, alta ocupação, eventos ou demandas permanentes com profissionais qualificados.

Jornada principal: Hero → Profissionais → Processo → Diferenciais → Proposta via WhatsApp.

CTA principal: **Preciso de profissionais** / **Solicitar orçamento**.

### Candidatos

Necessidade: encontrar oportunidades de trabalho em hotéis e operações da região.

Jornada principal: Hero → Caminho “Para candidatos” → Página de vagas → Vaga escolhida → WhatsApp com código e cargo preenchidos.

CTA principal: **Quero uma oportunidade** / **Quero me candidatar**.

## 4. Proposta de valor

**Pessoas certas para operações que não podem parar.**

A mensagem central combina a promessa existente — excelência em terceirização para hotelaria de alto padrão — com os diferenciais reais da empresa: seleção qualificada, agilidade, acompanhamento, reposição e conformidade.

## 5. Arquitetura da informação

1. Cabeçalho flutuante com navegação e alternância de tema.
2. Hero com proposta de valor e CTAs para empresas e candidatos.
3. Dois caminhos de conversão: empresa e candidato.
4. Dor operacional: “Sua Operação Não Pode Parar”.
5. Profissionais disponíveis.
6. Processo em quatro etapas.
7. Diferenciais da E&D.
8. Segmentos atendidos.
9. Sobre a empresa e conformidade.
10. Captação de candidatos com acesso à página de vagas.
11. Perguntas frequentes.
12. CTA comercial final.
13. Rodapé com contatos reais.

## 6. Sistema visual

### Direção

Minimalista, institucional e contemporânea. Superfícies limpas, bastante respiro, tipografia forte, cantos suaves e detalhes luminosos em azul. O azul-marinho ancora a confiança; o azul-claro indica ação, movimento e proximidade.

### Cores principais

| Papel | Cor | Uso |
|---|---|---|
| Primária institucional | `#031328` | Títulos, fundos de destaque, estrutura e confiança |
| Primária complementar | `#071B34` | Gradientes escuros e superfícies profundas |
| Secundária / ação | `#0EA3E8` | CTAs, links ativos, ícones e destaques |
| Secundária escura | `#087FBD` | Hover e contraste de botões |
| Secundária clara | `#70CDF5` | Detalhes sobre fundos escuros |
| Sucesso | `#22A06B` | Sinais positivos e WhatsApp |
| Atenção | `#DD5A56` | Dores e alertas operacionais |

### Tema claro

- Fundo: `#F4F8FB`
- Superfície: `#FFFFFF`
- Superfície suave: `#EDF4F8`
- Texto: `#07182C`
- Texto secundário: `#5C6B7D`

### Tema escuro

- Fundo: `#020B17`
- Superfície: `#071628`
- Superfície suave: `#0A1D32`
- Texto: `#F5F9FD`
- Texto secundário: `#A6B5C7`

### Tipografia

- Títulos: **Plus Jakarta Sans**, peso 600–700.
- Textos e interface: **Geist**, peso 400–700.
- Títulos usam espaçamento negativo moderado para uma aparência editorial e compacta.

### Componentes

- Botões arredondados, com altura mínima de 52 px nas áreas de conversão.
- Cards com borda sutil e elevação apenas em interação.
- Ícones lineares para leitura rápida.
- Imagem principal com recorte assimétrico e cards contextuais flutuantes.
- FAQs nativas com abertura exclusiva para reduzir ruído visual.

## 7. Comportamento do cabeçalho

- O cabeçalho começa visualmente integrado ao topo da página.
- Ao rolar, permanece visível em desktop e mobile usando comportamento sticky.
- Depois de 34 px de rolagem, reduz levemente a altura, aumenta a sombra e se aproxima do topo.
- O fundo usa transparência e desfoque para manter legibilidade sobre qualquer seção.
- No mobile, a navegação abre em painel compacto abaixo do cabeçalho.
- O item correspondente à seção atual é destacado automaticamente.

## 8. Animações e microinterações

- Entrada progressiva de textos, cards e seções com `IntersectionObserver`.
- Pequenos atrasos em sequência para criar ritmo sem bloquear a leitura.
- Imagem do hero respira lentamente com escala e deslocamento quase imperceptíveis.
- Cards flutuantes no hero oscilam verticalmente.
- Linha do processo é desenhada quando a seção entra na tela.
- Cards sobem levemente e recebem brilho de borda no hover.
- No mobile, cards de profissionais e segmentos recebem o estado visual de hover ao cruzar o centro da tela, preservando o efeito existente na versão anterior.
- FAQ transforma o ícone de “mais” ao abrir.
- Todas as animações são desativadas ou reduzidas quando o sistema solicita `prefers-reduced-motion`.

## 9. Responsividade

### Desktop — acima de 1080 px

- Hero em duas colunas.
- Navegação completa no cabeçalho.
- Cards de profissionais em grade de quatro colunas.
- Processo em linha horizontal.

### Tablet — 621 a 1080 px

- Hero mantém duas colunas enquanto houver espaço e passa para uma coluna abaixo de 820 px.
- Navegação vira menu compacto abaixo de 820 px.
- Grids reduzem progressivamente para duas ou três colunas.

### Mobile — até 620 px

- Conteúdo em uma coluna.
- CTAs ocupam toda a largura.
- Processo vira lista vertical.
- Cards têm áreas de toque confortáveis.
- Cabeçalho e WhatsApp permanecem acessíveis durante a rolagem.

## 10. Requisitos funcionais

- Alternância claro/escuro com persistência em `localStorage`.
- Respeito ao tema do sistema na primeira visita.
- Menu mobile com estado acessível em `aria-expanded` e fechamento por Escape ou clique externo.
- Links de WhatsApp com mensagens distintas para empresas e candidatos.
- Telefone e e-mail clicáveis.
- Navegação por âncoras com compensação para o cabeçalho.
- Ano do rodapé atualizado automaticamente.
- Funcionar sem framework e sem etapa de build.
- Página estática `vagas.html` alimentada por `assets/data/vagas.js`, compatível com acesso local e Nginx.
- Exibir somente vagas ativas e não expiradas, ordenadas pela publicação e limitadas a 24 oportunidades.
- Filtrar vagas por local e regime de contratação.
- Abrir a candidatura no WhatsApp com código e cargo da vaga preenchidos.

## 11. Acessibilidade

- HTML semântico com `header`, `nav`, `main`, `section`, `article` e `footer`.
- Link “Ir para o conteúdo”.
- Foco de teclado visível.
- Contraste compatível com WCAG AA nas combinações principais.
- Nomes acessíveis em botões e links de ícone.
- Conteúdo institucional preservado com JavaScript desativado; tema, menu mobile, animações, filtros e carregamento das vagas dependem de JavaScript.
- Suporte a redução de movimento.

## 12. SEO e compartilhamento

- Título e descrição específicos para hotelaria e Porto Seguro.
- URL canônica.
- Metadados Open Graph.
- Dados estruturados `EmploymentAgency` com contatos reais.
- Hierarquia única de H1 e títulos de seção coerentes.
- Imagem principal com dimensões explícitas e prioridade de carregamento.

## 13. Métricas recomendadas

- Cliques em “Preciso de profissionais”.
- Cliques em “Quero uma oportunidade”.
- Cliques em “Solicitar orçamento”.
- Cliques em telefone, e-mail e WhatsApp flutuante.
- Profundidade de rolagem em 50%, 75% e 90%.
- Taxa de abertura das perguntas frequentes.
- Conversão por dispositivo e por tema.

## 14. Critérios de aceite

- Todas as informações factuais do HTML original permanecem na página.
- Contatos permanecem: `(73) 9 8183-0606` e `edivaldo.pereira@edrh.com.br`.
- A página funciona em claro e escuro sem perda de contraste ou conteúdo.
- Cabeçalho acompanha a rolagem em desktop e mobile.
- Menu mobile funciona com mouse, toque e teclado.
- Todos os CTAs de empresa e candidato abrem o destino correto.
- Todos os acessos de candidatos na landing chegam a `vagas.html`.
- Vagas inativas e expiradas não aparecem; estados sem vagas e sem resultados são claros e acessíveis.
- Não há rolagem horizontal entre 320 px e 1920 px.
- Não há erros de JavaScript no carregamento.
- Animações não ocultam conteúdo quando a preferência de movimento reduzido está ativa.
