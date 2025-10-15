'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
  Award,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Crown
} from 'lucide-react';

function HomePage({ hasToken }) {
  const router = useRouter();

  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [Cookies, setCookies] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Verificar role do usuário
  useEffect(() => {
    if (!hasToken) {
      setUserRole(null);
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      setUserRole(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserRole(String(decoded.role).toLowerCase());
    } catch {
      setUserRole(null);
    }
  }, [hasToken]);

  // Carregar js-cookie dinamicamente
  useEffect(() => {
    import('js-cookie').then((module) => {
      setCookies(module.default);
    });
  }, []);

  // Verificar se usuário já aceitou cookies
  useEffect(() => {
    if (!Cookies) return;

    const cookieConsent = Cookies.get('cookieConsent');

    if (!cookieConsent) {
      setShowCookieConsent(true);
    }
  }, [Cookies]);

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

  // Aceitar cookies
  const acceptCookies = () => {
    if (!Cookies) return;

    Cookies.set('cookieConsent', 'accepted', {
      expires: 365,
      path: '/',
      sameSite: 'strict'
    });
    setShowCookieConsent(false);

    Cookies.set('userPreferences', JSON.stringify({
      theme: 'light',
      language: 'pt-BR',
      notifications: true
    }), {
      expires: 365,
      path: '/'
    });
  };

  // Rejeitar cookies
  const rejectCookies = () => {
    if (!Cookies) return;

    Cookies.set('cookieConsent', 'rejected', {
      expires: 365,
      path: '/',
      sameSite: 'strict'
    });
    setShowCookieConsent(false);
  };

  // Buscar serviços em destaque
  const fetchFeaturedServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.desenrola.shop/api/provider/services/paged?PageSize=6&OnlyActive=true', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      const data = await response.json();

      if (data.items) {
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

  // Determinar se é prestador
  const isProvider = hasToken && (userRole === "2" || userRole === "provider");

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

      {/* Serviços em Destaque */}
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
                  <div className={styles.planBadgeWrapper}>
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
          ) : (
            <div className={styles.emptyStateFeatured}>
              <Award size={48} />
              <p>Serviços em destaque estarão disponíveis em breve</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção Torne-se Prestador ou Planos */}
      {isProvider ? (
        // Se for prestador, mostra banner de planos
        <section className={styles.plansSection}>
          <div className={styles.container}>
            <div className={styles.plansCard}>
              <div className={styles.plansContent}>
                <div className={styles.plansIcon}>
                  <Crown size={48} />
                </div>
                <h2 className={styles.plansTitle}>Potencialize seu Negócio</h2>
                <p className={styles.plansDescription}>
                  Assine um plano e destaque seus serviços para milhares de clientes em Picos-PI
                </p>
                
                <div className={styles.plansBenefits}>
                  <div className={styles.plansBenefit}>
                    <Star size={20} className={styles.plansBenefitIcon} />
                    <span>Serviços em destaque</span>
                  </div>
                  <div className={styles.plansBenefit}>
                    <TrendingUp size={20} className={styles.plansBenefitIcon} />
                    <span>Maior visibilidade</span>
                  </div>
                  <div className={styles.plansBenefit}>
                    <Award size={20} className={styles.plansBenefitIcon} />
                    <span>Badge de prestador premium</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/planos')}
                  className={styles.plansButton}
                >
                  <Crown size={20} />
                  Ver Planos Disponíveis
                  <ArrowRight size={20} />
                </button>

                <p className={styles.plansFooterText}>
                  Escolha o plano ideal para o crescimento do seu negócio
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Se não for prestador, mostra banner para se tornar prestador
        <section className={styles.becomeProviderSection}>
          <div className={styles.container}>
            <div className={styles.providerCard}>
              <div className={styles.providerContent}>
                <div className={styles.providerIcon}>
                  <Briefcase size={48} />
                </div>
                <h2 className={styles.providerTitle}>Seja um Prestador de Serviços</h2>
                <p className={styles.providerDescription}>
                  Cadastre seus serviços, alcance mais clientes e faça parte da maior plataforma de serviços de Picos-PI
                </p>
                
                <div className={styles.providerBenefits}>
                  <div className={styles.providerBenefit}>
                    <CheckCircle2 size={20} className={styles.benefitIcon} />
                    <span>Cadastro gratuito e rápido</span>
                  </div>
                  <div className={styles.providerBenefit}>
                    <CheckCircle2 size={20} className={styles.benefitIcon} />
                    <span>Controle total dos seus serviços</span>
                  </div>
                  <div className={styles.providerBenefit}>
                    <CheckCircle2 size={20} className={styles.benefitIcon} />
                    <span>Receba avaliações e construa reputação</span>
                  </div>
                  <div className={styles.providerBenefit}>
                    <CheckCircle2 size={20} className={styles.benefitIcon} />
                    <span>Conecte-se com clientes qualificados</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/finalizarcadastro')}
                  className={styles.providerButton}
                >
                  <Briefcase size={20} />
                  Tornar-me Prestador
                  <ArrowRight size={20} />
                </button>

                <p className={styles.providerFooterText}>
                  Junte-se a centenas de profissionais que já transformaram seus negócios
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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

      {/* Banner de Cookies */}
      {showCookieConsent && (
        <div className={styles.cookieBanner}>
          <div className={styles.cookieContent}>
            <div className={styles.cookieText}>
              <h4>🍪 Nós usamos cookies</h4>
              <p>
                Utilizamos cookies para melhorar sua experiência, personalizar conteúdo e analisar nosso tráfego.
                Ao clicar em &quot;Aceitar&quot;, você concorda com o uso de cookies.
              </p>
            </div>
            <div className={styles.cookieActions}>
              <button onClick={acceptCookies} className={styles.cookieAcceptButton}>
                Aceitar Cookies
              </button>
              <button onClick={rejectCookies} className={styles.cookieRejectButton}>
                Apenas Essenciais
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