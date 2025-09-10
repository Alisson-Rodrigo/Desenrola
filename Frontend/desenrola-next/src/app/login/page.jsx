'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aqui você faria a chamada para sua API de login
      console.log('Login data:', formData);
      
      // Simulação de loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirecionar para dashboard ou página principal
      // router.push('/dashboard');
      
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = (e) => {
    const formGroup = e.target.parentElement;
    if (formGroup) {
      formGroup.style.transform = 'scale(1.02)';
    }
  };

  const handleInputBlur = (e) => {
    const formGroup = e.target.parentElement;
    if (formGroup) {
      formGroup.style.transform = 'scale(1)';
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* Painel da Esquerda */}
      <div className={styles.leftPanel}>
        <div className={styles.brandContainer}>
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>
      
      {/* Painel da Direita */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <h2>
            Bem-vindo de volta 
            <span className={styles.welcomeEmoji}>👋</span>
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seuemail@email.com"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.labelWrapper}>
                <label htmlFor="password">Senha</label>
                <Link href="/recoverpass" className={styles.forgotPassword}>
                  Esqueci minha senha
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className={styles.signupLink}>
            Ainda não tem conta? {' '}
            <Link href="/register">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}