# Spec: Protótipo Conceitual — Plataforma Educacional com IA

## Visão Geral

Plataforma educacional gamificada e interativa onde usuários estudam qualquer conteúdo com acompanhamento de IA. A IA não apenas ensina, mas também avalia, acompanha progresso e adapta o ensino ao perfil do aluno. Todo conteúdo é (na versão real) obtido da internet e armazenado em banco vetorial para evitar alucinações.

**Este é um protótipo conceitual** — sem backend real, sem IA real, sem banco de dados real. Tudo é simulado/mockado com vanilla HTML/CSS/JS.

---

## 1. Escopo do Protótipo

### 1.1 O que ESTÁ incluído
- Interface visual completa e navegável (6 telas principais)
- Fluxos de interação simulados end-to-end
- Mock de respostas da IA (com typing effect, erros humanos simulados, tom adaptativo)
- **3 personas de IA** com personalidades distintas (Prof. Sage, Coach Spark, Quiz Master)
- Widgets interativos de questões funcionais (6 tipos)
- **Reconhecimento de formas no canvas** (AI Vision mock)
- Sistema de gamificação completo (XP, níveis, streaks, badges, ranking, moedas, loja)
- **Mascote evolutivo (Tamagotchi)** que reage ao progresso e streak
- **Ghost Racing** — competição contra NPCs em tempo real durante quizzes
- **Repetição Espaçada (SRS)** — reintrodução inteligente de conceitos antigos
- **Grafo de Conhecimento** interativo (mapa visual de tópicos)
- **Heat Map de atividade** (estilo GitHub)
- **Radar Chart de competências**
- **Mix Diário de Estudo** cross-matéria (estilo Spotify)
- **Slash Commands** no chat (`/explica`, `/exemplo`, `/questao`, etc.)
- **Puzzles de aquecimento** antes das aulas
- **Animação "Matrix Upload"** no pós-triagem
- **Fake Live Ticker** de atividade de NPCs
- **Notificações toast** simuladas
- **Previsão de "quando vai dominar"** cada matéria
- Loja de recompensas com itens desbloqueáveis
- Tema claro e escuro (toggle)
- Fluxo de triagem para matéria custom (híbrido: chat + wizard)

### 1.2 O que NÃO está incluído
- Backend/servidor real
- Autenticação real (login é mockado)
- IA real (LLM, embeddings, RAG)
- Banco de dados real (vetorial ou relacional)
- Scraping/web crawling de conteúdo
- Persistência de dados além de localStorage
- Responsividade mobile (desktop-first, mas não quebrar em telas menores)

---

## 2. Arquitetura Técnica

### 2.1 Stack
- **HTML5** — semântico, acessível
- **CSS3** — custom properties para theming, Grid/Flexbox para layout, animações
- **JavaScript vanilla** — ES6+, módulos, sem frameworks
- **Canvas 2D** — para animações, grafo de conhecimento, heat map
- **SVG** — para mascote evolutivo e reconhecimento de formas
- **Sem build tools** — arquivos servidos diretamente
- **Sem dependências externas** — zero bibliotecas de terceiros

### 2.2 Estrutura de Pastas (Scaffold)

```
edu-ai-prototype/
├── index.html                  # Ponto de entrada, shell da aplicação
├── css/
│   ├── variables.css           # Design tokens (cores, spacing, tipografia, shadows)
│   ├── base.css                # Reset, tipografia global, utilitários
│   ├── layout.css              # Sidebar, grid principal, responsividade base
│   ├── components.css          # Botões, cards, inputs, badges, modals, toasts
│   ├── chat.css                # Estilos específicos do chat + slash commands
│   ├── widgets.css             # Widgets de questões interativas
│   ├── gamification.css        # XP bar, streaks, badges, ranking, loja, mascote
│   ├── themes.css              # Tema claro e escuro (CSS variables overrides)
│   ├── animations.css          # Animações globais (confetti, shake, float, matrix)
│   └── pages/
│       ├── dashboard.css       # Dashboard, knowledge graph, heat map, daily mix
│       ├── catalog.css         # Catálogo de matérias
│       ├── profile.css         # Perfil, radar chart, histórico
│       └── triagem.css         # Fluxo de triagem custom
├── js/
│   ├── app.js                  # Inicialização, roteamento, estado global
│   ├── router.js               # SPA router (hash-based)
│   ├── state.js                # Gerenciamento de estado (userData, progress, etc.)
│   ├── mock/
│   │   ├── ai-responses.js     # Respostas pré-escritas por persona/contexto/fluxo
│   │   ├── subjects.js         # Dados mock das matérias + grafo de dependências
│   │   ├── questions.js        # Banco de questões mock por matéria/tipo
│   │   ├── shop-items.js       # Itens da loja (temas, acessórios, títulos)
│   │   ├── npcs.js             # Dados dos NPCs (ranking, ghost racing, ticker)
│   │   └── warmup-puzzles.js   # Puzzles de aquecimento mock
│   ├── services/
│   │   ├── ai-service.js       # Simula chamadas à IA (persona, tom, callbacks)
│   │   ├── gamification.js     # XP, níveis, streaks, moedas, badges
│   │   ├── srs.js              # Repetição Espaçada (tracking de meia-vida)
│   │   ├── mastery-predictor.js # Previsão de "quando vai dominar"
│   │   └── storage.js          # Wrapper para localStorage
│   ├── components/
│   │   ├── sidebar.js          # Navegação lateral fixa + live ticker
│   │   ├── chat-engine.js      # Motor do chat (renderização, scroll, input)
│   │   ├── typing-indicator.js # Indicador "IA digitando..." com typos ocasionais
│   │   ├── slash-commands.js   # Parser e handler de comandos / no chat
│   │   ├── theme-toggle.js     # Toggle tema claro/escuro
│   │   ├── xp-bar.js           # Barra de XP animada
│   │   ├── streak-badge.js     # Badge de sequência de dias
│   │   ├── avatar.js           # Componente de avatar do usuário
│   │   ├── mascote.js          # Mascote evolutivo Tamagotchi (SVG com layers)
│   │   ├── knowledge-graph.js  # Grafo de conhecimento interativo (Canvas/SVG)
│   │   ├── heat-map.js         # Heat map de atividade (estilo GitHub)
│   │   ├── radar-chart.js      # Radar chart de competências (Canvas/SVG)
│   │   ├── daily-mix.js        # Card "Seu Mix Diário de Estudo"
│   │   ├── ghost-race.js       # Componente de corrida fantasma em quizzes
│   │   ├── toast.js            # Sistema de notificações toast
│   │   ├── confetti.js         # Animação de confetti (CSS particles)
│   │   ├── matrix-upload.js    # Animação canvas pós-triagem (galáxia de nós)
│   │   └── modal.js            # Modal genérico
│   ├── widgets/
│   │   ├── widget-base.js      # Classe base para todos os widgets de questão
│   │   ├── multiple-choice.js  # Múltipla escolha com botões
│   │   ├── true-false.js       # Verdadeiro/Falso
│   │   ├── fill-blank.js       # Preencher lacunas inline
│   │   ├── drag-drop.js        # Arrastar e soltar com physics-based snapping
│   │   ├── slider.js           # Slider numérico para estimativas
│   │   └── canvas-draw.js      # Canvas com reconhecimento de formas (AI Vision)
│   └── pages/
│       ├── dashboard.js        # Dashboard (mascote, graph, heat map, daily mix, etc.)
│       ├── catalog.js          # Catálogo de matérias
│       ├── study.js            # Chat de estudo (principal)
│       ├── review-shorts.js    # Modo "Shorts" de revisão (flashcards swipe)
│       ├── profile.js          # Perfil do aluno (radar chart, badges, histórico)
│       └── triagem.js          # Fluxo de triagem custom (wizard/chat híbrido)
├── assets/
│   ├── icons/                  # SVGs inline ou sprites
│   └── avatars/                # Peças do avatar e mascote (base + acessórios)
└── data/
    └── state-default.json      # Estado inicial padrão do usuário (para reset)
```

