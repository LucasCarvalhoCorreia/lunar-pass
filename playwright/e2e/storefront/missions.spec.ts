import { test, expect } from '../../support'
import { cleanAndInsertSoldOutMission } from '../../support/db'

test('Buscar missões para todas as bases lunares disponíveis', async ({ app }) => {
  // Arrange - preparação do cenário
  await app.homePage.go()

  // Act - Execução da ação
  await app.homePage.searchMissions()

  // Assert - verificar o resultado
  const bases = await app.missionsPage.getVisibleBases()
  expect(bases).toEqual(expect.arrayContaining([
    'Base Lunar Alpha',
    'Base Lunar Orion',
    'Base Lunar Aurora',
    'Base Lunar Selene'
  ]))

  const dates = await app.missionsPage.getDepartureDates()
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())
  expect(dates).toEqual(sortedDates)
})

test('Buscar missões filtrando por uma base específica', async ({ app }) => {
  // Arrange - preparação do cenário
  await app.homePage.go()

  // Act - Execução da ação
  await app.homePage.selectBase('Base Lunar Alpha')
  await app.homePage.searchMissions()

  // Assert - verificar o resultado
  const bases = await app.missionsPage.getVisibleBases()
  expect(bases).toEqual(['Base Lunar Alpha'])

  await expect(app.missionsPage.title).toHaveText('1 missão disponível')
  await expect(app.missionsPage.activeFilterSummary).toContainText('Base Lunar Alpha')
})

test('Missão esgotada aparece nos resultados sem opção de reserva', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanAndInsertSoldOutMission('LP-0827B')
  await app.homePage.go()

  // Act - Execução da ação
  await app.homePage.selectBase('Base Lunar Selene')
  await app.homePage.searchMissions()

  // Assert - verificar o resultado
  const missionCard = app.missionsPage.getMissionCard('LP-0827B')
  await expect(missionCard.getByTestId('mission-sold-out')).toHaveText('Esgotado')
  await expect(missionCard.getByRole('link', { name: 'Reservar' })).not.toBeVisible()
})
