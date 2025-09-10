import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import './RecoverPassword.css'; // Importa o CSS

function RecoverPassword() {
  return (
    <div className="recover-container">
      {/* Painel Esquerdo com o Gradiente */}
      <div className="left-panel">
        <div className="brand-container">
          <h1>Desenrola</h1>
          <p>Chegou em Picos? A gente desenrola pra você.</p>
        </div>
      </div>

      {/* Painel Direito com o Formulário */}
      <div className="right-panel">
        <div className="recover-card">
          <h2>Recuperar senha</h2>
          
          <form>
            <div className="form-group">
              <label htmlFor="email">E-mail cadastrado</label>
              <input 
                type="email" 
                id="email" 
                placeholder="seuemail@exemplo.com" 
              />
            </div>

            <button type="submit" className="recover-button">
              Enviar instruções
            </button>
          </form>

          <Link to="/" className="back-to-login">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;