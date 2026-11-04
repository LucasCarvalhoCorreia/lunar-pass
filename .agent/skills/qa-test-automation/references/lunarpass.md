# Lunar Pass — o que a suíte já é

Resumo do que está em `docs/arquitetura.md` e no código em `playwright/`. Se o código e este arquivo divergirem, o código e `docs/arquitetura.md` vencem.

## Stack e runner

- Playwright + TypeScript. Gerenciador: Yarn (`yarn.lock`).
- `playwright.config.ts` na raiz: `testDir: './playwright/e2e'`, `baseURL: 'http://localhost:3000'`, `fullyParallel: true`, project **chromium** (Firefox/WebKit comentados).
- Scripts: `yarn test`, `yarn test:ui`, `yarn report`.
- Rodar um arquivo: `npx playwright test playwright/e2e/<arquivo>.spec.ts`.
- `src/` é a aplicação (neste repositório, placeholder). Specs não moram em `src/`.

## Pastas

```
playwright/e2e/                 *.spec.ts
playwright/support/index.ts     fixture { app }
playwright/support/db.ts        Kysely + funções de missão
playwright/support/helpers.ts   formatDate
playwright/support/types.ts     Mission, Reservation, Ticket
playwright/support/pages/       *.page.ts
playwright/support/pages/components/  navbar.ts, toast.ts
```

## Fixture

Specs importam `test` e `expect` de `../support`. O parâmetro é `{ app }` (e `{ page }` só se o spec da área já for assim).

`createApp` em `playwright/support/index.ts` hoje expõe:

| Chave | Classe | Arquivo |
|---|---|---|
| `loginPage` | `LoginPage` | `pages/login.page.ts` |
| `dashPage` | `DashPage` | `pages/dash.page.ts` |
| `registerPage` | `RegisterPage` | `pages/register.page.ts` |
| `navbar` | `Navbar` | `pages/components/navbar.ts` |
| `toast` | `Toast` | `pages/components/toast.ts` |

Page Object novo: criar o arquivo, importar, incluir em `createApp`. Não instanciar no spec.

## Specs existentes

| Arquivo | Área | Padrão observado |
|---|---|---|
| `home.spec.ts` | storefront (`/`) | Usa `{ page }` e locator no spec, sem Page Object de home |
| `login.spec.ts` | mission-control | `beforeEach` → `app.loginPage.go()`; AAA; `{ app }` |
| `register.spec.ts` | mission-control | `beforeEach` autentica com o usuário da suíte; massa via `db.ts` |

Comentários AAA usados em login/register:

```ts
// Arrange - preparação do cenário
// Act - Execução da ação
// Assert - verificar o resultado
```

(Alguns testes de register usam só `// Arrange` / `// Act` / `// Assert`.)

## Locators (arquitetura §3.2)

1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByTestId`

Evitar XPath, `/..` e classe CSS.

Na implementação atual:

- Login: `getByPlaceholder` nos campos, `getByRole` no botão e no heading, `alert` por `getByRole('alert')`.
- Register: `getByRole('textbox'|'spinbutton'|'button'|'heading')`, `getByLabel` no select da base, `getByTestId('mission-form-return-date')`.
- Dash: `getByRole('link', { name: 'Nova missão' })`.
- Navbar: `getByRole('button', { name: 'Sair' })`.
- Toast: `getByRole('listitem')`.

`LoginPage.go()` e `RegisterPage.submitMission()` usam `expect` **dentro** do Page Object. Novos POs da mesma área devem copiar esse estilo, não o da skill genérica (que proibia `expect` no PO).

Locators só usados num fluxo podem ficar **inline no método** (`login`, `submitMission`). Locators reusados nos specs viram `readonly` no construtor (`alert`, `title`, `addButton`, `logoutButton`, `message`).

## Massa e tipos

`playwright/support/db.ts` (Kysely + `pg` + `CamelCasePlugin`):

- `cleanMission(missionId)` — apaga tickets, reservation e missão
- `cleanAndInsertMission(missionId, mission)` — limpa e insere
- `insertMission`, `deleteMission`, `deleteReservation`, `deleteTickets`

Tipos em `types.ts`: `Mission` (`id`, `rocket`, `baseId`, `departureDate`, `returnDate`, `price`), `Reservation`, `Ticket`.

IDs já usados nos specs: `LP-0128A`, `LP-3001A`. Não repetir.

Código inválido de missão: `@faker-js/faker` com 5 caracteres alfanuméricos maiúsculos (fora do formato `LP-0000`).

Não há `test.afterEach` de limpeza nos specs atuais: a limpeza entra no Arrange (`cleanMission` / `cleanAndInsertMission`). Não introduzir `afterEach` como regra nova sem pedido.

Helper `formatDate` em `helpers.ts`: de `YYYY-MM-DD` para `20 de jan. de 2028`.

## Autenticação usada pela suíte

Mission Control: `app.loginPage.go()` → `/mission-control/login`. Usuário já usado em `login.spec.ts` e `register.spec.ts`: e-mail `buzz@lunarpass.dev`, senha `pwd123`. Não inventar outro usuário. Não mover isso para `.env`.

Após login, os specs esperam `app.navbar.logoutButton` visível com `{ timeout: 10_000 }`.

## Módulos de produto citados na arquitetura

- `mission-control` — login, dash, cadastro de missão
- `storefront` — vitrine pública (`home.spec.ts`); fluxos de busca/reserva ainda sem Page Objects nesta suíte

## Playwright MCP

Configurado em `.agent/mcp_config.json` (`@playwright/mcp`). Na sessão Cursor, use as ferramentas Playwright MCP disponíveis (snapshot de acessibilidade, navegação, clique, preenchimento). Não use o MCP para “provar aceite”; use para descobrir a tela e, se preciso, reproduzir falha.

## Documentos em `docs/` (gitignorados)

| Arquivo | Uso nesta skill |
|---|---|
| `docs/arquitetura.md` | Padrão da suíte |
| `docs/aderencia.md` | Testabilidade da UI; pedidos de `data-testid` ainda podem ser só recomendação, não implementação |
| `docs/storefront.md` | Especificação Gherkin do storefront (não é código de teste) |
