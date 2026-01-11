import { expect, Page } from '@playwright/test';
import data from '../../fixtures/data.json';

export class CadastroPage {
    readonly page: Page

    constructor (page: Page){
        this.page = page;
    }

    async go(){
        await this.page.goto('/cadastrarusuarios');
    }

    async fillFormCadastro(nome: string, email: string, password: string, administrador: string){
        await this.page.getByPlaceholder('Digite seu nome').fill(nome)
        await this.page.getByPlaceholder('Digite seu email').fill(email)
        await this.page.getByPlaceholder('Digite sua senha').fill(password)

        if (administrador === 'true'){
            await this.page.locator('#administrador').check();
            await expect(this.page.locator('#administrador')).toBeChecked();
        }
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