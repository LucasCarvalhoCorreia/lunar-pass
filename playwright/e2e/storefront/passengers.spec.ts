import { test, expect } from '../../support'
import { cleanAndInsertMission } from '../../support/db'
import { birthDateForAge } from '../../support/helpers'
import { Mission } from '../../support/types'

test('Aceitar nome com 3 caracteres e passaporte com 5 caracteres (mínimos válidos)', async ({ app }) => {
  // Arrange
  const mission: Mission = {
    id: 'LP-0929A',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act
  await app.store.bookingPage.submitPassenger('Ana', 'XP123', birthDateForAge(25))

  // Assert
  await expect(app.store.bookingPage.paymentTitle).toBeVisible()
})

test('Aceitar nome com 120 caracteres e passaporte com 30 caracteres (máximos válidos)', async ({ app }) => {
  // Arrange - preparação do cenário
  const mission: Mission = {
    id: 'LP-Y0Y28',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act - Execução da ação
  await app.store.bookingPage.submitPassenger('a'.repeat(120), 'A'.repeat(30), birthDateForAge(25))

  // Assert - verificar o resultado
  await expect(app.store.bookingPage.paymentTitle).toBeVisible()
})

test('Recusar nome com 2 caracteres (abaixo do limite mínimo)', async ({ app }) => {
  // Arrange - preparação do cenário
  const mission: Mission = {
    id: 'LP-3T34A',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act - Execução da ação
  await app.store.bookingPage.fullNameInput.fill('Ab')
  await app.store.bookingPage.passportInput.fill('XP1234567890123')
  await app.store.bookingPage.page.getByRole('button', { name: 'Ir para pagamento' }).click()

  // Assert - verificar o resultado
  await expect(app.store.bookingPage.fullNameInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.store.bookingPage.alert).toHaveText('O nome deve ter pelo menos 3 caracteres')
  await expect(app.store.bookingPage.fullNameInput).toBeFocused()
})

test('Recusar nome com 121 caracteres (acima do limite máximo)', async ({ app }) => {
  // Arrange - preparação do cenário
  const mission: Mission = {
    id: 'LP-IDF8H',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act - Execução da ação
  await app.store.bookingPage.fullNameInput.fill('a'.repeat(121))
  await app.store.bookingPage.passportInput.fill('XP1234567890123')
  //await app.store.bookingPage.birthDateInput.fill(birthDateForAge(25))
  await app.store.bookingPage.page.getByRole('button', { name: 'Ir para pagamento' }).click()

  // Assert - verificar o resultado
  await expect(app.store.bookingPage.fullNameInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.store.bookingPage.alert).toHaveText('O nome deve ter no máximo 120 caracteres')
  await expect(app.store.bookingPage.fullNameInput).toBeFocused()
})

test('Recusar passaporte com 4 caracteres (abaixo do limite mínimo)', async ({ app }) => {
  // Arrange - preparação do cenário
  const mission: Mission = {
    id: 'LP-OXS8H',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act - Execução da ação
  await app.store.bookingPage.fullNameInput.fill('a'.repeat(30))
  await app.store.bookingPage.passportInput.fill('ABCD')
  //await app.store.bookingPage.birthDateInput.fill(birthDateForAge(25))
  await app.store.bookingPage.page.getByRole('button', { name: 'Ir para pagamento' }).click()

  // Assert - verificar o resultado
  await expect(app.store.bookingPage.passportInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.store.bookingPage.alert).toHaveText('O passaporte deve ter pelo menos 5 caracteres')
  await expect(app.store.bookingPage.passportInput).toBeFocused()
})

test('Recusar passaporte com 31 caracteres (acima do limite máximo)', async ({ app }) => {
  // Arrange - preparação do cenário
  const mission: Mission = {
    id: 'LP-C1SL7',
    rocket: 'Starship',
    baseId: 'alpha',
    departureDate: '2029-09-10',
    returnDate: '2029-09-17',
    price: 1000.00
  }

  await cleanAndInsertMission(mission.id, mission)
  await app.store.bookingPage.go(mission.id)
  await app.store.bookingPage.selectSeats(['A1'])
  await app.store.bookingPage.continue()

  // Act - Execução da ação
  await app.store.bookingPage.fullNameInput.fill('a'.repeat(30))
  await app.store.bookingPage.passportInput.fill('A'.repeat(31))
  //await app.store.bookingPage.birthDateInput.fill(birthDateForAge(25))
  await app.store.bookingPage.page.getByRole('button', { name: 'Ir para pagamento' }).click()

  // Assert - verificar o resultado
  await expect(app.store.bookingPage.passportInput).toHaveAttribute('aria-invalid', 'true')
  await expect(app.store.bookingPage.alert).toHaveText('O passaporte deve ter no máximo 30 caracteres')
  await expect(app.store.bookingPage.passportInput).toBeFocused()
})
