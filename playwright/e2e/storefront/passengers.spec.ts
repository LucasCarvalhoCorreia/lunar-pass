import { test, expect } from '../../support'
import { cleanReservationAndTickets } from '../../support/db'

test('Aceitar nome com 3 caracteres e passaporte com 5 caracteres (mínimos válidos)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-2801A')
  await app.passengersPage.go('LP-2801A')

  // Act - Execução da ação
  await app.passengersPage.fillForm('Ana', 'XP123')
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.paymentHeading).toBeVisible()
})

test('Aceitar nome com 120 caracteres e passaporte com 30 caracteres (máximos válidos)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-Y0Y28')
  await app.passengersPage.go('LP-Y0Y28')

  // Act - Execução da ação
  await app.passengersPage.fillForm('a'.repeat(120), 'A'.repeat(30))
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.paymentHeading).toBeVisible()
})

test('Recusar nome com 2 caracteres (abaixo do limite mínimo)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-3T34A')
  await app.passengersPage.go('LP-3T34A')

  // Act - Execução da ação
  await app.passengersPage.fillForm('Ab', 'XP1234567890123')
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.fullNameInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.passengersPage.alert).toHaveText('O nome deve ter pelo menos 3 caracteres')
  await expect(app.passengersPage.fullNameInput).toBeFocused()
})

test('Recusar nome com 121 caracteres (acima do limite máximo)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-IDF8H')
  await app.passengersPage.go('LP-IDF8H')

  // Act - Execução da ação
  await app.passengersPage.fillForm('a'.repeat(121), 'XP1234567890123')
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.fullNameInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.passengersPage.alert).toHaveText('O nome deve ter no máximo 120 caracteres')
  await expect(app.passengersPage.fullNameInput).toBeFocused()
})

test('Recusar passaporte com 4 caracteres (abaixo do limite mínimo)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-OXS8H')
  await app.passengersPage.go('LP-OXS8H')

  // Act - Execução da ação
  await app.passengersPage.fillForm('a'.repeat(30), 'ABCD')
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.documentInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.passengersPage.alert).toHaveText('O passaporte deve ter pelo menos 5 caracteres')
  await expect(app.passengersPage.documentInput).toBeFocused()
})

test('Recusar passaporte com 31 caracteres (acima do limite máximo)', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanReservationAndTickets('LP-C1SL7')
  await app.passengersPage.go('LP-C1SL7')

  // Act - Execução da ação
  await app.passengersPage.fillForm('a'.repeat(30), 'A'.repeat(31))
  await app.passengersPage.submit()

  // Assert - verificar o resultado
  await expect(app.passengersPage.documentInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.passengersPage.alert).toHaveText('O passaporte deve ter no máximo 30 caracteres')
  await expect(app.passengersPage.documentInput).toBeFocused()
})
