'use client';

import Link from 'next/link';
import styles from './RecoverPassword.module.css';

export default function RecoverPassword() {
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

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail cadastrado</label>
              <input
                type="email"
                id="email"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>

            <button type="submit" className={styles.recoverButton}>
              Enviar instruções
            </button>
          </form>

          <Link href="/login" className={styles.backToLogin}>
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
}
