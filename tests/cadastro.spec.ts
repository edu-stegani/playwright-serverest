import { test, expect } from '@playwright/test';
import data from './fixtures/data.json';
import { getUserByEmail, deleteUserById } from './support/helpers';
import { CadastroPage } from './support/pages/cadastroPage';

let cadastroPage: CadastroPage;

test.beforeEach(async ({ page }) => {
    cadastroPage = new CadastroPage(page);
})

test.describe('cadastro de usuário comum', () => {

    test('cadastro de usuário comum com sucesso', async ({ request }) => {

        const responseBody = await getUserByEmail(request, data.create_user.email);     // requisição GET para verificar se o usuário já existe
        if (responseBody.quantidade === 1) {
            console.log(`usuário já cadastrado, deletando o _id: ${responseBody.usuarios[0]._id}`);
            await deleteUserById(request, responseBody.usuarios[0]._id);    // requisição DELETE para remover o usuário existente
        }

        await cadastroPage.go();

        await cadastroPage.fillFormCadastro(
            data.create_user.nome,
            data.create_user.email,
            data.create_user.password,
            data.create_user.administrador
        );

        await cadastroPage.clickButtonByName('Cadastrar');

        await cadastroPage.checkAlertMessage('Cadastro realizado com sucesso');
    })

    test('cadastro de usuário com nome nulo', async () => {
        await cadastroPage.go();
        await cadastroPage.fillFormCadastro(
            data.nome_null.nome,
            data.nome_null.email,
            data.nome_null.password,
            data.nome_null.administrador
        );
        await cadastroPage.clickButtonByName('Cadastrar');
        await cadastroPage.checkAlertMessage('Nome é obrigatório');
    })

    test('cadastro de usuário com email nulo', async () => {
        await cadastroPage.go();
        await cadastroPage.fillFormCadastro(
            data.email_null.nome,
            data.email_null.email,
            data.email_null.password,
            data.email_null.administrador
        );
        await cadastroPage.clickButtonByName('Cadastrar');
        await cadastroPage.checkAlertMessage('Email é obrigatório');
    })

    test('cadastro de usuário com password nulo', async () => {
        await cadastroPage.go();
        await cadastroPage.fillFormCadastro(
            data.password_null.nome,
            data.password_null.email,
            data.password_null.password,
            data.password_null.administrador
        );
        await cadastroPage.clickButtonByName('Cadastrar');
        await cadastroPage.checkAlertMessage('Password é obrigatório');
    })

    test('cadastro de usuário com email inválido', async () => {
        await cadastroPage.go();
        await cadastroPage.fillFormCadastro(
            data.email_incorrect.nome,
            data.email_incorrect.email,
            data.email_incorrect.password,
            data.email_incorrect.administrador
        );
        await cadastroPage.clickButtonByName('Cadastrar');
        await cadastroPage.checkAlertBrowse();
    })
})



test.describe('cadastro de usuário administrador', () => {

    test('cadastro de usuário administrador com sucesso', async ({ request }) => {
        const responseBody = await getUserByEmail(request, data.create_adm.email);     // requisição GET para verificar se o usuário já existe
        if (responseBody.quantidade === 1) {
            console.log(`usuário já cadastrado, deletando o _id: ${responseBody.usuarios[0]._id}`);
            await deleteUserById(request, responseBody.usuarios[0]._id);    // requisição DELETE para remover o usuário existente
        }
        await cadastroPage.go();
        await cadastroPage.fillFormCadastro(
            data.create_adm.nome,
            data.create_adm.email,
            data.create_adm.password,
            data.create_adm.administrador
        );
        await cadastroPage.clickButtonByName('Cadastrar');
        await cadastroPage.checkAlertMessage('Cadastro realizado com sucesso');
    })
})

