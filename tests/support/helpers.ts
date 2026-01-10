import { expect, APIRequestContext } from '@playwright/test';

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