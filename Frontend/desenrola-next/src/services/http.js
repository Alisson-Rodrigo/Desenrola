// src/services/http.js

/**
 * Base URL da API, vinda de NEXT_PUBLIC_API_BASE_URL; fallback localhost.
 * @constant {string}
 */
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087';

/**
 * Executa GET autenticado com Bearer token.
 * @param {string} path - Caminho da API (ex.: '/api/user/profile').
 * @returns {Promise<any>} JSON de resposta.
 * @throws {Error} code=401 quando sem token ou Unauthorized.
 */
export async function authGet(path) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) {
    const e = new Error('Sem token');
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
 * Executa PUT autenticado com Bearer token enviando body JSON.
 * @param {string} path - Caminho da API (ex.: '/api/user/profile').
 * @param {object} body - Objeto para serializar como JSON.
 * @returns {Promise<any>} JSON (ou {} quando 204).
 * @throws {Error} code=status HTTP em caso de erro.
 */
export async function authPut(path, body) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (!token) {
    const e = new Error('Sem token');
    e.code = 401;
    throw e;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await safeMsg(res);
    const e = new Error(msg);
    e.code = res.status;
    throw e;
  }

  try { return await res.json(); } catch { return {}; }
}

/**
 * Extrai mensagem de erro amigável da Response.
 * @param {Response} res
 * @returns {Promise<string>}
 */
async function safeMsg(res) {
  try {
    const data = await res.json();
    return data?.message || data?.error || `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}
