// page.jsx
'use client';

import { useState } from 'react';
import styles from './AssinarPlano.module.css';
import { FiCheck, FiX } from 'react-icons/fi'; // <-- Essa linha precisa da biblioteca instalada!

/**
 * @fileoverview Página de planos de assinatura do Desenrola.
 * Contém a renderização dos cartões de plano, alternância de ciclo de cobrança
 * e uma seção de perguntas frequentes (FAQ).
 */

/**
 * Estrutura de uma feature do plano.
 * @typedef {Object} Feature
 * @property {string} text - Texto descritivo da feature
 * @property {boolean} included - Se a feature está incluída no plano
 */

/**
 * Estrutura de preços do plano.
 * @typedef {Object} PlanPrice
 * @property {number} monthly - Preço mensal
 * @property {number} annually - Preço anual
 */

/**
 * Estrutura de um plano.
 * @typedef {Object} Plan
 * @property {string} id - Identificador do plano
 * @property {string} name - Nome do plano
 * @property {PlanPrice} price - Preços do plano
 * @property {string} description - Descrição do plano
 * @property {boolean} [popular] - Se o plano é marcado como popular
 * @property {Feature[]} features - Lista de features
 */

/**
 * Estrutura de um item de FAQ.
 * @typedef {Object} FaqItem
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 */

/**
 * Componente principal da página de planos.
 * Exibe os planos disponíveis, alternância de ciclo e FAQs.
 * @returns {JSX.Element}
 */
