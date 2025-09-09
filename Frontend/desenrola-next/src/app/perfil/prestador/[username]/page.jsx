"use client";

import React, { useState } from 'react';
import { 
  Star, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Award, 
  Users, 
  CheckCircle,
  ChevronRight,
  Clock
} from 'lucide-react';
import styles from './ProfilePage.module.css';


export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('servicos');

  const services = [
    { name: 'Desenvolvimento Frontend', category: 'Web' },
    { name: 'Consultoria', category: 'Consultoria' },
    { name: 'Instalação de Sistemas', category: 'Sistemas' },
    { name: 'Manutenção', category: 'Suporte' },
    { name: 'Configuração de Sistemas', category: 'Sistemas' },
    { name: 'Migração de Dados', category: 'Dados' }
  ];

  const reviews = [
    {
      name: 'Ana Luiza',
      rating: 5,
      date: '2 dias',
      comment: 'Excelente profissional! Resolveu meu problema de forma rápida e objetiva. A plataforma ficou perfeita e muito fácil de usar. Recomendo!'
    },
    {
      name: 'Carlos Henrique',
      rating: 5,
      date: '1 semana',
      comment: 'Trabalho impecável, muito atencioso aos detalhes e cumpriu todos os prazos acordados. Já contratei novamente!'
    },
    {
      name: 'Luíza Santos',
      rating: 5,
      date: '2 semanas',
      comment: 'Ótimo profissional! A consulta foi bem esclarecedora e me ajudou muito. Entrega rápida e qualidade excelente. Parabéns!'
    }
  ];

  const portfolio = [
    { id: 1, title: 'Sistema de Gestão', category: 'Web App' },
    { id: 2, title: 'E-commerce Platform', category: 'E-commerce' },
    { id: 3, title: 'Dashboard Analytics', category: 'Dashboard' },
    { id: 4, title: 'Mobile App', category: 'Mobile' }
  ];

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

  const ServiceTag = ({ name, category }) => (
    <div className={styles.serviceTag}>
      <div className={styles.serviceName}>{name}</div>
      <div className={styles.serviceCategory}>{category}</div>
    </div>
  );

  const ReviewCard = ({ review }) => {
    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('');
    };

    return (
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
  };

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
      {/* Header Navigation */}
      <header className={styles.header}>
        <div className={styles.maxWidth}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <h1 className={styles.logoText}>Desenvolva</h1>
            </div>
            <nav className={styles.nav}>
              <a href="#" className={styles.navLink}>Início</a>
              <a href="#" className={styles.navLink}>Serviços</a>
              <a href="#" className={styles.navLink}>Portfólio</a>
              <a href="#" className={styles.navLink}>Mais Pedidos</a>
            </nav>
            <div className={styles.onlineStatus}>
              <div className={styles.statusBadge}>
                <div className={styles.statusDot}></div>
                <span className={styles.statusText}>Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.maxWidth}>
        <div className={styles.mainGrid}>
          {/* Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.profileSection}>
              <div className={styles.avatarContainer}>
                <span className={styles.avatarText}>JP</span>
              </div>
              <h2 className={styles.profileName}>João Pereira</h2>
              <p className={styles.profileTitle}>Profissional Certificado</p>
              <div className={styles.ratingContainer}>
                <div className={styles.starContainer}>
                  {renderStars(5)}
                </div>
                <span className={styles.ratingValue}>4.8</span>
              </div>
              <div className={styles.metricsGrid}>
                <div>
                  <div className={styles.metricValue}>127</div>
                  <div className={styles.metricLabel}>Pedidos</div>
                </div>
                <div>
                  <div className={styles.metricValue}>98%</div>
                  <div className={styles.metricLabel}>Satisfação</div>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.primaryButton}>
                <MessageCircle className={styles.buttonIcon} />
                <span>Solicitar Serviço</span>
              </button>
              <button className={styles.secondaryButton}>
                <Phone className={styles.buttonIcon} />
                <span>Ligar Agora</span>
              </button>
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
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>Conectado via 4G/Wifi</span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>Chat no WhatsApp</span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>Taxa de resposta rápida</span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactText}>6 meses na plataforma</span>
                  <CheckCircle className={styles.checkIcon} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={styles.mainContent}>
            <div className={styles.profileHeader}>
              <div className={styles.profileHeaderContent}>
                <div className={styles.profileInfo}>
                  <h1>João Pereira dos Santos</h1>
                  <p className={styles.profileDescription}>
                    Especialista especializado em desenvolvimento de plataforma e sistemas
                  </p>
                  <div className={styles.profileDetails}>
                    <div className={styles.detailItem}>
                      <MapPin className={styles.detailIcon} />
                      <span>Picos, Piauí</span>
                    </div>
                    <div className={styles.detailItem}>
                      <Clock className={styles.detailIcon} />
                      <span>Responde em até 2h</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.metricsContainer}>
                <MetricCard value="4.8" label="Avaliação Média" colorClass="green" />
                <MetricCard value="127" label="Pedidos Concluídos" colorClass="blue" />
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
                      <ChevronRight className={styles.chevronIcon} />
                    </div>
                    <div className={styles.servicesGrid}>
                      {services.map((service, index) => (
                        <ServiceTag 
                          key={index} 
                          name={service.name} 
                          category={service.category} 
                        />
                      ))}
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
