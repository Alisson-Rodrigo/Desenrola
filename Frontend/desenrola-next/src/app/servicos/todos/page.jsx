'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../../../hooks/useDebounce';
import Navbar from '../../../components/Navbar';
import styles from './ServicosPage.module.css';

import { 
  Search, 
  ChevronLeft, 
  ChevronRight,
  User,
  MapPin,
  Loader2,
  X,
  Clock,
  ArrowRight,
  Grid3x3,
  List,
  SlidersHorizontal
} from 'lucide-react';

export default function ServicosPage() {
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [hasToken, setHasToken] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [filters, setFilters] = useState({
    onlyActive: true,
    category: ''
  });

  // Categorias mapeadas
  const categorias = {
    "Eletrica": "Elétrica",
    "Hidraulica": "Hidráulica", 
    "Pintura": "Pintura",
    "Jardinagem": "Jardinagem",
    "Limpeza": "Limpeza",
    "Reformas": "Reformas e Construção",
    "TI": "Tecnologia da Informação (TI)",
    "Transporte": "Transporte e Mudanças",
    "Beleza": "Beleza e Estética",
    "Educacao": "Educação e Aulas Particulares",
    "Saude": "Saúde e Bem-estar",
    "Automotivo": "Serviços Automotivos",
    "Marcenaria": "Marcenaria e Móveis Planejados",
    "Serralheria": "Serralheria",
    "Climatizacao": "Climatização",
    "InstalacaoEletrodomesticos": "Instalação de Eletrodomésticos",
    "Fotografia": "Fotografia e Filmagem",
    "Eventos": "Eventos e Festas",
    "ConsultoriaFinanceira": "Consultoria Financeira e Contábil",
    "AssistenciaTecnica": "Assistência Técnica",
    "DesignPublicidade": "Design e Publicidade",
    "Juridico": "Serviços Jurídicos",
    "Seguranca": "Segurança",
    "MarketingDigital": "Marketing Digital",
    "ConsultoriaEmpresarial": "Consultoria Empresarial",
    "TraducaoIdiomas": "Tradução e Idiomas",
    "ServicosDomesticos": "Serviços Domésticos Gerais",
    "ManutencaoPredial": "Manutenção Predial e Industrial",
    "PetCare": "Pet Care",
    "Gastronomia": "Culinária e Gastronomia"
  };

  // Verificar se tem token
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setHasToken(!!token);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const fetchServices = async (page = 1, searchTerm = '', onlyActive = true, category = '') => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        Page: page.toString(),
        PageSize: '20',
        OnlyActive: onlyActive.toString()
      });

      if (searchTerm.trim()) params.append('Search', searchTerm.trim());
      if (category) params.append('ServiceCategory', category);

      const response = await fetch(`https://api.desenrola.shop/api/provider/services/paged?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      
      if (data.items) {
        setServices(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1, debouncedQuery, filters.onlyActive, filters.category);
    setCurrentPage(1);
  }, [debouncedQuery, filters.onlyActive, filters.category]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchServices(newPage, debouncedQuery, filters.onlyActive, filters.category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchServices(1, debouncedQuery, filters.onlyActive, filters.category);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ onlyActive: true, category: '' });
    setQuery('');
    setCurrentPage(1);
    fetchServices(1, '', true, '');
  };

  const handleInputChange = (e) => setQuery(e.target.value);

  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(price);

  const requireAuth = (callback) => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }
    callback();
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    return (
      <div className={styles.pagination}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className={styles.paginationButton}>
          <ChevronLeft size={16} />
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => handlePageChange(1)} className={styles.paginationPageButton}>1</button>
            {startPage > 2 && <span className={styles.paginationEllipsis}>...</span>}
          </>
        )}

        {pages.map((page) => (
          <button key={page} onClick={() => handlePageChange(page)} className={`${styles.paginationPageButton} ${currentPage === page ? styles.paginationPageButtonActive : ''}`}>
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.paginationEllipsis}>...</span>}
            <button onClick={() => handlePageChange(totalPages)} className={styles.paginationPageButton}>{totalPages}</button>
          </>
        )}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className={styles.paginationButton}>
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.servicosPage}>
      <Navbar />

      {/* Header Section */}
      <section className={styles.headerSection}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>Explore Todos os Serviços</h1>
          <p className={styles.pageSubtitle}>Encontre o profissional ideal para o que você precisa</p>
          
          {/* Barra de busca */}
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Buscar por serviço, categoria ou profissional..."
              value={query}
              onChange={handleInputChange}
              className={styles.searchInput}
            />
            {loading && <Loader2 size={20} className={styles.spin} />}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <h2 className={styles.sectionTitle}>
                {query ? `Resultados para "${query}"` : filters.category ? `Categoria: ${categorias[filters.category]}` : 'Todos os Serviços'}
              </h2>
              {!loading && (
                <span className={styles.resultsCount}>
                  {totalItems} {totalItems === 1 ? 'serviço encontrado' : 'serviços encontrados'}
                </span>
              )}
            </div>

            <div className={styles.toolbarRight}>
              {/* View Mode Toggle */}
              <div className={styles.viewToggle}>
                <button onClick={() => setViewMode('grid')} className={`${styles.viewButton} ${viewMode === 'grid' ? styles.viewButtonActive : ''}`}>
                  <Grid3x3 size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}>
                  <List size={18} />
                </button>
              </div>

              {/* Filters Button */}
              <button onClick={() => setShowFilters(!showFilters)} className={styles.filterButton}>
                <SlidersHorizontal size={18} />
                Filtros
                {(!filters.onlyActive || filters.category) && (
                  <span className={styles.filterBadge}>•</span>
                )}
              </button>
            </div>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <div className={styles.filtersPanel}>
              <div className={styles.filtersPanelHeader}>
                <h3>Filtros</h3>
                <button onClick={() => setShowFilters(false)} className={styles.closeFiltersButton}>
                  <X size={20} />
                </button>
              </div>
              
              <div className={styles.filtersGrid}>
                <div className={styles.filterGroup}>
                  <label>Categoria</label>
                  <select 
                    value={filters.category} 
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className={styles.filterSelect}
                  >
                    <option value="">Todas as categorias</option>
                    {Object.entries(categorias).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.filterGroup}>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={filters.onlyActive}
                      onChange={(e) => setFilters({...filters, onlyActive: e.target.checked})}
                    />
                    Apenas serviços ativos
                  </label>
                </div>
              </div>

              <div className={styles.filtersActions}>
                <button onClick={clearFilters} className={styles.clearButton}>
                  Limpar Filtros
                </button>
                <button onClick={applyFilters} className={styles.applyButton}>
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}

          {/* Services Grid/List */}
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingCircle}>
                <Loader2 size={40} className={styles.loadingSpinner} />
              </div>
              <p>Carregando serviços...</p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className={viewMode === 'grid' ? styles.servicesGrid : styles.servicesList}>
                {services.map((service) => (
                  <article 
                    key={service.id} 
                    className={viewMode === 'grid' ? styles.serviceCard : styles.serviceListItem}
                    onClick={() => requireAuth(() => router.push(`/servicos/visualizar/${service.id}`))}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardContent}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardCategory}>
                          <MapPin size={14} />
                          {categorias[service.category] || service.category}
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
                          <button 
                            className={styles.cardProvider}
                            onClick={(e) => {
                              e.stopPropagation();
                              requireAuth(() => router.push(`/perfil/prestador/${service.providerId}`));
                            }}
                          >
                            <User size={14} />
                            {service.providerName}
                          </button>
                        )}
                        <div className={styles.cardDate}>
                          <Clock size={14} />
                          {formatDate(service.dateTime)}
                        </div>
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.cardPrice}>{formatPrice(service.price)}</div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            requireAuth(() => router.push(`/servicos/visualizar/${service.id}`));
                          }}
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
              <div className={styles.emptyStateIcon}><Search size={64} /></div>
              <h3>Nenhum serviço encontrado</h3>
              <p>Tente ajustar os filtros ou buscar por outros termos.</p>
              <button onClick={clearFilters} className={styles.emptyStateButton}>Limpar filtros</button>
            </div>
          )}
        </div>
      </section>

      {/* Overlay de Login */}
      {showOverlay && !hasToken && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <div className={styles.overlayIcon}><User size={48} /></div>
            <h3>Acesso Necessário</h3>
            <p>Faça login para visualizar os detalhes completos dos serviços e conectar-se com profissionais qualificados.</p>
            <div className={styles.overlayActions}>
              <button onClick={() => router.push('/auth/login')} className={styles.overlayLoginButton}>
                Fazer Login
              </button>
              <button onClick={() => setShowOverlay(false)} className={styles.overlayCancelButton}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}