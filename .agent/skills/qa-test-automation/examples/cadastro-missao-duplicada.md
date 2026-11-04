# Exemplo real: código de missão duplicado

Calibração com o que **já existe** em `playwright/e2e/register.spec.ts` e nos Page Objects. Não é um cenário fictício de outro produto.

## 1. O cenário (equivalente ao teste existente)

**Funcionalidade:** Cadastro de missão (Mission Control)

**Contexto:**
**Dado** que estou autenticado no controle de missões

**Cenário:** não deve cadastrar com código duplicado
**Dado** que já existe uma missão com o código informado
**Quando** eu submeto o cadastro com o mesmo código
**Então** eu sou informado de que já existe uma missão com este ID

## 2. Leitura

| Parte | No Lunar Pass |
|---|---|
| Contexto | `beforeEach`: `loginPage.go()`, `login` com o usuário da suíte, `navbar.logoutButton` visível |
| Dado | `cleanAndInsertMission` com `Mission` cujo `id` não colide com outros specs |
| Quando | `dashPage.addButton.click()`, título da register visível, `registerPage.submitMission(mission)` |
| Então | `expect(app.registerPage.alert).toHaveText('Já existe uma missão com este ID.')` |

## 3. Padrões que o exemplo ilustra

- Import de `../support`, `{ app }`, tipos `Mission`, funções de `../support/db`.
- ID exclusivo (`LP-3001A` neste spec — **não reutilizar** em teste novo).
- Limpeza **no Arrange**, sem `afterEach`.
- `expect` do **Então** no spec; o `expect` da data de retorno permanece **dentro** de `submitMission` (já existente).
- Locator de alerta: `getByRole('alert')` no PO.
- Sem URL absoluta.

O código canônico é o arquivo `playwright/e2e/register.spec.ts`, não uma cópia paralela. Ao automatizar um cenário **novo**, copie essa forma; não reescreva este teste.
