# Delícias em Bolo — Landing Page

Landing page do ateliê de confeitaria **Delícias em Bolo** (Paulo Afonso – BA).
React 19 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide React, em estrutura compatível com **shadcn/ui**.

---

## 1. Instalação e execução

Requisitos: **Node.js 20.19+** (ou 22+).

```bash
npm install        # instala as dependências
npm run dev        # ambiente de desenvolvimento → http://localhost:5173
npm run build      # gera a versão de produção em /dist
npm run preview    # testa a versão de produção localmente
npm run typecheck  # (opcional) checagem de tipos TypeScript
```

**Publicação (Vercel/Netlify):** framework "Vite", comando `npm run build`, pasta de saída `dist`.

O arquivo `preview/index.html` (dentro do ZIP) é uma versão autocontida só para visualização — abre direto no navegador, sem instalar nada.

---

## Atualização

- **Hero fixo:** sem animação de entrada, zoom ou parallax — a foto, a logomarca e o nome aparecem imediatamente.
- **Barra de navegação:** some ao rolar para baixo (para não cobrir a leitura) e volta ao rolar para cima ou ao navegar pelo teclado.
- **Premiação:** imagem oficial do Prêmio Excelências do Ano 2025 adicionada.

---

## 2. Estrutura

```
src/
├─ App.tsx · main.tsx · index.css        # entrada, tema (paleta, fontes, animações)
├─ data/                                 # ★ TODO o conteúdo editável fica aqui
│  ├─ site.ts          # nome, WhatsApp, Instagram, endereço, menu, textos "Sobre" e premiação
│  ├─ images.ts        # caminhos do Hero, logomarca e imagem da premiação
│  ├─ gallery.ts       # fotos do Mostruário e do carrossel do "Sobre"
│  ├─ menu.ts          # cardápio transcrito: preços, massas, recheios, tamanhos, pagamento, regras
│  └─ form-options.ts  # opções do formulário (sabores vêm automaticamente do menu.ts)
├─ components/
│  ├─ ui/              # componentes reutilizáveis (padrão shadcn)
│  │  ├─ glyph-portal.tsx                     # 21st.dev — portal tipográfico da premiação
│  │  ├─ carousel-circular-image-gallery.tsx  # 21st.dev — carrossel circular do "Sobre"
│  │  ├─ footer-section.tsx                   # 21st.dev — rodapé
│  │  ├─ lightbox.tsx · reveal-text.tsx · section-heading.tsx · drip-divider.tsx …
│  └─ layout/          # Navbar, botões flutuantes (WhatsApp, voltar ao topo, progresso)
├─ sections/           # Hero, About, Award, CakeGallery, menu/, Location, contact/
├─ hooks/              # scrollspy, foco preso, trava de rolagem, fontes…
└─ lib/                # utils (cn), animações, formatação, mensagem do WhatsApp
public/images/          # hero/, galeria/, marca/, premiacao/
docs/cardapio-transcrito.md              # cardápio em texto, conferido com as imagens originais
```

### Por que `components/ui`?
É o caminho padrão do **shadcn/ui** (definido em `components.json`). Mantendo os componentes ali, o comando
`npx shadcn@latest add <componente>` e os componentes do 21st.dev funcionam sem ajustes de import (`@/components/ui/...`).
O alias `@` → `src` está configurado no `vite.config.ts` e nos `tsconfig`.

---

## 3. Como atualizar o conteúdo

| Quero mudar…                     | Arquivo                      |
| -------------------------------- | ---------------------------- |
| WhatsApp, Instagram, endereço    | `src/data/site.ts`           |
| Textos do "Sobre" e da premiação | `src/data/site.ts`           |
| Preços, sabores, tamanhos, regras| `src/data/menu.ts`           |
| Opções do formulário             | `src/data/form-options.ts`   |
| Fotos do mostruário              | `src/data/gallery.ts` + `public/images/galeria/` |
| Foto do Hero / logomarca         | `src/data/images.ts` + `public/images/hero|marca/` |

**Trocar ou adicionar fotos**
1. Exporte em **WebP** (qualidade ~80). Para a galeria, gere duas versões: `bolo-13.webp` (até 1600 px) e `bolo-13-900.webp` (900 px de largura).
2. Copie para `public/images/galeria/`.
3. Em `src/data/gallery.ts`, adicione `photo("bolo-13", largura, altura, "descrição para leitores de tela")`.
   A galeria não exibe títulos sobre as fotos — o texto é só acessibilidade.

