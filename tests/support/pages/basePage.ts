import { expect, Page } from '@playwright/test';
import data from '../../fixtures/data.json';

export class BasePage {
    readonly page: Page
    constructor (page: Page){
        this.page = page;
    }

    async clickButtonByName(name: string) {
        const buttonCadastrar = await this.page.locator(`//button[contains(text, ${name})]`)
        await buttonCadastrar.click()
    }

    async checkAlertMessage(expectedMessage: string) {
        const alertVisible = await this.page.locator('.alert');
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