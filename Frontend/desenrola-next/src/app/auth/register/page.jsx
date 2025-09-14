'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Register.module.css';
import { registerUser } from '../../services/userApi';

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

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    if (!form.userName || !form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios.' });
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
        role: 1, // sempre 1
      });
      setMessage({ type: 'success', text: 'Conta criada com sucesso!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao registrar.' });
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
            {/* Username */}
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

            {/* Nome completo */}
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

            {/* Email */}
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

            {/* Telefone */}
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

            {/* Senha */}
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

            {/* Confirmar senha */}
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
            <p
              className={
                message.type === 'error'
                  ? styles.errorText
                  : message.type === 'success'
                  ? styles.successText
                  : ''
              }
            >
              {message.text}
            </p>
          )}

          <p className={styles.loginLink}>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
