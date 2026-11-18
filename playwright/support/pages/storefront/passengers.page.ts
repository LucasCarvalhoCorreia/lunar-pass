import { Page, Locator, expect } from '@playwright/test'

export class PassengersPage {
    readonly page: Page
    readonly title: Locator
    readonly paymentHeading: Locator
    readonly fullNameInput: Locator
    readonly documentInput: Locator
    readonly submitButton: Locator
    readonly backButton: Locator
    readonly alert: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Cadastre os passageiros' })
        this.paymentHeading = page.getByRole('heading', { name: 'Pagamento' })
        this.fullNameInput = page.getByRole('textbox', { name: 'Nome completo' })
        this.documentInput = page.getByRole('textbox', { name: 'Passaporte' })
        this.submitButton = page.getByRole('button', { name: 'Ir para pagamento' })
        this.backButton = page.getByRole('button', { name: 'Voltar' })
        this.alert = page.getByRole('alert')
    }

    async go(missionId: string, seat = 'A1') {
        await this.page.goto(`/booking/${missionId}`)
        await this.page.getByRole('button', { name: new RegExp(`Assento ${seat}\\b`) }).click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
        await expect(this.title).toBeVisible()
    }

    async fillForm(name: string, passport: string) {
        await this.fullNameInput.fill(name)
        await this.documentInput.fill(passport)
    }

    async submit() {
        await this.submitButton.click()
    }
}
