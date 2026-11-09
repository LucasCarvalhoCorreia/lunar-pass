import { Page, Locator, expect } from '@playwright/test'

export class SeatMapPage {
    readonly page: Page
    readonly title: Locator
    readonly continueButton: Locator
    readonly emptySelectionNotice: Locator
    readonly summarySelectedSeats: Locator
    readonly summaryTotalPrice: Locator
    readonly passengersHeading: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Escolha seus assentos' })
        this.continueButton = page.getByRole('button', { name: 'Continuar' })
        this.emptySelectionNotice = page.getByText('Nenhum assento escolhido')
        this.summarySelectedSeats = page.getByTestId('summary-selected-seats')
        this.summaryTotalPrice = page.getByTestId('summary-total-price')
        this.passengersHeading = page.getByRole('heading', { name: 'Cadastre os passageiros' })
    }

    async go(missionId: string) {
        await this.page.goto(`/booking/${missionId}`)
        await expect(this.title).toBeVisible()
    }

    getSeat(seat: string): Locator {
        return this.page.getByRole('button', { name: new RegExp(`Assento ${seat}\\b`) })
    }

    async selectSeat(seat: string) {
        await this.getSeat(seat).click()
    }

    getSeatTooltip(seat: string): Locator {
        return this.page.locator(`#seat-${seat}-tooltip`)
    }
}
