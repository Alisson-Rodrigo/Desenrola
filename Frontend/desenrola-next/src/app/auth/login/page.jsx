'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { login } from '../../../services/authApi';

// Constantes para as roles (mantém consistência com o backend)
const USER_ROLES = {
  ADMIN: 0,
  CUSTOMER: 1,
  PROVIDER: 2
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });


  /**
  Atualiza o estado do formulário conforme o usuário digita nos campos.
  @param {React.ChangeEvent<HTMLInputElement>} e Evento de input
  */

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }



  // Prefetch para rotas mais usadas

  /**
  Realiza o prefetch de rotas comuns para melhorar a performance da navegação.
  */
  useEffect(() => {
    router.prefetch('/auth/register');
    router.prefetch('/auth/recoverpass');
    router.prefetch('/');
    router.prefetch('/admin');
    router.prefetch('/provider'); // Se tiver rota para provider
  }, [router]);
  
  
  
  /**
  Envia o formulário de login, autentica o usuário e redireciona conforme o tipo.
  @param {React.FormEvent<HTMLFormElement>} e Evento de envio do formulário
  */

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    if (!form.username || !form.password) {
      setMessage({ type: 'error', text: 'Preencha usuário e senha.' });
      return;
    }

    try {
      setLoading(true);
      const { token, user } = await login({
        username: form.username,
        password: form.password,
      });

      // Armazena token (ideal: httpOnly cookie via backend)
      localStorage.setItem('auth_token', token);
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));

      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });

      // --- CÓDIGO MELHORADO ---
      // Redireciona baseado na role do usuário
      if (user && user.role === USER_ROLES.ADMIN) {
        router.push('/admin'); // Administrador vai para painel admin
      } else if (user && user.role === USER_ROLES.PROVIDER) {
        router.push('/provider'); // Provider vai para painel do prestador (se existir)
      } else {
        router.push('/'); // Customer e outros vão para página principal
      }
      // --- FIM DA MODIFICAÇÃO ---

    } catch (err) {
      let errorText = 'Erro ao autenticar.';

      if (err?.response?.data?.message) {
        errorText = err.response.data.message;
      } else if (typeof err?.response?.data === 'string') {
        errorText = err.response.data;
      } else if (err.message) {
        errorText = err.message;
      }

      // Se vier JSON {"message":"..."} → extrai só o texto
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.message) {
          errorText = parsed.message;
        }
      } catch (_) {
        // não era JSON válido
      }

      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      {/* Painel Esquerdo */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito (Formulário) */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <h2>
            Entrar <span className={styles.welcomeEmoji}>👋</span>
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="seu.username"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="password">Senha</label>
                <Link className={styles.forgotPassword} href="/auth/recoverpass">
                  Esqueci a senha
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <button className={styles.loginButton} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {message.type && (
              <p
                style={{
                  marginTop: 12,
                  fontSize: '.95rem',
                  color: message.type === 'error' ? '#b91c1c' : '#065f46',
                  whiteSpace: 'pre-line', // permite múltiplas linhas
                }}
              >
                {message.text}
              </p>
            )}
          </form>

          <div className={styles.signupLink}>
            Novo por aqui? <Link href="/auth/register">Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}