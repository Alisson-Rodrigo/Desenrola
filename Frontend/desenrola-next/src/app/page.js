'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react'; // ícone da lupa

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