---

## 3. Design System

### 3.1 Filosofia Visual
- **Minimalista moderno** — clean, espaçoso, hierarquia clara
- **Dual theme** — tema claro (padrão) e escuro, toggle na sidebar
- **Micro-interações ricas** — hover states, transições, feedback visual, physics-based
- **Hierarquia tipográfica forte** — títulos grandes, corpo legível, labels sutis
- **"Juicy" feedback** — cada ação tem resposta visual (shake, glow, bounce, confetti)

### 3.2 Paleta de Cores

**Tema Claro:**
```css
--color-bg-primary: #FAFBFC;
--color-bg-secondary: #FFFFFF;
--color-bg-tertiary: #F0F2F5;
--color-text-primary: #1A1D23;
--color-text-secondary: #5F6B7A;
--color-text-muted: #9CA3AF;
--color-accent: #6366F1;        /* Indigo — cor principal */
--color-accent-hover: #4F46E5;
--color-accent-light: #EEF2FF;
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-streak: #F97316;        /* Laranja para streaks */
--color-xp: #8B5CF6;            /* Roxo para XP */
--color-coin: #EAB308;          /* Dourado para moedas */
--color-mascot: #6366F1;        /* Indigo para mascote */
--color-graph-node: #3B82F6;    /* Azul para nós do grafo */
--color-graph-mastered: #10B981; /* Verde para dominado */
--color-graph-progress: #F59E0B; /* Amarelo para em progresso */
--color-graph-review: #EF4444;  /* Vermelho para precisa revisar */
--color-border: #E5E7EB;
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-full: 9999px;
```

**Tema Escuro:**
```css
--color-bg-primary: #0F1117;
--color-bg-secondary: #1A1D27;
--color-bg-tertiary: #242836;
--color-text-primary: #F1F3F5;
--color-text-secondary: #9CA3AF;
--color-text-muted: #6B7280;
--color-accent: #818CF8;
--color-accent-hover: #6366F1;
--color-accent-light: #1E1B4B;
/* ... (demais cores ajustadas para contraste WCAG AA) */
```

