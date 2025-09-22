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
  Edit
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

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
            <a href="/perfil" className={`${styles.menuItem} ${styles.active}`}>
              <User size={16} style={{ marginRight: '8px' }} />
              Meu Perfil
            </a>
            <a href="/servicos" className={styles.menuItem}>
              <Wrench size={16} style={{ marginRight: '8px' }} />
              Meus Serviços
            </a>
            <a href="/avaliacoes" className={styles.menuItem}>
              <Star size={16} style={{ marginRight: '8px' }} />
              Avaliações
            </a>
          </nav>

          <button className={styles.assistanceButton}>
            <HelpCircle size={16} />
            Torne-se Vip
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
              <span className={styles.infoLabel}>Endereço</span>
              <span className={styles.infoValue}>{profile?.address || 'Não informado'}</span>
            </div>
            
            <div className={styles.infoGroup}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>
                {profile?.isVerified ? 'Verificado' : 'Pendente'}
              </span>
            </div>
          </div>

          {/* Services Section */}
          {profile?.categories && profile.categories.length > 0 && (
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
          )}

        
  
        </div>
      </div>
    </>
  );
}