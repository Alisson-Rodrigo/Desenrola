'use client';

import React, { useState, useEffect } from 'react';
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
  Menu,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import styles from './AdminDashboard.module.css'; // CSS Module

/**
 * Componente principal do painel de administração.
 * 
 * Permite:
 * - Validar documentos de prestadores de serviço.
 * - Aprovar ou rejeitar prestadores pendentes.
 * - Exibir informações e documentos enviados.
 * - Paginar resultados.
 * - Alternar entre diferentes seções do dashboard.
 */
const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('pendentes');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [activeSection, setActiveSection] = useState('validacao');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [prestadores, setPrestadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  /**
   * Itens do menu lateral com ícones e rótulos.
   */
  const menuItems = [
    { key: 'validacao', label: 'Validação de Prestadores', icon: FileCheck },
    { key: 'prestadores', label: 'Gerenciar Prestadores', icon: Users },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'notificacoes', label: 'Notificações', icon: Bell },
    { key: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  /**
   * Ajusta a URL da imagem vinda do backend para exibição correta.
   * @param {string} imageUrl - URL original da imagem
   * @returns {string|null} - URL processada ou null se inválida
   */
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http')) {
      return imageUrl.replace('localhost:7014', 'localhost:5087');
    }
    
    return `http://localhost:5087${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  /**
   * Busca prestadores pendentes no backend com paginação.
   * @param {number} page - Página atual
   * @param {number} pageSize - Tamanho da página
   */
  const fetchPendingProviders = async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch(
        `https://api.desenrola.shop/api/provider/pending?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const mappedProviders = data.items.map(item => {
        const processedImageDocuments = (item.imageDocuments || [])
          .map(url => processImageUrl(url))
          .filter(url => url !== null);

        return {
          id: item.id,
          name: item.name || "Nome não informado",
          cpf: formatCPF(item.cpf),
          rg: item.rg,
          address: item.address,
          serviceName: "Serviço não especificado",
          description: "Descrição não disponível",
          phoneNumber: formatPhone(item.phoneNumber),
          documentPhotos: processedImageDocuments,
          submittedAt: new Date(item.dateCreated).toLocaleDateString('pt-BR'),
          status: item.isVerified ? 'aceito' : 'pendente',
          isActive: item.isActive
        };
      });
      
      setPrestadores(mappedProviders);
      setPagination({
        totalItems: data.totalItems,
        page: data.page,
        pageSize: data.pageSize,
        totalPages: data.totalPages
      });
      
    } catch (err) {
      console.error('Erro ao carregar prestadores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formata um CPF em padrão ###.###.###-##
   * @param {string} cpf
   * @returns {string}
   */
  const formatCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  /**
   * Formata um telefone em padrão (##) #####-####
   * @param {string} phone
   * @returns {string}
   */
  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  useEffect(() => {
    if (selectedTab === 'pendentes') {
      fetchPendingProviders(pagination.page, pagination.pageSize);
    }
  }, [selectedTab]);

  /**
   * Manipula a troca de página na paginação.
   * @param {number} newPage - Nova página selecionada
   */
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchPendingProviders(newPage, pagination.pageSize);
    }
  };

  /**
   * Aprova prestador via API e atualiza estado.
   * @param {string} id - ID do prestador
   */
  const handleApprove = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Token de autenticação não encontrado');

      const formData = new FormData();
      formData.append("Id", id);
      formData.append("Operation", "true");

      const response = await fetch('https://api.desenrola.shop/api/provider/mark-provider', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setPrestadores(prev =>
        prev.map(prestador =>
          prestador.id === id ? { ...prestador, status: 'aceito' } : prestador
        )
      );

      await fetchPendingProviders(pagination.page, pagination.pageSize);
      alert('Prestador aprovado com sucesso!');

    } catch (err) {
      console.error('Erro ao aprovar prestador:', err);
      alert(`Não foi possível aprovar o prestador: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Rejeita prestador via API e atualiza estado.
   * @param {string} id - ID do prestador
   */
  const handleReject = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Token de autenticação não encontrado');

      const formData = new FormData();
      formData.append("Id", id);
      formData.append("Operation", "false");

      const response = await fetch('https://api.desenrola.shop/api/provider/mark-provider', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setPrestadores(prev =>
        prev.map(prestador =>
          prestador.id === id ? { ...prestador, status: 'rejeitado' } : prestador
        )
      );

      await fetchPendingProviders(pagination.page, pagination.pageSize);
      alert('Prestador rejeitado com sucesso!');

    } catch (err) {
      console.error('Erro ao rejeitar prestador:', err);
      alert(`Não foi possível rejeitar o prestador: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Abre modal de documentos de um prestador.
   * @param {string[]} photos - URLs das fotos enviadas
   * @param {string} prestadorName - Nome do prestador
   */
  const openDocumentModal = (photos, prestadorName) => {
    setSelectedDocument({ photos, prestadorName });
  };

  /**
   * Fecha modal de documentos.
   */
  const closeDocumentModal = () => {
    setSelectedDocument(null);
  };

  /**
   * Componente para exibir uma imagem de documento com tratamento de erro e loading.
   * @param {{ src: string, alt: string, index: number }} props
   */
  const DocumentImage = ({ src, alt, index }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
      console.error(`Erro ao carregar imagem ${index + 1}:`, src);
      setImageError(true);
      setImageLoading(false);
    };

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    if (imageError) {
      return (
        <div className={styles['document-error']}>
          <FileText className="w-12 h-12 text-gray-400" />
          <p>Erro ao carregar documento {index + 1}</p>
          <p className={styles['error-url']}>URL: {src}</p>
        </div>
      );
    }

    return (
      <div className={styles['document-image-container']}>
        {imageLoading && (
          <div className={styles['image-loading']}>
            <Loader2 className="w-8 h-8 animate-spin" />
            <p>Carregando...</p>
          </div>
        )}
        <img 
          src={src}
          alt={alt}
          className={styles['document-image']}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      </div>
    );
  };

  /**
   * Componente de paginação (informações + botões de navegação).
   */
  const PaginationComponent = () => {
    if (pagination.totalPages <= 1) return null;

    const startItem = (pagination.page - 1) * pagination.pageSize + 1;
    const endItem = Math.min(pagination.page * pagination.pageSize, pagination.totalItems);

    return (
      <div className={styles['pagination-container']}>
        <div className={styles['pagination-info']}>
          Mostrando {startItem} a {endItem} de {pagination.totalItems} resultados
        </div>
        <div className={styles['pagination-controls']}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={styles['pagination-button']}
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>
          
          <div className={styles['pagination-pages']}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`${styles['pagination-page']} ${
                  pageNum === pagination.page ? styles.active : ''
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={styles['pagination-button']}
          >
            Próximo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  /**
   * Conteúdo da seção de Validação de Prestadores.
   * Exibe lista de prestadores pendentes e ações.
   */
  const ValidacaoContent = () => (
    <div className={styles['space-y-6']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Validação de Prestadores</h1>
        <p className={styles['page-description']}>
          Analise e valide os documentos dos prestadores de serviço
        </p>
      </div>

      {error && (
        <div className={styles['error-message']}>
          <X className="w-5 h-5" />
          Erro ao carregar dados: {error}
          <button 
            onClick={() => fetchPendingProviders(pagination.page, pagination.pageSize)}
            className={styles['retry-button']}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles['loading-container']}>
          <Loader2 className={`${styles['loading-icon']} animate-spin`} />
          <p>Carregando prestadores...</p>
        </div>
      ) : (
        <>
          <div className={styles['prestadores-list']}>
            {prestadores
              .filter(p => {
                if (selectedTab === 'todos') return true;
                if (selectedTab === 'pendentes') return p.status === 'pendente';
                if (selectedTab === 'aceitos') return p.status === 'aceito';
                if (selectedTab === 'rejeitados') return p.status === 'rejeitado';
                return true;
              })
              .map((prestador) => (
              <div key={prestador.id} className={styles['prestador-card']}>
                <div className={styles['prestador-grid']}>
                  <div className={styles['prestador-info']}>
                    <div className={styles['prestador-header']}>
                      <h3 className={styles['prestador-name']}>{prestador.name}</h3>
                      <div className={styles['status-badges']}>
                        <span className={`${styles['status-badge']} ${styles[prestador.status]}`}>
                          {prestador.status}
                        </span>
                        {!prestador.isActive && (
                          <span className={`${styles['status-badge']} ${styles.inactive}`}>
                            Inativo
                          </span>
                        )}
                      </div>
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
                          disabled={prestador.documentPhotos.length === 0}
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

          <PaginationComponent />
        </>
      )}

      {!loading && prestadores.length === 0 && !error && (
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

  /**
   * Placeholder genérico para seções ainda não implementadas.
   * @param {{ title: string }} props
   */
  const PlaceholderContent = ({ title }) => (
    <div className={styles['placeholder-content']}>
      <div className={styles['placeholder-icon']}>
        <Settings />
      </div>
      <h3 className={styles['placeholder-title']}>{title}</h3>
      <p className={styles['placeholder-text']}>Esta seção será implementada em breve.</p>
    </div>
  );

  /**
   * Renderiza conteúdo baseado na seção ativa.
   * @returns {JSX.Element}
   */
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
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className={styles['main-content']}>
        <div className={styles['content-wrapper']}>{renderContent()}</div>
      </div>

      {/* Modal de Documentos */}
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
                {selectedDocument.photos.length > 0 ? (
                  selectedDocument.photos.map((imageUrl, index) => (
                    <div key={index} className={styles['document-item']}>
                      <DocumentImage 
                        src={imageUrl}
                        alt={`Documento ${index + 1}`}
                        index={index}
                      />
                      <div className={styles['document-label']}>
                        <p>Documento {index + 1}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles['no-documents']}>
                    <FileText className="w-12 h-12 text-gray-400" />
                    <p>Nenhum documento disponível</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
