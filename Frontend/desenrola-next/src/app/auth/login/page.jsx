'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';
import { login } from '../../../services/authApi';

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

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  useEffect(() => {
    router.prefetch('/auth/register');
    router.prefetch('/auth/recoverpass');
    router.prefetch('/');
    router.prefetch('/admin');
    router.prefetch('/provider');
  }, [router]);

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

      localStorage.setItem('auth_token', token);
      if (user) localStorage.setItem('auth_user', JSON.stringify(user));

      setMessage({ type: 'success', text: 'Login realizado com sucesso!' });

      if (user && user.role === USER_ROLES.ADMIN) {
        router.push('/admin');
      } else if (user && user.role === USER_ROLES.PROVIDER) {
        router.push('/provider');
      } else {
        router.push('/');
      }

    } catch (err) {
      let errorText = 'Erro ao autenticar.';

      if (err?.response?.data?.message) {
        errorText = err.response.data.message;
      } else if (typeof err?.response?.data === 'string') {
        errorText = err.response.data;
      } else if (err.message) {
        errorText = err.message;
      }

      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.message) {
          errorText = parsed.message;
        }
      } catch (_) {}

      setMessage({ type: 'error', text: errorText });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* Lado Esquerdo */}
      <div className={styles.leftSide}>
        <div className={styles.blobBg}>
          <div className={`${styles.blob} ${styles.blob1}`}></div>
          <div className={`${styles.blob} ${styles.blob2}`}></div>
          <div className={`${styles.blob} ${styles.blob3}`}></div>
        </div>
        
        <div className={styles.brandContent}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoCircle}>D</div>
            <h1 className={styles.brandName}>Desenrola</h1>
          </div>
          <p className={styles.brandTagline}>
            Chegou em Picos?<br />
            A gente desenrola pra você.
          </p>
        </div>

        <div className={styles.decorativeDots}>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
          <div className={styles.dot}></div>
        </div>
      </div>

      {/* Lado Direito */}
      <div className={styles.rightSide}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
            <p className={styles.formSubtitle}>Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="username">
                Username
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="username"
                  className={styles.formInput}
                  placeholder="seu.username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordGroup}>
                <label className={styles.inputLabel} htmlFor="password">
                  Senha
                </label>
                <Link href="/auth/recoverpass" className={styles.forgotLink}>
                  Esqueci a senha
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="password"
                  className={styles.formInput}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {message.type && (
              <p className={styles[message.type === 'error' ? 'errorMessage' : 'successMessage']}>
                {message.text}
              </p>
            )}
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.signupText}>
            Novo por aqui? <Link href="/auth/register" className={styles.signupLink}>Criar conta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}