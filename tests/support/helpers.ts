import { expect, APIRequestContext } from '@playwright/test';
import data from '../fixtures/data.json';

require('dotenv').config();
const BASE_API = process.env.BASE_API

export async function getUserByEmail(request: APIRequestContext, email: string) {
    // Faz a requisição passando o parâmetro email e retorna o body (sem asserts aqui)
    const resp = await request.get(`${BASE_API}/usuarios`, { params: { email } });
    const responseBody = await resp.json();
    return responseBody;
}

export async function deleteUserById(request: APIRequestContext, id: string) {
    await request.delete(`${BASE_API}/usuarios/${id}`);
}

export async function createUser(request: APIRequestContext, userData: any) {
    const cadastroUsuario = await request.post(`${BASE_API}/usuarios`, { data: userData });
    expect(cadastroUsuario.status()).toBe(201)
}

export async function loginUser(request: APIRequestContext, email: string, password: string) {
    // verificar se usuario existe antes do login, se não existir irá cadastra-lo
    const responseBody = await getUserByEmail(request, email);     // requisição GET para verificar se o usuário já existe
    if (responseBody.quantidade === 0) {
        await createUser(request, data.create_adm);    // requisição POST para cadastrar o usuário adm
    }

    const loginResponse = await request.post(`${BASE_API}/login`, { data: { email: email, password: password } })
    const bearerToken = await loginResponse.json().then(res => res.authorization)
    return bearerToken;
}

export async function createProduct(request: APIRequestContext, token: string, productData: any) {
    const productCreated = await request.post(`${BASE_API}/produtos`, {
        headers: { Authorization: token },
        data: productData
    })
    await expect(productCreated.status()).toBe(201)
}

export async function getProductByName(request: APIRequestContext, name: string) {
    const resp = await request.get(`${BASE_API}/produtos`, { params: { nome: name } })
    const responseBody = await resp.json();
    return responseBody;
}

export async function deleteProductById(request: APIRequestContext, id: string, token: string) {
    await request.delete(`${BASE_API}/produtos/` + id,
        {
            headers: { Authorization: token }
        }
    )
}

export async function changesProduct(request: APIRequestContext, id: string, token: string) {
    await request.put(`${BASE_API}/produtos/${id}`,
            {
                headers: { Authorization: token },
                data: {
                    "nome": "PlayStation 5",
                    "preco": 3490,
                    "descricao": "Eletronicos",
                    "quantidade": 19
                }
            }
        )
}