# 🚀 LunarPass — Automação de Testes E2E

Suíte completa de testes automatizados ponta a ponta (End-to-End) para a aplicação **LunarPass**, desenvolvida com **Playwright**, **TypeScript** e **Kysely**.

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Arquitetura e Boas Práticas](#-arquitetura-e-boas-práticas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Módulos e Cobertura de Testes](#-módulos-e-cobertura-de-testes)
- [Pré-requisitos e Instalação](#-pré-requisitos-e-instalação)
- [Como Executar os Testes](#-como-executar-os-testes)
- [Relatórios e Evidências](#-relatórios-e-evidências)
- [Documentações Relacionadas](#-documentações-relacionadas)

---

## 🔭 Visão Geral

O **LunarPass** é uma plataforma de viagens e missões espaciais que conta com dois módulos principais:
1. **Storefront:** Vitrine pública voltada para usuários finais (busca de missões espaciais, seleção de assentos, cadastro de passageiros, aplicação de cupons/descontos e checkout com cartão).
2. **Mission Control:** Painel administrativo operacional (autenticação de tripulantes/administradores, gestão e cadastro de missões espaciais).

Este repositório concentra a engenharia de qualidade e automação de testes E2E, garantindo confiabilidade, isolamento de cenários e alta resiliência.

---

## 🛠️ Stack Tecnológica

- **Test Runner:** [Playwright](https://playwright.dev/) (v1.62+)
- **Linguagem:** TypeScript
- **Gerenciador de Pacotes:** Yarn / npm
- **Database Query Builder:** [Kysely](https://kysely.dev/)
- **Database Driver:** `pg` (PostgreSQL / Supabase)
- **Massa de Dados:** `@faker-js/faker` & geradores utilitários customizados

---

## 🏗️ Arquitetura e Boas Práticas

A automação segue as diretrizes documentadas em [docs/arquitetura.md](file:///c:/Metodo-ADT/lunarpass-tests/docs/arquitetura.md):

1. **Page Component Object Model (PCOM):**
   - Abstrações de tela em `playwright/support/pages/` e componentes reutilizáveis em `playwright/support/pages/components/`.
2. **Fixtures First & Injeção de Dependência:**
   - Injeção tipada através da fixture customizada `{ app }` em `playwright/support/index.ts`, eliminando instanciações manuais (`new PageObject(page)`) nos testes.
3. **Massa de Teste Direta via Banco (Direct Database Seeding):**
   - Utilização do Kysely (`playwright/support/db.ts`) para limpeza e inserção atômica de dados pré-condição (`cleanAndInsertMission`, `cleanMission`), garantindo rapidez e independência entre testes.
4. **Resiliência e Acessibilidade (A11y-driven Locators):**
   - Ordem de prioridade estrita de locators: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`.
   - Sem dependência de classes CSS frágeis ou seletores XPath relacionais.
5. **Isolamento Total & Multi-Worker:**
   - IDs de missão exclusivos por cenário (`LP-XXXXX`) para garantir execução paralela limpa e sem concorrência de banco.
6. **Alinhamento com Especificação Gherkin:**
   - Títulos de testes 1:1 com os cenários documentados na pasta `docs/` e estrutura AAA (Arrange, Act, Assert).

---

## 📁 Estrutura do Projeto

```plaintext
lunarpass-tests/
├── .agent/                    # Skills e configurações dos agentes de automação e QA
├── docs/                      # Especificações funcionais, BDD/Gherkin e arquitetura
│   ├── arquitetura.md         # Padrões arquiteturais, convenções e regras da suíte
│   ├── aderencia.md           # Análise de seletores e aderência a acessibilidade
│   ├── stripe-cards.md        # Cartões de crédito para simulação de pagamentos
│   └── storefront/            # Documentação e cenários BDD/Gherkin do Storefront
│       ├── busca-de-missoes.md
│       ├── mapa-de-assentos.md
│       ├── passageiros.md
│       ├── desconto.md
│       └── pagamento-e-emissao-do-ticket.md
├── playwright/                # Toda a infraestrutura e código da automação E2E
│   ├── e2e/                   # Especificações de teste (*.spec.ts)
│   │   ├── mission-control/   # Testes do painel administrativo
│   │   │   ├── login.spec.ts
│   │   │   └── register.spec.ts
│   │   └── storefront/        # Testes da loja e fluxo de compra
│   │       ├── home.spec.ts
│   │       ├── missions.spec.ts
│   │       ├── seat-map.spec.ts
│   │       ├── passengers.spec.ts
│   │       ├── discount.spec.ts
│   │       └── payment.spec.ts
│   └── support/               # Abstrações, fixtures e utilitários
│       ├── db.ts              # Conexão Kysely e queries atômicas de apoio
│       ├── helpers.ts         # Utilitários de data e formatação
│       ├── index.ts           # Runner estendido do Playwright com fixture { app }
│       ├── types.ts           # Interfaces e tipos do modelo de dados
│       └── pages/             # Page Objects (PCOM)
│           ├── mission-control/
│           ├── shared/
│           └── storefront/
├── package.json               # Dependências e scripts
├── playwright.config.ts       # Configuração global do Playwright
└── README.md                  # Documentação principal do projeto
```

---

## 🧪 Módulos e Cobertura de Testes

### 🛸 Storefront (`playwright/e2e/storefront/`)
- **`home.spec.ts`**: Carregamento da página inicial e títulos principais.
- **`missions.spec.ts`**: Busca e filtragem de missões por termo e data de partida.
- **`seat-map.spec.ts`**: Seleção de assentos, bloqueio de assentos indisponíveis e limites de seleção.
- **`passengers.spec.ts`**: Validação de limites mínimos e máximos (nome, passaporte) e regra de maioridade para data de nascimento.
- **`discount.spec.ts`**: Aplicação de cupons válidos, inválidos e cálculo do desconto sobre o total.
- **`payment.spec.ts`**: Fluxo completo de checkout com cartão de crédito e confirmação da reserva.

### 🛰️ Mission Control (`playwright/e2e/mission-control/`)
- **`login.spec.ts`**: Autenticação administrativa com credenciais válidas e inválidas.
- **`register.spec.ts`**: Cadastro de novas missões espaciais e validações de campos obrigatórios/duplicados.

---

## ⚙️ Pré-requisitos e Instalação

1. **Node.js** (v18 ou superior recomendado)
2. **Yarn** ou **npm**

Instale as dependências do projeto:
```bash
yarn install
# ou
npm install
```

Instale os navegadores do Playwright:
```bash
npx playwright install --with-deps chromium
```

---

## 🚀 Como Executar os Testes

Execute todos os testes E2E:
```bash
yarn test
# ou
npm test
```

Executar com interface visual do Playwright (UI Mode):
```bash
yarn test:ui
# ou
npm run test:ui
```

Executar uma suíte ou arquivo específico:
```bash
npx playwright test playwright/e2e/storefront/passengers.spec.ts
```

Executar apenas os testes de um módulo:
```bash
npx playwright test playwright/e2e/storefront/
npx playwright test playwright/e2e/mission-control/
```

Executar em modo headed (com navegador visível):
```bash
npx playwright test --headed
```

> [!TIP]
> No ambiente Windows com PowerShell, caso a execução de scripts `.ps1` esteja bloqueada por política de segurança, execute os comandos prefixando com `cmd /c`:
> ```bash
> cmd /c "npx playwright test"
> ```

---

## 📊 Relatórios e Evidências

Após a execução, um relatório HTML detalhado é gerado automaticamente na pasta `playwright-report/`.

Para abrir e visualizar o relatório no navegador:
```bash
yarn report
# ou
npx playwright show-report
```

- **Traces:** Habilitados para depuração detalhada passo a passo (`trace: 'on'`).
- **Screenshots:** Capturadas automaticamente em caso de falha (`screenshot: 'only-on-failure'`).

---

## 📚 Documentações Relacionadas

- [docs/arquitetura.md](file:///c:/Metodo-ADT/lunarpass-tests/docs/arquitetura.md) — Diretrizes detalhadas da arquitetura da automação e PCOM.
- [docs/aderencia.md](file:///c:/Metodo-ADT/lunarpass-tests/docs/aderencia.md) — Matriz de aderência de seletores e acessibilidade.
- [docs/stripe-cards.md](file:///c:/Metodo-ADT/lunarpass-tests/docs/stripe-cards.md) — Cartões de teste do Stripe utilizados na suíte de pagamento.
- [docs/storefront/](file:///c:/Metodo-ADT/lunarpass-tests/docs/storefront/) — Especificações em Gherkin declarativo de cada funcionalidade da vitrine.