**Imagem do Prêmio Excelências do Ano 2025**
A arte original enviada está em `public/images/premiacao/premio-excelencias-2025.png` (630 × 769 px, sem cortes nem edições),
exibida inteira (`object-fit: contain`) com moldura dourada e lightbox. Para trocar por uma versão em maior resolução,
substitua o arquivo e atualize `width`/`height` em `src/data/images.ts`.

**Ocultar os dados bancários** do cardápio: `pagamento.mostrarDadosBancarios = false` em `src/data/menu.ts`.

---

## 4. Formulário de orçamento → WhatsApp

- 7 etapas (cliente, evento, bolo, sabores, referências, entrega, revisão) com validação acessível e foco no primeiro erro.
- Sabores e coberturas vêm do cardápio; limite de **2 recheios por andar** (regra do cardápio) e opção "Ainda não decidi".
- Rascunho salvo no aparelho do cliente (`localStorage`); as imagens não são salvas.
- Ao enviar, o site monta a mensagem organizada por categorias e abre `wa.me/5575991990879` com o texto pronto.
  **Nada é "enviado" pelo site**: o cliente confirma o envio dentro do WhatsApp.
- **Anexos:** o link do WhatsApp não aceita arquivos. O site mostra as referências escolhidas e orienta o cliente a anexá-las
  na conversa; em celulares compatíveis aparece o botão "Compartilhar imagens" (Web Share API).
  Para envio automático de arquivos seria necessário um backend (ex.: Supabase Storage).

---

## 5. Componentes do 21st.dev — o que foi adaptado

- **GlyphPortal** (MIT, aviso de licença mantido): usado na seção de premiação — o ano "2025" é uma janela para o fundo escuro
  com partículas douradas e a câmera mergulha no "0". Textos traduzidos para PT-BR; lógica original preservada.
  A fonte do portal (`Fraunces 600`, licença OFL) é auto-hospedada para medir os glifos sem atraso.
- **Carrossel circular**: o original injetava GSAP por CDN. A mesma coreografia (círculo que nasce na miniatura, cresce,
  "vira a página" e volta quicando) foi reimplementada com um tween próprio e as mesmas curvas — sem dependência externa.
  Ganhou teclado, rótulos acessíveis, pausa fora da tela e moldura em arco.
- **Footer**: links reais da marca, monograma oficial, paleta vinho/champanhe; usa `framer-motion` (mesma API de `motion/react`).

---

## 6. Desempenho e acessibilidade

Imagens em WebP com `width/height` (sem saltos de layout), lazy loading fora da primeira tela, Hero com `fetchpriority="high"`
e `preload`, mapa carregado só ao se aproximar, formulário carregado sob demanda (code splitting), partículas pausadas fora da tela.
HTML semântico, navegação por teclado, foco visível, `aria-*` nos campos e diálogos, contraste revisado e respeito a
`prefers-reduced-motion` (portal e carrossel ficam estáticos, animações são desligadas).

---

## 7. Pendências para confirmar com a cliente

1. **Imagem do Prêmio** — a arte recebida tem 630 × 769 px; se existir uma versão maior, ela deixa a seção ainda mais nítida em telas grandes.
2. **WhatsApp** — o briefing traz `+55 75 9199-0879` (8 dígitos); o cardápio oficial traz **(75) 99199-0879**. Foi usado o do cardápio.
3. **Nome** — briefing: "DELICIAS EM BOLO"; cardápio/logo tipográfica: "Ateliê Delícia em Bolo" (singular). Foi usado "Delícias em Bolo" (com acento). Altere em `site.ts` se necessário.
4. **"Pedidos com antecedência de no máximo 5 dias"** — transcrito exatamente como no cardápio; provavelmente o correto é "no mínimo".
5. **"Edição especial"** — no cardápio aparece logo acima de "Bolo de noiva"; foi tratado como selo desse item.
6. **Dados bancários** — publicados como no cardápio; podem ser ocultados com uma linha (seção 3).
7. **Foto da confeiteira** — só existe dentro das imagens do cardápio (que não podem ser usadas no site). Envie uma foto própria se quiser incluí-la no "Sobre".
