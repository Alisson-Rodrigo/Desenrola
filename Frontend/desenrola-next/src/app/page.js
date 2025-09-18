'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';

import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  User,
  Calendar,
  MapPin,
  Loader2,
  X
} from 'lucide-react';

function HomePage({ hasToken }) {
  const router = useRouter();
  
  // Estados da busca e filtros
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados da paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Estados dos filtros
  const [filters, setFilters] = useState({
    search: '',
    onlyActive: true,
    providerId: ''
  });

  // Categorias para o filtro
  const categorias = {
    0: "Elétrica",
    1: "Hidráulica", 
    2: "Pintura",
    3: "Jardinagem",
    4: "Limpeza",
    5: "Reformas",
    6: "TI",
    7: "Transporte",
    8: "Beleza",
    9: "Educação",
    10: "Saúde",
    11: "Automotivo",
    12: "Marcenaria",
    13: "Serralheria",
    14: "Climatização",
    15: "Instalação Eletrodomésticos",
    16: "Fotografia",
    17: "Eventos",
    18: "Consultoria Financeira",
    19: "Assistência Técnica",
    20: "Design e Publicidade",
    21: "Jurídico",
    22: "Segurança",
    23: "Marketing Digital",
    24: "Consultoria Empresarial",
    25: "Tradução e Idiomas",
    26: "Serviços Domésticos",
    27: "Manutenção Predial",
    28: "Pet Care",
    29: "Gastronomia"
  };

  // Função para buscar serviços da API
  const fetchServices = async (page = 1, searchTerm = '', onlyActive = true, providerId = '') => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams({
        Page: page.toString(),
        PageSize: pageSize.toString(),
        OnlyActive: onlyActive.toString()
      });

      if (searchTerm.trim()) {
        params.append('Search', searchTerm.trim());
      }
      
      if (providerId.trim()) {
        params.append('ProviderId', providerId.trim());
      }

      const response = await fetch(`http://localhost:5087/api/provider/services/paged?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);
      
      if (data.items) {
        setServices(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalCount || 0);
      } else if (Array.isArray(data)) {
        setServices(data);
        setTotalPages(1);
        setTotalItems(data.length);
      } else {
        setServices([]);
        setTotalPages(1);
        setTotalItems(0);
      }

    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      setServices([]);
      alert(`Erro ao carregar serviços: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasToken) {
      fetchServices(1, filters.search, filters.onlyActive, filters.providerId);
    }
  }, [hasToken, pageSize]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }

    setCurrentPage(1);
    fetchServices(1, query, filters.onlyActive, filters.providerId);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchServices(newPage, query, filters.onlyActive, filters.providerId);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchServices(1, query, filters.onlyActive, filters.providerId);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      onlyActive: true,
      providerId: ''
    });
    setQuery('');
    setCurrentPage(1);
    fetchServices(1, '', true, '');
  };

  const handleInputChange = (e) => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }
    setQuery(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para renderizar paginação
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className={styles.pagination}>
        {/* Botão Anterior */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={styles.paginationButton}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Primeira página */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={styles.paginationPageButton}
              disabled={loading}
            >
              1
            </button>
            {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
          </>
        )}

        {/* Páginas visíveis */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${styles.paginationPageButton} ${
              currentPage === page ? styles.paginationPageButtonActive : ''
            }`}
            disabled={loading}
          >
            {page}
          </button>
        ))}

        {/* Última página */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={styles.paginationPageButton}
              disabled={loading}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botão Próximo */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={styles.paginationButton}
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.homePage}>
      <Navbar />

      <section className={styles.container}>
        {/* Cabeçalho */}
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            Encontre o serviço que você precisa
          </h1>
          <p className={styles.pageSubtitle}>
            Conectando você aos melhores profissionais de Picos-PI com qualidade e confiança
          </p>
        </div>

        {/* Barra de busca e filtros */}
        <div className={styles.searchSection}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Buscar serviços (Ex: elétrica, pintura...) ou prestador"
                value={query}
                onChange={handleInputChange}
                className={styles.searchInput}
              />
              <button 
                type="submit" 
                className={styles.searchButton}
                disabled={loading}
              >
                {loading ? <Loader2 size={20} className={styles.spin} /> : <Search size={20} />}
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filtersToggle}
            >
              <Filter size={20} />
              Filtros
            </button>
          </form>

          {/* Painel de filtros */}
          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filtersPanelHeader}>
                <h3 className={styles.filtersPanelTitle}>Filtros de Busca</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className={styles.closePanelButton}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.filtersGrid}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Apenas Ativos</label>
                  <select
                    value={filters.onlyActive}
                    onChange={(e) => setFilters(prev => ({ ...prev, onlyActive: e.target.value === 'true' }))}
                    className={styles.filterSelect}
                  >
                    <option value="true">Apenas Ativos</option>
                    <option value="false">Todos</option>
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>ID do Prestador</label>
                  <input
                    type="text"
                    placeholder="ID do prestador"
                    value={filters.providerId}
                    onChange={(e) => setFilters(prev => ({ ...prev, providerId: e.target.value }))}
                    className={styles.filterInput}
                  />
                </div>

                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Itens por página</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className={styles.filterSelect}
                  >
                    <option value="6">6 itens</option>
                    <option value="12">12 itens</option>
                    <option value="24">24 itens</option>
                    <option value="48">48 itens</option>
                  </select>
                </div>
              </div>

              <div className={styles.filtersActions}>
                <button
                  onClick={applyFilters}
                  className={styles.applyFiltersButton}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={16} className={styles.spin} /> : <Search size={16} />}
                  Aplicar Filtros
                </button>
                <button
                  onClick={clearFilters}
                  className={styles.clearFiltersButton}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Informações dos resultados */}
          {hasToken && !loading && (
            <div className={styles.resultsInfo}>
              <span>Mostrando {services.length} de {totalItems} serviços</span>
              <span>Página {currentPage} de {totalPages}</span>
            </div>
          )}
        </div>

        {/* Lista de serviços */}
        <div className={styles.servicesSection}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <Loader2 size={32} className={styles.loadingSpinner} />
              <span className={styles.loadingText}>Carregando serviços...</span>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className={styles.servicesGrid}>
                {services.map((service) => (
                  <div key={service.id} className={styles.serviceCard}>
                    <div className={styles.serviceCardHeader}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <span className={styles.servicePrice}>
                        {formatPrice(service.price)}
                      </span>
                    </div>

                    <div className={styles.serviceCategory}>
                      <MapPin size={16} />
                      <span className={styles.serviceCategoryText}>
                        {categorias[service.category] || `Categoria ${service.category}`}
                      </span>
                    </div>

                    <p className={styles.serviceDescription}>{service.description}</p>

                    {service.providerName && (
                      <div className={styles.serviceProvider}>
                        <User size={16} />
                        <span className={styles.serviceProviderText}>
                          {service.providerName}
                        </span>
                      </div>
                    )}

                    <div className={styles.serviceDate}>
                      <Calendar size={16} />
                      <span className={styles.serviceDateText}>
                        {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <div className={styles.serviceFooter}>
                      <span className={`${styles.serviceStatus} ${service.isActive ? styles.serviceStatusActive : styles.serviceStatusInactive}`}>
                        {service.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                      <button 
                        onClick={() => router.push(`/servicos/${service.id}`)}
                        className={styles.serviceDetailsButton}
                      >
                        <Eye size={16} /> Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Paginação - CORRIGIDO */}
              {renderPagination()}
            </>
          ) : (
            <div className={styles.emptyState}>
              <Search size={48} className={styles.emptyStateIcon} />
              <h3 className={styles.emptyStateTitle}>Nenhum serviço encontrado</h3>
              <p className={styles.emptyStateText}>
                Tente ajustar os filtros ou buscar por outros termos.
              </p>
              <button
                onClick={clearFilters}
                className={styles.emptyStateButton}
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Overlay de login */}
      {showOverlay && !hasToken && (
        <div className={styles.loginOverlay}>
          <div className={styles.loginModal}>
            <h3 className={styles.loginModalTitle}>Login Necessário</h3>
            <p className={styles.loginModalText}>
              Você precisa estar logado para buscar e visualizar serviços.
            </p>
            <div className={styles.loginModalActions}>
              <button
                onClick={() => router.push('/auth/login')}
                className={styles.loginButton}
              >
                Fazer Login
              </button>
              <button
                onClick={() => setShowOverlay(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(HomePage);