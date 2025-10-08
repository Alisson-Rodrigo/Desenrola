"use client";

import React from 'react';
import styles from './Concluirpagamento.module.css';
import { FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation'; // 1. Importe o useRouter

const PaginaFinal = () => {
  const router = useRouter(); // 2. Instancie o router

  const handleVoltar = () => {
    router.push('/'); // 3. Use o router para navegar para a página inicial
  };

  return (
    <div className={styles.container}>
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