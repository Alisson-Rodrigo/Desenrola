'use client';
import styles from './FinalizeCadastro.module.css';
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { submitProviderRegistration } from '../../services/providerService';
import { debugUserToken, checkProviderStatus } from '../../services/debugService';

export default function FinalizeCadastroPage() {
  const [formData, setFormData] = useState({
    CPF: '',
    RG: '',
    DocumentPhotos: [],
    Address: '',
    ServiceName: '',
    Description: '',
    PhoneNumber: '',
    Category: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Category' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Arquivos selecionados:', files);
    setFormData(prev => ({
      ...prev,
      DocumentPhotos: files
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.CPF.trim()) errors.push('CPF é obrigatório');
    if (!formData.RG.trim()) errors.push('RG é obrigatório');
    if (!formData.Address.trim()) errors.push('Endereço é obrigatório');
    if (!formData.ServiceName.trim()) errors.push('Nome do Serviço é obrigatório');
    if (!formData.Description.trim()) errors.push('Descrição é obrigatória');
    if (!formData.PhoneNumber.trim()) errors.push('Telefone é obrigatório');
    
    // Validação corrigida para categoria - verifica se é string vazia ou null/undefined
    if (formData.Category === '' || formData.Category === null || formData.Category === undefined) {
      errors.push('Categoria é obrigatória');
    }
    
    if (!formData.DocumentPhotos || formData.DocumentPhotos.length === 0) {
      errors.push('Pelo menos um documento deve ser enviado');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError({
        type: 'validation',
        message: 'Corrija os seguintes erros:',
        details: validationErrors
      });
      return;
    }
    
    setIsSubmitting(true);
    setApiResponse(null);
    setError(null);

    try {
      const authToken = localStorage.getItem('auth_token');
      if (!authToken) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }

      console.log('Dados do formulário antes do envio:', formData);

      const result = await submitProviderRegistration(formData, authToken);

      setApiResponse({
        type: 'success',
        message: 'Cadastro enviado para validação com sucesso!',
        data: result
      });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError({
        type: 'error',
        message: error.message || 'Erro desconhecido ao enviar cadastro',
        details: error
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => window.history.back();

  const serviceCategories = [
    { value: 0, label: 'Elétrica' },
    { value: 1, label: 'Hidráulica' },
    { value: 2, label: 'Pintura' },
    { value: 3, label: 'Jardinagem' },
    { value: 4, label: 'Limpeza' },
    { value: 5, label: 'Reformas e Construção' },
    { value: 6, label: 'Tecnologia da Informação (TI)' },
    { value: 7, label: 'Transporte e Mudanças' },
    { value: 8, label: 'Beleza e Estética' },
    { value: 9, label: 'Educação e Aulas Particulares' },
    { value: 10, label: 'Saúde e Bem-estar' },
    { value: 11, label: 'Serviços Automotivos' },
    { value: 12, label: 'Marcenaria e Móveis Planejados' },
    { value: 13, label: 'Serralheria' },
    { value: 14, label: 'Climatização' },
    { value: 15, label: 'Instalação de Eletrodomésticos' },
    { value: 16, label: 'Fotografia e Filmagem' },
    { value: 17, label: 'Eventos e Festas' },
    { value: 18, label: 'Consultoria Financeira e Contábil' },
    { value: 19, label: 'Assistência Técnica (Eletrônicos)' },
    { value: 20, label: 'Design e Publicidade' },
    { value: 21, label: 'Serviços Jurídicos' },
    { value: 22, label: 'Segurança' },
    { value: 23, label: 'Marketing Digital e Social Media' },
    { value: 24, label: 'Consultoria Empresarial' },
    { value: 25, label: 'Tradução e Idiomas' },
    { value: 26, label: 'Serviços Domésticos Gerais' },
    { value: 27, label: 'Manutenção Predial e Industrial' },
    { value: 28, label: 'Pet Care' },
    { value: 29, label: 'Culinária e Gastronomia' }
  ];

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          {/* Cabeçalho - CORRIGIDO */}
          <div className={styles.header}>
            <h1 className={styles.title}>Finalize seu cadastro como prestador</h1>
            <p className={styles.subtitle}>
              Preencha as informações abaixo para completar seu cadastro.
            </p>
            <div className={styles.progressBar}>
              Etapa 2 de 2 - Dados do Prestador
            </div>
          </div>

          {/* Debug Info - CORRIGIDO */}
          {debugInfo && (
            <div className={styles.infoBox}>
              <div className={styles.infoBoxTitle}>🔍 DEBUG INFO:</div>
              <p><strong>UserId:</strong> {debugInfo.userId || 'Não encontrado'}</p>
              <p><strong>Token exp:</strong> {new Date(debugInfo.fullToken?.exp * 1000).toLocaleString()}</p>
              <details>
                <summary>Ver mais detalhes</summary>
                <div className={styles.responseData}>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              </details>
            </div>
          )}

          {/* Mensagem de Sucesso - CORRIGIDO */}
          {apiResponse && apiResponse.type === 'success' && (
            <div className={styles.successMessage}>
              <div className={styles.messageIcon}>✅</div>
              <div className={styles.messageContent}>
                <h3>Sucesso!</h3>
                
              </div>
            </div>
          )}

          {/* Mensagem de Erro - CORRIGIDO */}
          {error && (
            <div className={styles.errorMessage}>
              <div className={styles.messageIcon}>❌</div>
              <div className={styles.messageContent}>
                <h3>Erro</h3>
                <p>{error.message}</p>
                {error.type === 'validation' && error.details && (
                  <ul style={{ marginTop: '8px', marginLeft: '16px' }}>
                    {error.details.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
               
              </div>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* CPF e RG */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <div className={styles.labelWithTooltip}>
                  <label htmlFor="CPF">CPF *</label>
                  <div className={styles.tooltip}>
                    ℹ️
                    <span className={styles.tooltipText}>
                      Digite apenas os números do CPF, sem pontos ou traços.
                    </span>
                  </div>
                </div>
                <input
                  type="text"
                  id="CPF"
                  name="CPF"
                  value={formData.CPF}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="RG">RG *</label>
                <input
                  type="text"
                  id="RG"
                  name="RG"
                  value={formData.RG}
                  onChange={handleInputChange}
                  placeholder="Digite seu RG"
                  required
                />
              </div>
            </div>

            {/* Endereço */}
            <div className={styles.formGroup}>
              <label htmlFor="Address">Endereço *</label>
              <input
                type="text"
                id="Address"
                name="Address"
                value={formData.Address}
                onChange={handleInputChange}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </div>

            {/* Nome do Serviço e Telefone */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="ServiceName">Nome de Prestador *</label>
                <input
                  type="text"
                  id="ServiceName"
                  name="ServiceName"
                  value={formData.ServiceName}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva - Eletricista"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="PhoneNumber">Telefone *</label>
                <input
                  type="tel"
                  id="PhoneNumber"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
            </div>

            {/* Categoria */}
            <div className={styles.formGroup}>
              <label htmlFor="Category">Categoria *</label>
              <select
                id="Category"
                name="Category"
                value={formData.Category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {serviceCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div className={styles.formGroup}>
              <label htmlFor="Description">Descrição *</label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Descreva seus serviços, experiência e diferenciais..."
                required
              />
            </div>

            {/* Upload de documentos - CORRIGIDO */}
            <div className={styles.formGroup}>
              <div className={styles.labelWithTooltip}>
                <label htmlFor="DocumentPhotos">Fotos de Documentos *</label>
                <div className={styles.tooltip}>
                  ℹ️
                  <span className={styles.tooltipText}>
                    Envie fotos claras dos seus documentos (RG, CPF, comprovantes).
                    Formatos aceitos: JPG, PNG, PDF. Máximo 5MB por arquivo.
                  </span>
                </div>
              </div>
              
              <div className={styles.infoBox}>
                <div className={styles.infoBoxTitle}>📄 Documentos Necessários</div>
                <p>
                  • RG e CPF (frente e verso)<br/>
                  • Comprovante de residência<br/>
                  • Certificados profissionais (se houver)
                </p>
              </div>

              <div className={styles.fileUploadBox}>
                <input
                  type="file"
                  id="DocumentPhotos"
                  name="DocumentPhotos"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                  required
                />
                <label htmlFor="DocumentPhotos" className={styles.fileUploadLabel}>
                  <div className={styles.uploadIcon}>📁</div>
                  <span>Clique para selecionar arquivos</span>
                  <div className={styles.fileTypes}>
                    PNG, JPG, JPEG, PDF (máx. 5MB cada)
                  </div>
                </label>
              </div>

              {formData.DocumentPhotos.length > 0 && (
                <div className={styles.fileList}>
                  <strong>Arquivos selecionados ({formData.DocumentPhotos.length}):</strong>
                  <ul>
                    {formData.DocumentPhotos.map((file, i) => (
                      <li key={i}>
                        📎 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botões - CORRIGIDO */}
            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={handleBack} 
                disabled={isSubmitting}
                className={styles.backButton}
              >
                ← Voltar
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}