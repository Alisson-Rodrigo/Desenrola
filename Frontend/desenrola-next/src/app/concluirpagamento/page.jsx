"use client";

import React, { useEffect, useState } from 'react';
import styles from './Concluirpagamento.module.css';
import { FiCheck } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const PaginaFinal = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const verificarAutenticacao = () => {
      // Opção 1: Verificar token no localStorage
      const token = localStorage.getItem('token');
      
      // Opção 2: Verificar múltiplos itens (token + user data)
      const userData = localStorage.getItem('userData');
      
      // Se não houver token OU dados do usuário, redireciona para login
      if (!token || !userData) {
        router.push('auth/login'); // Ajuste para sua rota de login
        return;
      }

      // Opcional: Validar se o token não está expirado
      try {
        const user = JSON.parse(userData);
        // Adicione validações adicionais se necessário
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao validar usuário:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verificarAutenticacao();
  }, [router]);

  const handleVoltar = () => {
    router.push('/');
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Não renderiza nada se não estiver autenticado (já redirecionou)
  if (!isAuthenticated) {
    return null;
  }

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