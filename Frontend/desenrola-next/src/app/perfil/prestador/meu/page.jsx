'use client';

import React, { useEffect, useState } from 'react';
import { 
  Check, 
  User, 
  Settings, 
  CreditCard, 
  Star, 
  HelpCircle,
  Wrench,
  Edit,
  X,
  Save,
  Calendar,
  Clock,
  Plus,
  Trash2,
  MessageCircle
} from 'lucide-react';
import styles from './ProfilePage.module.css';
import Navbar from '../../../../components/Navbar'; 

// 🔑 Mapa das categorias baseado no enum do backend
const categoryMap = {
  0: "Elétrica",
  1: "Hidráulica",
  2: "Pintura",
  3: "Jardinagem",
  4: "Limpeza",
  5: "Reformas e Construção",
  6: "Tecnologia da Informação (TI)",
  7: "Transporte e Mudanças",
  8: "Beleza e Estética",
  9: "Educação e Aulas Particulares",
  10: "Saúde e Bem-estar",
  11: "Serviços Automotivos",
  12: "Marcenaria e Móveis Planejados",
  13: "Serralheria",
  14: "Climatização (Ar-condicionado e Ventilação)",
  15: "Instalação de Eletrodomésticos",
  16: "Fotografia e Filmagem",
  17: "Eventos e Festas",
  18: "Consultoria Financeira e Contábil",
  19: "Assistência Técnica (Eletrônicos)",
  20: "Design e Publicidade",
  21: "Serviços Jurídicos",
  22: "Segurança (Câmeras, Alarmes, Portões)",
  23: "Marketing Digital e Social Media",
  24: "Consultoria Empresarial",
  25: "Tradução e Idiomas",
  26: "Serviços Domésticos Gerais",
  27: "Manutenção Predial e Industrial",
  28: "Pet Care (Banho, Tosa e Passeio)",
  29: "Culinária e Gastronomia",
};

// 🔑 Mapeamento dos dias da semana baseado no enum WeekDay do backend
const daysOfWeek = {
  0: "Domingo",    // Sunday
  1: "Segunda-feira", // Monday
  2: "Terça-feira",   // Tuesday
  3: "Quarta-feira",  // Wednesday
  4: "Quinta-feira",  // Thursday
  5: "Sexta-feira",   // Friday
  6: "Sábado"        // Saturday
};

  /**
  Formata uma string de horário para o formato HH:MM.
  Ex: "08:00:00" → "08:00"
  @param {string} timeString Horário retornado da API
  @return {string} Horário formatado ou 'N/A'
  */



// 🔑 NOVA FUNÇÃO: Formatar horário recebido da API
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  // Se vier no formato "HH:MM" ou "HH:MM:SS", pega apenas HH:MM
  const timeParts = timeString.split(':');
  if (timeParts.length >= 2) {
    return `${timeParts[0]}:${timeParts[1]}`;
  }
  
  return timeString;
};



  /**
  Renderiza estrelas preenchidas de acordo com a nota fornecida.
  @param {number} rating Nota da avaliação (0 a 5)
  @return {JSX.Element} Conjunto de ícones de estrelas
  */

