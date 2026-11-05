import { test, expect } from '../../support'
import { cleanAndInsertSoldOutMission } from '../../support/db'

import { LunarBase, Mission, Reservation, Ticket } from '../../support/types'
import {cleanAndInsertLunarBase,} from '../../support/db'

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

test('Lidar com ausência de missões para os filtros', async ({ app }) => {
  // Arrange
  const lunarBase: LunarBase = {
    id: 'artemis',
    name: 'Base Lunar Artemis',
    shortName: 'Artemis',
    tagline: 'Cratera Shackleton',
    description: 'Estação de pesquisa avançada localizada na borda iluminada da cratera Shackleton.',
    imageUrl: '/images/bases/aurora.jpg',
    sortOrder: 50,
    isActive: true
  }

  await cleanAndInsertLunarBase(lunarBase)

  // Act
  await app.homePage.go()
  await app.homePage.selectBase(lunarBase.name)
  await app.homePage.searchMissions()

  // Assert
  await expect(app.missionsPage.emptyState).toContainText(
    'Nenhuma missão programada com esses filtros.'
  )
  await expect(app.missionsPage.clearFilterLink).toBeVisible()
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
