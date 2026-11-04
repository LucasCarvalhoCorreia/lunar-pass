# Diagnóstico de falhas (Lunar Pass)

Usado no passo 7 e no modo `corrigir`.

## Onde olhar

1. Erro no terminal (linha, locator, esperado vs recebido).
2. `test-results/**/error-context.md` e screenshot.
3. Relatório: `yarn report` ou `npx playwright show-report`.
4. Reproduzir o caminho com o Playwright MCP se ainda houver dúvida.

## Classifique antes de mexer

| Causa | Sinais | O que fazer |
|---|---|---|
| **Locator** | Não acha / acha demais / texto ou role mudou | Corrigir no PO, ordem Role → Label → Placeholder → TestId. Ver `docs/aderencia.md` se a tela for conhecida |
| **Sincronização** | Intermitente; age cedo demais | Esperar estado visível. O timeout `10_000` no Sair já existe; não usar `waitForTimeout`. Não aumentar `retries` no config |
| **Dados** | ID duplicado, missão ausente, resto de run anterior | Ajustar `cleanMission` / ID exclusivo. Em paralelo, o mesmo ID em dois testes colide — isso não é flake de UI |
| **Ambiente** | App fora; banco `ENOTFOUND`; `Executable doesn't exist` | Não mudar teste, config nem connection string. "Não executado". Chromium ausente: `npx playwright install chromium` **com autorização** |
| **Produto** | Tela ≠ **Então**, de forma estável | Não mudar asserção. Reportar esperado vs observado |

## Correção

- Uma causa por vez; rodar de novo depois.
- Nunca alterar asserção, valor esperado ou título para passar.
- Sem `test.skip`, sem retries no spec, sem comentar expect.
- Instabilidade: `npx playwright test playwright/e2e/<arquivo>.spec.ts --repeat-each=5 --workers=1`. Colisão `duplicate key` em paralelo com o mesmo ID **não** é flake.
- Causa unclear: entregue evidências e hipóteses, sem patch de adivinhação.
