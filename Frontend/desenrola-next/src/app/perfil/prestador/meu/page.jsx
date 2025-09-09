import React from 'react';
import { 
  Check, 
  User, 
  Settings, 
  CreditCard, 
  Star, 
  HelpCircle,
  Wrench,
  Edit
} from 'lucide-react';
import styles from './ProfilePage.module.css';
import Navbar from '../../../../components/Navbar'; // 1. IMPORTAÇÃO DA NAVBAR

export default function ProfilePage() {
  const services = [
    "Encanamento Residencial",
    "Vazamentos", 
    "Instalação de Torneiras",
    "Desentupimento",
    "Instalação de Chuveiros",
    "Reparo de Tubulações",
    "Manutenção Preventiva"
  ];

  const stats = [
    { number: "4.8", label: "Avaliação Média" },
    { number: "127", label: "Trabalhos Realizados" },
    { number: "98%", label: "Taxa de Satisfação" },
    { number: "2", label: "Anos na Plataforma" }
  ];

  return (
    // 2. USAMOS UM FRAGMENTO PARA ENVOLVER A NAVBAR E O RESTO DO CONTEÚDO
    <>
      <Navbar /> {/* 3. NAVBAR É CHAMADA AQUI, NO TOPO E FORA DO CONTAINER PRINCIPAL */}

      {/* Este container agora agrupa apenas o conteúdo que deve ficar lado a lado */}
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              JP
              <div className={styles.statusBadge}></div>
            </div>
            <h2 className={styles.profileName}>João Pereira</h2>
            <p className={styles.profileEmail}>joao.pereira@gmail.com</p>
            <button className={styles.verifyButton}>
              <Check size={16} />
              Prestador Verificado
            </button>
          </div>

          <nav className={styles.sidebarMenu}>
            <a href="/perfil" className={`${styles.menuItem} ${styles.active}`}>
              <User size={16} style={{ marginRight: '8px' }} />
              Meu Perfil
            </a>
            <a href="/servicos" className={styles.menuItem}>
              <Wrench size={16} style={{ marginRight: '8px' }} />
              Meus Serviços
            </a>
            <a href="/solicitacoes" className={styles.menuItem}>
              <CreditCard size={16} style={{ marginRight: '8px' }} />
              Solicitações
            </a>
            <a href="/avaliacoes" className={styles.menuItem}>
              <Star size={16} style={{ marginRight: '8px' }} />
              Avaliações
            </a>
            <a href="/financeiro" className={styles.menuItem}>
              <CreditCard size={16} style={{ marginRight: '8px' }} />
              Financeiro
            </a>
            <a href="/seguranca" className={styles.menuItem}>
              <Settings size={16} style={{ marginRight: '8px' }} />
              Segurança
            </a>
          </nav>

          <button className={styles.assistanceButton}>
            <HelpCircle size={16} />
            Central de Assistência
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Meu Perfil</h1>
            <button className={styles.editButton}>
              <Edit size={16} style={{ marginRight: '6px' }} />
              Editar Perfil
            </button>
          </div>

          {/* Profile Information */}
          <div className={styles.profileInfo}>
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Nome Completo</span>
              <span className={styles.infoValue}>João Pereira dos Santos</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>E-mail</span>
              <span className={styles.infoValue}>joao.pereira@gmail.com</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Telefone</span>
              <span className={styles.infoValue}>(85) 98765-4321</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>CPF</span>
              <span className={styles.infoValue}>123.456.789-00</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Cidade</span>
              <span className={styles.infoValue}>Picos, Piauí</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Área de Atuação</span>
              <span className={styles.infoValue}>Centro e Adjacências</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Experiência</span>
              <span className={styles.infoValue}>10+ anos</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Certificações</span>
              <span className={styles.infoValue}>CREA-PI 123456789</span>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <h3 className={styles.statNumber}>{stat.number}</h3>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Services Section */}
          <div className={styles.servicesSection}>
            <h3 className={styles.sectionTitle}>
              <Wrench size={20} />
              Serviços Oferecidos
            </h3>
            <div className={styles.servicesGrid}>
              {services.map((service, index) => (
                <span key={index} className={styles.serviceTag}>
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}