export default function Planos() {
    /**
     * Dados estáticos dos planos.
     * @type {Record<string, Plan>}
     */
    const plansData = {
        normal: { id: 'normal', name: 'Normal', price: { monthly: 0, annually: 0 }, description: 'Perfeito para começar a usar o Desenrola', features: [
            { text: 'Cadastro de serviços básicos', included: true },
            { text: 'Perfil visível, mas sem destaque', included: true },
            { text: 'Pode receber avaliações e usar feedback básico', included: true },
            { text: 'Sem prioridade no catálogo', included: false },
            { text: 'Relatórios limitados', included: false },
        ]},
        vip: { id: 'vip', name: 'VIP', price: { monthly: 29.90, annually: 322.92 }, description: 'Ideal para prestadores que querem se destacar', popular: true, features: [
            { text: 'Serviços aparecem com prioridade média no catálogo', included: true },
            { text: 'Perfil ganha selo VIP nas solicitações', included: true },
            { text: 'Mais chances básicas (respostas, estatísticas como visualizações e cliques no perfil)', included: true },
            { text: 'Suporte prioritário', included: true },
            { text: 'Relatórios completos', included: false },
        ]},
        master: { id: 'master', name: 'Master', price: { monthly: 59.90, annually: 646.92 }, description: 'Para profissionais que querem dominar o mercado', features: [
            { text: 'Máxima visibilidade (sempre no topo do catálogo)', included: true },
            { text: 'Perfil com selo exclusivo (ex: filtros, destaque especial)', included: true },
            { text: 'Relatórios completos (taxas, conversões, avaliações)', included: true },
            { text: 'Suporte prioritário e gerente de conta dedicado', included: true },
            { text: 'Acesso antecipado a novos recursos', included: true },
        ]},
    };

    /**
     * Perguntas frequentes mostradas na página.
     * @type {FaqItem[]}
     */
    const faqData = [
        { id: 1, question: 'Posso cancelar a qualquer momento?', answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas. Seu acesso continuará ativo até o fim do período já pago.' },
        { id: 2, question: 'Como funciona o plano gratuito?', answer: 'O plano "Normal" é gratuito e não tem limite de tempo. Ele oferece funcionalidades básicas para você começar. Você pode fazer o upgrade para um plano pago quando quiser.' },
        { id: 3, question: 'Posso mudar de plano depois?', answer: 'Com certeza! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento diretamente no seu painel de controle.' },
        { id: 4, question: 'Quais formas de pagamento vocês aceitam?', answer: 'Aceitamos os principais cartões de crédito (Visa, MasterCard, American Express) e Pix.' },
    ];

    /**
     * Estado que controla o ciclo de cobrança selecionado pelo usuário.
     * Pode ser 'monthly' ou 'annually'.
     * @type {[('monthly'|'annually'), function]}
     */
    const [billingCycle, setBillingCycle] = useState('monthly');

    /**
     * Estado com o id do plano atualmente selecionado na UI.
     * @type {[string, function]}
     */
    const [selectedPlan, setSelectedPlan] = useState('vip');

    /**
     * Estado que guarda qual item de FAQ está aberto (id) ou null quando nenhum.
     * @type {[number|null, function]}
     */
    const [openFaq, setOpenFaq] = useState(null);

    /**
     * Alterna a FAQ aberta (expande/colapsa).
     * @param {number} id - ID do item FAQ a alternar
     */
    const handleFaqToggle = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    return (
        <div className={styles.container}>
            {/* Cabeçalho da página com título e descrição */}
            <div className={styles.header}>
                <h1>Escolha o Plano Ideal para Você</h1>
                <p>Encontre prestadores de confiança, solicite serviços com facilidade e tenha acesso a recursos exclusivos. Comece grátis e evolua quando precisar!</p>
                {/* Alternador de ciclo de cobrança (mensal / anual) */}
                <div className={styles.toggle}>
                    <button 
                        className={`${styles.toggleButton} ${billingCycle === 'monthly' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Mensal
                    </button>
                    <button 
                        className={`${styles.toggleButton} ${billingCycle === 'annually' ? styles.active : ''}`}
                        onClick={() => setBillingCycle('annually')}
                    >
                        Anual <span className={styles.discount}>-10%</span>
                    </button>
                </div>
            </div>

            {/* Grid que renderiza todos os cartões de plano dinamicamente */}
            <div className={styles.plansGrid}>
                {Object.values(plansData).map(plan => {
                    // Determina se o cartão atual está selecionado
                    const isSelected = selectedPlan === plan.id;
                    // Preço atual baseado no ciclo selecionado
                    const currentPrice = plan.price[billingCycle];
                    const priceFormatted = currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                    const pricePeriod = billingCycle === 'monthly' ? '/mês' : '/ano';

                    return (
                        <div 
                            key={plan.id}
                            className={`${styles.planCard} ${isSelected ? styles.vipCard : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {/* Badge para o plano mais popular */}
                            {plan.popular && <div className={styles.mostPopular}>MAIS POPULAR</div>}
                            <h2>{plan.name}</h2>
                            <div className={styles.price}>
                                <span className={styles.currency}>R$</span>
                                <span className={styles.amount}>{priceFormatted}</span>
                                <span className={styles.period}>{plan.price.monthly > 0 ? pricePeriod : '/grátis'}</span>
                            </div>
                            <p className={styles.description}>{plan.description}</p>
                            <ul className={styles.featuresList}>
                                {plan.features.map((feature, index) => (
                                    <li key={index}>
                                        {feature.included ? <FiCheck className={styles.checkIcon} /> : <FiX className={styles.xIcon} />}
                                        {feature.text}
                                    </li>
                                ))}
                            </ul>
                            <button className={plan.id === 'vip' ? styles.buttonVip : styles.buttonPrimary}>
                                {plan.id === 'normal' ? 'COMEÇAR GRÁTIS' : `ASSINAR ${plan.name.toUpperCase()}`}
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Caixa de garantia com política de reembolso */}
            <div className={styles.guaranteeBox}>
                <h3>Garantia de 30 Dias</h3>
                <p>Não ficou satisfeito? Oferecemos reembolso total em até 30 dias. Experimente sem riscos e veja como o Desenrola pode transformar seu negócio!</p>
            </div>

            {/* Seção de Perguntas Frequentes (FAQ) */}
            <div className={styles.faqSection}>
                <h2>? Perguntas Frequentes</h2>
                {faqData.map(item => (
                    <div key={item.id} className={styles.faqWrapper}>
                        {/* Item clicável que alterna a resposta */}
                        <div className={styles.faqItem} onClick={() => handleFaqToggle(item.id)}>
                            <h3>{item.question}</h3>
                            <span style={{ transform: openFaq === item.id ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                        </div>
                        {/* Resposta visível apenas quando o item está aberto */}
                        {openFaq === item.id && (
                            <div className={styles.faqAnswer}>
                                <p>{item.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};