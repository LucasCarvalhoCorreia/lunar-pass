# Massa de teste no Lunar Pass

Mecanismo: **Kysely** em `playwright/support/db.ts` (PostgreSQL). Não alterar pool, SSL nem connection string.

## Funções existentes

| Função | Uso nos specs |
|---|---|
| `cleanMission(id)` | Antes de cadastrar missão nova pela UI (`LP-0128A`) |
| `cleanAndInsertMission(id, mission)` | Pré-condição de código duplicado (`LP-3001A`) |
| `insertMission` / `deleteMission` | Usadas pelas funções acima |
| `deleteReservation` / `deleteTickets` | Encadeadas em `cleanMission` |

Tipo `Mission`: `id`, `rocket`, `baseId`, `departureDate`, `returnDate`, `price`.

`baseId` nos specs: `'aurora'`, `'orion'` (minúsculas). Não inventar bases; se o cenário citar Alpha/Orion/Aurora/Selene, confira na tela/DB o valor do option (`aurora` etc.).

Datas nos specs de cadastro: ISO `YYYY-MM-DD`. Preço: number (`1000.00`).

## Regras alinhadas ao que já existe

1. **ID exclusivo.** Formato visto: `LP-` + dígitos + letra (`LP-0128A`). Antes de escolher, busque `LP-` em `playwright/e2e/`.
2. **Limpar antes de usar o ID** (`cleanMission` ou `cleanAndInsertMission` no Arrange). Os specs **não** usam `afterEach` — não adicione como padrão novo.
3. **Código inválido:** `faker.string.alphanumeric({ length: { min: 5, max: 5 }, casing: 'upper' })` como em `register.spec.ts`, para cair em `Use o formato LP-0000`.
4. **Listas compartilhadas (storefront):** nunca `toHaveCount` da lista inteira nem `nth()`. Ache a missão pelo ID.
5. **Não alterar** missões/usuários que o teste não criou. O usuário `buzz@lunarpass.dev` é de referência: só autenticar, não mudar no banco.

## Quando falta função

1. Veja `types.ts` e `db.ts`. Tabelas tipadas hoje: `missions`, `reservations`, `tickets`.
2. Só acrescente função no mesmo estilo se o cenário precisar e a estrutura estiver visível no código. Sem coluna/tabela no tipo: **pergunte**.
3. Não crie factory genérica nem `.env` (arquitetura §6 não priorizada).
4. Anote no resumo o que foi acrescentado.

Autenticação **não** passa pelo banco nestes specs: é UI + usuário já conhecido.
