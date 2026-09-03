import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/login.page'
import { Navbar } from '../pages/components/navbar'

let loginPage: LoginPage
let navbar: Navbar

test.beforeEach(async ({ page }) => {
    //Arrange
    loginPage = new LoginPage(page)
    navbar = new Navbar(page)
    await loginPage.go()
})

test('deve autenticar no controle de missões', async ({ page }) => {
    //Act
    await loginPage.login('buzz@lunarpass.dev', 'pwd123')

    //Assert
    await expect(navbar.logoutButton).toBeVisible({timeout: 10_0000})
})

test('não deve autenticar com senha incorreta', async ({ page }) => {
    //Act
    await loginPage.login('buzz@lunarpass.dev', 'pwd125')
    await page.getByRole('button', { name: 'Entrar' }).click()

    //Assert
    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar com email não cadastrado', async ({ page }) => {
    //Act
    await loginPage.login('invalid@lunarpass.dev', 'pwd123')

    //Assert
    await expect(loginPage.alert).toHaveText('E-mail ou senha inválidos.')
})

test('não deve autenticar quando a senha não é informada', async ({ page }) => {
    //Act
    await loginPage.login('invalid@lunarpass.dev', '')

    //Assert
    await expect(loginPage.alert).toHaveText('Informe a senha')
})

test('não deve autenticar quando o e-mail não é informado', async ({ page }) => {
    //Act
    await loginPage.login('', 'pwd123')

    //Assert
    await expect(loginPage.alert).toHaveText('Informe um e-mail válido')
})

test('não deve autenticar quando o e-mail e senha não são informados', async ({ page }) => {
    //Act
    await loginPage.login('', '')

    //Assert
    await expect(loginPage.alert).toHaveText('Informe um e-mail válido')
})