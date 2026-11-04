# Revisão antes de entregar

Corrija o que falhar; só então entregue.

## Fidelidade ao cenário

- [ ] Título = nome do cenário (ou cenário + linha de Exemplos).
- [ ] Uma asserção de spec por **Então** e por **E**, sem extras no spec.
- [ ] Nenhum passo ou regra inventados.
- [ ] Textos só observados na tela listados no resumo.

## Arquitetura Lunar Pass

- [ ] PO novo em `playwright/support/pages/` (ou `components/`) e registrado em `createApp`.
- [ ] Spec em `playwright/e2e/`, import de `../support`, uso de `{ app }` (exceto se o pedido for só alterar `home.spec.ts`).
- [ ] Sem pastas `tests/`, `pages/` ou `support/` na raiz.
- [ ] Navegação relativa à `baseURL`.
- [ ] Nenhum PO/spec existente refatorado sem pedido.
- [ ] Sem `.env`, `storageState`, factory nova ou mudança de `playwright.config.ts`.

## Locators e esperas

- [ ] Ordem Role → Label → Placeholder → TestId.
- [ ] Sem XPath, `/..`, classe CSS, `waitForTimeout`.
- [ ] Contraprova na tela para asserção de estado.
- [ ] Estilo do PO igual ao vizinho (`expect` em `go`/`submitMission` só se a área já fizer isso).

## Dados

- [ ] ID de missão exclusivo, não usado em outro spec.
- [ ] Arrange com `cleanMission` / `cleanAndInsertMission` quando o cenário envolve missão.
- [ ] Sem asserção de contagem total ou posição em lista compartilhada.
- [ ] Sem `afterEach` novo, a menos que o usuário peça.

## Execução

- [ ] Rodou `npx playwright test playwright/e2e/<arquivo>.spec.ts` (chromium).
- [ ] Resultado no resumo = o que aconteceu.
- [ ] Repetiu em série (`--repeat-each=3 --workers=1`) sem variar.
- [ ] Falha de produto reportada com esperado vs observado.
- [ ] Sem `test.only`, `test.skip` ou asserção comentada.
