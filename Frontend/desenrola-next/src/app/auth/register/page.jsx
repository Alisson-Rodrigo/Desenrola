'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Register.module.css';
import { registerUser } from '../../../services/userApi';

export default function Register() {
  const router = useRouter();
  
  const [form, setForm] = useState({
    userName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  function handleChange(e) {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  }

  function traduzirMensagem(msg) {
    return msg
      .replace(
        'Passwords must have at least one non alphanumeric character.',
        'A senha deve ter pelo menos um caractere não alfanumérico (ex: !, @, #, $).'
      )
      .replace(
        "Passwords must have at least one lowercase ('a'-'z').",
        'A senha deve ter pelo menos uma letra minúscula (a-z).'
      )
      .replace(
        "Passwords must have at least one uppercase ('A'-'Z').",
        'A senha deve ter pelo menos uma letra maiúscula (A-Z).'
      );
  }

  useEffect(() => {
    router.prefetch('/auth/login');
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    if (
      !form.userName ||
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
      return;
    }

    if (form.password.length < 6) {
      setMessage({ type: 'error', text: 'O campo senha precisa ter, pelo menos, 6 caracteres.' });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        userName: form.userName,
        name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        passwordConfirmation: form.confirmPassword,
        role: 1,
      });
      setMessage({ type: 'success', text: 'Conta criada com sucesso!' });
    } catch (err) {
      let errorText = 'Erro ao registrar.';

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

      let mensagens = errorText
        .split(/\r?\n|\|/g)
        .map((m) => traduzirMensagem(m.trim()))
        .filter((m) => m.length > 0);

      errorText = mensagens.join('\n');

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
            <h2 className={styles.formTitle}>Criar conta</h2>
            <p className={styles.formSubtitle}>Preencha seus dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="userName">
                Usuário
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="userName"
                  className={styles.formInput}
                  placeholder="Nome de usuário"
                  value={form.userName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="fullName">
                Nome completo
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  id="fullName"
                  className={styles.formInput}
                  placeholder="Seu nome completo"
                  value={form.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="email">
                E-mail
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  id="email"
                  className={styles.formInput}
                  placeholder="seuemail@exemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="phone">
                Telefone (opcional)
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="tel"
                  id="phone"
                  className={styles.formInput}
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="password">
                Senha
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="password"
                  className={styles.formInput}
                  placeholder="Crie uma senha forte"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="confirmPassword">
                Confirmar senha
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="confirmPassword"
                  className={styles.formInput}
                  placeholder="Confirme sua senha"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Enviando...' : 'Cadastrar'}
            </button>

            {message.type && (
              <div className={styles[message.type === 'error' ? 'errorMessage' : 'successMessage']}>
                {message.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </form>

          <div className={styles.divider}>
            <span>ou</span>
          </div>

          <p className={styles.loginText}>
            Já tem uma conta? <Link href="/auth/login" className={styles.loginLink}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}