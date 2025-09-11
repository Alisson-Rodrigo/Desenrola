'use client';
import styles from './FinalizeCadastro.module.css';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Navbar from '../../components/Navbar';

export default function FinalizeCadastroPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    serviceArea: '',
    phone: '',
    neighborhood: '',
    city: '',
    cac: '',
    idDocument: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      idDocument: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Formulário enviado com sucesso!');
    }, 2000);
  };

  const handleBack = () => {
    // Navegar para página anterior
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Finalize seu cadastro como prestador</h1>
            <p className={styles.subtitle}>
              Para garantir segurança e confiança na plataforma, pedimos a validação com algumas 
              informações profissionais e documentos de identificação.
            </p>
            <div className={styles.progressBar}>
              <span>Etapa 2 de 2 - Quase lá! ✅</span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fullName">Nome completo *</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo" 
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="serviceArea">Área de serviço oferecida *</label>
              <select 
                id="serviceArea" 
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione sua área</option>
                <option value="eletricista">Eletricista</option>
                <option value="encanador">Encanador</option>
                <option value="pedreiro">Pedreiro</option>
                <option value="pintor">Pintor</option>
                <option value="marceneiro">Marceneiro</option>
                <option value="jardineiro">Jardineiro</option>
                <option value="limpeza">Serviços de Limpeza</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000" 
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="neighborhood">Bairro *</label>
                <input 
                  type="text" 
                  id="neighborhood" 
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  placeholder="Digite seu bairro" 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="city">Cidade *</label>
                <select 
                  id="city" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="sp">São Paulo - SP</option>
                  <option value="rj">Rio de Janeiro - RJ</option>
                  <option value="bh">Belo Horizonte - MG</option>
                  <option value="salvador">Salvador - BA</option>
                  <option value="brasilia">Brasília - DF</option>
                  <option value="curitiba">Curitiba - PR</option>
                  <option value="recife">Recife - PE</option>
                  <option value="fortaleza">Fortaleza - CE</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.labelWithTooltip}>
                <label htmlFor="cac">CAC (Certidão de Antecedentes Criminais) *</label>
                <div className={styles.tooltip}>
                  <FaInfoCircle color="#6b7280" size={16} />
                  <span className={styles.tooltipText}>
                    A Certidão de Antecedentes Criminais é um documento oficial que garante maior 
                    segurança para nossos clientes. Este é um requisito para prestadores que 
                    trabalham em residências e estabelecimentos comerciais.
                  </span>
                </div>
              </div>
              <input 
                type="text" 
                id="cac" 
                name="cac"
                value={formData.cac}
                onChange={handleInputChange}
                placeholder="Digite o código da sua certidão" 
                required
              />
            </div>

            <div className={styles.infoBox}>
              <p className={styles.infoBoxTitle}>Por que solicitamos a CAC?</p>
              <p>
                A Certidão de Antecedentes Criminais é um documento oficial que garante maior 
                segurança para nossos clientes. Este é um requisito para prestadores que 
                trabalham em residências e estabelecimentos comerciais.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label>Upload de documento de identificação (opcional)</label>
              <div className={styles.fileUploadBox}>
                <input 
                  type="file" 
                  id="idUpload" 
                  name="idDocument"
                  className={styles.fileInput}
                  accept=".png,.jpg,.jpeg,.pdf,.gif"
                  onChange={handleFileChange}
                />
                <label htmlFor="idUpload" className={styles.fileUploadLabel}>
                  <span className={styles.uploadIcon}>📎</span>
                  <span>
                    {formData.idDocument 
                      ? `Arquivo selecionado: ${formData.idDocument.name}`
                      : 'Clique para adicionar um arquivo'
                    }
                  </span>
                  <span className={styles.fileTypes}>PNG, JPG, PDF ou GIF (máx. 5MB)</span>
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                className={styles.backButton}
                onClick={handleBack}
                disabled={isSubmitting}
              >
                ← VOLTAR
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR PARA VALIDAÇÃO'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}