'use client';

import { useEffect, useState, useMemo } from 'react';
import styles from './Favoritos.module.css';
import { FaHeart } from 'react-icons/fa';
import { FiMessageSquare, FiUser, FiMapPin, FiHeart } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { FavoritesService } from '../../services/favoriteService';

export default function FavoritosPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [favoritedProviders, setFavoritedProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar todos os prestadores favoritados
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const favoriteIds = await FavoritesService.getAll();

      console.log("favoriteIds:", favoriteIds); // Verifique se os favoritos estão sendo retornados corretamente

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavoritedProviders([]);
        return;
      }

      // Não precisamos de getProvider, já temos os dados de favoritos
      setFavoritedProviders(favoriteIds);
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Filtros de especialidade
  const filterCategories = useMemo(() => {
    const categories = favoritedProviders.map(p => p.serviceName?.replace(' de Móveis', ''));
    return ['Todos', ...new Set(categories)];
  }, [favoritedProviders]);

  const filteredProviders = useMemo(() => {
    console.log("activeFilter:", activeFilter); // Verifique qual filtro está ativo
    if (activeFilter === 'Todos') return favoritedProviders;
    return favoritedProviders.filter(p => p.serviceName?.replace(' de Móveis', '') === activeFilter);
  }, [activeFilter, favoritedProviders]);

  // Remover favorito
  const handleFavoriteToggle = async (providerId, event) => {
    event.stopPropagation();
    try {
      await FavoritesService.remove(providerId);
      setFavoritedProviders(prev => prev.filter(p => p.id !== providerId));
    } catch (err) {
      console.error('Erro ao remover favorito:', err);
    }
  };

  // Estados de carregamento e vazio
  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Carregando seus favoritos...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!favoritedProviders.length) {
    return (
      <div className={styles.pageWrapper}>
        <Navbar />
        <main className={styles.mainContent}>
          <div className={styles.emptyState}>
            <FaHeart className={styles.emptyIcon} />
            <h2>Nenhum favorito ainda</h2>
            <p>Adicione prestadores à sua lista de favoritos para vê-los aqui.</p>
          </div>
        </main>
      </div>
    );
  }

  // Página principal
  return (
    <div className={styles.pageWrapper}>
      <Navbar />

      <main className={styles.mainContent}>
        {/* Cabeçalho */}
        <div className={styles.favoritesHeader}>
          <FaHeart className={styles.headerIcon} />
          <h1>Meus Favoritos</h1>
          <p>
            Aqui estão os prestadores que você mais gosta! Tenha acesso rápido aos profissionais de
            confiança e solicite serviços com facilidade.
          </p>
        </div>

        {/* Estatísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h2>{favoritedProviders.length}</h2>
            <p>Prestadores Favoritos</p>
          </div>
          <div className={styles.statCard}>
            <h2>--</h2>
            <p>Serviços Realizados</p>
          </div>
          <div className={styles.statCard}>
            <h2>--</h2>
            <p>Avaliação Média</p>
          </div>
        </div>

        {/* Lista */}
        <div className={styles.providersSection}>
          <div className={styles.providersHeader}>
            <h2>Prestadores</h2>
            <div className={styles.filterButtons}>
              {filterCategories.map(category => (
                <button
                  key={category}
                  className={`${styles.filterButton} ${
                    activeFilter === category ? styles.activeFilter : ''
                  }`}
                  onClick={() => setActiveFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.providersGrid}>
            {filteredProviders.map(prestador => (
              <div
                key={prestador.id}
                className={styles.providerCard}
                onClick={() => setSelectedProvider(prestador.id)}
              >
                {/* Cabeçalho */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar}>
                    <div className={styles.onlineIndicator}></div>
                  </div>

                  <div className={styles.cardInfo}>
                    <h3>{prestador.name}</h3>
                    <p>{prestador.serviceName || 'Sem serviço'}</p>
                  </div>

                  <FiHeart
                    className={`${styles.cardHeartIcon} ${styles.favoritedHeart}`}
                    onClick={e => handleFavoriteToggle(prestador.id, e)}
                  />
                </div>

                {/* Botões */}
                <div className={styles.cardButtons}>
                  <button className={styles.buttonPrimary}>
                    <FiMessageSquare /> Solicitar Serviço
                  </button>
                  <button className={styles.buttonSecondary}>
                    <FiUser /> Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
