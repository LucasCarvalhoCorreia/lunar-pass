import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { Navbar } from '../pages/components/navbar'
import { DashPage } from '../pages/dash.page'
import { RegisterPage } from '../pages/register.page'
import { Toast } from '../pages/components/toast'

import { faker } from '@faker-js/faker'
import { Mission } from '../support/types'

import { insertMission, deleteMission, deleteReservation, deleteTickets, cleanMission, cleanAndInsertMission } from '../support/db'

let loginPage: LoginPage
let dashPage: DashPage
let registerPage: RegisterPage
let navbar: Navbar
let toast: Toast

test.beforeEach(async ({ page }) => {
    //Arrange
    loginPage = new LoginPage(page)
    dashPage = new DashPage(page)
    registerPage = new RegisterPage(page)

    navbar = new Navbar(page)
    toast = new Toast(page)
    await loginPage.go()
    await loginPage.login('buzz@lunarpass.dev', 'pwd123')
    await expect(navbar.logoutButton).toBeVisible({timeout: 10_000})
})

test('deve cadastrar uma nova missão', async ({ page }) => {

  const mission: Mission = {
    id: 'LP-0128A',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2028-01-20',
    returnDate: '2028-01-27',
    price: 1000
  }

  await cleanMission(mission.id)

  await dashPage.addButton.click()
  await expect(registerPage.title).toBeVisible()
  await registerPage.submitMission(mission)

  await expect(toast.message).toContainText('A nova missão foi adicionada ao catálogo e já está disponível para reservas.')
})

test('não deve cadastrar com o código da missão incorreto', async ({ page }) => {

  const mission: Mission = {
    id: faker.string.alphanumeric({length: { min: 5, max: 5 }, casing: 'upper' }),
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2028-01-20',
    returnDate: '2028-01-27',
    price: 1000
  }

  await dashPage.addButton.click()
  await expect(registerPage.title).toBeVisible()
  await registerPage.submitMission(mission)

  await expect(registerPage.alert).toContainText('Use o formato LP-0000')
})

test('não deve cadastrar com o código duplicado', async ({ page }) => {

  const mission: Mission = {
    id: 'LP-0127B',
    rocket: 'Starship',
    baseId: 'orion',
    departureDate: '2028-01-20',
    returnDate: '2028-01-27',
    price: 1000
  }

  await cleanAndInsertMission(mission.id, mission)

  await dashPage.addButton.click()
  await expect(registerPage.title).toBeVisible()
  await registerPage.submitMission(mission)

  await expect(registerPage.alert).toContainText('Já existe uma missão com este ID.')
})