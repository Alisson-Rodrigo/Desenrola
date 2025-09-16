'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth(Component) {
  return function ProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (!token) router.replace('/auth/login');
    }, [router]);

    return <Component {...props} />;
  };
}
