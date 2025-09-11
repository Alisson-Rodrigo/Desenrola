// src/services/userApi.js
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087/api';

/**
 * Registra um usuário enviando os dados como query string.
 * A API espera: UserName, Name, Email, Password, PasswordConfirmation
 */
export async function registerUser({ userName, name, email, password, passwordConfirmation }) {
  // Monta a querystring conforme sua API
  const params = new URLSearchParams({
    UserName: userName,
    Name: name,
    Email: email,
    Password: password,
    PasswordConfirmation: passwordConfirmation,
  });

  const url = `${BASE_URL}/user?${params.toString()}`;

  // Geralmente é POST; se sua API usar GET, troque o método.
  const res = await fetch(url, {
    method: 'POST',
    // Se a API exigir JSON, use headers+body. Como você disse "query", deixei sem body.
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ ... })
  });

  // Trata respostas não-2xx
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Falha no registro (HTTP ${res.status})`);
  }

  // Se a API retorna JSON:
  // return await res.json();

  // Se não retorna nada relevante:
  return true;
}
