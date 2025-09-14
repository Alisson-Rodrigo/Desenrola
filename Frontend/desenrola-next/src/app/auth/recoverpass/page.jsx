'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './RecoverPassword.module.css';
import { forgotPassword } from '../../services/authApi';

export default function RecoverPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: null, text: '' });

    if (!email) {
      setMessage({ type: 'error', text: 'Digite o e-mail cadastrado.' });
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setMessage({
        type: 'success',
        text: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.',
      });
      setEmail('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Erro ao solicitar recuperação.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.recoverContainer}>
      {/* Painel Esquerdo */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className={styles.rightPanel}>
        <div className={styles.recoverCard}>
          <h2>Recuperar senha</h2>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail cadastrado</label>
              <input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.recoverButton} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar instruções'}
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

          <Link href="/login" className={styles.backToLogin}>
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
