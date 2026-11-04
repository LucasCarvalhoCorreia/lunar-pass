import { Page, Locator, expect } from '@playwright/test'

export class MissionsPage {
    readonly page: Page
    readonly title: Locator
    readonly activeFilterSummary: Locator
    readonly missionCards: Locator
    readonly baseFilterButton: Locator
    readonly sortSelect: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { level: 1 })
        this.activeFilterSummary = page.locator('h1 + p')
        this.missionCards = page.getByTestId('mission-card')
        this.baseFilterButton = page.getByRole('button', { name: 'Bases lunares' })
        this.sortSelect = page.getByLabel('Ordenar por')
    }

    async getVisibleBases(): Promise<string[]> {
        await expect(this.missionCards.first()).toBeVisible()
        const headings = await this.page.getByRole('heading', { level: 3 }).allTextContents()
        return [...new Set(headings.map(h => h.trim()))]
    }

    async getDepartureDates(): Promise<Date[]> {
        await expect(this.missionCards.first()).toBeVisible()
        const dateTexts = await this.page.getByTestId('departure-date').allTextContents()
        const months: Record<string, number> = {
            'jan.': 0, 'fev.': 1, 'mar.': 2, 'abr.': 3, 'mai.': 4, 'jun.': 5,
            'jul.': 6, 'ago.': 7, 'set.': 8, 'out.': 9, 'nov.': 10, 'dez.': 11
        }
        return dateTexts.map(text => {
            const [dia, , mes, , ano] = text.trim().split(' ')
            return new Date(Number(ano), months[mes], Number(dia))
        })
    }
}
