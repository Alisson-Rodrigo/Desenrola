"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Award, 
  Users, 
  CheckCircle,
  ChevronRight,
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';
import styles from './ProfilePage.module.css';
import Navbar from '../../../../components/Navbar';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('servicos');
  const [providerData, setProviderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeamento das categorias
  const categoriaMap = {
    0: { nome: "Elétrica", icon: "⚡" },
    1: { nome: "Hidráulica", icon: "🔧" },
    2: { nome: "Pintura", icon: "🎨" },
    3: { nome: "Jardinagem", icon: "🌱" },
    4: { nome: "Limpeza", icon: "🧽" },
    5: { nome: "Reformas e Construção", icon: "🏗️" },
    6: { nome: "Tecnologia da Informação (TI)", icon: "💻" },
    7: { nome: "Transporte e Mudanças", icon: "🚚" },
    8: { nome: "Beleza e Estética", icon: "💅" },
    9: { nome: "Educação e Aulas Particulares", icon: "📚" },
    10: { nome: "Saúde e Bem-estar", icon: "🏥" },
    11: { nome: "Serviços Automotivos", icon: "🚗" },
    12: { nome: "Marcenaria e Móveis Planejados", icon: "🪵" },
    13: { nome: "Serralheria", icon: "🔨" },
    14: { nome: "Climatização", icon: "❄️" },
    15: { nome: "Instalação de Eletrodomésticos", icon: "📺" },
    16: { nome: "Fotografia e Filmagem", icon: "📸" },
    17: { nome: "Eventos e Festas", icon: "🎉" },
    18: { nome: "Consultoria Financeira e Contábil", icon: "💰" },
    19: { nome: "Assistência Técnica", icon: "🔧" },
    20: { nome: "Design e Publicidade", icon: "🎯" },
    21: { nome: "Serviços Jurídicos", icon: "⚖️" },
    22: { nome: "Segurança", icon: "🛡️" },
    23: { nome: "Marketing Digital", icon: "📊" },
    24: { nome: "Consultoria Empresarial", icon: "📈" },
    25: { nome: "Tradução e Idiomas", icon: "🗣️" },
    26: { nome: "Serviços Domésticos Gerais", icon: "🏠" },
    27: { nome: "Manutenção Predial e Industrial", icon: "🏢" },
    28: { nome: "Pet Care", icon: "🐕" },
    29: { nome: "Culinária e Gastronomia", icon: "👨‍🍳" }
  };

  const categoriaStringMap = {
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

  // Buscar dados do provedor
  const fetchProviderData = async (providerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("auth_token");
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5087/api/provider/profile/specify?Id=${providerId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Acesso negado. Faça login novamente.');
        }
        throw new Error(`Erro ${response.status}: Provedor não encontrado`);
      }

      const data = await response.json();
      setProviderData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do provedor:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) {
      fetchProviderData(params.id);
    }
  }, [params?.id]);

  // Funções utilitárias
  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL'
  }).format(price);

  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
  };

  const getInitials = (name) => {
    if (!name) return 'UP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const tabs = [
    { key: 'servicos', label: 'Serviços Oferecidos', icon: Award },
    { key: 'avaliacoes', label: 'Avaliações dos Clientes', icon: Star },
    { key: 'portfolio', label: 'Galeria de Trabalhos', icon: Users }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`}
      />
    ));
  };

  const MetricCard = ({ value, label, colorClass = 'green' }) => (
    <div className={`${styles.metricCard} ${styles[colorClass]}`}>
      <div className={styles.metricCardValue}>{value}</div>
      <div className={styles.metricCardLabel}>{label}</div>
    </div>
  );

  const ServiceTag = ({ service }) => (
    <div className={styles.serviceTag}>
      <div className={styles.serviceName}>{service.title}</div>
      <div className={styles.serviceCategory}>
        {categoriaStringMap[service.category] || service.category}
      </div>
      <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
    </div>
  );

  // Estados de carregamento e erro
  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loadingContainer}>
          <Loader2 size={40} className={styles.loadingSpinner} />
          <p>Carregando perfil do profissional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorContainer}>
          <AlertCircle size={40} className={styles.errorIcon} />
          <h2>Provedor não encontrado</h2>
          <p>{error}</p>
          <button onClick={() => router.back()} className={styles.backButton}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!providerData) return null;

  // Mock data para avaliações e portfolio (já que não vem da API)
  const reviews = [
    {
      name: 'Ana ',
      rating: 5,
      date: '2 dias',
      comment: 'Excelente profissional! Resolveu meu problema de forma rápida e objetiva.'
    },
    {
      name: 'Carlos Henrique',
      rating: 5,
      date: '1 semana',
      comment: 'Trabalho impecável, muito atencioso aos detalhes e cumpriu todos os prazos.'
    }
  ];

  const portfolio = [
    { id: 1, title: 'Projeto Residencial', category: 'Elétrica' },
    { id: 2, title: 'Instalação Comercial', category: 'Hidráulica' }
  ];

  const ReviewCard = ({ review }) => (
    <div className={styles.reviewCard}>
      <div className={styles.reviewHeader}>
        <div className={styles.reviewUserInfo}>
          <div className={styles.reviewAvatar}>
            <span className={styles.reviewAvatarText}>
              {getInitials(review.name)}
            </span>
          </div>
          <div>
            <h4 className={styles.reviewUserName}>{review.name}</h4>
            <div className={styles.reviewMeta}>
              <div className={styles.starContainer}>
                {renderStars(review.rating)}
              </div>
              <span className={styles.reviewDate}>há {review.date}</span>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  );

  const PortfolioItem = ({ item }) => (
    <div className={styles.portfolioItem}>
      <div className={styles.portfolioIcon}>
        <Award className={styles.portfolioIconSvg} />
      </div>
      <h3 className={styles.portfolioTitle}>{item.title}</h3>
      <p className={styles.portfolioCategory}>{item.category}</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.maxWidth}>
        <div className={styles.mainGrid}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.profileSection}>
              <div className={styles.avatarContainer}>
                <span className={styles.avatarText}>{getInitials(providerData.userName)}</span>
              </div>
              <h2 className={styles.profileName}>{providerData.userName}</h2>
              <p className={styles.profileTitle}>
                {providerData.isVerified ? 'Profissional Verificado' : 'Profissional'}
              </p>
              <div className={styles.ratingContainer}>
                <div className={styles.starContainer}>
                  {renderStars(5)}
                </div>
                <span className={styles.ratingValue}>4.8</span>
              </div>
              <div className={styles.metricsGrid}>
                <div>
                  <div className={styles.metricValue}>{providerData.services?.length || 0}</div>
                  <div className={styles.metricLabel}>Serviços</div>
                </div>
                <div>
                  <div className={styles.metricValue}>98%</div>
                  <div className={styles.metricLabel}>Satisfação</div>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
         
              <button className={styles.outlineButton}>
                Enviar Mensagem
              </button>
            </div>

            <div className={styles.contactSection}>
              <h3 className={styles.contactTitle}>
                <Phone className={styles.contactIcon} />
                Informações de Contato
              </h3>
              <div className={styles.contactList}>
                {providerData.phoneNumber && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactText}>{formatPhone(providerData.phoneNumber)}</span>
                    <CheckCircle className={styles.checkIcon} />
                  </div>
                )}
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>
                    {providerData.isActive ? 'Ativo na plataforma' : 'Inativo'}
                  </span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>
                    {providerData.isVerified ? 'Perfil Verificado' : 'Perfil não verificado'}
                  </span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                {providerData.address && (
                  <div className={styles.contactItem}>
                    <span className={styles.contactText}>{providerData.address}</span>
                    <CheckCircle className={styles.checkIcon} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderContent}>
                <div className={styles.profileInfo}>
                  <h1>{providerData.userName}</h1>
                  <p className={styles.profileDescription}>
                    {providerData.description || 'Profissional qualificado pronto para atender suas necessidades.'}
                  </p>
                  <div className={styles.profileDetails}>
                    <div className={styles.detailItem}>
                      <MapPin className={styles.detailIcon} />
                      <span>{providerData.address || 'Picos, Piauí'}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <Clock className={styles.detailIcon} />
                      <span>Responde em até 2h</span>
                    </div>
                  </div>
                  <div className={styles.categoriesContainer}>
                    <h4>Especialidades:</h4>
                    <div className={styles.categoriesList}>
                      {providerData.categories?.map((catId, index) => (
                        <span key={index} className={styles.categoryChip}>
                          {categoriaMap[catId]?.icon} {categoriaMap[catId]?.nome || `Categoria ${catId}`}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.metricsContainer}>
                <MetricCard value="4.8" label="Avaliação Média" colorClass="green" />
                <MetricCard value={providerData.services?.length || 0} label="Serviços Oferecidos" colorClass="blue" />
                <MetricCard value="98%" label="Taxa de Satisfação" colorClass="purple" />
                <MetricCard value="2" label="Anos de Experiência" colorClass="orange" />
              </div>
            </div>

            <div className={styles.tabContainer}>
              <div className={styles.tabNavigation}>
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`${styles.tabButton} ${activeTab === key ? styles.active : styles.inactive}`}
                  >
                    <Icon className={styles.tabIcon} />
                    <span className={styles.tabLabel}>{label}</span>
                  </button>
                ))}
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'servicos' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Serviços Oferecidos</h2>
                      <div className={styles.tabCounter}>
                        {providerData.services?.length || 0} serviços
                      </div>
                    </div>
                    <div className={styles.servicesGrid}>
                      {providerData.services?.length > 0 ? (
                        providerData.services.map((service) => (
                          <ServiceTag key={service.id} service={service} />
                        ))
                      ) : (
                        <p>Nenhum serviço cadastrado ainda.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'avaliacoes' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Avaliações dos Clientes</h2>
                      <div className={styles.tabCounter}>
                        {reviews.length} avaliações
                      </div>
                    </div>
                    <div className={styles.reviewsList}>
                      {reviews.map((review, index) => (
                        <ReviewCard key={index} review={review} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Galeria de Trabalhos</h2>
                      <div className={styles.tabCounter}>
                        {portfolio.length} projetos
                      </div>
                    </div>
                    <div className={styles.portfolioGrid}>
                      {portfolio.map((item) => (
                        <PortfolioItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}