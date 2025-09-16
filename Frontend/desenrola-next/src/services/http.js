/**
 * @file Contém funções de serviço para realizar chamadas HTTP autenticadas para a API.
 * @author [Seu Nome]
 */

/**
 * A URL base da API, obtida da variável de ambiente ou um valor padrão para desenvolvimento local.
 * @constant {string}
 */
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087';

/**
 * Executa uma requisição GET autenticada usando um Bearer Token.
 * @async
 * @param {string} path - O caminho do endpoint da API (ex: '/api/user/profile').
 * @returns {Promise<any>} Uma promise que resolve para a resposta da API em formato JSON.
 * @throws {Error} Lança um erro com um código de status se a requisição falhar ou não for autorizada.
 */
export async function authGet(path) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) {
    const e = new Error('Sem token de autenticação');
    e.code = 401;
    throw e;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const msg = await safeMsg(res);
    const e = new Error(msg);
    e.code = res.status;
    throw e;
  }

  return res.json();
}

/**
 * Executa uma requisição PUT autenticada. A função detecta automaticamente
 * se o corpo da requisição é um objeto JSON ou FormData e ajusta os cabeçalhos de acordo.
 * @async
 * @param {string} path - O caminho do endpoint da API (ex: '/api/user').
 * @param {object | FormData} body - O corpo da requisição. Pode ser um objeto JavaScript (para JSON) ou uma instância de FormData.
 * @returns {Promise<any>} Uma promise que resolve para a resposta da API em formato JSON (ou um objeto vazio em caso de sucesso sem conteúdo).
 * @throws {Error} Lança um erro com um código de status se a requisição falhar.
 */
export async function authPut(path, body) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) {
    const e = new Error('Sem token de autenticação');
    e.code = 401;
    throw e;
  }

  const isFormData = body instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Se não for FormData, é JSON, então definimos o Content-Type.
  // Se for FormData, o navegador define o Content-Type automaticamente com o boundary correto.
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await safeMsg(res);
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
 * Extrai de forma segura uma mensagem de erro de uma resposta de fetch.
 * @async
 * @private
 * @param {Response} res - O objeto Response da chamada fetch.
 * @returns {Promise<string>} Uma string contendo a mensagem de erro.
 */
async function safeMsg(res) {
  try {
    const data = await res.json();
    return data?.message || data?.error || `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}