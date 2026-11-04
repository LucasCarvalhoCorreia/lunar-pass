# Do Gherkin ao teste (Lunar Pass)

O Gherkin descreve negócio. A automação traduz para Playwright sem mudar o especificado.

A especificação pode estar na conversa, em `docs/storefront.md`, ou em outro `.md`. Palavras-chave em texto puro, **negrito** ou `.feature`.

## Como cada parte vira código neste repo

| Gherkin | No teste | Como no Lunar Pass |
|---|---|---|
| **Contexto** | `test.beforeEach` | Login: `app.loginPage.go()`. Register: `go` + `login` do usuário da suíte + Sair visível |
| **Dado** (missão/reserva) | Arrange | `cleanMission` / `cleanAndInsertMission` em `playwright/support/db.ts`. Pela UI só se o cenário pedir a navegação |
| **Dado** (viajante na vitrine) | Arrange | Ainda **não** há funções de massa de storefront além de missão. Se faltar, pergunte (ver `duvidas.md` item 9) |
| **Quando** | Act | Métodos do Page Object (`login`, `submitMission`, clique em `dashPage.addButton`) |
| **Então** / **E** | Assert no spec | Uma asserção por resultado, nos locators expostos (`alert`, `toast.message`, `navbar.logoutButton`) |
| **Esquema** + **Exemplos** | Um `test` por linha | Lista de dados no spec |
| Anotações (`*Regra de origem*`) | Nada | Só rastreio |

## Título

- `Cenário: não deve cadastrar com código duplicado` → `test('não deve cadastrar com código duplicado', ...)`.
- Esquema: nome + identificação da linha (`Validar o tamanho do nome | caracteres: 2`).
- Um spec por funcionalidade/fluxo, em `playwright/e2e/`.
- Não renomear testes que já existem.

## Quando o cenário não é suficiente

| Situação | O que fazer |
|---|---|
| **Então** vago | Perguntar antes de escrever |
| Mensagem sem texto no Gherkin | Usar o texto da tela; observação no resumo |
| Ação impedida na UI | Não forçar clique; `toBeDisabled` ou alerta; comentar no Act |
| Sem correspondência na tela | O verificável + pergunta no resumo |
| **Dado** que `db.ts` não cria | Perguntar. Não inventar tabela/coluna |
| Decisão de negócio em aberto (`docs/storefront.md` marca “a investigar”) | Não automatizar; pendente |
| Tela ≠ **Então** | Teste falha; possível defeito de produto |