### 3.3 Tipografia
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### 3.4 Layout Principal
```
┌─────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────────────────────────────┐ │
│  │          │  │                                  │ │
│  │ SIDEBAR  │  │         ÁREA DE CONTEÚDO         │ │
│  │  240px   │  │          (flex: 1)               │ │
│  │          │  │                                  │ │
│  │ Logo     │  │  Renderiza a página ativa:       │ │
│  │ Nav      │  │  - Dashboard                     │ │
│  │ Ticker   │  │  - Catálogo                      │ │
│  │ User     │  │  - Chat de Estudo                │ │
│  │ Theme    │  │  - Perfil                        │ │
│  └──────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## 4. Telas e Funcionalidades

### 4.1 Sidebar (Navegação Fixa)
- **Logo/nome da plataforma** no topo
- **Links de navegação** com ícones:
  - 🏠 Dashboard
  - 📚 Catálogo de Matérias
  - 💬 Chat de Estudo
  - 👤 Meu Perfil
- **Indicador de página ativa** (destaque visual)
- **Fake Live Ticker** (novo) — feed sutil no meio da sidebar com eventos de NPCs:
  - *"Ana S. desbloqueou a badge Polímata! 🏆"*
  - *"Pedro completou Equações do 2º Grau! 📐"*
  - *"Maria está em 12º dia de streak! 🔥"*
  - Rola verticalmente com fade nas bordas, atualiza a cada 8-15 segundos
- **Bloco do usuário** no rodapé:
  - Avatar pequeno
  - Nome
  - Nível atual (ex: "Nv. 12 — Estudante Avançado")
  - Moedas 💰
  - Toggle tema claro/escuro 🌙☀️

### 4.2 Dashboard
**Layout:** Grid de cards com resumo da atividade do usuário.

**Cards/Seções:**
1. **Saudação + Streak**
   - "Bom dia, [Nome]! 🔥 5 dias seguidos"
   - Contador de dias de streak com animação de fogo
   - Botão "Estudar agora" (CTA principal)

2. **Mascote Evolutivo (Tamagotchi)** (novo)
   - SVG central no dashboard com o mascote/cérebro que evolui visualmente:
     - **Estágio 1 (Nível 1-5):** Cérebro pequeno e opaco, poucos detalhes
     - **Estágio 2 (Nível 6-15):** Cérebro com brilho sutil, contornos definidos
     - **Estágio 3 (Nível 16-30):** Conexões neurais visíveis pulsam
     - **Estágio 4 (Nível 31+):** Aurora/glow completo, partículas ao redor
   - **Reações ao estado:**
     - Streak ativo: chama ao redor do mascote
     - Streak quebrado: mascote "cabisbaixo", olhos semicerrados
     - Acerto de questão: mascote pulsa/festeja
     - Erro: mascote faz expressão de "pense de novo"
   - **Itens da loja equipados visualmente** no mascote (óculos, chapéu, etc.)
   - Tooltip ao hover: "Nível 12 — 340/500 XP"

3. **Mix Diário de Estudo** (novo — estilo Spotify)
   - Card "📚 Seu Mix de Hoje" com 3-5 lições curtas cross-matéria:
     - *"5min de Raciocínio Lógico (revisão SRS)"*
     - *"8min de Matemática (novo módulo)"*
     - *"3min de Português (revisão de ontem)"*
   - Cada item com ícone da matéria, duração estimada, tipo (novo/revisão)
   - Botão "▶ Começar Mix" que encadeia tudo automaticamente no chat
   - **Remove a decisão "o que estudar hoje?"**

4. **Barra de Progresso Geral**
   - XP atual / XP para próximo nível
   - Barra animada com cor gradiente (não pula — anima suavemente com easing)
   - "+15 XP" flutua para cima e desaparece quando XP é ganho
   - "Nível 12 — 340/500 XP"

5. **Matérias em Andamento**
   - Cards horizontais (max 3-4 visíveis)
   - Cada card: nome da matéria, barra de progresso (módulos), último acesso
   - Botão "Continuar" em cada card
   - **Indicador SRS** (novo): badge "🔄 Revisar" em matérias com conceitos a revisar

6. **Grafo de Conhecimento** (novo)
   - Visualização de rede interativa mostrando tópicos conectados:
     - **Nós** = conceitos/tópicos
     - **Arestas** = dependências (pré-requisitos)
     - **Cores por status:** dominado (verde), em progresso (azul), não iniciado (cinza), precisa revisar (vermelho/amarelo)
   - Implementado em Canvas 2D ou SVG com posicionamento por força (force-directed)
   - **Interativo:** hover mostra tooltip com nome + status; clique abre a aula do tópico
   - Zoom e pan com scroll/arrasto
   - Compacto no dashboard (mini-versão), expande para tela cheia no perfil

7. **Heat Map de Atividade** (novo — estilo GitHub)
   - Grid calendarial (52 semanas × 7 dias) mostrando dias de estudo:
     - Sem atividade: cinza
     - Pouca atividade: verde claro
     - Muita atividade: verde escuro
   - Tooltip ao hover: "15 de julho: 3 questões, 25 XP"
   - Mostra os últimos 3-6 meses

8. **Previsão de Domínio** (novo)
   - Card com estimativas baseadas na velocidade atual:
     - *"No seu ritmo, você dominará Matemática em ~12 dias"*
     - *"Se estudar 30min/dia em vez de 15min, serão ~7 dias"*
   - Calculado pelo `mastery-predictor.js` baseado em XP/hora e módulos restantes

9. **Conquistas Recentes**
   - Últimas 3 badges conquistadas em destaque
   - Badge com ícone + nome + data
   - Link "Ver todas →"

10. **Ranking Semanal**
    - Top 5 da semana (avatar, nome, XP)
    - Posição do usuário atual (se não estiver no top 5)
    - Indicadores de subida/descida (▲▼)

11. **Moedas e Loja**
    - Saldo atual de moedas
    - Preview de 1-2 itens da loja
    - Botão "Visitar Loja"

### 4.3 Catálogo de Matérias
**Layout:** Grid de cards + barra de pesquisa + filtros.

**Matérias Pré-definidas (mock):**
- Matemática
- Português
- Raciocínio Lógico
- História
- Ciências
- Inglês
- Programação
- Direito

**Card de matéria pré-definida:**
- Ícone/emoji temático
- Nome da matéria
- Breve descrição
- Número de módulos
- Nível de dificuldade (iniciante/intermediário/avançado)
- Botão "Começar" ou "Continuar" (se já iniciada)
- Indicador SRS: "🔄 3 conceitos para revisar" (se aplicável)
- Indicador de "47 estudando agora" (novo — número flutua realisticamente)

**Botão "Criar Matéria Custom" (+)**
- Card especial com ícone "+" e visual diferenciado
- Ao clicar → abre cards de sugestão + opção "Criar do zero"
- **Cards de sugestão:** temas populares custom (ex: "Concurso INSS", "ENEM 2025", "Investimentos para iniciantes")
- **Criar do zero:** campo de texto para descrever o que quer aprender → inicia fluxo de triagem

### 4.4 Chat de Estudo (Tela Principal)
**Layout:** Chat fullscreen na área de conteúdo.

**Componentes:**
1. **Header do chat**
   - Nome da matéria/tópico atual
   - Módulo atual (ex: "Módulo 3 de 8 — Equações do 2º Grau")
   - Botão de voltar ao catálogo
   - Indicador de progresso do módulo
   - **Persona ativa** (novo): ícone + nome da IA persona atual (Prof. Sage / Coach Spark / Quiz Master)

2. **Área de mensagens**
   - Mensagens da IA (avatar da persona à esquerda)
   - Mensagens do usuário (avatar do usuário à direita)
   - Widgets de questões inline (expandidos no fluxo do chat)
   - Scroll automático para última mensagem
   - **Referências a conteúdo de módulos anteriores** com links inline

3. **3 Personas de IA** (novo)
   - **Prof. Sage** 🧙 — para explicações teóricas profundas, tom acadêmico mas acessível, usa analogias
   - **Coach Spark** ⚡ — para motivação e celebrações, encorajador, empolgado
   - **Quiz Master** 🎯 — para questões e avaliações, direto e focado em desafio
   - A persona muda automaticamente conforme o contexto (explicação → Sage, feedback positivo → Spark, questão → Quiz Master)
   - Avatar e cor de fundo da mensagem mudam conforme a persona

4. **Tipos de mensagem da IA:**
   - **Texto explicativo** — parágrafos de ensino, com formatação (negrito, itálico, listas)
   - **Exemplos visuais** — blocos destacados com exemplos
   - **Questão interativa** — widget renderizado inline no chat
   - **Feedback de questão** — resultado (✅/❌), explicação, dica
   - **Resumo de módulo** — card com pontos-chave ao final de um módulo
   - **Transição de módulo** — "Parabéns! Você completou o Módulo 3. Vamos para o Módulo 4?"
   - **Revisão SRS** (novo) — questão de revisão de conceito anterior inserida no meio da aula
   - **Pergunta-guia sócrática** (novo) — quando o aluno erra, em vez de dar a resposta, a IA faz uma pergunta que guia à descoberta

5. **Input do usuário**
   - Campo de texto para respostas abertas
   - Quando uma questão interativa aparece, o input é substituído pelo widget
   - Após responder o widget, o input de texto volta
   - **Slash Commands** (novo): o input aceita comandos especiais digitados com `/`:
     - `/explica` — IA explica o último conceito de forma mais simples
     - `/exemplo` — IA dá um exemplo prático do cotidiano
     - `/questao` — IA gera uma questão sobre o tópico atual
     - `/pula` — Pula para o próximo módulo
     - `/revisao` — IA faz uma revisão de conceitos anteriores
     - `/dica` — IA dá uma dica para a questão atual
     - `/persona` — Troca a persona ativa da IA
   - Menu dropdown aparece ao digitar `/` com as opções disponíveis

6. **Indicador de "digitando..."**
   - Animação de 3 pontos pulsantes
   - Aparece antes de cada resposta da IA para simular processamento
   - **Typo simulado** (novo): ~5% de chance de a IA cometer um typo, fazer backspace, e corrigir — detalhe sutil que cria empatia e sensação humana

7. **Comentários de "outros alunos"** (novo — opcional)
   - Seção lateral ou inline mostrando comentários de NPCs:
     - *"Pedro H. disse: essa parte de equações é difícil mesmo!"*
     - *"Ana M. completou este módulo em 12 minutos"*
   - Aparece esporadicamente entre mensagens da IA

**Comportamento da IA — Método Sócrático** (novo):
Quando o aluno erra uma questão, a IA NÃO dá a resposta diretamente. Em vez disso:
- ❌ "A resposta é 42."
- ✅ "Interessante! Você aplicou a fórmula, mas olhe o sinal do segundo termo... o que acontece se você inverter?"
- ✅ "Boa tentativa! Pense no que significa o discriminante ser negativo. O que isso diz sobre as raízes?"

**Callbacks Stateful** (novo):
A IA referencia interações passadas do localStorage:
- *"Ontem você teve dificuldade com frações, mas vamos tentar uma abordagem diferente hoje."*
- *"Faz 3 dias que você não pratica equações. Vamos revisar?"*
- *"Você acertou 5 seguidas! Vamos aumentar o nível?"*

**Reações Emocionais** (novo):
- **Frustração detectada** (3 erros seguidos): IA muda para Coach Spark, baixa dificuldade, oferece encorajamento
- **Sequência de acertos** (5+ seguidos): IA celebra, aumenta desafio, sugere módulo avançado
- **Velocidade alta** (responde muito rápido): IA pergunta se é fácil demais, sugere pular

**Puzzles de Aquecimento** (novo):
Antes de cada aula, um mini-puzzle visual (30 segundos) como "aquecimento mental":
- Sequência lógica com imagens
- Encontre o padrão
- Rotacione a forma para encaixar
- Aparece como primeira mensagem do chat: *"Hora de aquecer o cérebro! 🧩"*

**Ghost Racing** (novo):
Durante quizzes cronometrados, barra de progresso de um NPC preenchendo em tempo real ao lado da do usuário:
- Como no Mario Kart com fantasmas
- NPC com avatar e nome visível
- Velocidade do NPC baseada em dificuldade configurada
- Se o usuário "vence" o fantasma: bônus de XP

**Fluxo típico de uma aula mockada (atualizado):**
```
IA (Coach Spark ⚡): "Bora aquecer! 🧩" → [Puzzle de aquecimento rápido]
IA (Prof. Sage 🧙): "Vamos continuar com Equações do 2º Grau. 📐"
IA (Prof. Sage 🧙): "Uma equação do 2º grau tem a forma ax² + bx + c = 0, onde a ≠ 0."
IA (Prof. Sage 🧙): "O método mais comum é a fórmula de Bhaskara:"
IA (Prof. Sage 🧙): [bloco visual com a fórmula destacada]
IA (Quiz Master 🎯): "Vamos praticar? Resolva: x² - 5x + 6 = 0"
    [Widget: slider numérico para cada raiz] + [Ghost Race bar ao lado]
