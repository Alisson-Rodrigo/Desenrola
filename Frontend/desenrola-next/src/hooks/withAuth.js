'use client';

import { useEffect, useState } from 'react';

/**
 * HOC para proteger páginas.
 * - Permite visualizar sempre.
 * - Passa `hasToken` para o componente, que decide o que renderizar.
 */
export function withAuth(Component) {
  return function ProtectedPage(props) {
    const [hasToken, setHasToken] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      setHasToken(!!token);
    }, []);

    return <Component {...props} hasToken={hasToken} />;
  };
}
