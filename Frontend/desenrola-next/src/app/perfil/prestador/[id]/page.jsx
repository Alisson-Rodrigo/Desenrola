"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star, Phone, MapPin, Award, CheckCircle,
  Clock, Loader2, AlertCircle
} from 'lucide-react';
import styles from './ProfilePage.module.css';
import Navbar from '../../../../components/Navbar';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('servicos');
  const [providerData, setProviderData] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ================================
  // MAPAS AUXILIARES
  // ================================
  const daysOfWeek = {
    0: 'Domingo', 1: 'Segunda-feira', 2: 'Terça-feira',
    3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado'
  };

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

  // ================================
  // FUNÇÕES DE BUSCA
  // ================================
  const fetchProviderData = async (providerId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:5087/api/provider/profile/specify?Id=${providerId}`, { method: 'GET', headers });
      if (!response.ok) throw new Error(`Erro ${response.status}: Provedor não encontrado`);

      const data = await response.json();
      setProviderData(data);
    } catch (err) {
      console.error('Erro ao buscar dados do provedor:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async (providerId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:5087/api/schedule/provider/${providerId}`, { method: 'GET', headers });
      const scheduleData = response.ok ? await response.json() : [];
      setScheduleData(scheduleData);
    } catch (err) {
      console.error('Erro ao buscar horários de trabalho:', err);
      setScheduleData([]);
    }
  };

  const fetchReviews = async (providerId) => {
  try {
    const token = localStorage.getItem("auth_token"); // pega o token salvo
    const headers = {
      "Content-Type": "application/json"
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`http://localhost:5087/api/evaluation/provider/${providerId}`, {
      method: "GET",
      headers
    });

    if (response.ok) {
      const data = await response.json();
      console.log("📥 Avaliações recebidas:", data); // debug
      setReviews(data);
    } else {
      console.warn("⚠️ Erro ao buscar avaliações:", response.status);
      setReviews([]);
    }
  } catch (err) {
    console.error("❌ Erro ao buscar avaliações:", err);
    setReviews([]);
  }
};



  useEffect(() => {
    if (params?.id) {
      fetchProviderData(params.id);
      fetchScheduleData(params.id);
      fetchReviews(params.id);
    }
  }, [params?.id]);

  // ================================
  // FUNÇÕES AUXILIARES
  // ================================
  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const formatPhone = (phone) => phone?.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') || '';
  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'UP';
  const formatTime = (time) => time?.slice(0, 5) || '';

  const tabs = [
    { key: 'servicos', label: 'Serviços Oferecidos', icon: Award },
    { key: 'avaliacoes', label: 'Avaliações dos Clientes', icon: Star },
    { key: 'horarios', label: 'Horários de Trabalho', icon: Clock }
  ];

  const renderStars = (rating) => (
    [...Array(5)].map((_, i) => (
      <Star key={i} className={`${styles.star} ${i < rating ? styles.starFilled : styles.starEmpty}`} />
    ))
  );

  // ================================
  // SUB-COMPONENTES
  // ================================
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
        {service.category}
      </div>
      <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
    </div>
  );

  const ScheduleItem = ({ schedule }) => (
    <div className={styles.scheduleItem}>
      <div className={styles.scheduleDay}>
        <span className={styles.scheduleDayName}>{daysOfWeek[schedule.dayOfWeek]}</span>
      </div>
      <div className={styles.scheduleTime}>
        {schedule.isAvailable
          ? <span className={styles.scheduleAvailable}>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
          : <span className={styles.scheduleUnavailable}>Indisponível</span>}
      </div>
      <div className={styles.scheduleStatus}>
        {schedule.isAvailable
          ? <CheckCircle className={styles.availableIcon} />
          : <AlertCircle className={styles.unavailableIcon} />}
      </div>
    </div>
  );

  const ReviewCard = ({ review, providerName }) => (
  <div className={styles.reviewCard}>
    <div className={styles.reviewHeader}>
      <div className={styles.reviewUserInfo}>
        <div className={styles.reviewAvatar}>
          {review.userImage ? (
            <img src={review.userImage} alt={review.userName} className={styles.reviewAvatarImg} />
          ) : (
            <span className={styles.reviewAvatarText}>
              {getInitials(review.userName)}
            </span>
          )}
        </div>
        <div>
          <h4 className={styles.reviewUserName}>{review.userName}</h4>
          <p className={styles.reviewProviderName}>Avaliado: {providerName}</p> {/* <- Novo */}
          <div className={styles.reviewMeta}>
            <div className={styles.starContainer}>
              {renderStars(review.note)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <p className={styles.reviewComment}>{review.comment}</p>
  </div>
);




  // ================================
  // RENDERIZAÇÃO
  // ================================
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

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.maxWidth}>
        <div className={styles.mainGrid}>
          {/* ========== SIDEBAR ========== */}
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
                <div className={styles.starContainer}>{renderStars(5)}</div>
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
              <button className={styles.outlineButton}>Enviar Mensagem</button>
              <button
                className={styles.primaryButton}
                onClick={() => router.push(`/servicos/avaliar?providerId=${params.id}`)}
              >
                <Star className={styles.buttonIcon} />
                Avaliar Prestador
              </button>
            </div>

            <div className={styles.contactSection}>
              <h3 className={styles.contactTitle}>
                <Phone className={styles.contactIcon} /> Informações de Contato
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

          {/* ========== MAIN CONTENT ========== */}
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

            {/* ========== TABS ========== */}
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
                {/* Serviços */}
                {activeTab === 'servicos' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Serviços Oferecidos</h2>
                      <div className={styles.tabCounter}>{providerData.services?.length || 0} serviços</div>
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

                {/* Avaliações */}
                {activeTab === 'avaliacoes' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Avaliações dos Clientes</h2>
                      <div className={styles.tabCounter}>{reviews.length} avaliações</div>
                    </div>
                    <div className={styles.reviewsList}>
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <ReviewCard
                            key={index}
                            review={review}
                            providerName={providerData.userName} // <-- aqui passa o nome do prestador
                          />
                        ))
                      ) : (
                        <p>Nenhuma avaliação encontrada.</p>
                      )}
                    </div>
                  </div>
                )}


                {/* Horários */}
                {activeTab === 'horarios' && (
                  <div>
                    <div className={styles.tabHeader}>
                      <h2 className={styles.tabTitle}>Horários de Trabalho</h2>
                      <div className={styles.tabCounter}>{scheduleData.length} dias configurados</div>
                    </div>
                    <div className={styles.scheduleList}>
                      {scheduleData.length > 0 ? (
                        scheduleData
                          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                          .map((schedule) => <ScheduleItem key={schedule.id} schedule={schedule} />)
                      ) : (
                        <div className={styles.noSchedule}>
                          <Clock size={48} className={styles.noScheduleIcon} />
                          <p>Horários de trabalho não configurados ainda.</p>
                        </div>
                      )}
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
