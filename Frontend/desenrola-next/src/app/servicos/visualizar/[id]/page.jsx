"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import styles from "./VisualizarServico.module.css";
import Navbar from "../../../../components/Navbar";

export default function VisualizarServico({ params }) {
  const { id } = use(params);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [servico, setServico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agenda, setAgenda] = useState([]);
  const [loadingAgenda, setLoadingAgenda] = useState(false);
  
  // Estados para avaliações
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [mediaAvaliacoes, setMediaAvaliacoes] = useState(null);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

  // Função para obter o token de autenticação
  const getAuthToken = () => {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('token') || localStorage.getItem('authToken');
    return token;
  };

  // Headers padrão com autenticação
  const getAuthHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Buscar avaliações do prestador
  const fetchAvaliacoes = async (providerId) => {
    try {
      setLoadingAvaliacoes(true);
      
      console.log('Buscando avaliações para providerId:', providerId);
      
      // Buscar avaliações
      const responseAvaliacoes = await fetch(
        `http://localhost:5087/api/evaluation/provider/${providerId}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      
      // Buscar média das avaliações
      const responseMedia = await fetch(
        `http://localhost:5087/api/evaluation/provider/${providerId}/average`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      
      // Se der 404 ou não houver dados, considera que não tem avaliações
      if (responseAvaliacoes.status === 404 || !responseAvaliacoes.ok) {
        console.log('Nenhuma avaliação encontrada');
        setAvaliacoes([]);
        setMediaAvaliacoes(null);
        setLoadingAvaliacoes(false);
        return;
      }

      if (responseMedia.status === 404 || !responseMedia.ok) {
        console.log('Média de avaliações não encontrada');
        setMediaAvaliacoes(null);
      } else {
        const mediaData = await responseMedia.json();
        setMediaAvaliacoes(mediaData.average);
      }
      
      const avaliacoesData = await responseAvaliacoes.json();
      console.log('Avaliações retornadas:', avaliacoesData);
      
      // Verifica se retornou array vazio
      if (Array.isArray(avaliacoesData) && avaliacoesData.length === 0) {
        setAvaliacoes([]);
        setMediaAvaliacoes(null);
      } else {
        setAvaliacoes(avaliacoesData);
      }
      
    } catch (err) {
      console.log('Sem avaliações disponíveis:', err.message);
      setAvaliacoes([]);
      setMediaAvaliacoes(null);
    } finally {
      setLoadingAvaliacoes(false);
    }
  };

  // Buscar agenda do prestador
  const fetchAgenda = async (providerId) => {
    try {
      setLoadingAgenda(true);
      
      console.log('Buscando agenda para providerId:', providerId);
      
      const response = await fetch(
        `http://localhost:5087/api/schedule/provider/${providerId}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );
      
      // Se der 404 ou não houver dados, considera que não tem agenda
      if (response.status === 404 || !response.ok) {
        console.log('Nenhuma agenda encontrada');
        setAgenda([]);
        setLoadingAgenda(false);
        return;
      }
      
      const agendaData = await response.json();
      console.log('Agenda retornada:', agendaData);
      
      // Verifica se retornou array vazio
      if (Array.isArray(agendaData) && agendaData.length === 0) {
        setAgenda([]);
      } else {
        setAgenda(agendaData);
      }
      
    } catch (err) {
      console.log('Sem agenda disponível:', err.message);
      setAgenda([]);
    } finally {
      setLoadingAgenda(false);
    }
  };

  // Função para abrir modal e buscar agenda
  const openAgendaModal = () => {
    setIsModalOpen(true);
    if (servico?.providerId) {
      fetchAgenda(servico.providerId);
    }
  };

  // Função para mapear dia da semana
  const getDayName = (dayOfWeek) => {
    const days = [
      'Domingo',
      'Segunda-feira', 
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ];
    return days[dayOfWeek] || 'Dia inválido';
  };

  // Função para gerar horários entre start e end
  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`2024-01-01T${startTime}:00`);
    const end = new Date(`2024-01-01T${endTime}:00`);
    
    let current = new Date(start);
    
    while (current < end) {
      slots.push(current.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
      current.setHours(current.getHours() + 1);
    }
    
    return slots;
  };

  // Função para renderizar estrelas da avaliação
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className={styles.starFull}>⭐</span>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className={styles.starHalf}>⭐</span>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className={styles.starEmpty}>☆</span>
      );
    }
    
    return stars;
  };

  // Função para renderizar a média das avaliações
  const renderAverageRating = () => {
    if (mediaAvaliacoes === null || mediaAvaliacoes === undefined || avaliacoes.length === 0) {
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
          <div className={styles.ratingStars}>
            {renderStars(mediaAvaliacoes)}
          </div>
          <div className={styles.ratingInfo}>
            <span className={styles.ratingValue}>{mediaAvaliacoes.toFixed(1)}</span>
            <span className={styles.ratingCount}>
              ({avaliacoes.length} avaliação{avaliacoes.length !== 1 ? 'ões' : ''})
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Buscar dados do serviço pela API
  useEffect(() => {
    const fetchServico = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:5087/api/provider/services/paged?ServiceId=${id}&Page=1&PageSize=1`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Token de autenticação inválido ou expirado');
          }
          throw new Error(`Erro na API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const servicoData = data.items[0];
          
          const servicoFormatado = {
            id: servicoData.id,
            providerId: servicoData.providerId,
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
            isActive: servicoData.isActive,
            images: servicoData.images || []
          };
          
          console.log('Dados do serviço carregados:', servicoFormatado);
          setServico(servicoFormatado);

          // Buscar avaliações após carregar o serviço
          if (servicoData.providerId) {
            fetchAvaliacoes(servicoData.providerId);
          }
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

    if (id) {
      fetchServico();
    }
  }, [id]);

  const getInitials = (nome) => {
    if (!nome) return "??";
    return nome
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCategoryIcon = (categoria) => {
    const icons = {
      'Hidraulica': '🔧',
      'Eletrica': '⚡',
      'Limpeza': '🧹',
      'Jardinagem': '🌱',
      'Pintura': '🎨',
      'Marcenaria': '🔨',
      'Encanamento': '🔧'
    };
    return icons[categoria] || '🔧';
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.errorContainer}>
              <h2>Erro ao carregar serviço</h2>
              <p>{error}</p>
              <Link href="/">
                <button className={styles.btnPrimary}>Voltar à Página Inicial</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Service not found
  if (!servico) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div className={styles.errorContainer}>
              <h2>Serviço não encontrado</h2>
              <p>O serviço solicitado não foi encontrado.</p>
              <Link href="/">
                <button className={styles.btnPrimary}>Voltar à Página Inicial</button>
              </Link>
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
          {/* Header */}
          <div className={styles.serviceHeader}>
            <div className={styles.categoryBadge}>
              {getCategoryIcon(servico.categoria)} {servico.categoria}
            </div>
            <h1 className={styles.serviceTitle}>{servico.titulo}</h1>
            <div className={styles.serviceDescription}>{servico.descricao}</div>
            
            <div className={styles.addressSection}>
              <svg
                className={styles.addressIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H8a2 2 0 01-2-2V8m6 0V7"
                />
              </svg>
              <span>
                <strong>Data do Serviço:</strong> {servico.dataServico}
              </span>
            </div>

            <div className={styles.addressSection}>
              <svg
                className={styles.addressIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                <strong>Endereço:</strong> {servico.endereco}
              </span>
            </div>
          </div>

          {/* Infos */}
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoValue}>{servico.preco}</div>
                <div className={styles.infoLabel}>Preço</div>
              </div>
        
              <div className={styles.infoCard}>
                <div className={`${styles.statusBadge} ${servico.status === 'Disponível' ? styles.statusAvailable : styles.statusUnavailable}`}>
                  <span className={styles.statusDot}></span>
                  {servico.status}
                </div>
                <div className={styles.infoLabel}>Status</div>
              </div>
            </div>
          </div>

          {/* Prestador */}
          <div className={styles.prestadorCard}>
            <h3 className={styles.infoTitle}>Prestador</h3>
            <div className={styles.prestadorHeader}>
              <div className={styles.prestadorAvatar}>
                {servico.prestador.iniciais}
              </div>
              <div className={styles.prestadorInfo}>
                <h3>{servico.prestador.nome}</h3>
                <p className={styles.prestadorTitle}>
                  {servico.prestador.especialidade}
                </p>
              </div>
            </div>

            {/* Seção de Avaliações */}
            <div className={styles.avaliacoesWrapper}>
              {loadingAvaliacoes ? (
                <div className={styles.avaliacoesLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Carregando avaliações...</p>
                </div>
              ) : (
                renderAverageRating()
              )}
            </div>
          </div>

          {/* Seção de Avaliações Detalhadas */}
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
                            <img 
                              src={avaliacao.userImage} 
                              alt={avaliacao.userName}
                              className={styles.userImage}
                            />
                          ) : (
                            <span className={styles.userInitials}>
                              {getInitials(avaliacao.userName)}
                            </span>
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
                      <div className={styles.avaliacaoComment}>
                        <p>"{avaliacao.comment}"</p>
                      </div>
                    )}
                  </div>
                ))}
                {avaliacoes.length > 5 && (
                  <div className={styles.moreAvaliacoes}>
                    <p>E mais {avaliacoes.length - 5} avaliação{avaliacoes.length - 5 !== 1 ? 'ões' : ''}...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Imagens do Serviço */}
          {servico.images && servico.images.length > 0 && (
            <div className={styles.imagesSection}>
              <h3 className={styles.infoTitle}>Imagens do Serviço</h3>
              <div className={styles.imagesGrid}>
                {servico.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image}
                    alt={`Imagem do serviço ${index + 1}`}
                    className={styles.serviceImage}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className={styles.actions}>
            <button
              onClick={openAgendaModal}
              className={styles.btnSecondary}
            >
              Ver Agenda do Prestador
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Agenda */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                📅 Agenda de {servico.prestador.nome}
              </h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>
            <div className={styles.agendaContent}>
              {loadingAgenda ? (
                <div className={styles.agendaLoading}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Carregando agenda...</p>
                </div>
              ) : agenda.length === 0 ? (
                <div className={styles.agendaEmpty}>
                  <div className={styles.emptyIcon}>📅</div>
                  <h3>Nenhum horário disponível</h3>
                  <p>O prestador ainda não configurou sua agenda de atendimento.</p>
                </div>
              ) : (
                <div className={styles.agendaDays}>
                  {agenda
                    .filter(item => item.isAvailable)
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map((agendaItem) => (
                      <div key={agendaItem.id} className={styles.agendaDay}>
                        <div className={styles.dayHeader}>
                          <h3 className={styles.dayTitle}>
                            {getDayName(agendaItem.dayOfWeek)}
                          </h3>
                          <span className={styles.dayDate}>
                            {agendaItem.startTime} - {agendaItem.endTime}
                          </span>
                        </div>
                        <div className={styles.horariosGrid}>
                          {generateTimeSlots(agendaItem.startTime, agendaItem.endTime)
                            .slice(0, 8)
                            .map((horario, index) => (
                              <button 
                                key={index}
                                className={`${styles.horarioButton} ${styles.disponivel}`}
                                onClick={() => {
                                  alert(`Horário selecionado: ${getDayName(agendaItem.dayOfWeek)} às ${horario}`);
                                }}
                              >
                                {horario}
                              </button>
                            ))
                          }
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.btnOutline}
                onClick={() => setIsModalOpen(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}