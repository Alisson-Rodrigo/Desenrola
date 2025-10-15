/**
 * @file Módulo para autenticação e gerenciamento de conta de usuário.
 * @description Contém funções para login, recuperação e redefinição de senha,
 * comunicando-se com a API backend.
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.desenrola.shop';

/**
 * Autentica um usuário na API.
 * * Envia as credenciais para o endpoint de autenticação e processa a resposta,
 * que pode ser um JSON contendo o token e os dados do usuário, ou um token em texto puro.
 * * @param {object} credentials - As credenciais do usuário.
 * @param {string} credentials.username - O nome de usuário ou e-mail.
 * @param {string} credentials.password - A senha do usuário.
 * @returns {Promise<{token: string, user: object | null}>} Uma promessa que resolve para um objeto contendo o token JWT e, opcionalmente, os dados do usuário.
 * @throws {Error} Lança um erro se a autenticação falhar, se a resposta da API não for 'ok', ou se o token não for encontrado na resposta.
 */
export async function login({ username, password }) {
  const url = `${BASE_URL}/api/auth?Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`;

  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let message = 'Falha ao autenticar.';
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch { }
    if (res.status === 400) message = 'Verifique os campos e tente novamente.';
    if (res.status === 401) message = 'Usuário ou senha inválidos.';
    throw new Error(message);
  }

  // Algumas APIs retornam JSON, outras só um token em texto
  let token = null;
  let user = null;

  // 1) tenta JSON
  try {
    const data = await res.json();
    token = data?.token || data?.accessToken || data?.jwt || null;
    user = data?.user ?? null;
  } catch {
    // 2) fallback: texto puro
    try {
      const text = await res.text();
      token = text && text.trim().length > 0 ? text.trim() : null;
    } catch { }
  }

  if (!token) throw new Error('Resposta de autenticação sem token.');

  return { token, user, /* opcional: raw: data */ };
}

/**
 * Solicita a recuperação de senha para um determinado e-mail.
 * * Envia uma requisição POST para o endpoint de 'esqueci minha senha'.
 * * @param {string} email - O e-mail do usuário que deseja recuperar a senha.
 * @returns {Promise<object>} Uma promessa que resolve para a resposta da API (geralmente um objeto de sucesso) ou um objeto padrão em caso de corpo de resposta vazio.
 * @throws {Error} Lança um erro se a solicitação falhar ou se a resposta da API não for 'ok'.
 */
export async function forgotPassword(email) {
  const url = `${BASE_URL}/api/auth/forgot-password?Email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let msg = 'Falha ao solicitar recuperação de senha.';
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch { }
    throw new Error(msg);
  }

  // a API pode não retornar body; trate como sucesso mesmo sem JSON
  try {
    return await res.json();
  } catch {
    return { message: 'Solicitação enviada.' };
  }
}

/**
 * Redefine a senha do usuário usando um token de validação.
 * * @param {string} token - O token de redefinição de senha recebido (geralmente por e-mail).
 * @param {string} password - A nova senha a ser definida.
 * @param {string} confirmPassword - A confirmação da nova senha.
 * @returns {Promise<object>} Uma promessa que resolve para a resposta da API ou um objeto de sucesso padrão.
 * @throws {Error} Lança um erro se a redefinição falhar ou se a resposta da API não for 'ok'.
 */
export async function resetPassword(token, password, confirmPassword) {
  const url = `${BASE_URL}/api/auth/validation-reset?Token=${encodeURIComponent(token)}&Password=${encodeURIComponent(password)}&ConfirmPassword=${encodeURIComponent(confirmPassword)}`;

  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let msg = 'Falha ao redefinir senha.';
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch { }
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return { message: 'Senha redefinida com sucesso.' };
  }
}