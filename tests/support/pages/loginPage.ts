import { expect, Page } from '@playwright/test';
import data from '../../fixtures/data.json';

export class LoginPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page;
    }

    async go() {
        await this.page.goto('/login');
    }

    async fillForm(email: string, password: string) {
    const loginForm = await this.page.locator('.form')
    await expect(loginForm).toBeVisible();
    
    await this.page.getByPlaceholder('Digite seu email').fill(email)
    await this.page.getByPlaceholder('Digite sua senha').fill(password)
    }

    async clickButtonByName(name: string) {
        const buttonEntrar = await this.page.locator(`//button[contains(text, ${name})]`)
        await buttonEntrar.click()
    }

    async checkDashboard() {
        await expect(this.page.locator('//button[@data-testid="logout"]')).toBeVisible();
        await expect(this.page.locator('//a[@data-testid="home"]')).toBeVisible()
    }

    async checkAlertMessage(expectedMessage: string) {
        const alertVisible = await this.page.locator('.alert');
        // await expect(alertVisible).toHaveText(expectedMessage);
        await expect(alertVisible).toContainText(expectedMessage);
    }

    async checkAlertBrowse() {
        const inputEmail = await this.page.locator('#email')
        const validationMessage = await inputEmail.evaluate(e => (e as HTMLInputElement).validationMessage)  //obtem a mensagem de validação do HTML5
        const normReceived = validationMessage.trim().normalize('NFC');  // normaliza texto para evitar problemas com acentuação e caracteres especiais
        const expectEnglish = `Please include an '@' in the email address. '${data.email_incorrect.email}' is missing an '@'.` // texto em ingles

        expect(normReceived).toContain(expectEnglish);  // assert com o texto em ingles

    }

}