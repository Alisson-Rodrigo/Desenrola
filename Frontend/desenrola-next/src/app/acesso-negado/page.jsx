'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import styles from './AcessoNegado.module.css';

/**
 * Página exibida quando um usuário tenta acessar um recurso
 * sem a permissão necessária.
 */
const AcessoNegado = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ShieldAlert className={styles.icon} />

        <h1 className={styles.title}>
          Acesso Negado
        </h1>

        <p className={styles.message}>
          Você não tem as permissões necessárias para visualizar esta página. 
          Por favor, faça login com uma conta de administrador ou retorne para a página inicial.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.button}>
            <ArrowLeft size={18} />
            Voltar para a Página Inicial
          </Link>
          <Link href="/auth/login" className={`${styles.button} ${styles.buttonSecondary}`}>
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AcessoNegado;