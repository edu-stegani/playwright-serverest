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

    async checkDashboard() {
        await expect(this.page.locator('//button[@data-testid="logout"]')).toBeVisible();
        await expect(this.page.locator('//a[@data-testid="home"]')).toBeVisible()
    }

}