'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
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
  X,
  Sparkles,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Grid3x3,
  List
} from 'lucide-react';

function HomePage({ hasToken }) {
  const router = useRouter();
  
  // Estados da busca e filtros
  const [query, setQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  
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

  // Categorias em destaque para quick filters
  const featuredCategories = [
    { id: 0, name: "Elétrica", icon: "⚡" },
    { id: 1, name: "Hidráulica", icon: "🔧" },
    { id: 2, name: "Pintura", icon: "🎨" },
    { id: 5, name: "Reformas", icon: "🏗️" },
    { id: 6, name: "TI", icon: "💻" },
    { id: 8, name: "Beleza", icon: "✨" }
  ];

  // ✅ Função para verificar expiração do token
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      return true;
    }
  };

  // Função para buscar serviços da API
  const fetchServices = async (page = 1, searchTerm = '', onlyActive = true, providerId = '') => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }

    const token = localStorage.getItem('auth_token');

    // ✅ Verificação de expiração do token
    if (!token || isTokenExpired(token)) {
      console.warn("Token expirado ou inválido. Redirecionando para login...");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setShowOverlay(true);
      return;
    }

    setLoading(true);
    
    try {
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

  const handleCategoryFilter = (categoryId) => {
    setQuery(categorias[categoryId]);
    setCurrentPage(1);
    fetchServices(1, categorias[categoryId], filters.onlyActive, filters.providerId);
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
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={styles.paginationButton}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

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

      {/* Hero Section Redesenhada */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <div className={styles.heroPattern}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.heroTextContent}>
            <div className={styles.heroBadge}>
              <Sparkles size={16} />
              <span>Plataforma Nº 1 em Picos-PI</span>
            </div>
            
            <h1 className={styles.heroTitle}>
              Encontre os <span className={styles.heroHighlight}>melhores profissionais</span> para seus projetos
            </h1>
            
            <p className={styles.heroDescription}>
              Conectamos você a especialistas qualificados em diversas áreas. 
              Qualidade garantida e preços justos.
            </p>

            {/* Barra de busca integrada ao hero */}
            <form onSubmit={handleSearch} className={styles.heroSearchForm}>
              <div className={styles.heroSearchWrapper}>
                <Search className={styles.heroSearchIcon} size={20} />
                <input
                  type="text"
                  placeholder="O que você precisa? Ex: eletricista, pintor..."
                  value={query}
                  onChange={handleInputChange}
                  className={styles.heroSearchInput}
                />
                <button 
                  type="submit" 
                  className={styles.heroSearchButton}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={20} className={styles.spin} />
                  ) : (
                    <>
                      Buscar
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <TrendingUp size={20} />
                <span><strong>{totalItems}+</strong> Serviços</span>
              </div>
              <div className={styles.heroStat}>
                <User size={20} />
                <span><strong>500+</strong> Profissionais</span>
              </div>
              <div className={styles.heroStat}>
                <Star size={20} />
                <span><strong>4.8</strong> Avaliação</span>
              </div>
            </div>
          </div>

          <div className={styles.heroImageSection}>
            <div className={styles.floatingCard}>
              <div className={styles.floatingCardIcon}>🎨</div>
              <span>Pintura</span>
            </div>
            <div className={styles.floatingCard2}>
              <div className={styles.floatingCardIcon}>⚡</div>
              <span>Elétrica</span>
            </div>
            <div className={styles.floatingCard3}>
              <div className={styles.floatingCardIcon}>🔧</div>
              <span>Hidráulica</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias em destaque */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <h2 className={styles.categoriesTitle}>Categorias Populares</h2>
          <div className={styles.categoriesGrid}>
            {featuredCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryFilter(category.id)}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <h2 className={styles.sectionTitle}>
                {query ? `Resultados para "${query}"` : 'Todos os Serviços'}
              </h2>
              {hasToken && !loading && (
                <span className={styles.resultsCount}>
                  {totalItems} serviços encontrados
                </span>
              )}
            </div>

            <div className={styles.toolbarRight}>
              {/* View Mode Toggle */}
              <div className={styles.viewToggle}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`${styles.viewButton} ${viewMode === 'grid' ? styles.viewButtonActive : ''}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={styles.filterButton}
              >
                <Filter size={18} />
                Filtros
                {(filters.providerId || !filters.onlyActive) && (
                  <span className={styles.filterBadge}>•</span>
                )}
              </button>
            </div>
          </div>

          {/* Filters Sidebar */}
          <div className={`${styles.filtersSidebar} ${showFilters ? styles.filtersSidebarOpen : ''}`}>
            <div className={styles.filtersSidebarHeader}>
              <h3>Filtros</h3>
              <button onClick={() => setShowFilters(false)} className={styles.closeFiltersButton}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.filtersSidebarContent}>
              <div className={styles.filterGroup}>
                <label>Status</label>
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
                <label>ID do Prestador</label>
                <input
                  type="text"
                  placeholder="Digite o ID"
                  value={filters.providerId}
                  onChange={(e) => setFilters(prev => ({ ...prev, providerId: e.target.value }))}
                  className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label>Itens por página</label>
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

              <div className={styles.filtersSidebarActions}>
                <button onClick={applyFilters} className={styles.applyButton}>
                  Aplicar Filtros
                </button>
                <button onClick={clearFilters} className={styles.clearButton}>
                  Limpar Tudo
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid/List */}
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingCircle}>
                <Loader2 size={40} className={styles.loadingSpinner} />
              </div>
              <p>Carregando serviços incríveis...</p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? styles.servicesGrid : styles.servicesList}>
                {services.map((service) => (
                  <article key={service.id} className={viewMode === 'grid' ? styles.serviceCard : styles.serviceListItem}>
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardCategory}>
                          <MapPin size={14} />
                          {categorias[service.category] || `Categoria ${service.category}`}
                        </div>
                        <div className={styles.cardStatus}>
                          {service.isActive ? (
                            <span className={styles.statusActive}>Disponível</span>
                          ) : (
                            <span className={styles.statusInactive}>Indisponível</span>
                          )}
                        </div>
                      </div>

                      <h3 className={styles.cardTitle}>{service.title}</h3>
                      
                      <p className={styles.cardDescription}>
                        {service.description.length > 150 
                          ? service.description.substring(0, 150) + '...' 
                          : service.description}
                      </p>

                      <div className={styles.cardMeta}>
                        {service.providerName && (
                          <div className={styles.cardProvider}>
                            <User size={14} />
                            {service.providerName}
                          </div>
                        )}
                        <div className={styles.cardDate}>
                          <Clock size={14} />
                          {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardPrice}>
                          {formatPrice(service.price)}
                        </div>
                        <button 
                          onClick={() => router.push(`/servicos/${service.id}`)}
                          className={styles.cardButton}
                        >
                          Ver Detalhes
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {renderPagination()}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <Search size={64} />
              </div>
              <h3>Nenhum serviço encontrado</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos.</p>
              <button onClick={clearFilters} className={styles.emptyStateButton}>
                Limpar filtros e tentar novamente
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Login Overlay */}
      {showOverlay && !hasToken && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayIcon}>
              <User size={48} />
            </div>
            <h3>Acesso Necessário</h3>
            <p>Faça login para explorar todos os serviços disponíveis e conectar-se com profissionais qualificados.</p>
            <div className={styles.overlayActions}>
              <button
                onClick={() => router.push('/auth/login')}
                className={styles.overlayLoginButton}
              >
                Fazer Login
              </button>
              <button
                onClick={() => setShowOverlay(false)}
                className={styles.overlayCancelButton}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAuth(HomePage);