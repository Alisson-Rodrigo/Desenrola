import React from 'react';
import styles from './AssinarPlano.module.css';
import { FiCheck, FiX } from 'react-icons/fi'; // Ícones para listas de funcionalidades

/**
 * @component Planos
 * @description A página principal para exibir e selecionar os planos de assinatura.
 * * Funcionalidades:
 * - Exibe um cabeçalho com título e descrição da página.
 * - Apresenta um seletor para planos Mensais ou Anuais.
 * - Mostra três opções de planos (Normal, VIP, Master) em um grid.
 * - Cada plano detalha seu preço, descrição e uma lista de funcionalidades.
 * - Destaca o plano "VIP" como o mais popular.
 * - Inclui uma seção de garantia e uma lista de Perguntas Frequentes (FAQ).
 * * @returns {JSX.Element} O componente renderizado da página de planos.
 */
const Planos = () => {
  // OBS: Os dados dos planos e FAQ estão estáticos (hardcoded) no JSX.
  // No futuro, eles podem ser extraídos de um array de objetos e renderizados dinamicamente.

  return (
    <div className={styles.container}>
      {/* Seção do Cabeçalho: Título, subtítulo e seletor de período */}
      <div className={styles.header}>
        <h1>Escolha o Plano Ideal para Você</h1>
        <p>Encontre prestadores de confiança, solicite serviços com facilidade e tenha acesso a recursos exclusivos. Comece grátis e evolua quando precisar!</p>
        <div className={styles.toggle}>
          <button className={`${styles.toggleButton} ${styles.active}`}>Mensal</button>
          <button className={styles.toggleButton}>Anual <span className={styles.discount}>-10%</span></button>
        </div>
      </div>

      {/* Grid que segura os três cartões de plano */}
      <div className={styles.plansGrid}>
        
        {/* Cartão do Plano Normal (Grátis) */}
        <div className={styles.planCard}>
          <h2>Normal</h2>
          <div className={styles.price}>
            <span className={styles.currency}>R$</span>
            <span className={styles.amount}>0,00</span>
            <span className={styles.period}>/grátis</span>
          </div>
          <p className={styles.description}>Perfeito para começar a usar o Desenrola</p>

          <ul className={styles.featuresList}>
            {/* Funcionalidades incluídas (ícone de check) */}
            <li><FiCheck className={styles.checkIcon} /> Cadastro de serviços básicos</li>
            <li><FiCheck className={styles.checkIcon} /> Perfil visível, mas sem destaque</li>
            <li><FiCheck className={styles.checkIcon} /> Pode receber avaliações e usar feedback básico</li>
            {/* Funcionalidades não incluídas (ícone de X) */}
            <li><FiX className={styles.xIcon} /> Sem prioridade no catálogo</li>
            <li><FiX className={styles.xIcon} /> Relatórios limitados</li>
          </ul>
          <button className={styles.buttonPrimary}>COMEÇAR GRÁTIS</button>
        </div>

        {/* Cartão do Plano VIP (Destaque de "Mais Popular") */}
        <div className={`${styles.planCard} ${styles.vipCard}`}>
          <div className={styles.mostPopular}>MAIS POPULAR</div>
          <h2>VIP</h2>
          <div className={styles.price}>
            <span className={styles.currency}>R$</span>
            <span className={styles.amount}>29,90</span>
            <span className={styles.period}>/mês</span>
          </div>
          <p className={styles.description}>Ideal para prestadores que querem se destacar</p>

          <ul className={styles.featuresList}>
            <li><FiCheck className={styles.checkIcon} /> Serviços aparecem com prioridade média no catálogo</li>
            <li><FiCheck className={styles.checkIcon} /> Perfil ganha selo VIP nas solicitações</li>
            <li><FiCheck className={styles.checkIcon} /> Mais chances básicas (respostas, estatísticas como visualizações e cliques no perfil)</li>
            <li><FiCheck className={styles.checkIcon} /> Suporte prioritário</li>
            <li><FiX className={styles.xIcon} /> Relatórios completos</li>
          </ul>
          <button className={styles.buttonVip}>ASSINAR VIP</button>
        </div>

        {/* Cartão do Plano Master */}
        <div className={styles.planCard}>
          <h2>Master</h2>
          <div className={styles.price}>
            <span className={styles.currency}>R$</span>
            <span className={styles.amount}>59,90</span>
            <span className={styles.period}>/mês</span>
          </div>
          <p className={styles.description}>Para profissionais que querem dominar o mercado</p>

          <ul className={styles.featuresList}>
            <li><FiCheck className={styles.checkIcon} /> Máxima visibilidade (sempre no topo do catálogo)</li>
            <li><FiCheck className={styles.checkIcon} /> Perfil com selo exclusivo (ex: filtros, destaque especial)</li>
            <li><FiCheck className={styles.checkIcon} /> Relatórios completos (taxas, conversões, avaliações)</li>
            <li><FiCheck className={styles.checkIcon} /> Suporte prioritário e gerente de conta dedicado</li>
            <li><FiCheck className={styles.checkIcon} /> Acesso antecipado a novos recursos</li>
          </ul>
          <button className={styles.buttonPrimary}>ASSINAR MASTER</button>
        </div>
      </div>

      {/* Seção da Garantia de 30 Dias */}
      <div className={styles.guaranteeBox}>
        <h3>Garantia de 30 Dias</h3>
        <p>Não ficou satisfeito? Oferecemos reembolso total em até 30 dias. Experimente sem riscos e veja como o Desenrola pode transformar seu negócio!</p>
      </div>

      {/* Seção de Perguntas Frequentes (FAQ) */}
      <div className={styles.faqSection}>
        <h2>? Perguntas Frequentes</h2>
        {/* Cada item do FAQ pode no futuro ter um estado para abrir/fechar a resposta */}
        <div className={styles.faqItem}>
          <h3>Posso cancelar a qualquer momento?</h3>
          <span>+</span>
        </div>
        <div className={styles.faqItem}>
          <h3>Como funciona o teste gratuito?</h3>
          <span>+</span>
        </div>
        <div className={styles.faqItem}>
          <h3>Posso mudar de plano depois?</h3>
          <span>+</span>
        </div>
        <div className={styles.faqItem}>
          <h3>Quais formas de pagamento vocês aceitam?</h3>
          <span>+</span>
        </div>
      </div>
    </div>
  );
};

export default Planos;