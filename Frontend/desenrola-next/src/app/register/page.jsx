import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import './Register.css';

function Register() {
  return (
    <div className="register-container">
      {/* Painel Esquerdo com o Gradiente (Igual ao Login) */}
      <div className="left-panel">
        <div className="brand-container">
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito com o Formulário de Cadastro */}
      <div className="right-panel">
        <div className="register-card">
          <h2>Criar conta</h2>
          
          <form>
            <div className="form-group">
              <label htmlFor="fullName">Nome completo</label>
              <input 
                type="text" 
                id="fullName" 
                placeholder="Seu nome completo" 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seuemail@exemplo.com" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input 
                type="tel"
                id="phone" 
                placeholder="(00) 00000-0000" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Crie uma senha forte" 
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar senha</label>
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirme sua senha" 
              />
            </div>

            <button type="submit" className="register-button">
              Cadastrar
            </button>
          </form>

          <p className="login-link">
            Já tem uma conta? <Link to="/">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;