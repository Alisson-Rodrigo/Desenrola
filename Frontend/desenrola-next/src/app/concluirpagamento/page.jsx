import React from 'react';
import styles from './Concluirpagamento.module.css'; // Estilos específicos para este componente (CSS Modules)
import { FiCheck } from 'react-icons/fi'; // Ícone de check da biblioteca Feather Icons

const PaginaFinal = () => {

  // Função placeholder para a navegação. Em um app real, aqui entraria a lógica do React Router.
  const handleVoltar = () => {
    console.log("Voltando...");
  };

  return (
    // Container principal que usa flexbox para centralizar o card na tela inteira.
    <div className={styles.container}>
      
      {/* O card de sucesso que agrupa o conteúdo */}
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FiCheck className={styles.icon} />
        </div>

        <h1 className={styles.title}>
          Pagamento Realizado com Sucesso!
        </h1>

        <p className={styles.subtitle}>
          Sua transação foi processada e sua assinatura está ativa.
        </p>

        <button
          className={styles.button}
          onClick={handleVoltar}
        >
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

export default PaginaFinal;