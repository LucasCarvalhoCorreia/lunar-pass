# Specs no Lunar Pass

## Onde e como importar

- Pasta: `playwright/e2e/`. Um arquivo por fluxo (`login.spec.ts`, `register.spec.ts`).
- Sempre: `import { test, expect } from '../support'`.
- Não importar `@playwright/test` no spec (regra de `docs/arquitetura.md` §5).
- Usar `{ app }`. Exceção já existente: `home.spec.ts` usa `{ page }` — não replicar em specs novos.

## Estrutura

- **Contexto** Gherkin → `test.beforeEach` do arquivo, como em login (`go`) e register (login + espera do Sair).
- No teste: `// Arrange`, `// Act`, `// Assert` (login ainda usa as frases longas “preparação do cenário” / “Execução da ação” / “verificar o resultado”). Copie o spec da mesma funcionalidade.
- Um `test` por cenário; em Esquema do Cenário, um `test` por linha.

## Asserções

- `toBeVisible`, `toHaveText`, `toContainText`, `toHaveTitle`, `toHaveURL`, `toBeDisabled`, `toHaveCount` só sobre **o item do próprio teste**.
- Uma asserção por **Então** e por **E**. Nenhuma a mais no spec. (O `expect` interno de `submitMission` / `go` já existe no PO; não duplicar no spec o mesmo check.)
- Texto ou número **exato** que a tela mostra.
- “Não permite”: estado observável (alerta, botão desabilitado, permanência na URL), não clique forçado.
- Login autenticado: `await expect(app.navbar.logoutButton).toBeVisible({ timeout: 10_000 })` — este timeout já é da suíte; não espalhar timeouts novos sem necessidade.
- Toast de sucesso de missão: `await expect(app.toast.message).toContainText('...')` como em `register.spec.ts`.
- Alertas de formulário: `await expect(app.loginPage.alert)` / `app.registerPage.alert` com `toHaveText`.

## Esperas

- Sem `waitForTimeout`.
- Sem alterar `retries` em `playwright.config.ts`.

## Isolamento

- Nenhum teste depende de outro.
- IDs de missão únicos; não reutilizar `LP-0128A` nem `LP-3001A`.
- Storefront: asserir a missão semeada pelo teste, nunca a contagem total nem a posição na lista (`docs/arquitetura.md` §3.4).

## Nomes

- Variáveis e POs em inglês (`mission`, `registerPage`).
- Título do teste = nome do cenário Gherkin (os specs atuais usam “deve …” / “não deve …”; isso é o nome que já está no arquivo, não um modelo a forçar se o Gherkin trouxer outro título).
