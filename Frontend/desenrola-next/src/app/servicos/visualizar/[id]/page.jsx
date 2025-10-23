"use client";

import { useState, useEffect, use, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MessageSquare, Calendar } from 'lucide-react';
import styles from "./VisualizarServico.module.css";
import Navbar from "../../../../components/Navbar";
import { FavoritesService } from "../../../../services/favoriteService";

export default function VisualizarServico({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(null);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleFavorite = useCallback(async () => {
    if (!servico?.providerId) {
      console.warn("ProviderId ainda não disponível para favoritar.");
      return;
    }
    try {
      if (isFavorited) {
        await FavoritesService.remove(servico.providerId);
        setIsFavorited(false);
        console.log("✔️ Favorito removido com sucesso");
      } else {
        await FavoritesService.add(servico.providerId);
        setIsFavorited(true);
        console.log("✔️ Favoritado com sucesso");
      }
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
    }
  }, [isFavorited, servico?.providerId]);

  const handleSendMessage = useCallback(async () => {
    if (!servico?.userId) {
      console.error('❌ userId do prestador não encontrado para iniciar o chat.');
      alert('Não foi possível iniciar uma conversa com este profissional no momento.');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Você precisa estar logado para enviar mensagens.');
        router.push('/login');
        return;
      }

      const response = await fetch('https://api.desenrola.shop/api/Message/send', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          receiverId: servico.userId,
          content: 'Olá! Vi seu serviço na plataforma e gostaria de mais informações.'
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Sua sessão expirou. Por favor, faça login novamente.');
          router.push('/login');
          return;
        }
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
      }

      console.log('✅ Mensagem enviada com sucesso, redirecionando para o chat...');
      router.push(`/chat?receiverId=${servico.userId}`);

    } catch (err) {
      console.error('❌ Erro ao enviar mensagem inicial:', err);
      alert('Erro ao iniciar conversa. Tente novamente.');
    }
  }, [servico, router]);

  const fetchAvaliacoes = async (providerId) => {
    try {
      setLoadingAvaliacoes(true);
      const headers = getAuthHeaders();
      const responseAvaliacoes = await fetch(`https://api.desenrola.shop/api/evaluation/provider/${providerId}`, { method: 'GET', headers });
      const responseMedia = await fetch(`https://api.desenrola.shop/api/evaluation/provider/${providerId}/average`, { method: 'GET', headers });

      if (!responseAvaliacoes.ok) {
        setAvaliacoes([]);
        setMediaAvaliacoes(null);
      } else {
        const avaliacoesData = await responseAvaliacoes.json();
        setAvaliacoes(Array.isArray(avaliacoesData) ? avaliacoesData : []);
      }

      if (responseMedia.ok) {
        const mediaData = await responseMedia.json();
        setMediaAvaliacoes(mediaData.average);
      } else {
        setMediaAvaliacoes(null);
      }
    } catch (err) {
      console.log('Sem avaliações disponíveis:', err.message);
      setAvaliacoes([]);
      setMediaAvaliacoes(null);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  const fetchAgenda = async (providerId) => {
    try {
      setLoadingAgenda(true);
      const response = await fetch(`https://api.desenrola.shop/api/schedule/provider/${providerId}`, { method: 'GET', headers: getAuthHeaders() });

      if (!response.ok) {
        setAgenda([]);
        return;
      }
      const agendaData = await response.json();
      setAgenda(Array.isArray(agendaData) ? agendaData : []);
    } catch (err) {
      console.log('Sem agenda disponível:', err.message);
      setAgenda([]);
    } finally {
      setLoadingAgenda(false);
    }
  };

  const openAgendaModal = () => {
    setIsModalOpen(true);
    if (servico?.providerId) {
      fetchAgenda(servico.providerId);
    }
  };

  const getDayName = (dayOfWeek) => {
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[dayOfWeek] || 'Dia inválido';
  };

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    if (!startTime || !endTime) return slots;
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    let current = new Date(start);
    while (current < end) {
      slots.push(current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      current.setHours(current.getHours() + 1);
    }
    return slots;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className={styles.starFull}>⭐</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className={styles.starEmpty}>☆</span>);
    }
    return stars;
  };

  const renderAverageRating = () => {
    if (mediaAvaliacoes === null || !Array.isArray(avaliacoes) || avaliacoes.length === 0) {
      return (
        <div className={styles.ratingSection}>
          <div className={styles.noRating}>
            <span className={styles.noRatingIcon}>⭐</span>
            <span className={styles.noRatingText}>Nenhuma avaliação ainda</span>
            <p className={styles.noRatingSubtext}>Seja o primeiro a avaliar este prestador!</p>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.ratingSection}>
        <div className={styles.averageRating}>
          <div className={styles.ratingStars}>{renderStars(mediaAvaliacoes)}</div>
          <div className={styles.ratingInfo}>
            <span className={styles.ratingValue}>{mediaAvaliacoes.toFixed(1)}</span>
            <span className={styles.ratingCount}>({avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''})</span>
          </div>
        </div>
      </div>
    );
  };

  const getInitials = (nome) => {
    if (!nome) return "??";
    return nome.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const getCategoryIcon = (categoria) => {
    const icons = { 'Hidraulica': '🔧', 'Eletrica': '⚡', 'Limpeza': '🧹', 'Jardinagem': '🌱', 'Pintura': '🎨', 'Marcenaria': '🔨', 'Encanamento': '🔧' };
    return icons[categoria] || '🔧';
  };

  useEffect(() => {
    const fetchServico = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.desenrola.shop/api/provider/services/paged?ServiceId=${id}&Page=1&PageSize=1`, { method: 'GET', headers: getAuthHeaders() });

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status}`);
        }
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const servicoData = data.items[0];
          const servicoFormatado = {
            id: servicoData.id,
            providerId: servicoData.providerId,
            userId: servicoData.userId, // CAPTURANDO O userId CORRETO
            titulo: servicoData.title,
            descricao: servicoData.description,
            categoria: servicoData.category,
            endereco: "Endereço não informado",
            prestador: {
              nome: servicoData.providerName,
              iniciais: getInitials(servicoData.providerName),
              especialidade: `Especialista em ${servicoData.category}`,
            },
            status: servicoData.isAvailable ? "Disponível" : "Indisponível",
            preco: `R$ ${servicoData.price.toFixed(2)}`,
            dataServico: new Date(servicoData.dateTime).toLocaleDateString('pt-BR'),
            images: servicoData.images || [],
          };
          setServico(servicoFormatado);
          fetchAvaliacoes(servicoFormatado.providerId);
          
          const allFavorites = await FavoritesService.getAll();
          const isFavorited = allFavorites.some(fav => fav.providerId === servicoFormatado.providerId);
          setIsFavorited(isFavorited);
        } else {
          setError('Serviço não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar serviço:', err);
        setError('Erro ao carregar os dados do serviço');
      } finally {
        setLoading(false);
      }
    };
    fetchServico();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando dados do serviço...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.errorContainer}>
              <h2>Erro ao carregar serviço</h2>
              <p>{error}</p>
              <Link href="/"><button className={styles.btnPrimary}>Voltar à Página Inicial</button></Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!servico) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.errorContainer}>
              <h2>Serviço não encontrado</h2>
              <p>O serviço solicitado não foi encontrado.</p>
              <Link href="/"><button className={styles.btnPrimary}>Voltar à Página Inicial</button></Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={styles.serviceHeader}>
            <div className={styles.categoryBadge}>{getCategoryIcon(servico.categoria)} {servico.categoria}</div>
            <h1 className={styles.serviceTitle}>{servico.titulo}</h1>
            <div className={styles.serviceDescription}>{servico.descricao}</div>
            <div className={styles.addressSection}>
              <svg className={styles.addressIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8m6 0V7" />
              </svg>
              <span><strong>Data do Serviço:</strong> {servico.dataServico}</span>
            </div>
            <div className={styles.addressSection}>
              <svg className={styles.addressIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span><strong>Endereço:</strong> {servico.endereco}</span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}><div className={styles.infoValue}>{servico.preco}</div><div className={styles.infoLabel}>Preço</div></div>
              <div className={styles.infoCard}><div className={`${styles.statusBadge} ${servico.status === "Disponível" ? styles.statusAvailable : styles.statusUnavailable}`}><span className={styles.statusDot}></span>{servico.status}</div><div className={styles.infoLabel}>Status</div></div>
              <div className={styles.infoCard}>
                <button className={`${styles.favoriteBox} ${isFavorited ? styles.favorited : ""}`} disabled={!servico?.providerId} onClick={handleFavorite}>
                  <span className={`${styles.heartIcon} ${isFavorited ? styles.heartActive : ""}`}>❤️</span>
                  {isFavorited ? "Remover favorito" : "Adicionar favorito"}
                </button>
              </div>
            </div>
          </div>

          <div className={styles.prestadorCard}>
            <h3 className={styles.infoTitle}>Prestador</h3>
            <div className={styles.prestadorHeader}>
              <div className={styles.prestadorAvatar}>{servico.prestador.iniciais}</div>
              <div className={styles.prestadorInfo}>
                <h3>{servico.prestador.nome}</h3>
                <p className={styles.prestadorTitle}>{servico.prestador.especialidade}</p>
              </div>
            </div>
            <div className={styles.avaliacoesWrapper}>
              {loadingAvaliacoes ? <div className={styles.loadingSpinner}></div> : renderAverageRating()}
            </div>
          </div>

          {!loadingAvaliacoes && avaliacoes.length > 0 && (
            <div className={styles.avaliacoesSection}>
              <h3 className={styles.infoTitle}>Avaliações dos Clientes</h3>
              <div className={styles.avaliacoesList}>
                {avaliacoes.slice(0, 5).map((avaliacao) => (
                  <div key={avaliacao.id} className={styles.avaliacaoCard}>
                    <div className={styles.avaliacaoHeader}>
                      <div className={styles.avaliacaoUser}>
                        <div className={styles.userAvatar}>
                          {avaliacao.userImage ? (
                            <img src={avaliacao.userImage} alt={avaliacao.userName} className={styles.userImage} />
                          ) : (
                            <span className={styles.userInitials}>{getInitials(avaliacao.userName)}</span>
                          )}
                        </div>
                        <div className={styles.userInfo}>
                          <h4 className={styles.userName}>{avaliacao.userName}</h4>
                          <div className={styles.userRating}>
                            {renderStars(avaliacao.note)}
                            <span className={styles.ratingNumber}>({avaliacao.note})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {avaliacao.comment && (
                      <div className={styles.avaliacaoComment}><p>"{avaliacao.comment}"</p></div>
                    )}
                  </div>
                ))}
                {avaliacoes.length > 5 && (
                  <div className={styles.moreAvaliacoes}><p>E mais {avaliacoes.length - 5} avaliação{avaliacoes.length - 5 !== 1 ? 'ões' : ''}...</p></div>
                )}
              </div>
            </div>
          )}

          {servico.images && servico.images.length > 0 && (
            <div className={styles.imagesSection}>
              <h3 className={styles.infoTitle}>Imagens do Serviço</h3>
              <div className={styles.imagesGrid}>
                {servico.images.map((image, index) => (
                  <img key={index} src={image} alt={`Imagem do serviço ${index + 1}`} className={styles.serviceImage} />
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={handleSendMessage} className={styles.btnPrimary}>
              <MessageSquare size={20} className={styles.buttonIcon} />
              Enviar Mensagem
            </button>
            <button onClick={openAgendaModal} className={styles.btnSecondary}>
              <Calendar size={20} className={styles.buttonIcon} />
              Ver Agenda do Prestador
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>📅 Agenda de {servico.prestador.nome}</h2>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>✖</button>
            </div>
            <div className={styles.agendaContent}>
              {loadingAgenda ? (
                <div className={styles.agendaLoading}><div className={styles.loadingSpinner}></div><p>Carregando agenda...</p></div>
              ) : agenda.length === 0 ? (
                <div className={styles.agendaEmpty}><div className={styles.emptyIcon}>📅</div><h3>Nenhum horário disponível</h3><p>O prestador ainda não configurou sua agenda de atendimento.</p></div>
              ) : (
                <div className={styles.agendaDays}>
                  {agenda.filter(item => item.isAvailable).sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((agendaItem) => (
                    <div key={agendaItem.id} className={styles.agendaDay}>
                      <div className={styles.dayHeader}>
                        <h3 className={styles.dayTitle}>{getDayName(agendaItem.dayOfWeek)}</h3>
                        <span className={styles.dayDate}>{agendaItem.startTime} - {agendaItem.endTime}</span>
                      </div>
                      <div className={styles.horariosGrid}>
                        {generateTimeSlots(agendaItem.startTime, agendaItem.endTime).slice(0, 8).map((horario, index) => (
                          <button key={index} className={`${styles.horarioButton} ${styles.disponivel}`} onClick={() => alert(`Horário selecionado: ${getDayName(agendaItem.dayOfWeek)} às ${horario}`)}>{horario}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnOutline} onClick={() => setIsModalOpen(false)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}