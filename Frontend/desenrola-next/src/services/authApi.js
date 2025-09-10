export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087';

export async function login({ username, password }) {
  const url = `${BASE_URL}/api/auth`; // ajuste aqui se sua rota for outra
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Caso sua API espere querystring, mude a strategy.
    body: JSON.stringify({ username, password }),
  });

  // Trata erros comuns
  if (!res.ok) {
    let message = 'Falha ao autenticar.';
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch {}
    // 400/401 mensagens mais claras
    if (res.status === 400) message = 'Verifique os campos e tente novamente.';
    if (res.status === 401) message = 'Usuário ou senha inválidos.';
    throw new Error(message);
  }

  // Sucesso
  const data = await res.json();

  // Estruturas comuns: { token, expiresIn, user } ou { accessToken, user }
  const token = data?.token || data?.accessToken || data?.jwt || null;
  if (!token) {
    throw new Error('Resposta de autenticação sem token.');
  }

  return {
    token,
    user: data?.user ?? null,
    raw: data,
  };
}
export async function forgotPassword(email) {
  const url = `${BASE_URL}/api/auth/forgot-password?Email=${encodeURIComponent(email)}`;
  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let msg = 'Falha ao solicitar recuperação de senha.';
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  // a API pode não retornar body; trate como sucesso mesmo sem JSON
  try {
    return await res.json();
  } catch {
    return { message: 'Solicitação enviada.' };
  }
}