import { test, expect } from '../../support'
import { cleanAndInsertSoldOutMission } from '../../support/db'

import { LunarBase, Mission, Reservation, Ticket } from '../../support/types'
import {cleanAndInsertLunarBase,} from '../../support/db'

test('Buscar missões para todas as bases lunares disponíveis', async ({ app }) => {
  // Arrange - preparação do cenário
  await app.store.homePage.go()

  // Act - Execução da ação
  await app.store.homePage.searchMissions()

  // Assert - verificar o resultado
  const bases = await app.store.missionsPage.getVisibleBases()
  expect(bases).toEqual(expect.arrayContaining([
    'Base Lunar Alpha',
    'Base Lunar Orion',
    'Base Lunar Aurora',
    'Base Lunar Selene'
  ]))

  const dates = await app.store.missionsPage.getDepartureDates()
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime())
  expect(dates).toEqual(sortedDates)
})

test('Buscar missões filtrando por uma base específica', async ({ app }) => {
  // Arrange - preparação do cenário
  await app.store.homePage.go()

  // Act - Execução da ação
  await app.store.homePage.selectBase('Base Lunar Alpha')
  await app.store.homePage.searchMissions()

  // Assert - verificar o resultado
  const bases = await app.store.missionsPage.getVisibleBases()
  expect(bases).toEqual(['Base Lunar Alpha'])

  await expect(app.store.missionsPage.title).toHaveText('7 missões disponíveis')
  await expect(app.store.missionsPage.activeFilterSummary).toContainText('Base Lunar Alpha')
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
  await app.store.homePage.go()
  await app.store.homePage.selectBase(lunarBase.name)
  await app.store.homePage.searchMissions()

  // Assert
  await expect(app.store.missionsPage.emptyState).toContainText(
    'Nenhuma missão programada com esses filtros.'
  )
  await expect(app.store.missionsPage.clearFilterLink).toBeVisible()
})

test('Missão esgotada aparece nos resultados sem opção de reserva', async ({ app }) => {
  // Arrange - preparação do cenário
  await cleanAndInsertSoldOutMission('LP-0827B')
  await app.store.homePage.go()

  // Act - Execução da ação
  await app.store.homePage.selectBase('Base Lunar Selene')
  await app.store.homePage.searchMissions()

  // Assert - verificar o resultado
  const missionCard = app.store.missionsPage.getMissionCard('LP-0827B')
  await expect(missionCard.getByTestId('mission-sold-out')).toHaveText('Esgotado')
  await expect(missionCard.getByRole('link', { name: 'Reservar' })).not.toBeVisible()
})
