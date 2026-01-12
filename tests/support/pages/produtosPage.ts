import { expect, Page } from '@playwright/test';

export class ProdutosPage {
    readonly page;

    constructor(page: Page) {
        this.page = page;
    }

    async doLogin(email: string, password: string) {
        await this.page.goto('/login');
        const loginForm = await this.page.locator('.form')
        await expect(loginForm).toBeVisible();
        await this.page.getByPlaceholder('Digite seu email').fill(email)
        await this.page.getByPlaceholder('Digite sua senha').fill(password)
        await this.page.locator(`//button[contains(text, Entrar)]`).click()
        await expect(this.page.locator('//a[@data-testid="home"]')).toBeVisible()
    }

    async searchProduct(nome: string) {
        await this.page.getByPlaceholder('Pesquisar Produtos').fill(`${nome}`)
        await this.page.locator(`//button[contains(.,'Pesquisar')]`).click()
    }

    async clickAddListByName(nameProduct: string) {
        const buttonAddList = await this.page.locator(`//div[@class="card-body"]/h5[contains(.,"${nameProduct}")]/..//button[contains(.,"Adicionar a lista")]`)
        await buttonAddList.click()
    }

    async verifyProductCard(nome: string) {
        const productCard = await this.page.locator(`//div[@class='card-body']/h5[contains(.,'${nome}')]`)
        await expect(productCard).toBeVisible()
    }

    async verifyNoProductFound() {
        await expect(this.page.getByText('Nenhum produto foi encontrado')).toBeVisible()
    }

    async checkListItem(nome: string) {
        const checkLista = await this.page.locator('//h1[contains(.,"Lista de Compras")]')
        expect(checkLista).toBeVisible()
        const checkProduct = await this.page.locator(`//div[@class="card-body"]/div[contains(.,"${nome}")]`)
        expect(checkProduct).toBeVisible()
    }

    async clearList() {
        await this.page.locator('//button[contains(.,"Limpar Lista")]').click()
        await expect(this.page.getByText('Seu carrinho está vazio')).toBeVisible();
    }

    async checkDetailsUpdate(nameProduct: string){
        await this.page.getByTestId(`//div[@class="card-body"][contains(.,${nameProduct}")]/a[@data-testid]`).click
        const pageDetails = await this.page.getByText('Detalhes do produto')
        await expect(pageDetails).toBeVisible
        const quantidadeProduto = await this.page.getByText('Quantidade: 19')
        await expect(quantidadeProduto).toBeVisible
    }
}