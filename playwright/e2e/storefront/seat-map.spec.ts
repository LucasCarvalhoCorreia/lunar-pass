import { test, expect } from '../../support'
import { cleanReservationAndTickets, cleanAndBookSeat } from '../../support/db'

test('Impedir o avanço sem seleção mínima de assentos', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-0827A')
  await app.seatMapPage.go('LP-0827A')

  // Act - Execução da ação
  // Sem selecionar nenhum assento, a ação de avançar fica desabilitada

  // Assert - verificar o resultado
  await expect(app.seatMapPage.continueButton).toBeDisabled()
  await expect(app.seatMapPage.emptySelectionNotice).toBeVisible()
})

test('Avançar com seleção máxima de assentos permitida', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-CXLCF')
  await app.seatMapPage.go('LP-CXLCF')

  // Act - Execução da ação
  await app.seatMapPage.selectSeat('A1')
  await app.seatMapPage.selectSeat('A2')
  await app.seatMapPage.selectSeat('B1')
  await app.seatMapPage.selectSeat('B2')

  // Assert - verificar o resultado
  await expect(app.seatMapPage.summaryTotalPrice).toHaveText('USD 4,000.00')
  await app.seatMapPage.continueButton.click()
  await expect(app.seatMapPage.passengersHeading).toBeVisible()
})

test('Tentar selecionar assento já ocupado', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanAndBookSeat('LP-0127A', 'A1')
  await app.seatMapPage.go('LP-0127A')

  // Act - Execução da ação
  // O assento A1 já está ocupado e desabilitado na interface para seleção

  // Assert - verificar o resultado
  await expect(app.seatMapPage.summarySelectedSeats).toHaveText('—')
  await expect(app.seatMapPage.getSeat('A1')).toHaveAttribute('aria-label', /Ocupado/i)
})
