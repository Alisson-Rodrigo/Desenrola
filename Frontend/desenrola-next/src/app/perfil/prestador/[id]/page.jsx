'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Star, Phone, MapPin, Award, CheckCircle,
  Clock, Loader2, AlertCircle, X
} from 'lucide-react';
import styles from './ProfilePage.module.css';
import Navbar from '../../../../components/Navbar';

// ========================================================================
// COMPONENTES AUXILIARES MEMOIZADOS (Definidos fora do componente principal)
// ========================================================================

/**
 * Um componente de textarea memoizado para evitar re-renderizações desnecessárias.
 * @param {object} props - As props do componente.
 * @param {string} props.value - O valor atual do textarea.
 * @param {function} props.onChange - A função de callback para o evento onChange.
 * @returns {React.ReactElement} O elemento textarea.
 */
const CommentTextarea = React.memo(({ value, onChange, ...props }) => {
  return <textarea value={value} onChange={onChange} {...props} />;
});
CommentTextarea.displayName = 'CommentTextarea';

/**
 * Um card para exibir uma métrica chave no perfil.
 * @param {object} props - As props do componente.
 * @param {string|number} props.value - O valor da métrica.
 * @param {string} props.label - O rótulo da métrica.
 * @param {string} [props.colorClass='green'] - A classe de cor para o card.
 * @returns {React.ReactElement} O componente do card de métrica.
 */
const MetricCard = React.memo(({ value, label, colorClass = 'green' }) => (
  <div className={`${styles.metricCard} ${styles[colorClass]}`}>
    <div className={styles.metricCardValue}>{value}</div>
    <div className={styles.metricCardLabel}>{label}</div>
  </div>
));
MetricCard.displayName = 'MetricCard';

/**
 * Um componente de tag para exibir informações de um serviço oferecido.
 * @param {object} props - As props do componente.
 * @param {object} props.service - O objeto do serviço a ser exibido.
 * @param {function} props.formatPrice - Função para formatar o preço do serviço.
 * @returns {React.ReactElement} O componente da tag de serviço.
 */
const ServiceTag = React.memo(({ service, formatPrice }) => (
  <div className={styles.serviceTag}>
    <div className={styles.serviceName}>{service.title}</div>
    <div className={styles.serviceCategory}>{service.category}</div>
    <div className={styles.servicePrice}>{formatPrice(service.price)}</div>
  </div>
));
ServiceTag.displayName = 'ServiceTag';

/**
 * Um item da lista para exibir um dia e horário de trabalho.
 * @param {object} props - As props do componente.
 * @param {object} props.schedule - O objeto de horário de trabalho.
 * @param {object} props.daysOfWeek - Mapa de dias da semana.
 * @param {function} props.formatTime - Função para formatar a hora.
 * @returns {React.ReactElement} O componente do item de horário.
 */
const ScheduleItem = React.memo(({ schedule, daysOfWeek, formatTime }) => (
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
));
ScheduleItem.displayName = 'ScheduleItem';

/**
 * Um card para exibir uma avaliação de cliente.
 * @param {object} props - As props do componente.
 * @param {object} props.review - O objeto da avaliação.
 * @param {string} props.providerName - O nome do prestador avaliado.
 * @param {function} props.getInitials - Função para obter as iniciais do nome do usuário.
 * @param {function} props.renderStars - Função para renderizar as estrelas da avaliação.
 * @returns {React.ReactElement} O componente do card de avaliação.
 */
const ReviewCard = React.memo(({ review, providerName, getInitials, renderStars }) => (
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
          <p className={styles.reviewProviderName}>Avaliado: {providerName}</p>
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
));
ReviewCard.displayName = 'ReviewCard';

/**
 * Componente do modal para submeter uma nova avaliação.
 * @param {object} props - As props do componente.
 * @param {boolean} props.show - Controla a visibilidade do modal.
 * @param {string} props.providerName - Nome do prestador a ser avaliado.
 * @param {function} props.onClose - Função para fechar o modal.
 * @param {function} props.onSubmit - Função para submeter o formulário de avaliação.
 * @param {number} props.rating - A nota (número de estrelas) atual.
 * @param {string} props.comment - O texto do comentário.
 * @param {function} props.onCommentChange - Handler para a mudança no textarea do comentário.
 * @param {function} props.renderInteractiveStars - Função que renderiza as estrelas interativas.
 * @param {string} props.ratingText - Texto descritivo da nota atual.
 * @param {boolean} props.modalLoading - Estado de carregamento do envio do formulário.
 * @returns {React.ReactElement | null} O componente do modal de avaliação ou nulo se não estiver visível.
 */
