import { test, expect } from '@playwright/test';
import data from './fixtures/data.json';
import { getUserByEmail, deleteUserById, createUser } from './support/helpers';
import { LoginPage } from './support/pages/loginPage';

let loginPage: LoginPage;

test.beforeEach(({ page }) => {
  loginPage = new LoginPage(page);
});

test.describe('login com user comum', () => {
  test('login de usuario com sucesso', async ({ request }) => {

    
    const responseBody = await getUserByEmail(request, data.create_user.email);   // requisição GET passando o email para verificar se já existe

    if (responseBody.quantidade === 1) {
        const id = responseBody.usuarios[0]._id;
        console.log('deletando o usuário com id: ', id);
        await deleteUserById(request, id);    // requisição DELETE para usuário existente  
    }

    await createUser(request, data.create_user);    // requisição  POST para cadastrar o usuário

    //navegando para a page passando o endpoint
    await loginPage.go();
    // preenchendo formulario login
    await loginPage.fillForm(data.create_user.email, data.create_user.password);
    // clicar botão Entrar
    await loginPage.clickButtonByName('Entrar');
    // checkpoint da dashboard 
    await loginPage.checkDashboard();

  });

  test('login com usuário inválido', async () => {

    await loginPage.go();
    await loginPage.fillForm(data.user_invalid.email, data.user_invalid.password);
    await loginPage.clickButtonByName('Entrar');
    await loginPage.checkAlertMessage('Email e/ou senha inválidos');

  });

  test('login com senha nula', async () => {

    await loginPage.go();
    await loginPage.fillForm(data.password_null.email, data.password_null.password);
    await loginPage.clickButtonByName('Entrar');
    await loginPage.checkAlertMessage('Password é obrigatório');

  });

  test('login com email nulo', async () => {

    await loginPage.go();
    await loginPage.fillForm(data.email_null.email, data.email_null.password);
    await loginPage.clickButtonByName('Entrar');
    await loginPage.checkAlertMessage('Email é obrigatório');

  });

  test('login com email sem @', async () => {

    await loginPage.go();
    await loginPage.fillForm(data.email_incorrect.email, data.email_incorrect.password);
    await loginPage.clickButtonByName('Entrar');
    await loginPage.checkAlertBrowse();

  });
})



test.describe('login com user adm', () => {

  test('login de adm com sucesso', async ({ request }) => {

    // requisição GET passando o email para verificar se já existe
    const responseBody = await getUserByEmail(request, data.create_adm.email);

    // requisição DELETE caso o usuário já exista
    if (responseBody.quantidade === 0) {
      console.log('usuário nao existe, pode seguir para cadastro');
    } else {
      const id = responseBody.usuarios[0]._id;
      console.log('removendo o usuário com id: ', id);
      await deleteUserById(request, id);
    }

    // requisição  POST para cadastrar o usuário
    await createUser(request, data.create_adm);

    //navegando para a page passando o endpoint
    await loginPage.go();
    // preenchendo formulario login
    await loginPage.fillForm(data.create_adm.email, data.create_adm.password);
    // clicar botão Entrar
    await loginPage.clickButtonByName('Entrar');
    // checkpoint da dashboard 
    await loginPage.checkDashboard();
  })
});


