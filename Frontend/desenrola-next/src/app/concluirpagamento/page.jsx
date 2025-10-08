import React from 'react';
import styles from './Concluirpagamento.module.css';
import { FiCheck } from 'react-icons/fi';

const PaginaFinal = () => {

  const handleVoltar = () => {
    console.log("Voltando...");
  };

  return (
    // Container que ocupa a TELA CHEIA e centraliza o card
    <div className={styles.container}>
      
      {/* O card de sucesso */}
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