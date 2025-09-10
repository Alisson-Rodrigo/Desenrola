// src/Login.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      {/* Painel Esquerdo */}
      <div className="left-panel">
        <div className="brand-container">
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito */}
      <div className="right-panel">
        <div className="login-card">
          <h2>Bem-vindo de volta 👋</h2>
          
          <form>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seuemail@email.com" 
              />
            </div>
            
            <div className="form-group">
              <div className="label-wrapper">
                <label htmlFor="password">Senha</label>
                <Link to="/recuperar-senha" className="forgot-password">Esqueci minha senha</Link>
              </div>
              <input 
                type="password" 
                id="password" 
                placeholder="Sua senha" 
              />
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>

          <p className="signup-link">
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;