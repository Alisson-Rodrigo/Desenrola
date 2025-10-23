'use client';
export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './confirmarsenha.module.css';
import { resetPassword } from '../../../services/authApi';

// Componente separado que usa useSearchParams
function ConfirmPasswordForm() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token'); // token vem da URL

  /**
  Atualiza os campos do formulário com os dados digitados pelo usuário.
  @param {React.ChangeEvent<HTMLInputElement>} e Evento de mudança no input
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
  Envia o formulário para redefinir a senha do usuário.
  Verifica se os campos estão preenchidos e se o token é válido.
  Em caso de sucesso, redireciona para a página de login.
  @param {React.FormEvent<HTMLFormElement>} e Evento de envio do formulário
  */
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    if (!formData.password || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Preencha todos os campos.' });
      return;
    }

    if (!token) {
      setMessage({ type: 'error', text: 'Token inválido ou expirado.' });
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, formData.password, formData.confirmPassword);
      setMessage({
        type: 'success',
        text: 'Senha redefinida com sucesso! Redirecionando para login...',
      });

      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao redefinir senha.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.recoverCard}>
      <h2 className={styles.cardTitle}>Definir nova senha 🔐</h2>
      <p className={styles.description}>
        Crie uma senha forte para proteger sua conta.
      </p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="password">Nova senha</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.recoverButton} disabled={loading}>
          {loading ? 'Redefinindo...' : 'Redefinir senha'}
        </button>
      </form>

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
    </div>
  );
}

// Componente principal exportado
export default function ConfirmNewPassword() {
  return (
    <div className={styles.recoverContainer}>
      {/* Painel Esquerdo */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1 className={styles.brandTitle}>Desenrola</h1>
          <p className={styles.brandSubtitle}>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className={styles.rightPanel}>
        <Suspense fallback={
          <div className={styles.recoverCard}>
            <p>Carregando...</p>
          </div>
        }>
          <ConfirmPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}