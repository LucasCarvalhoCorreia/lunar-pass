import {Page, Locator} from '@playwright/test';
import { Mission } from '../support/missiont';

export class RegisterPage {
    readonly page: Page
    readonly title: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Programar missão' })
    }

    async submitMission(mission: Mission) {
        await this.page.getByRole('textbox', { name: 'ID da missão' }).fill(mission.id)
        await this.page.getByRole('textbox', { name: 'Foguete' }).fill(mission.rocket)
        await this.page.getByLabel('Base lunar').selectOption(mission.base)
        await this.page.getByRole('textbox', { name: 'Data de partida' }).fill(mission.departureDate)
        await this.page.getByRole('spinbutton', { name: 'Preço por passagem (USD)' }).fill(mission.price.toString())
        
        await this.page.getByRole('button', { name: 'Salvar missão' }).click()
    }
}