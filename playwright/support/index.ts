import { test as base, expect, Page } from '@playwright/test'

import { LoginPage } from './pages/mission-control/login.page'
import { DashPage } from './pages/mission-control/dash.page'
import { RegisterPage } from './pages/mission-control/register.page'
import { HomePage } from './pages/storefront/home.page'
import { MissionsPage } from './pages/storefront/missions.page'
import { BookingPage } from './pages/storefront/booking.page'
import { SeatMapPage } from './pages/storefront/seat-map.page'
import { PassengersPage } from './pages/storefront/passengers.page'
import { PaymentPage } from './pages/storefront/payment.page'

import { Navbar } from './pages/mission-control/navbar'
import { Toast } from './pages/shared/toast'
import { StripeService } from './services/stripe.service'

const createApp = (page: Page) => ({
    // Services
    services: {
        stripe: new StripeService(page),
    },

    // Legacy direct access
    loginPage: new LoginPage(page),
    dashPage: new DashPage(page),
    registerPage: new RegisterPage(page),
    homePage: new HomePage(page),
    missionsPage: new MissionsPage(page),
    seatMapPage: new SeatMapPage(page),
    passengersPage: new PassengersPage(page),
    paymentPage: new PaymentPage(page),
    navbar: new Navbar(page),
    toast: new Toast(page),

    // Contextual namespaces
    store: {
        homePage: new HomePage(page),
        missionsPage: new MissionsPage(page),
        bookingPage: new BookingPage(page),
    },
    missionControl: {
        loginPage: new LoginPage(page),
        dashPage: new DashPage(page),
        registerPage: new RegisterPage(page),
        navbar: new Navbar(page),
    },
})

type App = ReturnType<typeof createApp>

export const test = base.extend<{ app: App }>({
    app: async ({ page }, use) => {
        await use(createApp(page))
    },
})

export { expect }

