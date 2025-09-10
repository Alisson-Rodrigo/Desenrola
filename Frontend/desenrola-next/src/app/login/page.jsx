'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';
import { login } from '../../services/authApi';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  function handleChange(e) {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  }

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

      // Armazena token (alternativa mais segura: cookie httpOnly via backend)
      localStorage.setItem('auth_token', token);
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));

      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });

      // Redireciona (ajuste o destino conforme sua app)
      router.push('/dashboard'); 
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao autenticar.' });
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
          <h2>Entrar <span className={styles.welcomeEmoji}>👋</span></h2>

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
                <a className={styles.forgotPassword} href="/recoverpass">
                  Esqueci a senha
                </a>
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
                }}
              >
                {message.text}
              </p>
            )}
          </form>

          <div className={styles.signupLink}>
            Novo por aqui? <a href="/register">Criar conta</a>
          </div>
        </div>
      </div>
    </div>
  );
}
