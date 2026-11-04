# Dúvidas e divergências (não decidir sozinho)

Itens em que a skill genérica, a arquitetura e o código não coincidem, ou em que falta informação. Se o cenário esbarrar nisto, registre no resumo e pergunte. Não invente a regra.

1. **Pasta `docs/` está no `.gitignore`.** A arquitetura existe localmente, mas pode não estar no Git para outros clones. Trabalhe com `docs/arquitetura.md` quando o arquivo estiver acessível; senão use `lunarpass.md` e o código.

2. **`expect` no Page Object.** A skill genérica proibia. `LoginPage.go()` e `RegisterPage.submitMission()` usam `expect`. `docs/arquitetura.md` não proíbe nem manda. **Seguir o arquivo da área.** Não refatorar os POs existentes para “tirar o expect”.

3. **Limpeza depois do teste.** A skill genérica pedia `afterEach`. Os specs atuais limpam **antes** (`cleanMission` / `cleanAndInsertMission`) e não têm `afterEach`. Arquitetura exige ID exclusivo e isolamento, não o hook. **Não criar `afterEach` sem pedido.**

4. **`home.spec.ts` vs fixture `app`.** Arquitetura pede `{ app }` e PO por tela. Home usa `{ page }`, locator no spec, sem `HomePage`. **Novos fluxos de storefront:** criar PO + registrar no fixture, salvo se o usuário pedir para seguir o estilo atual da home. Não refatorar `home.spec.ts` sem pedido.

5. **Ordem `getByText`.** Arquitetura §3.2: Role → Label → Placeholder → TestId. `docs/aderencia.md` (recomendação geral) cita `getByRole` / `getByLabel` / `getByText` e depois `data-testid`. **Na suíte, seguir arquitetura §3.2.** Se a aderência de um elemento mandar um locator específico, use o da aderência para aquele elemento.

6. **Estilo (espaços e ponto-e-vírgula).** Fixture na arquitetura: 2 espaços. Maioria dos POs: 4 espaços, sem `;`. `home.spec.ts` e `register.page.ts` misturam. **Copiar o arquivo vizinho da mesma pasta.** Não padronizar o repositório.

7. **Seção 6 da arquitetura** (`.env`, `storageState`, factories, `db.destroy`, pastas por módulo) está explícita como **não priorizada**. Não implementar como parte da automação de um cenário.

8. **Connection string em `db.ts`.** Está no código. Não copiar para a skill, não alterar, não extrair para `.env` sem pedido.

9. **Funções de massa só para missão/reserva/ticket.** Não há insert de usuário, pagamento ou storefront além de `Mission` / `Reservation` / `Ticket`. Se o cenário precisar de outro estado, pergunte; não invente tabela nem coluna.

10. **Texto de mensagens.** Specs já fixam strings como `E-mail ou senha inválidos.`, `Já existe uma missão com este ID.` Se o Gherkin não trouxer o texto, use o da tela e declare observação. Se Gherkin e tela divergirem, falha de produto.

11. **Aderência vs produto.** `docs/aderencia.md` pede `data-testid` e labels que podem ainda não existir na UI. Descubra na tela. Se o elemento for inautomatizável (ex.: XPath `/..` nas bases), registre gap de testabilidade; não use o seletor que a aderência pede para evitar.