// 🔑 NOVA FUNÇÃO: Renderizar estrelas da avaliação
const renderStars = (rating) => {
  const stars = [];
  const maxStars = 5;
  
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <Star 
        key={i}
        size={16} 
        fill={i <= rating ? '#FFD700' : 'none'}
        stroke={i <= rating ? '#FFD700' : '#DDD'}
      />
    );
  }
  
  return <div className={styles.starsContainer}>{stars}</div>;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('perfil'); // 🔑 NOVO: Controla qual seção está ativa
  const [isEditing, setIsEditing] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  
  // 🔑 NOVO: Estados para avaliações
  const [evaluations, setEvaluations] = useState([]);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  const [evaluationAverage, setEvaluationAverage] = useState(0);
  
  // Estado para o formulário de agenda
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: ''
  });
  const [savingSchedule, setSavingSchedule] = useState(false);

  // 🔑 Busca dados do provider logado
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setError('Token não encontrado. Faça login novamente.');
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5087/api/provider/profile/myprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao carregar perfil (${response.status})`);
        }

        const data = await response.json();
        setProfile(data);
        // Inicializa o formulário de edição com os dados atuais
        setEditForm({
          id: data.id,
          cpf: data.cpf || '',
          rg: data.rg || '',
          address: data.address || '',
          serviceName: data.serviceName || '',
          description: data.description || '',
          phoneNumber: data.phoneNumber || '',
          categories: data.categories || []
        });
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔑 FUNÇÃO ATUALIZADA: Buscar agendas do provider
  const fetchSchedules = async () => {
    if (!profile?.id) return;
    
    setLoadingSchedules(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5087/api/schedule/provider/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dados da agenda recebidos:', data); // Para debug
        setSchedules(data);
      } else {
        console.error('Erro ao carregar agendas:', response.status);
      }
    } catch (err) {
      console.error('Erro ao carregar agendas:', err);
    } finally {
      setLoadingSchedules(false);
    }
  };

  // 🔑 NOVA FUNÇÃO: Buscar avaliações do provider
  const fetchEvaluations = async () => {
    if (!profile?.id) return;
    
    setLoadingEvaluations(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Buscar avaliações
      const evaluationsResponse = await fetch(`http://localhost:5087/api/evaluation/provider/${profile.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Buscar média das avaliações
      const averageResponse = await fetch(`http://localhost:5087/api/evaluation/provider/${profile.id}/average`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (evaluationsResponse.ok) {
        const evaluationsData = await evaluationsResponse.json();
        console.log('Avaliações recebidas:', evaluationsData);
        setEvaluations(evaluationsData);
      } else {
        console.error('Erro ao carregar avaliações:', evaluationsResponse.status);
      }

      if (averageResponse.ok) {
        const averageData = await averageResponse.json();
        console.log('Média recebida:', averageData);
        setEvaluationAverage(averageData.average || 0);
      } else {
        console.error('Erro ao carregar média:', averageResponse.status);
      }
    } catch (err) {
      console.error('Erro ao carregar avaliações:', err);
    } finally {
      setLoadingEvaluations(false);
    }
  };

  // Carregar dados quando o perfil estiver disponível
  useEffect(() => {
    if (profile?.id) {
      fetchSchedules();
      fetchEvaluations(); // 🔑 NOVO: Carrega avaliações quando perfil estiver disponível
    }
  }, [profile?.id]);

  // 🔑 NOVA FUNÇÃO: Controlar mudança de seção
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // 🔑 NOVA FUNÇÃO: Deletar agenda
  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm('Tem certeza que deseja excluir esta agenda?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5087/api/schedule/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Agenda excluída com sucesso!');
        fetchSchedules(); // Recarrega a lista
      } else {
        throw new Error('Erro ao excluir agenda');
      }
    } catch (err) {
      console.error('Erro ao excluir agenda:', err);
      alert('Erro ao excluir agenda: ' + err.message);
    }
  };

  // Abre o modal de edição
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Fecha o modal de edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaura os valores originais
    setEditForm({
      id: profile.id,
      cpf: profile.cpf || '',
      rg: profile.rg || '',
      address: profile.address || '',
      serviceName: profile.serviceName || '',
      description: profile.description || '',
      phoneNumber: profile.phoneNumber || '',
      categories: profile.categories || []
    });
  };

  // Atualiza os valores do formulário
  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manipula mudanças nas categorias
  const handleCategoryChange = (categoryId, checked) => {
    setEditForm(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, categoryId]
        : prev.categories.filter(cat => cat !== categoryId)
    }));
  };

  // Salva as alterações
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Cria FormData para multipart/form-data
      const formData = new FormData();
      formData.append('Id', editForm.id);
      formData.append('CPF', editForm.cpf);
      formData.append('RG', editForm.rg);
      formData.append('Address', editForm.address);
      formData.append('ServiceName', editForm.serviceName);
      formData.append('Description', editForm.description);
      formData.append('PhoneNumber', editForm.phoneNumber);
      
      // Adiciona categorias
      editForm.categories.forEach(category => {
        formData.append('Categories', category);
      });

      const response = await fetch("http://localhost:5087/api/provider", {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar perfil (${response.status})`);
      }

      // Atualiza o estado local com os novos dados
      const updatedProfile = { ...profile, ...editForm };
      setProfile(updatedProfile);
      setIsEditing(false);
      
      alert('Perfil atualizado com sucesso!');

    } catch (err) {
      console.error(err);
      alert('Erro ao salvar perfil: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Funções para agenda
  const handleOpenScheduleModal = () => {
    setIsScheduleModalOpen(true);
    setScheduleForm({
      dayOfWeek: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setScheduleForm({
      dayOfWeek: '',
      startTime: '',
      endTime: ''
    });
  };
  /**
  Atualiza o valor de um campo do formulário de agenda.
  @param {string} field Campo do formulário
  @param {string} value Valor a ser atribuído
  */

  const handleScheduleInputChange = (field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
  Valida os horários inseridos no formulário de agenda.
  Garante formato correto e intervalo mínimo de 1 hora.
  @param {string} startTime Horário de início
  @param {string} endTime Horário de fim
  @return {object} Objeto com isValid e mensagem
  */

  // Função de validação de horários
  const validateScheduleTimes = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return { isValid: false, message: 'Horários de início e fim são obrigatórios' };
    }
    
    // Validação de formato
    const timeFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeFormat.test(startTime) || !timeFormat.test(endTime)) {
      return { isValid: false, message: 'Formato de horário inválido. Use HH:MM' };
    }
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    if (startTotalMinutes >= endTotalMinutes) {
      return { isValid: false, message: 'O horário de início deve ser anterior ao horário de fim' };
    }
    
    // Verificação adicional: horário mínimo de 1 hora de diferença
    if (endTotalMinutes - startTotalMinutes < 60) {
      return { isValid: false, message: 'O período de atendimento deve ter pelo menos 1 hora de duração' };
    }
    
    return { isValid: true, message: '' };
  };

  // Função para salvar agenda
  const handleSaveSchedule = async () => {
    if (!scheduleForm.dayOfWeek || !scheduleForm.startTime || !scheduleForm.endTime) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar horários
    const validation = validateScheduleTimes(scheduleForm.startTime, scheduleForm.endTime);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Verificar se já existe uma agenda para este dia
    const existingSchedule = schedules.find(s => s.dayOfWeek === parseInt(scheduleForm.dayOfWeek));
    if (existingSchedule) {
      alert('Já existe uma agenda cadastrada para este dia da semana.');
      return;
    }

    setSavingSchedule(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Criando FormData para multipart/form-data
      const formData = new FormData();
      formData.append('ProviderId', profile.id);
      formData.append('DayOfWeek', parseInt(scheduleForm.dayOfWeek));
      formData.append('StartTime', `${scheduleForm.startTime}:00`);
      formData.append('EndTime', `${scheduleForm.endTime}:00`);

      const response = await fetch("http://localhost:5087/api/schedule", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro ao salvar agenda'}`);
      }

      const savedSchedule = await response.json();
      console.log('Agenda salva com sucesso:', savedSchedule);
      
      // Recarrega as agendas
      await fetchSchedules();
      handleCloseScheduleModal();
      alert('Agenda cadastrada com sucesso!');

    } catch (err) {
      console.error('Erro detalhado:', err);
      alert('Erro ao salvar agenda: ' + err.message);
    } finally {
      setSavingSchedule(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          fontSize: '1.1rem',
          color: '#2E7D32',
          fontWeight: '600'
        }}>
          Carregando perfil...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          fontSize: '1.1rem',
          color: '#D32F2F',
          fontWeight: '600',
          textAlign: 'center',
          background: 'rgba(244, 67, 54, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid rgba(244, 67, 54, 0.2)'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {profile?.serviceName?.[0] || 'U'}
              <div className={styles.statusBadge}></div>
            </div>
            <h2 className={styles.profileName}>{profile?.serviceName}</h2>
            <p className={styles.profileEmail}>{profile?.email}</p>
            {profile?.isVerified && (
              <button className={styles.verifyButton}>
                <Check size={16} />
                Prestador Verificado
              </button>
            )}
          </div>

          <nav className={styles.sidebarMenu}>
            <button 
              onClick={() => handleSectionChange('perfil')} 
              className={`${styles.menuItem} ${activeSection === 'perfil' ? styles.active : ''}`}
            >
              <User size={16} style={{ marginRight: '8px' }} />
              Meu Perfil
            </button>
            <button 
              onClick={() => handleSectionChange('servicos')} 
              className={`${styles.menuItem} ${activeSection === 'servicos' ? styles.active : ''}`}
            >
              <Wrench size={16} style={{ marginRight: '8px' }} />
              Meus Serviços
            </button>
            <button 
              onClick={() => handleSectionChange('avaliacoes')} 
              className={`${styles.menuItem} ${activeSection === 'avaliacoes' ? styles.active : ''}`}
            >
              <Star size={16} style={{ marginRight: '8px' }} />
              Avaliações
            </button>
          </nav>

          <button className={styles.assistanceButton}>
            <HelpCircle size={16} />
            Torne-se Vip
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Conteúdo baseado na seção ativa */}
          {activeSection === 'perfil' && (
            <>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Meu Perfil</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className={styles.editButton} onClick={handleOpenScheduleModal}>
                    <Calendar size={16} style={{ marginRight: '6px' }} />
                    Cadastrar Agenda
                  </button>
                  <button className={styles.editButton} onClick={handleEditClick}>
                    <Edit size={16} style={{ marginRight: '6px' }} />
                    Editar Perfil
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className={styles.profileInfo}>
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Nome Completo</span>
                  <span className={styles.infoValue}>{profile?.serviceName || 'Não informado'}</span>
                </div>
                
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>E-mail</span>
                  <span className={styles.infoValue}>{profile?.email || 'Não informado'}</span>
                </div>
                
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Telefone</span>
                  <span className={styles.infoValue}>{profile?.phoneNumber || 'Não informado'}</span>
                </div>
                
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>CPF</span>
                  <span className={styles.infoValue}>{profile?.cpf || 'Não informado'}</span>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>RG</span>
                  <span className={styles.infoValue}>{profile?.rg || 'Não informado'}</span>
                </div>
                
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Endereço</span>
                  <span className={styles.infoValue}>{profile?.address || 'Não informado'}</span>
                </div>

                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Descrição</span>
                  <span className={styles.infoValue}>{profile?.description || 'Não informado'}</span>
                </div>
                
                <div className={styles.infoGroup}>
                  <span className={styles.infoLabel}>Status</span>
                  <span className={styles.infoValue}>
                    {profile?.isVerified ? 'Verificado' : 'Pendente'}
                  </span>
                </div>
              </div>

              {/* Schedule Section */}
              <div className={styles.servicesSection}>
                <h3 className={styles.sectionTitle}>
                  <Calendar size={20} />
                  Agenda de Serviço
                </h3>
                {loadingSchedules ? (
                  <p>Carregando agenda...</p>
                ) : schedules.length > 0 ? (
                  <div className={styles.scheduleGrid}>
                    {schedules.map((schedule, index) => (
                      <div key={schedule.id || index} className={styles.scheduleItem}>
                        <div className={styles.scheduleDay}>
                          {daysOfWeek[schedule.dayOfWeek]}
                        </div>
                        <div className={styles.scheduleTime}>
                          <Clock size={14} />
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <div className={styles.scheduleStatus}>
                          <span className={schedule.isAvailable ? styles.available : styles.unavailable}>
                            {schedule.isAvailable ? 'Disponível' : 'Indisponível'}
                          </span>
                        </div>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          title="Excluir agenda"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noSchedule}>
                    Nenhuma agenda cadastrada. Clique em "Cadastrar Agenda" para adicionar seus horários disponíveis.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Services Section */}
          {activeSection === 'servicos' && (
            <>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Meus Serviços</h1>
              </div>

              {profile?.categories && profile.categories.length > 0 ? (
                <div className={styles.servicesSection}>
                  <h3 className={styles.sectionTitle}>
                    <Wrench size={20} />
                    Serviços Oferecidos
                  </h3>
                  <div className={styles.servicesGrid}>
                    {profile.categories.map((cat, index) => (
                      <span key={index} className={styles.serviceTag}>
                        {categoryMap[cat] || `Categoria ${cat}`}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noServicesMessage}>
                  <Wrench size={48} color="#ccc" />
                  <h3>Nenhum serviço cadastrado</h3>
                  <p>Adicione os serviços que você oferece editando seu perfil.</p>
                </div>
              )}
            </>
          )}

          {/* 🔑 NOVA SEÇÃO: Avaliações */}
          {activeSection === 'avaliacoes' && (
            <>
              <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Avaliações</h1>
                {evaluationAverage > 0 && (
                  <div className={styles.averageRating}>
                    <div className={styles.averageNumber}>{evaluationAverage.toFixed(1)}</div>
                    {renderStars(Math.round(evaluationAverage))}
                    <span className={styles.totalEvaluations}>({evaluations.length} avaliações)</span>
                  </div>
                )}
              </div>

              {loadingEvaluations ? (
                <div className={styles.loadingMessage}>
                  <p>Carregando avaliações...</p>
                </div>
              ) : evaluations.length > 0 ? (
                <div className={styles.evaluationsSection}>
                  <div className={styles.evaluationsList}>
                    {evaluations.map((evaluation, index) => (
                      <div key={index} className={styles.evaluationCard}>
                        <div className={styles.evaluationHeader}>
                          <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                              {evaluation.userImage ? (
                                <img src={evaluation.userImage} alt={evaluation.userName} />
                              ) : (
                                evaluation.userName?.[0]?.toUpperCase() || 'U'
                              )}
                            </div>
                            <div className={styles.userDetails}>
                              <span className={styles.userName}>{evaluation.userName || 'Usuário Anônimo'}</span>
                              {renderStars(evaluation.note)}
                            </div>
                          </div>
                          <div className={styles.evaluationRating}>
                            <span className={styles.ratingNumber}>{evaluation.note}</span>
                          </div>
                        </div>
                        {evaluation.comment && (
                          <div className={styles.evaluationComment}>
                            <MessageCircle size={16} />
                            <p>{evaluation.comment}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noEvaluationsMessage}>
                  <Star size={48} color="#ccc" />
                  <h3>Nenhuma avaliação ainda</h3>
                  <p>Suas avaliações de clientes aparecerão aqui.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de Edição */}
        {isEditing && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Editar Perfil</h2>
                <button 
                  className={styles.closeButton} 
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Nome do Serviço</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editForm.serviceName}
                    onChange={(e) => handleInputChange('serviceName', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Telefone</label>
                  <input
                    type="tel"
                    className={styles.formInput}
                    value={editForm.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>CPF</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editForm.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>RG</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editForm.rg}
                    onChange={(e) => handleInputChange('rg', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Endereço</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    value={editForm.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Descrição</label>
                  <textarea
                    className={styles.formTextarea}
                    value={editForm.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    disabled={saving}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Categorias de Serviço</label>
                  <div className={styles.categoriesGrid}>
                    {Object.entries(categoryMap).map(([id, name]) => (
                      <label key={id} className={styles.categoryLabel}>
                        <input
                          type="checkbox"
                          checked={editForm.categories.includes(parseInt(id))}
                          onChange={(e) => handleCategoryChange(parseInt(id), e.target.checked)}
                          disabled={saving}
                        />
                        <span className={styles.categoryName}>{name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  <Save size={16} style={{ marginRight: '6px' }} />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Cadastrar Agenda */}
        {isScheduleModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Cadastrar Agenda de Serviço</h2>
                <button 
                  className={styles.closeButton} 
                  onClick={handleCloseScheduleModal}
                  disabled={savingSchedule}
                >
                  <X size={20} />
                </button>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Dia da Semana *</label>
                  <select
                    className={styles.formInput}
                    value={scheduleForm.dayOfWeek}
                    onChange={(e) => handleScheduleInputChange('dayOfWeek', e.target.value)}
                    disabled={savingSchedule}
                  >
                    <option value="">Selecione um dia</option>
                    <option value="0">Domingo</option>
                    <option value="1">Segunda-feira</option>
                    <option value="2">Terça-feira</option>
                    <option value="3">Quarta-feira</option>
                    <option value="4">Quinta-feira</option>
                    <option value="5">Sexta-feira</option>
                    <option value="6">Sábado</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Horário de Início *</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={scheduleForm.startTime}
                    onChange={(e) => handleScheduleInputChange('startTime', e.target.value)}
                    disabled={savingSchedule}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Horário de Fim *</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={scheduleForm.endTime}
                    onChange={(e) => handleScheduleInputChange('endTime', e.target.value)}
                    disabled={savingSchedule}
                  />
                </div>

                <div className={styles.formNote}>
                  <p>* Campos obrigatórios</p>
                  <p>O período de atendimento deve ter pelo menos 1 hora de duração.</p>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCloseScheduleModal}
                  disabled={savingSchedule}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSaveSchedule}
                  disabled={savingSchedule}
                >
                  <Save size={16} style={{ marginRight: '6px' }} />
                  {savingSchedule ? 'Salvando...' : 'Cadastrar Agenda'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}