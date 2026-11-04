# Descoberta de tela (Lunar Pass)

O cenário diz **o que**; a tela diz **como**. Antes do Page Object, percorra o caminho com o Playwright MCP.

## Ambiente

- `baseURL`: `http://localhost:3000`
- Mission Control login: `/mission-control/login`
- Storefront: `/`
- Servidor MCP: `.agent/mcp_config.json` (`@playwright/mcp`). Use as ferramentas Playwright MCP **desta sessão**. Confirme os nomes das tools antes de chamar.

## Procedimento

1. Confirme que a aplicação responde em `http://localhost:3000`. Se não responder, não invente a tela: use só POs já existentes e entregue como "não executado".
2. Abra a primeira URL do cenário.
3. Leia o **snapshot de acessibilidade** (papel, nome, estado).
4. Execute o **Quando** para ver telas seguintes e o **Então**.
5. Anote por tela: path, elemento, locator segundo a ordem da arquitetura.
6. Feche a aba ao terminar.

## Dados na descoberta

- Missão: use um ID que o teste vai criar (`cleanMission` / `cleanAndInsertMission`) e limpe no Arrange do spec.
- Login: somente o usuário já usado nos specs (`buzz@lunarpass.dev`). Não invente conta.
- Não concluir reserva/pagamento com dados reais de cartão além dos que o próprio produto documentar como simulador.
- Consulte `docs/aderencia.md` para a tela, se existir seção. Se a aderência pedir `data-testid` que o snapshot **não** mostra, o atributo ainda não está na UI: não use o id inventado.

## Escolha do locator

Ordem da suíte (`docs/arquitetura.md` §3.2):

| Prioridade | Locator | Uso visto no projeto |
|---|---|---|
| 1 | `getByRole` | botão Entrar, link Nova missão, heading, alert, listitem (toast), spinbutton, textbox, checkbox |
| 2 | `getByLabel` | `Base lunar` (select) |
| 3 | `getByPlaceholder` | email e senha do login |
| 4 | `getByTestId` | `mission-form-return-date` |

Sem XPath, `/..`, classe CSS. Elemento sem papel nem testid estável: gap de testabilidade no resumo (como em `docs/aderencia.md`), não seletor frágil.

`getByText` não está na ordem da arquitetura da suíte. Só use se o snapshot não oferecer as quatro opções acima **e** a verificação for do próprio texto do **Então**; registre no resumo.

## Estados a confirmar

- Botão desabilitado (snapshot pode omitir).
- Texto de cada alerta/toast que o cenário usa.
- Contraprova: se afirma “desabilitado” ou “vazio”, veja o estado oposto na tela.
