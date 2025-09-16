// src/services/userApi.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087/api';

/**
 * Registra um novo usuário na API.
 * A função envia os dados do usuário como parâmetros de query string em uma requisição POST.
 * * @param {object} userData - Objeto contendo os dados para o registro.
 * @param {string} userData.userName - O nome de usuário escolhido.
 * @param {string} userData.name - O nome completo do usuário.
 * @param {string} userData.email - O endereço de e-mail do usuário.
 * @param {string} userData.password - A senha para a nova conta.
 * @param {string} userData.passwordConfirmation - A confirmação da senha, que deve ser idêntica à senha.
 * @returns {Promise<boolean>} Uma promessa que resolve para `true` se o registro for bem-sucedido.
 * @throws {Error} Lança um erro se a resposta da API não for bem-sucedida (status HTTP não-2xx), 
 * contendo o texto da resposta ou uma mensagem de falha padrão.
 */
export async function registerUser({ userName, name, email, password, passwordConfirmation }) {
  // Monta a querystring conforme a API
  const params = new URLSearchParams({
    UserName: userName,
    Name: name,
    Email: email,
    Password: password,
    PasswordConfirmation: passwordConfirmation,
  });

  const url = `${BASE_URL}/user?${params.toString()}`;

  // Geralmente o registro é feito com POST
  const res = await fetch(url, {
    method: 'POST',
    // Se a API exigir JSON, o corpo (body) da requisição deveria ser usado.
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ ... })
  });

  // Trata respostas não-2xx
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Falha no registro (HTTP ${res.status})`);
  }

  // Se a API retorna dados úteis em JSON, o retorno seria:
  // return await res.json();

  // Se não retorna nada relevante, um sucesso booleano é suficiente.
  return true;
}