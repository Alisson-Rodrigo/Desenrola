'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Register.module.css';
import { registerUser } from '../../../services/userApi';

export default function Register() {
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

  // Traduz mensagens do backend para PT-BR
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

  // Prefetch para rotas comuns
  useEffect(() => {
    // pré-carrega a tela de login
    if (typeof window !== 'undefined') {
      import('next/navigation').then(({ useRouter }) => {
        const router = useRouter();
        router.prefetch('/auth/login');
      });
    }
  }, []);

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

      // Se vier JSON {"message":"..."} → pega só o texto
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.message) {
          errorText = parsed.message;
        }
      } catch (_) {
        // não era JSON válido, segue como string
      }

      // separa por linhas ou por "|"
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
    <div className={styles.registerContainer}>
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.registerCard}>
          <h2>Criar conta</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="userName">Usuário</label>
              <input
                type="text"
                id="userName"
                placeholder="Nome de usuário"
                value={form.userName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fullName">Nome completo</label>
              <input
                type="text"
                id="fullName"
                placeholder="Seu nome completo"
                value={form.fullName}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                placeholder="Crie uma senha forte"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirme sua senha"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.registerButton} disabled={loading}>
              {loading ? 'Enviando...' : 'Cadastrar'}
            </button>
          </form>

          {message.text && (
            <div
              className={
                message.type === 'error'
                  ? styles.errorText
                  : styles.successText
              }
            >
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}

          <p className={styles.loginLink}>
            Já tem uma conta? <Link href="/auth/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
