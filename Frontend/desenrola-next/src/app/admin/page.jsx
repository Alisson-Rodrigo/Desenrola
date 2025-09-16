'use client';

import React, { useState } from 'react';
import {
  Check,
  X,
  Eye,
  FileText,
  Phone,
  MapPin,
  User,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  FileCheck,
  Bell,
  LogOut,
  Menu
} from 'lucide-react';

import styles from './AdminDashboard.module.css'; // CSS Module

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('pendentes');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeSection, setActiveSection] = useState('validacao');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { key: 'validacao', label: 'Validação de Prestadores', icon: FileCheck },
    { key: 'prestadores', label: 'Gerenciar Prestadores', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'notificacoes', label: 'Notificações', icon: Bell },
    { key: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const prestadores = [
    {
      id: 1,
      name: "João Santos Silva",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      address: "Rua das Palmeiras, 456 - Centro",
      serviceName: "Encanamento Residencial",
      description: "Especialista em reparos de encanamento, instalação de torneiras e consertos gerais",
      phoneNumber: "(89) 99999-2222",
      documentPhotos: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"],
      submittedAt: "15/12/2024 às 09:30",
      status: "pendente"
    },
    {
      id: 2,
      name: "Maria Oliveira Costa",
      cpf: "987.654.321-00",
      rg: "98.765.432-1",
      address: "Av. Principal, 789 - Bairro Novo",
      serviceName: "Limpeza Doméstica",
      description: "Serviços completos de limpeza residencial e comercial com produtos próprios",
      phoneNumber: "(89) 98888-1111",
      documentPhotos: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
      submittedAt: "14/12/2024 às 14:15",
      status: "pendente"
    },
    {
      id: 3,
      name: "Carlos Mendes",
      cpf: "456.789.123-00",
      rg: "45.678.912-3",
      address: "Rua do Comércio, 321 - Vila Nova",
      serviceName: "Eletricista Predial",
      description: "Instalações elétricas prediais, manutenção e reparos em sistemas elétricos",
      phoneNumber: "(89) 97777-3333",
      documentPhotos: ["/api/placeholder/300/200", "/api/placeholder/300/200", "/api/placeholder/300/200"],
      submittedAt: "13/12/2024 às 16:45",
      status: "aceito"
    }
  ];

  const filteredPrestadores = prestadores.filter(p => {
    if (selectedTab === 'todos') return true;
    return p.status === selectedTab;
  });

  const handleApprove = (id) => {
    console.log('Aprovar prestador:', id);
  };

  const handleReject = (id) => {
    console.log('Rejeitar prestador:', id);
  };

  const openDocumentModal = (photos, prestadorName) => {
    setSelectedDocument({ photos, prestadorName });
  };

  const closeDocumentModal = () => {
    setSelectedDocument(null);
  };

  const ValidacaoContent = () => (
    <div className={styles['space-y-6']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Validação de Prestadores</h1>
        <p className={styles['page-description']}>
          Analise e valide os documentos dos prestadores de serviço
        </p>
      </div>

      <div className={styles['tabs-container']}>
        <div className={styles['tabs-border']}>
          <nav className={styles['tabs-nav']}>
            {[
              { key: 'pendentes', label: 'Pendentes', count: prestadores.filter(p => p.status === 'pendente').length },
              { key: 'aceitos', label: 'Aceitos', count: prestadores.filter(p => p.status === 'aceito').length },
              { key: 'rejeitados', label: 'Rejeitados', count: prestadores.filter(p => p.status === 'rejeitado').length },
              { key: 'todos', label: 'Todos', count: prestadores.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`${styles['tab-button']} ${selectedTab === tab.key ? styles.active : ''}`}
              >
                {tab.label}
                <span className={`${styles['tab-count']} ${selectedTab === tab.key ? styles.active : ''}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles['prestadores-list']}>
        {filteredPrestadores.map((prestador) => (
          <div key={prestador.id} className={styles['prestador-card']}>
            <div className={styles['prestador-grid']}>
              <div className={styles['prestador-info']}>
                <div className={styles['prestador-header']}>
                  <h3 className={styles['prestador-name']}>{prestador.name}</h3>
                  <span className={`${styles['status-badge']} ${styles[prestador.status]}`}>
                    {prestador.status}
                  </span>
                </div>

                <div className={styles['prestador-details']}>
                  <div className={styles['detail-item']}>
                    <CreditCard className={styles['detail-icon']} />
                    <span>CPF: {prestador.cpf}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <FileText className={styles['detail-icon']} />
                    <span>RG: {prestador.rg}</span>
                  </div>
                  <div className={styles['detail-item']}>
                    <Phone className={styles['detail-icon']} />
                    <span>{prestador.phoneNumber}</span>
                  </div>
                  <div className={`${styles['detail-item']} ${styles.address}`}>
                    <MapPin className={`${styles['detail-icon']} ${styles.address}`} />
                    <span>{prestador.address}</span>
                  </div>
                </div>

                <div>
                  <h4 className={styles['service-name']}>{prestador.serviceName}</h4>
                  <p className={styles['service-description']}>{prestador.description}</p>
                </div>

                <div className={styles['prestador-footer']}>
                  <span className={styles['submitted-date']}>Enviado em: {prestador.submittedAt}</span>
                  <div>
                    <button
                      onClick={() => openDocumentModal(prestador.documentPhotos, prestador.name)}
                      className={styles['view-documents']}
                    >
                      <Eye />
                      Ver Documentos ({prestador.documentPhotos.length})
                    </button>
                  </div>
                </div>
              </div>

              {prestador.status === 'pendente' && (
                <div className={styles['prestador-actions']}>
                  <button
                    onClick={() => handleApprove(prestador.id)}
                    className={`${styles['action-button']} ${styles['approve-button']}`}
                  >
                    <Check />
                    Aprovar
                  </button>
                  <button
                    onClick={() => handleReject(prestador.id)}
                    className={`${styles['action-button']} ${styles['reject-button']}`}
                  >
                    <X />
                    Rejeitar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPrestadores.length === 0 && (
        <div className={styles['empty-state']}>
          <User className={styles['empty-icon']} />
          <h3 className={styles['empty-title']}>Nenhum prestador encontrado</h3>
          <p className={styles['empty-description']}>
            Não há prestadores com o status "{selectedTab}" no momento.
          </p>
        </div>
      )}
    </div>
  );

  const PlaceholderContent = ({ title }) => (
    <div className={styles['placeholder-content']}>
      <div className={styles['placeholder-icon']}>
        <Settings />
      </div>
      <h3 className={styles['placeholder-title']}>{title}</h3>
      <p className={styles['placeholder-text']}>Esta seção será implementada em breve.</p>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'validacao': return <ValidacaoContent />;
      case 'prestadores': return <PlaceholderContent title="Gerenciar Prestadores" />;
      case 'analytics': return <PlaceholderContent title="Analytics" />;
      case 'notificacoes': return <PlaceholderContent title="Notificações" />;
      case 'configuracoes': return <PlaceholderContent title="Configurações" />;
      default: return <ValidacaoContent />;
    }
  };

  return (
    <div className={styles['admin-dashboard']}>
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles['sidebar-header']}>
          {sidebarOpen && (
            <div className={styles['sidebar-logo']}>
              <div className={styles['logo-icon']}><span>D</span></div>
              <span className={styles['logo-text']}>Desenrola Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles['menu-toggle']}>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className={styles['sidebar-nav']}>
          <div className={styles['nav-items']}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`${styles['nav-item']} ${activeSection === item.key ? styles.active : ''}`}
                >
                  <Icon className={`${styles['nav-icon']} ${sidebarOpen ? styles['with-text'] : styles.centered}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className={styles['sidebar-footer']}>
          <button className={styles['logout-button']}>
            <LogOut className={`${styles['nav-icon']} ${sidebarOpen ? styles['with-text'] : styles.centered}`} />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      <div className={styles['main-content']}>
        <div className={styles['content-wrapper']}>{renderContent()}</div>
      </div>

      {selectedDocument && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <div className={styles['mt-3']}>
              <div className={styles['modal-header']}>
                <h3 className={styles['modal-title']}>
                  Documentos - {selectedDocument.prestadorName}
                </h3>
                <button onClick={closeDocumentModal} className={styles['modal-close']}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className={styles['documents-grid']}>
                {selectedDocument.photos.map((photo, index) => (
                  <div key={index} className={styles['document-item']}>
                    <img src={photo} alt={`Documento ${index + 1}`} className={styles['document-image']} />
                    <div className={styles['document-label']}><p>Documento {index + 1}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
