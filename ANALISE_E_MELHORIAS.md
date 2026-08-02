# Melhorias de responsividade — versão 11

## Problemas corrigidos

- Hero apertado em notebooks e tablets horizontais.
- Imagem profissional mantendo altura fixa por causa dos atributos HTML.
- Elementos decorativos ampliando a largura interna do documento.
- Botão flutuante do WhatsApp cobrindo os CTAs na primeira dobra.
- Cards e colunas com largura mínima inadequada em telas pequenas.
- Experiências, cases e projetos com leitura apertada no celular.
- Filtros, botões, e-mail e textos longos com risco de ultrapassar a tela.
- Layout inadequado em celulares na orientação paisagem.

## Soluções implementadas

- Gutter e espaçamentos fluidos com `clamp()`.
- Containers limitados pela viewport.
- Imagens com largura e altura fluidas.
- Breakpoints específicos para desktop, notebook, tablet, celular e landscape.
- Hero empilhado abaixo de 1080 px e compacto em landscape de baixa altura.
- Grids adaptativos: 4, 3, 2 ou 1 coluna conforme a largura.
- Abas e filtros reorganizados para toque e teclado.
- Quebra segura de URLs, e-mails, títulos e botões.
- Menu móvel com altura limitada, rolagem interna e safe areas.
- WhatsApp exibido apenas após o início da rolagem.
- Regras para aparelhos touch, redução de movimento e impressão.
- Correção dos glows decorativos com `overflow: clip`.

## Matriz de testes

- 1920×1080
- 1440×900
- 1366×768
- 1280×720
- 1024×768
- 834×1194
- 768×1024
- 430×932
- 390×844
- 375×812
- 360×800
- 320×568
- 812×375 em landscape

Resultado: zero overflow horizontal antes e depois da interação com abas e filtros; menu móvel funcional; nenhum erro JavaScript detectado.
