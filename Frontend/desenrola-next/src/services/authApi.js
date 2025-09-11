export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5087';

export async function login({ username, password }) {
  const url = `${BASE_URL}/api/auth?Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`;

  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let message = 'Falha ao autenticar.';
    try {
      const data = await res.json();
      message = data?.message || data?.error || message;
    } catch {}
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
    } catch {}
  }

  if (!token) throw new Error('Resposta de autenticação sem token.');

  return { token, user, /* opcional: raw: data */ };
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

export async function resetPassword(token, password, confirmPassword) {
  const url = `${BASE_URL}/api/auth/validation-reset?Token=${encodeURIComponent(token)}&Password=${encodeURIComponent(password)}&ConfirmPassword=${encodeURIComponent(confirmPassword)}`;

  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    let msg = 'Falha ao redefinir senha.';
    try {
      const data = await res.json();
      msg = data?.message || data?.error || msg;
    } catch {}
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return { message: 'Senha redefinida com sucesso.' };
  }
}
