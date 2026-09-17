---
name: playwright-navigation
description: Use esta skill para navegar, interagir, automatizar ou validar visualmente a aplicação LunarPass Mission Control usando as ferramentas do Playwright MCP (@playwright/mcp).
---

# Skill: Navegação Web com Playwright MCP

Esta skill instrui o agente a utilizar as ferramentas do **Playwright MCP** (`@playwright/mcp`) para automação, navegação resiliente e inspeção visual da aplicação **LunarPass Mission Control**.

---

## 1. Ferramentas Disponíveis no Playwright MCP

O Playwright MCP expõe comandos para controlar uma instância do navegador em tempo real:

- `playwright_navigate` / `browser_navigate`: Acessa uma URL específica.
- `playwright_screenshot` / `browser_screenshot`: Captura evidência visual da página ou de elementos específicos.
- `playwright_click` / `browser_click`: Realiza cliques em elementos interativos identificados por seletores ou acessibilidade.
- `playwright_fill` / `browser_type`: Preenche inputs, textareas e caixas de texto.
- `playwright_select_option` / `browser_select`: Seleciona opções em `<select>` dropdowns.
- `playwright_hover` / `browser_hover`: Posiciona o cursor do mouse sobre elementos (tooltips, menus suspensos).
- `playwright_evaluate` / `browser_evaluate`: Executa scripts JavaScript no contexto da página.
- `playwright_wait_for_selector`: Aguarda elementos assíncronos serem renderizados.

---

## 2. Mapeamento de Rotas e Telas (LunarPass Mission Control)

### Configuração de Ambiente
- **URL Base:** `http://localhost:3000`

---

### A. Tela de Autenticação / Login
- **URL:** `http://localhost:3000/mission-control/login`
- **Elementos Chave:**
  - Título: `Role: heading, Name: "Mission Control"`
  - Campo Email: `input[placeholder='Informe seu email']` ou `Role: textbox, Name: "Email"`
  - Campo Senha: `input[placeholder='Sua senha secreta']` ou `Role: textbox, Name: "Senha"`
  - Botão Entrar: `Role: button, Name: "Entrar"` (`button:has-text('Entrar')`)
  - Feedback/Alertas de Erro: `Role: alert`

#### Fluxo de Autenticação:
1. Navegar até `http://localhost:3000/mission-control/login`.
2. Preencher o e-mail do operador/usuário (`playwright_fill`).
3. Preencher a senha (`playwright_fill`).
4. Clicar em "Entrar" (`playwright_click`).
5. Capturar screenshot para comprovação visual de redirecionamento para o Dashboard (`playwright_screenshot`).

---

### B. Dashboard de Missões
- **URL:** `http://localhost:3000/mission-control/dash`
- **Elementos Chave:**
  - Link de Nova Missão: `Role: link, Name: "Nova missão"` (`a:has-text('Nova missão')`)
  - Lista de Missões cadastradas e seus respectivos status.

#### Fluxo de Navegação:
1. Navegar para o Dashboard (`/mission-control/dash`).
2. Localizar a lista de missões ou acionar `"Nova missão"` para registrar um lançamento.

---

### C. Cadastro de Missão Espacial
- **URL:** `http://localhost:3000/mission-control/register`
- **Elementos Chave:**
  - Título: `Role: heading, Name: "Programar missão"`
  - ID da Missão: `input[name='id']` ou `Role: textbox, Name: "ID da missão"`
  - Foguete: `Role: textbox, Name: "Foguete"`
  - Base Lunar: `<select>` associado à label `"Base lunar"`
  - Data de Partida: `Role: textbox, Name: "Data de partida"`
  - Data de Retorno Calculada: `[data-testid='mission-form-return-date']`
  - Preço da Passagem: `Role: spinbutton, Name: "Preço por passagem (USD)"`
  - Botão Salvar: `Role: button, Name: "Salvar missão"`

#### Fluxo de Cadastro:
1. Acessar `/mission-control/register`.
2. Preencher os campos obrigatórios (identificador, foguete, base lunar de destino, datas e tarifas).
3. Confirmar clicando no botão `"Salvar missão"`.
4. Capturar screenshot comprovando a mensagem de sucesso ou a inclusão na listagem.

---

## 3. Diretrizes de Resiliência e Boas Práticas

### Prioridade de Seletores
1. **Atributos de Teste Estáveis:** `[data-testid="..."]` (ex: `[data-testid="mission-form-return-date"]`).
2. **Acessibilidade e ARIA Roles:** `role=button[name="Entrar"]`, `role=heading[name="Mission Control"]`.
3. **Labels e Placeholders Semânticos:** `input[placeholder="Informe seu email"]`.
4. **Evitar:** Classes utilitárias Tailwind/CSS dinâmicas que podem variar entre compilações.

### Evidências Visuais (Screenshots)
- Realizar captura de tela após cada transição de estado significativa (login bem-sucedido, submissão de formulário ou mensagens de erro).

### Assincronismo e Renderização Dinâmica
- Sempre aguardar os seletores estarem visíveis e interativos antes de enviar eventos de digitação ou clique (`playwright_wait_for_selector`).