const EvaluationModal = React.memo(({
  show, providerName, onClose, onSubmit, rating, comment, onCommentChange,
  renderInteractiveStars, ratingText, modalLoading
}) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Avaliar {providerName}</h3>
          <button onClick={onClose} className={styles.closeButton} type="button">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className={styles.modalForm}>
          <div className={styles.ratingSection}>
            <label className={styles.modalLabel}>Sua avaliação:</label>
            {renderInteractiveStars()}
            <p className={styles.ratingText}>{ratingText}</p>
          </div>
          <div className={styles.commentSection}>
            <label htmlFor="comment" className={styles.modalLabel}>
              Comentário (opcional):
            </label>
            <CommentTextarea
              id="comment"
              value={comment}
              onChange={onCommentChange}
              placeholder="Conte como foi sua experiência com este profissional..."
              className={styles.commentTextarea}
              rows={4}
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={modalLoading}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={modalLoading || rating === 0}>
              {modalLoading ? (
                <><Loader2 size={16} className={styles.loadingIcon} />Enviando...</>
              ) : (
                'Enviar Avaliação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
EvaluationModal.displayName = 'EvaluationModal';


/**
 * Componente principal da página de perfil de um prestador de serviço.
 * Exibe informações, serviços, avaliações e horários de trabalho do prestador.
 * @returns {React.ReactElement} A página de perfil completa.
 */
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  // Estados do Componente
  const [activeTab, setActiveTab] = useState('servicos'); // Controla a aba ativa ('servicos', 'avaliacoes', 'horarios').
  const [providerData, setProviderData] = useState(null); // Armazena os dados do perfil do prestador.
  const [scheduleData, setScheduleData] = useState([]); // Armazena os horários de trabalho do prestador.
  const [reviews, setReviews] = useState([]); // Armazena as avaliações recebidas pelo prestador.
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento inicial da página.
  const [error, setError] = useState(null); // Armazena mensagens de erro, caso ocorram.

  // Estados do Modal de Avaliação
  const [showModal, setShowModal] = useState(false); // Controla a visibilidade do modal de avaliação.
  const [modalLoading, setModalLoading] = useState(false); // Controla o estado de carregamento do envio da avaliação.
  const [rating, setRating] = useState(0); // Armazena a nota (estrelas) da avaliação.
  const [comment, setComment] = useState(''); // Armazena o comentário da avaliação.
  const [hoverRating, setHoverRating] = useState(0); // Controla o efeito de hover nas estrelas de avaliação.

  /**
   * Mapa memoizado para nomes e ícones de categorias de serviço.
   * Evita a recriação deste objeto a cada renderização.
   */
  const categoriaMap = useMemo(() => ({
    0: { nome: "Elétrica", icon: "⚡" }, 1: { nome: "Hidráulica", icon: "🔧" }, 2: { nome: "Pintura", icon: "🎨" },
    3: { nome: "Jardinagem", icon: "🌱" }, 4: { nome: "Limpeza", icon: "🧽" }, 5: { nome: "Reformas e Construção", icon: "🏗️" },
    6: { nome: "Tecnologia da Informação (TI)", icon: "💻" }, 7: { nome: "Transporte e Mudanças", icon: "🚚" }, 8: { nome: "Beleza e Estética", icon: "💅" },
    9: { nome: "Educação e Aulas Particulares", icon: "📚" }, 10: { nome: "Saúde e Bem-estar", icon: "🏥" }, 11: { nome: "Serviços Automotivos", icon: "🚗" },
    12: { nome: "Marcenaria e Móveis Planejados", icon: "🪵" }, 13: { nome: "Serralheria", icon: "🔨" }, 14: { nome: "Climatização", icon: "❄️" },
    15: { nome: "Instalação de Eletrodomésticos", icon: "📺" }, 16: { nome: "Fotografia e Filmagem", icon: "📸" }, 17: { nome: "Eventos e Festas", icon: "🎉" },
    18: { nome: "Consultoria Financeira e Contábil", icon: "💰" }, 19: { nome: "Assistência Técnica", icon: "🔧" }, 20: { nome: "Design e Publicidade", icon: "🎯" },
    21: { nome: "Serviços Jurídicos", icon: "⚖️" }, 22: { nome: "Segurança", icon: "🛡️" }, 23: { nome: "Marketing Digital", icon: "📊" },
    24: { nome: "Consultoria Empresarial", icon: "📈" }, 25: { nome: "Tradução e Idiomas", icon: "🗣️" }, 26: { nome: "Serviços Domésticos Gerais", icon: "🏠" },
    27: { nome: "Manutenção Predial e Industrial", icon: "🏢" }, 28: { nome: "Pet Care", icon: "🐕" }, 29: { nome: "Culinária e Gastronomia", icon: "👨‍🍳" }
  }), []);
  
  /**
   * Mapa memoizado para os nomes dos dias da semana.
   */
  const daysOfWeek = useMemo(() => ({
    0: 'Domingo', 1: 'Segunda-feira', 2: 'Terça-feira', 3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado'
  }), []);


  /**
   * Busca os dados principais do perfil do prestador na API.
   * @type {function(string): Promise<void>}
   */
  const fetchProviderData = useCallback(async (providerId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
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
  }, []);

  /**
   * Busca os horários de trabalho do prestador na API.
   * @type {function(string): Promise<void>}
   */
  const fetchScheduleData = useCallback(async (providerId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) };
      const response = await fetch(`http://localhost:5087/api/schedule/provider/${providerId}`, { method: 'GET', headers });
      setScheduleData(response.ok ? await response.json() : []);
    } catch (err) {
      console.error('Erro ao buscar horários de trabalho:', err);
      setScheduleData([]);
    }
  }, []);

  /**
   * Busca as avaliações do prestador na API.
   * @type {function(string): Promise<void>}
   */
  const fetchReviews = useCallback(async (providerId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const headers = { "Content-Type": "application/json", ...(token && { "Authorization": `Bearer ${token}` }) };
      const response = await fetch(`http://localhost:5087/api/evaluation/provider/${providerId}`, { method: "GET", headers });
      if (response.ok) {
        setReviews(await response.json());
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("❌ Erro ao buscar avaliações:", err);
      setReviews([]);
    }
  }, []);

  /**
   * Efeito que dispara a busca de todos os dados quando o ID do prestador muda.
   */
  useEffect(() => {
    if (params?.id) {
      fetchProviderData(params.id);
      fetchScheduleData(params.id);
      fetchReviews(params.id);
    }
  }, [params?.id, fetchProviderData, fetchScheduleData, fetchReviews]);
  
  // Handlers do Modal
  const handleOpenModal = useCallback(() => setShowModal(true), []);
  const handleCloseModal = useCallback(() => { setShowModal(false); setRating(0); setComment(''); setHoverRating(0); }, []);
  const handleCommentChange = useCallback((e) => setComment(e.target.value), []);
  const handleRatingClick = useCallback((star) => setRating(star), []);
  const handleRatingHover = useCallback((star) => setHoverRating(star), []);
  const handleRatingLeave = useCallback(() => setHoverRating(0), []);

  /**
   * Submete a nova avaliação para a API.
   * @param {React.FormEvent} e - O evento do formulário.
   */
  const handleSubmitEvaluation = useCallback(async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação de 1 a 5 estrelas.');
      return;
    }
    setModalLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();
      formData.append('ProviderId', params.id);
      formData.append('Note', rating.toString());
      formData.append('Comment', comment);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const response = await fetch('http://localhost:5087/api/evaluation', { method: 'POST', headers, body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao enviar avaliação');
      }
      alert('Avaliação enviada com sucesso!');
      handleCloseModal();
      fetchReviews(params.id); // Re-busca as avaliações para atualizar a lista.
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
      alert('Erro ao enviar avaliação: ' + err.message);
    } finally {
      setModalLoading(false);
    }
  }, [rating, comment, params.id, handleCloseModal, fetchReviews]);

  // Funções de formatação e utilitários
  const formatPrice = useCallback((price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price), []);
  const formatPhone = useCallback((phone) => phone?.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3') || '', []);
  const getInitials = useCallback((name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'UP', []);
  const formatTime = useCallback((time) => time?.slice(0, 5) || '', []);

  /**
   * Renderiza as estrelas de uma avaliação (não interativas).
   * @param {number} ratingValue - A nota da avaliação (0 a 5).
   * @returns {React.ReactElement[]} Um array de componentes de estrela.
   */
  const renderStars = useCallback((ratingValue) => (
    [...Array(5)].map((_, i) => <Star key={i} className={`${styles.star} ${i < ratingValue ? styles.starFilled : styles.starEmpty}`} />)
  ), []);

  /**
   * Renderiza as estrelas interativas para o modal de avaliação.
   * @returns {React.ReactElement} O container com as estrelas clicáveis.
   */
  const renderInteractiveStars = useCallback(() => (
    <div className={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${styles.interactiveStar} ${star <= (hoverRating || rating) ? styles.starFilled : styles.starEmpty}`}
          onMouseEnter={() => handleRatingHover(star)}
          onMouseLeave={handleRatingLeave}
          onClick={() => handleRatingClick(star)}
        />
      ))}
    </div>
  ), [rating, hoverRating, handleRatingHover, handleRatingLeave, handleRatingClick]);

  /**
   * Texto descritivo memoizado para a nota de avaliação no modal.
   */
  const ratingText = useMemo(() => {
    switch (rating) {
      case 1: return 'Muito ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'Clique nas estrelas para avaliar';
    }
  }, [rating]);
  
  /**
   * Array de configuração para as abas de navegação.
   */
  const tabs = useMemo(() => [
    { key: 'servicos', label: 'Serviços Oferecidos', icon: Award },
    { key: 'avaliacoes', label: 'Avaliações dos Clientes', icon: Star },
    { key: 'horarios', label: 'Horários de Trabalho', icon: Clock }
  ], []);

  // Renderizações condicionais para loading e erro
  if (loading) {
    return (
      <div className={styles.container}><Navbar /><div className={styles.loadingContainer}><Loader2 size={40} className={styles.loadingSpinner} /><p>Carregando perfil do profissional...</p></div></div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}><Navbar /><div className={styles.errorContainer}><AlertCircle size={40} className={styles.errorIcon} /><h2>Provedor não encontrado</h2><p>{error}</p><button onClick={() => router.back()} className={styles.backButton}>Voltar</button></div></div>
    );
  }

  if (!providerData) return null;

  // Renderização principal da página
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.maxWidth}>
        <div className={styles.mainGrid}>
          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.profileSection}>
              <div className={styles.avatarContainer}><span className={styles.avatarText}>{getInitials(providerData.userName)}</span></div>
              <h2 className={styles.profileName}>{providerData.userName}</h2>
              <p className={styles.profileTitle}>{providerData.isVerified ? 'Profissional Verificado' : 'Profissional'}</p>
              <div className={styles.ratingContainer}><div className={styles.starContainer}>{renderStars(4.8)}</div><span className={styles.ratingValue}>4.8</span></div>
              <div className={styles.metricsGrid}>
                <div><div className={styles.metricValue}>{providerData.services?.length || 0}</div><div className={styles.metricLabel}>Serviços</div></div>
                <div><div className={styles.metricValue}>98%</div><div className={styles.metricLabel}>Satisfação</div></div>
              </div>
            </div>
            <div className={styles.actionButtons}>
              <button className={styles.outlineButton}>Enviar Mensagem</button>
              <button className={styles.primaryButton} onClick={handleOpenModal}><Star className={styles.buttonIcon} />Avaliar Prestador</button>
            </div>
            <div className={styles.contactSection}>
              <h3 className={styles.contactTitle}><Phone className={styles.contactIcon} /> Informações de Contato</h3>
              <div className={styles.contactList}>
                {providerData.phoneNumber && (<div className={styles.contactItem}><span className={styles.contactText}>{formatPhone(providerData.phoneNumber)}</span><CheckCircle className={styles.checkIcon} /></div>)}
                <div className={styles.contactItem}><span className={styles.contactText}>{providerData.isActive ? 'Ativo na plataforma' : 'Inativo'}</span><CheckCircle className={styles.checkIcon} /></div>
                <div className={styles.contactItem}><span className={styles.contactText}>{providerData.isVerified ? 'Perfil Verificado' : 'Perfil não verificado'}</span><CheckCircle className={styles.checkIcon} /></div>
                {providerData.address && (<div className={styles.contactItem}><span className={styles.contactText}>{providerData.address}</span><CheckCircle className={styles.checkIcon} /></div>)}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className={styles.mainContent}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderContent}>
                <div className={styles.profileInfo}>
                  <h1>{providerData.userName}</h1>
                  <p className={styles.profileDescription}>{providerData.description || 'Profissional qualificado pronto para atender suas necessidades.'}</p>
                  <div className={styles.profileDetails}>
                    <div className={styles.detailItem}><MapPin className={styles.detailIcon} /><span>{providerData.address || 'Picos, Piauí'}</span></div>
                    <div className={styles.detailItem}><Clock className={styles.detailIcon} /><span>Responde em até 2h</span></div>
                  </div>
                  <div className={styles.categoriesContainer}>
                    <h4>Especialidades:</h4>
                    <div className={styles.categoriesList}>{providerData.categories?.map((catId) => (<span key={catId} className={styles.categoryChip}>{categoriaMap[catId]?.icon} {categoriaMap[catId]?.nome || `Categoria ${catId}`}</span>))}</div>
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

            {/* TABS */}
            <div className={styles.tabContainer}>
              <nav className={styles.tabNavigation}>
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setActiveTab(key)} className={`${styles.tabButton} ${activeTab === key ? styles.active : ''}`}><Icon className={styles.tabIcon} /><span className={styles.tabLabel}>{label}</span></button>
                ))}
              </nav>

              <div className={styles.tabContent}>
                {activeTab === 'servicos' && (
                  <section>
                    <div className={styles.tabHeader}><h2 className={styles.tabTitle}>Serviços Oferecidos</h2><div className={styles.tabCounter}>{providerData.services?.length || 0} serviços</div></div>
                    <div className={styles.servicesGrid}>{providerData.services?.length > 0 ? providerData.services.map((service) => (<ServiceTag key={service.id} service={service} formatPrice={formatPrice} />)) : (<p>Nenhum serviço cadastrado ainda.</p>)}</div>
                  </section>
                )}
                {activeTab === 'avaliacoes' && (
                  <section>
                    <div className={styles.tabHeader}><h2 className={styles.tabTitle}>Avaliações dos Clientes</h2><div className={styles.tabCounter}>{reviews.length} avaliações</div></div>
                    <div className={styles.reviewsList}>{reviews.length > 0 ? reviews.map((review, index) => (<ReviewCard key={index} review={review} providerName={providerData.userName} getInitials={getInitials} renderStars={renderStars} />)) : (<p>Nenhuma avaliação encontrada.</p>)}</div>
                  </section>
                )}
                {activeTab === 'horarios' && (
                  <section>
                    <div className={styles.tabHeader}><h2 className={styles.tabTitle}>Horários de Trabalho</h2><div className={styles.tabCounter}>{scheduleData.length} dias configurados</div></div>
                    <div className={styles.scheduleList}>{scheduleData.length > 0 ? scheduleData.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((schedule) => <ScheduleItem key={schedule.id} schedule={schedule} daysOfWeek={daysOfWeek} formatTime={formatTime}/>) : (<div className={styles.noSchedule}><Clock size={48} className={styles.noScheduleIcon} /><p>Horários de trabalho não configurados ainda.</p></div>)}</div>
                  </section>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <EvaluationModal
        show={showModal}
        providerName={providerData?.userName}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEvaluation}
        rating={rating}
        comment={comment}
        onCommentChange={handleCommentChange}
        renderInteractiveStars={renderInteractiveStars}
        ratingText={ratingText}
        modalLoading={modalLoading}
      />
    </div>
  );
}