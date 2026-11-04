# Page Objects no Lunar Pass

Padrão: **Page Component Object Model (PCOM)** em `docs/arquitetura.md`.

- Páginas: `playwright/support/pages/<tela>.page.ts`, classe `<Tela>Page`.
- Componentes reutilizados em mais de uma tela: `playwright/support/pages/components/` (`Navbar`, `Toast` — arquivos `navbar.ts`, `toast.ts`, **sem** sufixo `Page`).
- Registro obrigatório em `createApp` (`playwright/support/index.ts`).
- Specs usam `app.<chave>`. Sem `new ...Page(page)` no spec.

## Regras para o que você cria

Siga o estilo do PO vizinho da mesma pasta. O que já está no código:

1. Construtor recebe `page: Page` e guarda `readonly page`.
2. Locators usados pelos **specs** (asserções) são `readonly` no construtor: `alert`, `title`, `addButton`, `logoutButton`, `message`.
3. Locators usados só no fluxo de um método ficam **inline no método**, como em `LoginPage.login` e `RegisterPage.submitMission`.
4. Métodos = ação do usuário: `go()`, `login(email, password)`, `submitMission(mission)`.
5. `go()` usa caminho relativo (`/mission-control/login`). Em `LoginPage`, `go()` ainda espera o heading `Mission Control` com `expect` — copie esse padrão em novos `go()` da mesma área (missão-control), não no storefront, até existir um PO de home.
6. Dados de teste e credenciais **não** ficam hardcoded no PO; vêm por parâmetro (o e-mail da suíte mora nos **specs**, não no PO).
7. Sem `waitForTimeout`. Sem XPath, `/..`, classe CSS.
8. Locators: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByTestId`.
9. Tipos de domínio (`Mission`) importam de `../types` (a partir de `pages/`) ou `../support/types` não se aplica dentro de `pages/` — o existente é `from '../types'`.
10. Helper de data: `formatDate` de `../helpers`, como em `register.page.ts`.

## `expect` no Page Object

Não aplicar a regra genérica “zero expect no PO”. Neste projeto:

- `LoginPage.go()`: `expect(title).toBeVisible()` após navegar.
- `RegisterPage.submitMission()`: `expect` no `getByTestId('mission-form-return-date')` com `formatDate`, **antes** de salvar.

Ao **completar** um PO existente, não remova esses `expect`. Ao **criar** um PO novo, só acrescente `expect` no PO se a tela vizinha fizer o mesmo tipo de espera (navegação confirmada ou campo calculado no meio da ação). Asserções do **Então** continuam no spec.

## Reutilizar ou criar?

| Situação | Decisão |
|---|---|
| A tela já tem PO | Reutilize e complete, sem mudar comportamento existente |
| Elemento compartilhado (Sair, toast) | `pages/components/` |
| Tela nova | Arquivo novo + entrada em `createApp` |
| Storefront ainda sem PO (hoje: home no spec) | Para **novo** fluxo, crie o PO — a arquitetura manda PCOM. Não refatore `home.spec.ts` no mesmo pedido, salvo o usuário pedir |

## Indentação

Copie o arquivo ao lado. Não reformatar o repositório.
