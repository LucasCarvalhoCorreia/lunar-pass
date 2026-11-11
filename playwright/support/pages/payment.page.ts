import { Page, Locator, expect } from '@playwright/test'

export class PaymentPage {
    readonly page: Page
    readonly title: Locator
    readonly emailInput: Locator
    readonly cardNameInput: Locator
    readonly cardNumberInput: Locator
    readonly expiryInput: Locator
    readonly cvvInput: Locator
    readonly submitButton: Locator
    readonly alert: Locator
    readonly confirmationHeading: Locator
    readonly reservationCode: Locator
    readonly paymentStatus: Locator
    readonly ticketList: Locator

    constructor(page: Page) {
        this.page = page
        this.title = page.getByRole('heading', { name: 'Pagamento' })
        this.emailInput = page.getByRole('textbox', { name: 'E-mail de contato' })
        this.cardNameInput = page.getByRole('textbox', { name: 'Nome no cartão' })
        this.cardNumberInput = page.getByRole('textbox', { name: 'Número do cartão' })
        this.expiryInput = page.getByRole('textbox', { name: 'Validade' })
        this.cvvInput = page.getByRole('textbox', { name: 'CVV' })
        this.submitButton = page.getByRole('button', { name: 'Pagar e reservar' })
        this.alert = page.getByRole('alert')
        this.confirmationHeading = page.getByRole('heading', { name: 'Sua reserva está confirmada.' });
        this.reservationCode = page.getByTestId('reservation-code')
        this.paymentStatus = page.getByText(/Pagamento aprovado! Pode arrumar as malas: a Lua já está esperando por você\./)
        this.ticketList = page.getByTestId('reservation-ticket')
    }

    async go(missionId: string, seat = 'A1', passengerName = 'Lucas Correia', passport = 'XP12345') {
        await this.page.goto(`/booking/${missionId}`)
        await this.page.getByRole('button', { name: new RegExp(`Assento ${seat}\\b`) }).click()
        await this.page.getByRole('button', { name: 'Continuar' }).click()
        await expect(this.page.getByRole('heading', { name: 'Cadastre os passageiros' })).toBeVisible()
        await this.page.getByRole('textbox', { name: 'Nome completo' }).fill(passengerName)
        await this.page.getByRole('textbox', { name: 'Passaporte' }).fill(passport)
        await this.page.getByRole('button', { name: 'Ir para pagamento' }).click()
        await expect(this.title).toBeVisible()
    }

    async fillPaymentForm(opts: {
        email?: string
        cardName?: string
        cardNumber: string
        expiry?: string
        cvv?: string
    }) {
        await this.emailInput.fill(opts.email ?? 'buzz@lunarpass.dev')
        await this.cardNameInput.fill(opts.cardName ?? 'Buzz Aldrin')
        await this.cardNumberInput.fill(opts.cardNumber)
        await this.expiryInput.fill(opts.expiry ?? '12/30')
        await this.cvvInput.fill(opts.cvv ?? '123')
    }

    async submit() {
        await this.submitButton.click()
    }
}
