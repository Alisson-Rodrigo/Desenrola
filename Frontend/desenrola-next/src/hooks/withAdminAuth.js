'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

/**
 * HOC para proteger rotas que exigem autenticação de administrador.
 * * - Verifica se existe um token no localStorage.
 * - Decodifica o token para verificar se o usuário tem a role 'Admin'.
 * - Redireciona para '/acesso-negado' se a verificação falhar.
 * - Exibe um estado de carregamento durante a verificação.
 */
const withAdminAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('auth_token');

      // 1. Verifica se o token existe
      if (!token) {
        router.replace('/acesso-negado');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        
        // 2. Verifica a role do usuário no token
        //    IMPORTANTE: Ajuste 'role' e 'Admin' para corresponder ao que seu backend envia no token JWT.
        //    Pode ser 'perfil', 'claim', etc.
        if (decodedToken.role !== 'Admin') {
          router.replace('/acesso-negado');
          return;
        }

        // 3. Se tudo estiver correto, permite a renderização da página
        setIsLoading(false);

      } catch (error) {
        // O token é inválido ou malformado
        console.error("Erro ao decodificar o token:", error);
        router.replace('/acesso-negado');
      }
    }, [router]);

    // Enquanto verifica, exibe uma tela de carregamento para evitar "piscar" a tela de admin
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Verificando permissões...</p>
        </div>
      );
    }

    // Se o usuário for um admin autenticado, renderiza o componente da página
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAdminAuth;