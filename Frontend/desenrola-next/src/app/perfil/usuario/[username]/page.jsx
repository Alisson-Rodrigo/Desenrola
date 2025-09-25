"use client";
import React, { useState } from 'react';
import styles from './ClientProfileView.module.css';

/**
 * Componente de visualização do perfil do cliente (visão do prestador).
 * Exibe informações do cliente, histórico de serviços, avaliações e indicadores de confiabilidade.
 * 
 * Funcionalidades:
 * - Exibe dados do cliente (nome, avatar, estatísticas)
 * - Tabs para alternar entre histórico de serviços, avaliações e confiabilidade
 * - Lista de serviços contratados pelo cliente
 * - Lista de avaliações recebidas
 * - Indicadores de confiabilidade verificados
 */
const ClientProfileView = () => {
  const [activeTab, setActiveTab] = useState('historico');

  // Dados do cliente/prestador visualizado
  const profileData = {
    name: 'Maria Silva Santos',
    type: 'Cliente visão prestador',
    avatar: 'MS',
    rating: 4.9,
    totalServices: 15,
    totalEarnings: 2850,
    completionRate: 100,
    joinDate: 'Março 2023'
  };

  // Histórico de serviços contratados pelo cliente
  const serviceHistory = [
    {
      id: 1,
      title: 'Instalação de Chuveiro Elétrico',
      date: '15 Mar 2023',
      price: 150.00,
      status: 'Concluído',
      description: 'Instalação completa de chuveiro elétrico com fiação nova, incluindo disjuntor para máxima segurança.'
    },
    {
      id: 2,
      title: 'Reparo de Vazamento de Pia',
      date: '22 Mar 2023',
      price: 120.00,
      status: 'Concluído',
      description: 'Correção de vazamento embaixo da pia da cozinha com troca de vedação e vedante.'
    },
    {
      id: 3,
      title: 'Desentupimento de Esgoto',
      date: '28 Mar 2023',
      price: 180.00,
      status: 'Concluído',
      description: 'Desentupimento de rede de esgoto com equipamentos especiais.'
    }
  ];

  // Avaliações detalhadas recebidas pelo cliente
  const reviews = [
    {
      id: 1,
      title: 'Excelente Atendimento',
      rating: 5,
      date: '16 Mar 2023',
      comment: 'Trabalho perfeito realizado, além do prazo entendido chegou o técnico no horário e fez a instalação, executando também outros pequenos reparos sem problemas. Recomendamos!'
    },
    {
      id: 2,
      title: 'Reparo de Vazamento',
      rating: 5,
      date: '23 Mar 2023',
      comment: 'Solucionou tudo o que precisava. Excelente atendimento do início ao fim e preço justo. Super recomendo o trabalho dele.'
    },
    {
      id: 3,
      title: 'Desentupimento',
      rating: 5,
      date: '29 Mar 2023',
      comment: 'Cara é muito profissional e fez o que precisa rapidamente e ainda deu dicas para evitar uma futura entupimento da rede. Muito obrigado pelos excelentes'
    }
  ];

  // Indicadores de confiabilidade do cliente
  const trustIndicators = [
    { title: 'Pagamentos', status: '✓' },
    { title: 'Identidade', status: '✓' },
    { title: 'Telefone', status: '✓' },
    { title: 'Email', status: '✓' }
  ];

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Sidebar com perfil */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>{profileData.avatar}</div>
            <h3 className={styles.userName}>{profileData.name}</h3>
            <p className={styles.userType}>{profileData.type}</p>
            
            {/* Estatísticas */}
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{profileData.totalServices}</span>
                <span className={styles.statLabel}>Serviços contratados</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>R$ {profileData.totalEarnings.toLocaleString()}</span>
                <span className={styles.statLabel}>Faturamento</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{profileData.rating}</span>
                <span className={styles.statLabel}>Avaliação média</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{profileData.completionRate}%</span>
                <span className={styles.statLabel}>Projetos concluídos</span>
              </div>
            </div>

            {/* Botões de ação */}
            <div className={styles.actionButtons}>
              <button className={styles.btnPrimary}>Solicitar Orçamento</button>
              <button className={styles.btnSecondary}>Ver</button>
              <button className={styles.btnTertiary}>Mensagem</button>
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <section className={styles.content}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'historico' ? styles.active : ''}`}
              onClick={() => setActiveTab('historico')}
            >
              📋 Histórico de Serviços
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'avaliacoes' ? styles.active : ''}`}
              onClick={() => setActiveTab('avaliacoes')}
            >
              ⭐ Avaliações Detalhadas
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'confiabilidade' ? styles.active : ''}`}
              onClick={() => setActiveTab('confiabilidade')}
            >
              🛡️ Indicadores de Confiabilidade
            </button>
          </div>

          {/* Conteúdo das tabs */}
          <div className={styles.tabContent}>
            {activeTab === 'historico' && (
              <div className={styles.serviceHistory}>
                <h3>Histórico de Serviços</h3>
                {serviceHistory.map(service => (
                  <div key={service.id} className={styles.serviceItem}>
                    <div className={styles.serviceHeader}>
                      <h4>{service.title}</h4>
                      <span className={styles.serviceStatus}>{service.status}</span>
                    </div>
                    <p className={styles.serviceDate}>{service.date}</p>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    <p className={styles.servicePrice}>R$ {service.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'avaliacoes' && (
              <div className={styles.reviews}>
                <h3>Avaliações Detalhadas</h3>
                {reviews.map(review => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewInfo}>
                        <div className={styles.reviewIcon}>✓</div>
                        <div>
                          <h4>{review.title}</h4>
                          <p className={styles.reviewDate}>{review.date}</p>
                        </div>
                      </div>
                      <div className={styles.rating}>
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'confiabilidade' && (
              <div className={styles.trustIndicators}>
                <h3>Indicadores de Confiabilidade</h3>
                <div className={styles.trustGrid}>
                  {trustIndicators.map((indicator, index) => (
                    <div key={index} className={styles.trustItem}>
                      <span className={styles.trustStatus}>{indicator.status}</span>
                      <span className={styles.trustTitle}>{indicator.title}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.trustNote}>
                  Todos os indicadores foram verificados e estão atualizados.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientProfileView;