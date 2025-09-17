'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react'; // ícone da lupa

/**
Index - Página inicial do sistema.

mostra a tela principal onde o usuário pode buscar serviços ou prestadores.
Se o usuário não estiver logado, aparece uma sobreposição (overlay) pedindo para fazer login.

O que faz:
- Mostra o título e subtítulo da página inicial.
- Renderiza a Navbar no topo.
- Exibe uma barra de busca por categoria ou prestador.
  - Se o usuário não estiver logado, aparece o aviso de login.
  - Se estiver logado, pode digitar e buscar normalmente.
- Exibe um botão que leva o usuário para a página de login quando necessário.

Propriedades (Props):
- hasToken (boolean): indica se o usuário está autenticado.

Estados internos:
- showOverlay (boolean): controla a exibição da mensagem de login.

Hooks usados:
- useRouter: faz o redirecionamento para a tela de login.

Dependências:
- Navbar: componente de navegação.
- withAuth: HOC que adiciona informações de autenticação.
- Search (lucide-react): ícone de lupa usado no botão da busca.

*/

function HomePage({ hasToken }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showOverlay, setShowOverlay] = useState(false); // controla overlay

  const handleSearch = (e) => {
    e.preventDefault();

    if (!hasToken) {
      // só mostra a mensagem quando tentar interagir
      setShowOverlay(true);
      return;
    }

    console.log('Buscando categoria:', query);
    // futuramente: fetch(`/api/servicos?categoria=${query}`)
  };

  const handleInputChange = (e) => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }
    setQuery(e.target.value);
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />

      <section className="home-section">
        <h1 className="home-title">Encontre o serviço que você precisa</h1>
        <p className="home-subtitle">
          Conectando você aos melhores profissionais de Picos-PI com qualidade e confiança
        </p>

        {/* Barra de busca */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Buscar por categoria (Ex: elétrica, pintura...) ou prestador"
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>
      </section>

      {/* Overlay só aparece quando o usuário tenta interagir sem login */}
      {showOverlay && !hasToken && (
        <div className="login-overlay">
          <p>Você precisa estar logado para interagir.</p>
          <button onClick={() => router.push('/auth/login')}>
            Ir para Login
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth(HomePage);
