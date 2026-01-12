import { test, expect } from '@playwright/test';
import data from './fixtures/data.json';
import productData from './fixtures/product.json';
import { getUserByEmail, createUser, getProductByName, loginUser, createProduct, deleteProductById, changesProduct } from './support/helpers';
import { ProdutosPage } from './support/pages/produtosPage';
let produtosPage: ProdutosPage;

test.beforeEach(async ({ page, request }) => {
    produtosPage = new ProdutosPage(page);

    const responseBody = await getUserByEmail(request, data.create_user.email);   // requisição GET passando o email para verificar se já existe
    if (responseBody.quantidade === 0) {
        await createUser(request, data.create_user);    // requisição  POST para cadastrar o usuário
    }

    // fazendo login via interface
    await produtosPage.doLogin(data.create_user.email, data.create_user.password);
})

test.describe('Produtos: usuário', () => {
    test('deve pesquisar um produto existente', async ({ request }) => {
        const productResponse = await getProductByName(request, `${productData.product1.nome}`);
        if (productResponse.quantidade === 0) {

            const bearerToken = await loginUser(request, data.create_adm.email, data.create_adm.password);  // requisição POST para obter token de adm
            await createProduct(request, bearerToken, productData.product1);   // requisição POST para cadastrar o produto
        }

        await produtosPage.searchProduct(productData.product1.nome)
        await produtosPage.verifyProductCard(productData.product1.nome)

    })

    test('deve pesquisar um produto inexistente', async () => {

        await produtosPage.searchProduct("Produto não existe")
        await produtosPage.verifyNoProductFound()

    })

    test('adicionar produto na lista', async () => {

        await produtosPage.searchProduct(productData.product1.nome)
        await produtosPage.verifyProductCard(productData.product1.nome)

        await produtosPage.clickAddListByName(productData.product1.nome)

        await produtosPage.checkListItem(productData.product1.nome)
    })

    test('deve limpar lista de compras', async ({ request }) => {
        const productResponse = await getProductByName(request, `${productData.product2.nome}`);
        if (productResponse.quantidade === 0) {

            const bearerToken = await loginUser(request, data.create_adm.email, data.create_adm.password);  // requisição POST para obter token de adm
            await createProduct(request, bearerToken, productData.product2);   // requisição POST para cadastrar o produto
        }

        await produtosPage.searchProduct(productData.product2.nome)
        await produtosPage.verifyProductCard(productData.product2.nome)

        await produtosPage.clickAddListByName(productData.product2.nome)

        await produtosPage.checkListItem(productData.product2.nome)

        await produtosPage.clearList()
    })

    test('detalhes do produto após requisição PUT', async ({ request }) => {
        const bearerToken = await loginUser(request, data.create_adm.email, data.create_adm.password);  // requisição POST para obter token de adm

        const productResponse = await getProductByName(request, `${productData.product1.nome}`);

        if (productResponse.quantidade === 1) {
            await deleteProductById(request, productResponse.produtos[0]._id, bearerToken)   // DELETE produto
        } 

        await createProduct(request, bearerToken, productData.product1);   //POST produto

        const productResponseAfterCreate = await getProductByName(request, `${productData.product1.nome}`);   // GET produto
        const idProduto = productResponseAfterCreate.produtos[0]._id;   // obter id produto

        await changesProduct(request, idProduto, bearerToken)   // PUT alterando o produto
        
        await produtosPage.searchProduct(productData.product1.nome)
        await produtosPage.verifyProductCard(productData.product1.nome)
        await produtosPage.checkDetailsUpdate(productData.product1.nome)
    })
})
