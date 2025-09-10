import styles from './FinalizeCadastro.module.css';
import { FaInfoCircle } from 'react-icons/fa'; // Ícone de exemplo, instale com: npm install react-icons

export default function FinalizeCadastroPage() {
  return (
    
    <div className={styles.container}>
        <Navbar />
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Finalize seu cadastro como prestador</h1>
          <p className={styles.subtitle}>
            Para garantir segurança e confiança na plataforma, pedimos a validação com algumas informações profissionais e documentos de identificação.
          </p>
          <div className={styles.progressBar}>
            <span>Etapa 2 de 2 - Quase lá! ✅</span>
          </div>
        </div>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Nome completo *</label>
            <input type="text" id="fullName" placeholder="Digite seu nome completo" />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="serviceArea">Área de serviço oferecida *</label>
            <select id="serviceArea">
              <option value="">Selecione sua área</option>
              <option value="eletricista">Eletricista</option>
              <option value="encanador">Encanador</option>
              <option value="pedreiro">Pedreiro</option>
              <option value="pintor">Pintor</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Telefone *</label>
              <input type="tel" id="phone" placeholder="(00) 00000-0000" />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="neighborhood">Bairro *</label>
              <input type="text" id="neighborhood" placeholder="Digite seu bairro" />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="city">Cidade *</label>
              <select id="city">
                <option value="">Selecione</option>
                <option value="sp">São Paulo</option>
                <option value="rj">Rio de Janeiro</option>
                <option value="bh">Belo Horizonte</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cac" className={styles.labelWithTooltip}>
              CAC (Certidão de Antecedentes Criminais) *
              <div className={styles.tooltip}>
                <FaInfoCircle color="#888" />
                <span className={styles.tooltipText}>
                  A Certidão de Antecedentes Criminais é um documento oficial que garante maior segurança para nossos clientes. Este é um requisito para prestadores que trabalham em residências e estabelecimentos comerciais.
                </span>
              </div>
            </label>
            <input type="text" id="cac" placeholder="Digite o código da sua certidão" />
          </div>

          <div className={styles.infoBox}>
            <p className={styles.infoBoxTitle}>Por que solicitamos a CAC?</p>
            <p>A Certidão de Antecedentes Criminais é um documento oficial que garante maior segurança para nossos clientes. Este é um requisito para prestadores que trabalham em residências e estabelecimentos comerciais.</p>
          </div>

          <div className={styles.formGroup}>
            <label>Upload de documento de identificação (opcional)</label>
            <div className={styles.fileUploadBox}>
              <input type="file" id="idUpload" className={styles.fileInput} />
              <label htmlFor="idUpload" className={styles.fileUploadLabel}>
                <span className={styles.uploadIcon}>📎</span>
                <span>Clique para adicionar um arquivo</span>
                <span className={styles.fileTypes}>PNG, JPG, PDF ou GIF</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.backButton}>&lt; VOLTAR</button>
            <button type="submit" className={styles.submitButton}>ENVIAR PARA VALIDAÇÃO</button>
          </div>
        </form>
      </div>
    </div>
  );
}