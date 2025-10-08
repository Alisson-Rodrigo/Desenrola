'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';
import styles from './HomePage.module.css';

import { 
  Search, 
  User,
  MapPin,
  Loader2,
  Sparkles,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Crown,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';

function HomePage({ hasToken }) {
  const router = useRouter();
  
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Categorias em destaque
  const featuredCategories = [
    { id: "Eletrica", name: "Elétrica", icon: "⚡" },
    { id: "Hidraulica", name: "Hidráulica", icon: "🔧" },
    { id: "Pintura", name: "Pintura", icon: "🎨" },
    { id: "Reformas", name: "Reformas", icon: "🏗️" },
    { id: "TI", name: "TI", icon: "💻" },
    { id: "Beleza", name: "Beleza", icon: "✨" },
    { id: "Limpeza", name: "Limpeza", icon: "🧹" },
    { id: "Jardinagem", name: "Jardinagem", icon: "🌱" }
  ];

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

  const requireAuth = (callback) => {
    if (!hasToken) {
      setShowOverlay(true);
      return;
    }
    callback();
  };

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
      return 'Data inválida';
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(price);

  // Buscar serviços em destaque (VIP e Master)
  const fetchFeaturedServices = async () => {
    setLoading(true);
    try {
      // TODO: Quando a API suportar filtro por plano, adicionar parâmetros
      const response = await fetch('http://localhost:5087/api/provider/services/paged?PageSize=6&OnlyActive=true', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const data = await response.json();
      
      if (data.items) {
        // Por enquanto pegamos os 6 primeiros, mas futuramente filtrar por plano VIP/Master
        setFeaturedServices(data.items);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços em destaque:', error);
      setFeaturedServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  // Função para retornar badge do plano (preparado para quando implementar)
  const getPlanBadge = (plan) => {
    // TODO: Quando a API retornar o plano do prestador
    switch(plan) {
      case 'MASTER':
        return <span className={styles.planBadgeMaster}><Crown size={14} /> Master</span>;
      case 'VIP':
        return <span className={styles.planBadgeVip}><Zap size={14} /> VIP</span>;
      default:
        return null;
    }
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

            {/* Search CTA */}
            <div className={styles.heroSearchCTA}>
              <button 
                onClick={() => router.push('/servicos/todos')}
                className={styles.heroSearchButton}
              >
                <Search size={20} />
                Buscar Serviços
              </button>
              
              <button 
                onClick={() => router.push('/servicos/todos')}
                className={styles.heroExploreButton}
              >
                Explorar Categorias
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Quick Stats */}
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <TrendingUp size={20} />
                <span><strong>1000+</strong> Serviços</span>
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
                onClick={() => router.push(`/servicos/todos?categoria=${category.id}`)}
                className={styles.categoryCard}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços em Destaque (VIP e Master) */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                <Award className={styles.sectionIcon} />
                Serviços em Destaque
              </h2>
              <p className={styles.sectionSubtitle}>
                Profissionais premium verificados e avaliados
              </p>
            </div>
            <button 
              onClick={() => router.push('/servicos/todos')}
              className={styles.seeAllButton}
            >
              Ver Todos
              <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className={styles.loadingState}>
              <Loader2 size={40} className={styles.loadingSpinner} />
              <p>Carregando serviços em destaque...</p>
            </div>
          ) : featuredServices.length > 0 ? (
            <div className={styles.featuredGrid}>
              {featuredServices.map((service) => (
                <article 
                  key={service.id} 
                  className={styles.featuredCard}
                  onClick={() => requireAuth(() => router.push(`/servicos/visualizar/${service.id}`))}
                >
                  {/* Badge do Plano - TODO: implementar quando API retornar o plano */}
                  <div className={styles.planBadgeWrapper}>
                    {/* {getPlanBadge(service.providerPlan)} */}
                    <span className={styles.planBadgeFeatured}>
                      <Star size={14} /> Destaque
                    </span>
                  </div>

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
                      {service.description.length > 120 
                        ? service.description.substring(0, 120) + '...' 
                        : service.description}
                    </p>

                    <div className={styles.cardMeta}>
                      {service.providerName && (
                        <button 
                          className={styles.cardProvider}
                          onClick={(e) => {
                            e.stopPropagation();
                            requireAuth(() => router.push(`perfil/prestador/${service.providerId}`));
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
          ) : (
            <div className={styles.emptyStateFeatured}>
              <Award size={48} />
              <p>Serviços em destaque estarão disponíveis em breve</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Pronto para encontrar o profissional ideal?</h2>
              <p className={styles.ctaDescription}>
                Explore nossa plataforma e conecte-se com especialistas qualificados
              </p>
              <button 
                onClick={() => router.push('/servicos/todos')}
                className={styles.ctaButton}
              >
                Explorar Todos os Serviços
                <ArrowRight size={20} />
              </button>
            </div>
            <div className={styles.ctaIllustration}>
              <Sparkles size={80} />
            </div>
          </div>
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

      <Footer />
    </div>
  );
}

export default withAuth(HomePage);