Usuário: [interage com widget, insere x=2 e x=3]
IA (Quiz Master 🎯): ✅ "Correto! As raízes são 2 e 3."
IA (Prof. Sage 🧙): "Você pode verificar: (x-2)(x-3) = x² - 5x + 6 ✓"
IA (Quiz Master 🎯): [Questão SRS] "Lembra de frações? Qual é 3/4 + 1/2?"
...
IA (Coach Spark ⚡): "🔥 Módulo concluído! +50 XP, +20 moedas!"
```

### 4.5 Widgets de Questões Interativas

#### 4.5.1 Múltipla Escolha
- Card com enunciado da questão
- Lista de alternativas (A, B, C, D) como botões clicáveis
- Hover: destaque sutil no botão
- Seleção: cor sólida + checkmark
- Feedback imediato: verde (certo) / vermelho (errado) + explicação
- **Screen shake** (novo): shake sutil (2-3px, 300ms) no widget ao errar
- Animação de confirmação verde ao acertar

#### 4.5.2 Verdadeiro/Falso
- Enunciado em card
- Dois botões grandes: ✅ Verdadeiro | ❌ Falso
- Mesmo sistema de feedback que múltipla escolha

#### 4.5.3 Preencher Lacunas
- Texto com espaços em branco sublinhados (______)
- Cada lacuna é um input inline editável
- Validação por lacuna: verde/vermelho individual
- Dica opcional ao errar

#### 4.5.4 Arrastar e Soltar
- Lista de itens embaralhados em cards draggable
- Zona de destino (target) com slots visuais
- Feedback de posição: borda tracejada quando arrastando sobre
- **Physics-based snapping** (novo): snap magnético quando próximo da posição correta, bounce elástico ao soltar
- Sombra elevada durante arrasto
- Validação da ordem final
- Touch-friendly (pointer events)

#### 4.5.5 Slider Numérico
- Enunciado com pergunta numérica
- Slider horizontal com min/max configurável
- Valor exibido em tempo real acima do thumb
- Input numérico opcional ao lado para precisão
- Botão "Confirmar"
- Feedback com distância da resposta correta

#### 4.5.6 Canvas/Desenho com AI Vision (atualizado)
- Área de canvas responsiva (min 400x300)
- Ferramentas: lápis, borracha, cor, espessura
- Grid/axes opcionais (para gráficos)
- Botões: Limpar, Desfazer, Confirmar
- **Reconhecimento de formas "AI Vision"** (novo):
  - Quando o usuário desenha e clica "Confirmar", detecta a forma (círculo, triângulo, reta, quadrado)
  - Animação de "scan" percorrendo o desenho
  - Substitui instantaneamente por uma versão SVG perfeita e limpa
  - Feedback: *"A IA entendeu: você desenhou um círculo! ✨"*
  - Momento mágico de "a IA entendeu o que eu quis desenhar!"

### 4.6 Perfil do Aluno
**Layout:** Header com avatar + grid de seções.

**Seções:**
1. **Header do Perfil**
   - Avatar grande (com acessórios desbloqueados)
   - Nome do usuário
   - Título personalizado (se equipado)
   - Nível + XP
   - Badge de streak em destaque

2. **Estatísticas Gerais**
   - Total de horas estudadas (mock)
   - Matérias concluídas
   - Questões respondidas
   - Taxa de acerto geral
   - Posição no ranking

3. **Radar Chart de Competências** (novo)
   - Gráfico de radar multi-eixo mostrando proficiência em sub-habilidades
   - Exemplo para Matemática: [Cálculo, Geometria, Álgebra, Estatística, Lógica]
   - O polígono expande/contrai conforme o desempenho
   - Implementado em Canvas/SVG
   - Revela assimetrias de conhecimento instantaneamente

4. **Grafo de Conhecimento (versão expandida)** (novo)
   - Versão ampliada do mini-grafo do dashboard
   - Tela cheia com zoom/pan
   - Cada nó clicável para navegar ao tópico

5. **Heat Map de Atividade** (novo — duplicata do dashboard, versão expandida)
   - Grid calendarial completo mostrando histórico de estudo
   - Filtro por matéria

6. **Badges/Conquistas**
   - Grid de todas as badges (conquistadas em cor, bloqueadas em cinza)
   - Tooltip com nome + descrição + data de conquista
   - Categorias: Estudo, Streak, Questões, Especiais

7. **Histórico de Atividades**
   - Timeline das últimas atividades (estudou X, completou módulo Y, ganhou badge Z)
   - Filtro por período

8. **Moedas**
   - Saldo atual com ícone
   - Últimas transações (ganhou X por..., gastou Y em...)

### 4.7 Loja de Recompensas
**Layout:** Grid de categorias com itens compráveis.

**Categorias:**
1. **Temas Visuais** (cores de chat, wallpapers de perfil)
2. **Acessórios de Avatar** (chapéus, óculos, backgrounds)
3. **Acessórios do Mascote** (óculos, chapéu, aura — equipados VISUALMENTE no mascote do dashboard)
4. **Títulos Personalizados** ("Mestre da Lógica", "Gênio da Matemática")

**Item da loja:**
- Preview visual
- Nome
- Preço em moedas 💰
- Botão "Comprar" (desabilitado se moedas insuficientes)
- "Equipar" após compra (para itens de avatar/título/mascote)

### 4.8 Fluxo de Triagem Custom (Híbrido)

**Etapa 1 — Cards de Sugestão (no catálogo):**
- Grid de 6-8 cards com temas populares
- Card "+ Criar do zero" no final

**Etapa 2 — Input Inicial:**
- Se "Criar do zero": campo de texto "O que você quer aprender?"
- Se card de sugestão: usa o tema do card como ponto de partida

**Etapa 3 — Triagem no Chat (wizard dentro do modal):**
- Modal overlay com layout de chat simplificado
- A IA (Prof. Sage 🧙) faz 3-5 perguntas estruturadas, uma por vez:
  1. "Qual seu objetivo com este estudo?" (opções: concurso, curiosidade, profissional, escola/faculdade)
  2. "Qual seu nível atual no assunto?" (opções: zero, básico, intermediário, avançado)
  3. "Quanto tempo você tem disponível por dia?" (opções: 15min, 30min, 1h, 2h+)
  4. "Quer foco em teoria, prática (exercícios), ou ambos?" (opções)
  5. "Tem alguma data limite? (ex: prova em X semanas)" (input livre ou "sem limite")
- Cada pergunta aparece como mensagem da IA com opções clicáveis (botões)
- Após todas as respostas, a IA faz um "resumo da triagem"

**Etapa 4 — Animação "Matrix Upload"** (novo — O MOMENTO WOW)
Em vez de um loading spinner, uma animação canvas espetacular:
1. Tela escurece levemente
2. Nós luminosos começam a surgir aleatoriamente no canvas
3. Os nós se atraem e formam conexões (física simples: gravidade + atração entre nós vizinhos)
4. A rede forma uma constelação representando o "mapa de conhecimento" sendo gerado
5. Partículas de luz percorrem as conexões (simulando "processamento da IA")
6. Após ~3 segundos, a animação faz zoom suave e se dissolve
7. Transição seamless para o Plano de Estudo gerado

- **Por que funciona:** Transforma um momento técnico em emocional. Faz a IA parecer staggering poderosa.
- **Implementação:** Canvas 2D com `requestAnimationFrame`, ~150-200 linhas de JS.

**Etapa 5 — Plano de Estudo Gerado:**
- Card dentro do chat com o plano estruturado:
  - Nome da matéria custom (gerado pela IA)
  - Lista de módulos (3-6 módulos mock) com dependências visuais
  - Duração estimada
  - Mini-grafo de conhecimento mostrando a estrutura do plano
  - Botão "Começar Estudos" → redireciona para o Chat de Estudo

### 4.9 Modo "Shorts" de Revisão (novo)
Uma tela acessível pelo dashboard ou sidebar com flashcards em formato vertical, estilo TikTok/Reels:
- Cada flashcard mostra um conceito ou questão que o usuário errou
- **Swipe up** = próximo
- **Swipe right** = "já sei"
- **Swipe left** = "revisar depois"
- Velocidade e formato similar a Reels/TikTok
- Aparece com timer: "⚡ 2 minutos de revisão rápida"
- **Baseado no SRS:** prioriza conceitos com meia-vida próxima de expirar

### 4.10 Notificações Toast (novo)
Notificações toast no canto inferior direito:
- *"🔥 Não perca seu streak! Estude pelo menos 5 minutos hoje."*
- *"🎯 Nova conquista disponível: Responda 10 questões sem errar."*
- *"📚 Ana S. ultrapassou você no ranking!"*
- *"🧠 3 conceitos de Matemática precisam de revisão."*
- Aparecem esporadicamente (1-2x por sessão)
- Auto-dismiss após 5 segundos
- Dismiss manual com X

---

## 5. Sistema de Gamificação

### 5.1 XP e Níveis
- **Tabela de XP por nível** (progressão exponencial suave):
  - Nível 1: 0 XP | Nível 2: 100 XP | Nível 3: 250 XP | Nível 5: 700 XP | Nível 10: 3000 XP | ...
- **Fontes de XP:**
  - Ler explicação da IA: +5 XP
  - Responder questão corretamente: +15 XP
  - Responder questão incorretamente: +3 XP
  - Completar módulo: +50 XP
  - Completar matéria: +200 XP
  - Manter streak: +10 XP/dia
  - Vencer Ghost Race: +10 XP bônus
  - Completar puzzle de aquecimento: +5 XP
  - Completar revisão SRS: +8 XP
- **Feedback visual:** animação de "+15 XP" flutuando para cima e desaparecendo
- **Barra de XP** sempre visível na sidebar e no header do chat, com animação suave

### 5.2 Streaks (Sequências)
- **Contador** de dias consecutivos estudando
- **Mínimo:** 1 atividade por dia (responder 1 questão ou ler 1 explicação)
- **Reset:** perde o streak se ficar 1 dia sem atividade
- **Visual:** ícone de fogo 🔥 com número, cor laranja, animação pulsante
- **Marcos:** 7 dias (badge), 30 dias (badge especial), 100 dias (badge lendária)
- **Reação do mascote:** streak ativo → chama ao redor; streak quebrado → mascote triste

### 5.3 Badges/Conquistas
**Mock de badges (exemplos):**

| Badge | Condição | Raridade |
|---|---|---|
| 🌟 Primeiro Passo | Completar a primeira aula | Comum |
| 🔥 Em Chamas | 7 dias de streak | Incomum |
| 💯 Perfeccionista | 100% em um módulo | Incomum |
| 🧠 Mestre Lógico | Completar Raciocínio Lógico | Rara |
| ⚡ Speed Learner | Completar módulo em < 10min | Rara |
| 🏆 Lenda do Streak | 30 dias de streak | Épica |
| 📚 Polímata | Completar 3 matérias diferentes | Épica |
| 👑 Gênio Universal | Completar 5 matérias | Lendária |
| 🏎️ Ghost Buster | Vencer 10 Ghost Races | Rara |
| 🧩 Puzzle Master | Completar 20 aquecimentos | Incomum |
| 🔄 Memory Keeper | Completar 50 revisões SRS | Rara |
| ✨ AI Whisperer | Usar 10 slash commands | Comum |

### 5.4 Ranking
- **Semanal:** rankeado por XP ganho na semana
- **Mock:** 8-10 NPCs com nomes, avatares e XP variados
- **Visual:** tabela com posição, avatar, nome, XP, indicador ▲▼
- **Destaque** para a posição do usuário

### 5.5 Moedas e Loja
- **Fontes de moedas:**
  - Completar módulo: +20 moedas
  - Questão no primeiro acerto: +5 moedas
  - Streak de 7 dias: +50 moedas
  - Badge conquistada: +10-100 moedas (varia pela raridade)
  - Vencer Ghost Race: +10 moedas
- **Itens da loja:**
  - Temas visuais: 50-200 moedas
  - Acessórios avatar: 100-500 moedas
  - Acessórios mascote: 100-500 moedas
  - Títulos: 150-300 moedas
- **Fluxo:** comprar → equipar → aparece no perfil e/ou mascote

### 5.6 Repetição Espaçada (SRS) (novo)
Sistema que monitora a "meia-vida" da memória do usuário:
- **Intervalos:** 1 dia → 3 dias → 7 dias → 14 dias → 30 dias → 90 dias
- A cada questão respondida, o SRS calcula o próximo intervalo de revisão
- A IA periodicamente insere questões de revisão de módulos anteriores no meio de aulas novas
- Dashboard mostra "conceitos que precisam de revisão" com urgência por cor:
  - 🟢 Revisado recentemente
  - 🟡 Meia-vida próxima (revisar hoje/amanhã)
  - 🔴 Meia-vida expirada (revisar agora)
- **Implementação:** tracking de data de último acerto por questão + intervalo crescente

### 5.7 Ghost Racing (novo)
- Durante quizzes, barra de progresso de NPC preenchendo em tempo real
- NPC com avatar, nome e velocidade configurada
- Vitória do usuário = bônus de XP + moedas
- Derrota = incentivo para tentar de novo
- NPCs usados: os mesmos do ranking semanal

---

## 6. Comportamento da IA (Mock)

### 6.1 Tom Adaptativo
- **Concurso/ENEM:** formal, técnico, focado em questões de prova
- **Curiosidade:** casual, entusiasmado, usa analogias do cotidiano
- **Profissional:** direto, prático, focado em aplicação real
- **Escola/Faculdade:** didático, passo a passo, revisão de conceitos
- O tom é definido pelo objetivo escolhido na triagem

### 6.2 Respostas Pré-escritas
- Cada fluxo (aula, questão, feedback, triagem) tem um conjunto de respostas fixas
- Respostas incluem placeholders: `{nome}`, `{materia}`, `{modulo}`, `{persona}`
- A IA "escolhe" a resposta baseada no estado atual (módulo, questão, acerto/erro, persona ativa)
- **Com callbacks stateful:** templates incluem referências a dados do localStorage (streak, último erro, matéria com mais dificuldade)
- **Com tom sócrático:** respostas de erro são perguntas-guia, não respostas diretas

### 6.3 Fluxo de Aula Mock (atualizado)
```
1. [Coach Spark] Puzzle de aquecimento (30s)
2. [Prof. Sage] Boas-vindas ao módulo + callback ("Lembra que ontem...")
3. [Prof. Sage] Explicação do conceito (1-2 mensagens)
4. [Prof. Sage] Exemplo visual/prático
5. [Quiz Master] Questão 1 (múltipla escolha) + Ghost Race
6. [Quiz Master] Feedback (sócrático se erro) + explicação
7. [Prof. Sage] Questão SRS (revisão de conceito anterior)
8. [Quiz Master] Questão 2 (tipo diferente — ex: verdadeiro/falso)
9. [Quiz Master] Feedback
10. [Quiz Master] Questão 3 (tipo diferente — ex: slider ou drag-drop)
11. [Quiz Master] Feedback
12. [Prof. Sage] Resumo do módulo
13. [Coach Spark] "Módulo concluído!" + XP + moedas + possível badge + confetti
14. [Coach Spark] "Próximo módulo?" ou "Voltar ao catálogo"
```

### 6.4 Slash Commands (novo)
O parser de slash commands intercepta o input do usuário antes de enviar:
- `/explica` → IA (Prof. Sage) re-explica o último conceito de forma simplificada
- `/exemplo` → IA (Prof. Sage) dá exemplo do cotidiano
- `/questao` → IA (Quiz Master) gera questão extra sobre tópico atual
- `/pula` → IA (Coach Spark) confirma e avança para próximo módulo
- `/revisao` → IA (Prof. Sage) faz revisão de conceitos anteriores (via SRS)
- `/dica` → IA (Quiz Master) dá dica para a questão atual sem revelar resposta
- `/persona [nome]` → Troca persona ativa

---

## 7. Estado da Aplicação

### 7.1 Estrutura do Estado (localStorage)
```javascript
{
  user: {
    name: "Estudante",
    level: 1,
    xp: 0,
    xpToNext: 100,
    coins: 50,
    streak: 0,
    lastActiveDate: null,
    badges: [],
    equippedTitle: null,
    equippedAvatarItems: [],
    equippedMascotItems: [],
    customSubjects: []
  },
  subjects: {
    "matematica": {
      name: "Matemática",
      currentModule: 0,
      modules: [
        { id: 0, name: "Operações Básicas", completed: false, questionsAnswered: 0, correctAnswers: 0 },
        { id: 1, name: "Frações", completed: false, questionsAnswered: 0, correctAnswers: 0 }
      ]
    }
  },
  srs: {
    // Tracking de repetição espaçada por questão
    "matematica:0:0": { lastReview: "2026-07-29", interval: 1, nextReview: "2026-07-30", easeFactor: 2.5 },
    "matematica:0:1": { lastReview: "2026-07-28", interval: 3, nextReview: "2026-07-31", easeFactor: 2.3 }
  },
  chatHistory: {},
  activityHeatMap: {
    "2026-07-29": { questionsAnswered: 5, xpEarned: 45, minutesStudied: 15 },
    "2026-07-28": { questionsAnswered: 3, xpEarned: 20, minutesStudied: 10 }
  },
  shopPurchases: [],
  settings: {
    theme: "light",
    activePersona: null  // null = auto, "sage", "spark", "quiz"
  }
}
```

### 7.2 Persistência
- Estado salvo automaticamente no `localStorage` a cada ação
- Botão "Resetar Progresso" no perfil (volta ao estado padrão)

---

## 8. Mock de Dados

### 8.1 Matérias Pré-definidas
Cada matéria terá 4-6 módulos mock com 2-3 questões cada. Exemplo para Matemática:
- Módulo 1: Operações Básicas
- Módulo 2: Frações e Decimais
- Módulo 3: Equações do 1º Grau
- Módulo 4: Equações do 2º Grau
- Módulo 5: Geometria Básica
- Módulo 6: Estatística e Probabilidade

### 8.2 Questões Mock
Para cada módulo, 2-3 questões com tipos variados:
- 1 múltipla escolha
- 1 verdadeiro/falso ou preencher lacunas
- 1 interativa (slider, drag-drop ou canvas)

### 8.3 NPC do Ranking e Ghost Racing
```javascript
[
  { name: "Ana Silva", avatar: "👩‍🎓", xp: 2340, level: 15, ghostSpeed: 0.8 },
  { name: "Pedro Santos", avatar: "👨‍💻", xp: 1890, level: 13, ghostSpeed: 0.6 },
  { name: "Maria Oliveira", avatar: "👩‍🔬", xp: 1650, level: 12, ghostSpeed: 0.7 },
  // ... mais NPCs
]
```

### 8.4 Warm-up Puzzles
```javascript
[
  { type: "sequence", prompt: "Qual o próximo número?", data: [2, 4, 8, 16, "?"], answer: 32 },
  { type: "pattern", prompt: "Encontre o padrão", data: "🔴🔵🔴🔵🔴?", answer: "🔵" },
  { type: "rotation", prompt: "Rotacione 90° no sentido horário", data: "L-shape", answer: "rotated-L" }
]
```

### 8.5 Fake Live Ticker Events
```javascript
[
  { template: "{name} desbloqueou a badge {badge}! 🏆", names: [...], badges: [...] },
  { template: "{name} completou {materia}! 📐", names: [...], subjects: [...] },
  { template: "{name} está em {days}º dia de streak! 🔥", names: [...], daysRange: [3, 30] },
  { template: "📚 {count} pessoas estudando {materia} agora", subjects: [...], countRange: [15, 80] }
]
```

---

## 9. Interações e Micro-interações

### 9.1 Animações Essenciais
- **Transição de páginas:** fade-out (150ms) → fade-in (200ms) com translateY(-8px → 0)
- **XP ganho:** número "+15 XP" flutua para cima e desaparece
- **Subir de nível:** overlay comemorativo com confetti (CSS particles)
- **Badge conquistada:** modal com animação de revelação (badge aparece com glow)
- **Streak atualizado:** chama pulsa quando streak é mantido
- **Questão correta:** shake de confirmação verde + checkmark animado
- **Questão errada:** shake de erro vermelho (2-3px, 300ms) + X animado
- **Drag and drop:** sombra elevada + physics-based snap magnético com bounce elástico
- **Digitando...:** 3 pontos com animação de onda + ~5% chance de typo/fix
- **Mascote reações:** bounce ao acertar, tristeza ao errar, fogo ao manter streak
- **Matrix Upload:** animação canvas de galáxia de nós (3 segundos)
- **AI Vision no canvas:** scan animation → substituição por SVG limpo

### 9.2 Hover States Ricos
- **Cards:** elevação sutil (shadow increase) + scale(1.02)
- **Botões:** darken background + translate(-1px) no Y
- **Badges:** glow effect + tooltip com descrição
- **Avatar items:** bounce animation no hover
- **Knowledge graph nodes:** glow + tooltip com nome/status
- **Heat map cells:** tooltip com data e detalhes

### 9.3 Feedback Sonoro (Opcional)
- Sem áudio no protótipo (foco visual)
- Deixar hooks prontos para adicionar depois

---

## 10. Acessibilidade

- **Semântica HTML** adequada (headings hierarchy, landmarks, nav, main)
- **Contraste WCAG AA** em ambos os temas
- **Focus states** visíveis em todos os elementos interativos
- **Navegação por teclado** funcional (Tab, Enter, Escape)
- **ARIA labels** em widgets interativos
- **Respeitar prefers-reduced-motion** para animações

---

## 11. Prioridades de Implementação

### Fase 1 — Essencial (MVP visual)
1. Scaffold e estrutura de arquivos
2. Design system (CSS variables, base, temas, animações)
3. Sidebar + roteamento SPA + notificações toast
4. Dashboard com cards mock (saudação, streak, XP bar, matérias)
5. Catálogo de matérias (grid + cards)
6. Chat de estudo (motor de mensagens básico + 3 personas + typing indicator)
7. Mock de 1 matéria com 1 módulo e 1 questão (múltipla escolha)

### Fase 2 — Interatividade
8. Todos os 6 widgets de questões (com screen shake, physics-based snap)
9. Sistema de feedback sócrático (acerto/erro + pergunta-guia)
10. Slash commands no chat
11. Puzzles de aquecimento
12. Ghost Racing em quizzes
13. Fluxo completo de aula mock (1 matéria, 2-3 módulos)

### Fase 3 — Gamificação e Analytics
14. XP + níveis + barra de progresso animada
15. Streak com animação + reação do mascote
16. Mascote evolutivo (Tamagotchi SVG)
17. Badges com sistema de conquista
18. Ranking mock + Fake Live Ticker
19. Moedas + loja (incluindo acessórios do mascote)
20. SRS (repetição espaçada) + revisões no chat
21. Heat Map de atividade
22. Mix Diário cross-matéria

### Fase 4 — Completo e Polish
23. Perfil do aluno (radar chart, badges, histórico)
24. Grafo de Conhecimento interativo
25. Previsão de "quando vai dominar"
26. Fluxo de triagem custom com animação Matrix Upload
27. Canvas com AI Vision (reconhecimento de formas)
28. Modo "Shorts" de revisão (flashcards swipe)
29. Callbacks stateful da IA (referenciar histórico do usuário)
30. Matérias adicionais mock
31. Polish visual final + todas as micro-interações

---

## 12. Restrições e Decisões de Design

| Decisão | Justificativa |
|---|---|
| Sem frameworks/libraries | Protótipo vanilla para demonstrar conceito puro, sem overhead |
| SPA com hash routing | Navegação client-side sem servidor, `#/dashboard`, `#/chat`, etc. |
| localStorage para persistência | Dados sobrevivem refresh de página sem backend |
| Typing indicator com typos ocasionais | Cria sensação humana na IA sem complicar o mock |
| Tom sócrático em erros | Pedagogia real (Khanmigo style); aluno aprende raciocínio, não respostas |
| 3 personas de IA | Variedade visual e contextual; cada persona tem avatar/cor/tom próprios |
| Mascote evolutivo como eixo emocional | Conexão emocional que motiva uso diário; itens da loja ganham significado |
| Ghost Racing em quizzes | Competição sem multiplayer real; pressão saudável + bônus de XP |
| SRS integrado ao fluxo | Ciência cognitiva real; revisões aparecem naturalmente na aula |
| Animação Matrix Upload | "WOW moment" do protótipo; transforma loading em experiência emocional |
| Desktop-first | Protótipo conceitual, não precisa ser mobile-perfeito |
| CSS Custom Properties para theming | Toggle claro/escuro eficiente, fácil de estender |
| Widgets como classes JS | Reutilizáveis, encapsulados, fácil de adicionar novos tipos |
| Estado centralizado | Facilita debug e reset, padrão simples sem Redux/Zustand |
| Canvas 2D para visualizações | Grafo, heat map, radar chart — zero dependências, performance nativa |
| SVG para mascote | Layers escaláveis (base + acessórios), animações CSS suaves |
