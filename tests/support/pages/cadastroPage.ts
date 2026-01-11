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

}