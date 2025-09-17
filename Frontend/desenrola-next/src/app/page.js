'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { Search } from 'lucide-react'; // ícone da lupa

function HomePage() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Buscando categoria:', query);
    // Aqui você pode futuramente fazer fetch na API
    // fetch(`/api/servicos?categoria=${query}`)
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <section className="home-section">
        <h1 className="home-title">
          Encontre o serviço que você precisa
        </h1>
        <p className="home-subtitle">
          Conectando você aos melhores profissionais de Picos-PI com qualidade e confiança
        </p>

        {/* Barra de busca por categorias */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Buscar por categoria (Ex: elétrica, pintura...) Ou Prestador"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <Search size={20} />
          </button>
        </form>
      </section>
    </div>
  );
}

export default withAuth(HomePage);
