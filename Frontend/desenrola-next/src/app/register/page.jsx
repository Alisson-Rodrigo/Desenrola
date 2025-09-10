'use client';

import Link from 'next/link';
import styles from './Register.module.css';

export default function Register() {
  return (
    <div className={styles.registerContainer}>
      {/* Painel Esquerdo */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className={styles.rightPanel}>
        <div className={styles.registerCard}>
          <h2>Criar conta</h2>

          <form>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Nome completo</label>
              <input type="text" id="fullName" placeholder="Seu nome completo" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="seuemail@exemplo.com" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone</label>
              <input type="tel" id="phone" placeholder="(00) 00000-0000" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" placeholder="Crie uma senha forte" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input type="password" id="confirmPassword" placeholder="Confirme sua senha" />
            </div>

            <button type="submit" className={styles.registerButton}>
              Cadastrar
            </button>
          </form>

          <p className={styles.loginLink}>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
