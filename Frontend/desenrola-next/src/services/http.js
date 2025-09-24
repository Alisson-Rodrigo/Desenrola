/**
 * @file Serviço HTTP com autenticação para consumo da API do backend do Desenrola.
 * @author ...
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087';

/**
 * Obtém o token JWT salvo localmente (se estiver no navegador).
 * @returns {string|null}
 */
function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Extrai mensagem de erro da resposta da API.
 * @param {Response} res
 * @returns {Promise<string>}
 */
async function getErrorMessage(res) {
  try {
    const data = await res.json();
    return data?.message || data?.error || `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}

/**
 * Constrói os headers com o token e tipo de conteúdo apropriado.
 * @param {boolean} isJson - Se o conteúdo é JSON
 * @returns {HeadersInit}
 */
function buildHeaders(isJson = true) {
  const token = getToken();
  if (!token) {
    const e = new Error('Sem token de autenticação');
    e.code = 401;
    throw e;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
}

/**
 * Faz uma requisição GET autenticada.
 * @param {string} path - Ex: '/api/user'
 * @returns {Promise<any>}
 */
export async function authGet(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  if (!res.ok) {
    const msg = await getErrorMessage(res);
    const e = new Error(msg);
    e.code = res.status;
    throw e;
  }

  return res.json();
}

/**
 * Faz uma requisição POST autenticada (JSON ou FormData).
 * @param {string} path
 * @param {object|FormData} body
 * @returns {Promise<any>}
 */
export async function authPost(path, body) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(!isFormData),
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await getErrorMessage(res);
    const e = new Error(msg);
    e.code = res.status;
    throw e;
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * Faz uma requisição PUT autenticada (JSON ou FormData).
 * @param {string} path
 * @param {object|FormData} body
 * @returns {Promise<any>}
 */
export async function authPut(path, body) {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(!isFormData),
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await getErrorMessage(res);
    const e = new Error(msg);
    e.code = res.status;
    throw e;
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}
