'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import { useDebounce } from '../hooks/useDebounce';
import styles from './HomePage.module.css';

import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  User,
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
  const debouncedQuery = useDebounce(query, 500); // pesquisa em tempo real
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    onlyActive: true,
    providerId: ''
  });

  // Categorias mapeadas para string (como retorna a API)
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

  // Categorias em destaque
  const featuredCategories = [
    { id: "Eletrica", name: "Elétrica", icon: "⚡" },
    { id: "Hidraulica", name: "Hidráulica", icon: "🔧" },
    { id: "Pintura", name: "Pintura", icon: "🎨" },
    { id: "Reformas", name: "Reformas", icon: "🏗️" },
    { id: "TI", name: "TI", icon: "💻" },
    { id: "Beleza", name: "Beleza", icon: "✨" }
  ];

  // Buscar serviços
  const fetchServices = async (page = 1, searchTerm = '', onlyActive = true, providerId = '') => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        Page: page.toString(),
        PageSize: pageSize.toString(),
        OnlyActive: onlyActive.toString()
      });

      if (searchTerm.trim()) params.append('Search', searchTerm.trim());
      if (providerId.trim()) params.append('ProviderId', providerId.trim());

      const response = await fetch(`http://localhost:5087/api/provider/services/paged?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);

      const data = await response.json();
      
      if (data.items) {
        setServices(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0); // Corrigido: usar totalItems da resposta da API
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

  // Pesquisa em tempo real
  useEffect(() => {
    fetchServices(1, debouncedQuery, filters.onlyActive, filters.providerId);
    setCurrentPage(1);
  }, [debouncedQuery, pageSize, filters.onlyActive, filters.providerId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchServices(newPage, debouncedQuery, filters.onlyActive, filters.providerId);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchServices(1, debouncedQuery, filters.onlyActive, filters.providerId);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({ search: '', onlyActive: true, providerId: '' });
    setQuery('');
    setCurrentPage(1);
    fetchServices(1, '', true, '');
  };

  const handleInputChange = (e) => setQuery(e.target.value);

  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(price);

  const handleCategoryFilter = (categoryId) => {
    setQuery(categorias[categoryId]);
    setCurrentPage(1);
    fetchServices(1, categorias[categoryId], filters.onlyActive, filters.providerId);
  };

  // Paginação
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
    <div className={styles.homePage}>
      <Navbar />

      {/* Hero Section */}
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

            {/* Barra de busca em tempo real */}
            <div className={styles.heroSearchWrapper}>
              <Search className={styles.heroSearchIcon} size={20} />
              <input
                type="text"
                placeholder="O que você precisa? Ex: eletricista, pintor..."
                value={query}
                onChange={handleInputChange}
                className={styles.heroSearchInput}
              />
              {loading && <Loader2 size={20} className={styles.spin} />}
            </div>

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

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          {/* Toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <h2 className={styles.sectionTitle}>
                {query ? `Resultados para "${query}"` : 'Todos os Serviços'}
              </h2>
              {!loading && (
                <span className={styles.resultsCount}>
                  {totalItems} serviços encontrados
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
                <Filter size={18} />
                Filtros
                {(filters.providerId || !filters.onlyActive) && (
                  <span className={styles.filterBadge}>•</span>
                )}
              </button>
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
                        <div className={styles.cardPrice}>{formatPrice(service.price)}</div>
                        <button 
                          onClick={() => {
                            if (!hasToken) {
                              setShowOverlay(true);
                            } else {
                              router.push(`/servicos/${service.id}`);
                            }
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
              <button onClick={clearFilters} className={styles.emptyStateButton}>Limpar filtros e tentar novamente</button>
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
            <p>Faça login para explorar os detalhes dos serviços e conectar-se com profissionais qualificados.</p>
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

export default withAuth(HomePage);