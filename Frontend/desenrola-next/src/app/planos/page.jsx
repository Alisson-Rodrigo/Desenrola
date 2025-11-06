'use client';

import { useState, useEffect } from 'react';
import styles from './AssinarPlano.module.css';
import { FiCheck, FiX } from 'react-icons/fi';
import Navbar from '../../components/Navbar';

export default function Planos() {
    const plansData = {
        normal: { 
            id: 'normal', 
            name: 'Normal', 
            price: 0, 
            description: 'Perfeito para começar a usar o Desenrola', 
            features: [
                { text: 'Cadastro de serviços básicos', included: true },
                { text: 'Perfil visível, mas sem destaque', included: true },
                { text: 'Pode receber avaliações e usar feedback básico', included: true },
                { text: 'Sem prioridade no catálogo', included: false },
                { text: 'Relatórios limitados', included: false },
            ]
        },
        vip: { 
            id: 'vip', 
            name: 'VIP', 
            price: 29.90, 
            description: 'Ideal para prestadores que querem se destacar', 
            popular: true, 
            features: [
                { text: 'Serviços aparecem com prioridade média no catálogo', included: true },
                { text: 'Perfil ganha selo VIP nas solicitações', included: true },
                { text: 'Mais chances básicas (respostas, estatísticas como visualizações e cliques no perfil)', included: true },
                { text: 'Suporte prioritário', included: true },
                { text: 'Relatórios completos', included: false },
            ]
        },
        master: { 
            id: 'master', 
            name: 'Master', 
            price: 59.90, 
            description: 'Para profissionais que querem dominar o mercado', 
            features: [
                { text: 'Máxima visibilidade (sempre no topo do catálogo)', included: true },
                { text: 'Perfil com selo exclusivo (ex: filtros, destaque especial)', included: true },
                { text: 'Relatórios completos (taxas, conversões, avaliações)', included: true },
                { text: 'Suporte prioritário e gerente de conta dedicado', included: true },
                { text: 'Acesso antecipado a novos recursos', included: true },
            ]
        },
    };

    const faqData = [
        { id: 1, question: 'Posso cancelar a qualquer momento?', answer: 'Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas. Seu acesso continuará ativo até o fim do período já pago.' },
        { id: 2, question: 'Como funciona o plano gratuito?', answer: 'O plano "Normal" é gratuito e não tem limite de tempo. Ele oferece funcionalidades básicas para você começar. Você pode fazer o upgrade para um plano pago quando quiser.' },
        { id: 3, question: 'Posso mudar de plano depois?', answer: 'Com certeza! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento diretamente no seu painel de controle.' },
        { id: 4, question: 'Quais formas de pagamento vocês aceitam?', answer: 'Aceitamos os principais cartões de crédito (Visa, MasterCard, American Express) e Pix.' },
    ];

    const [selectedPlan, setSelectedPlan] = useState('normal');
    const [currentUserPlan, setCurrentUserPlan] = useState('normal');
    const [openFaq, setOpenFaq] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingUserPlan, setLoadingUserPlan] = useState(true);

    useEffect(() => {
        fetchUserPlan();
    }, []);

    const fetchUserPlan = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                setLoadingUserPlan(false);
                return;
            }

            const response = await fetch('https://api.desenrola.shop/api/users/me', {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                
                // Mapear o plan_id para o nome do plano
                const planIdMap = {
                    1: 'normal',
                    2: 'vip',
                    3: 'master'
                };

                const userPlanId = planIdMap[userData.plan_id] || 'normal';
                setCurrentUserPlan(userPlanId);
                setSelectedPlan(userPlanId);
            }
        } catch (error) {
            console.error('Erro ao buscar plano do usuário:', error);
        } finally {
            setLoadingUserPlan(false);
        }
    };

    const handleFaqToggle = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const handleCheckout = async (planId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            
            if (!token) {
                alert('Você precisa estar logado para assinar um plano!');
                window.location.href = '/login';
                return;
            }

            const planIdMap = {
                'normal': 1,
                'vip': 2,
                'master': 3
            };

            const numericPlanId = planIdMap[planId];

            const response = await fetch(`https://api.desenrola.shop/api/payments/checkout/${numericPlanId}`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Erro ao processar o checkout');
            }

            const data = await response.json();
            
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                alert('Plano assinado com sucesso!');
                window.location.href = '/dashboard';
            }

        } catch (error) {
            console.error('Erro no checkout:', error);
            alert(error.message || 'Erro ao processar o pagamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loadingUserPlan) {
        return (
            <>
                <Navbar />
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <p>Carregando planos...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Escolha o Plano Ideal para Você</h1>
                    <p>Encontre prestadores de confiança, solicite serviços com facilidade e tenha acesso a recursos exclusivos. Comece grátis e evolua quando precisar!</p>
                </div>

                <div className={styles.plansGrid}>
                    {Object.values(plansData).map(plan => {
                        const isCurrentPlan = currentUserPlan === plan.id;
                        const isSelected = selectedPlan === plan.id;
                        const priceFormatted = plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

                        return (
                            <div 
                                key={plan.id}
                                className={`${styles.planCard} ${isSelected ? styles.vipCard : ''} ${isCurrentPlan ? styles.currentPlan : ''}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {plan.popular && <div className={styles.mostPopular}>MAIS POPULAR</div>}
                                {isCurrentPlan && <div className={styles.currentPlanBadge}>SEU PLANO ATUAL</div>}
                                <h2>{plan.name}</h2>
                                <div className={styles.price}>
                                    <span className={styles.currency}>R$</span>
                                    <span className={styles.amount}>{priceFormatted}</span>
                                    <span className={styles.period}>{plan.price > 0 ? '/mês' : '/grátis'}</span>
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
                                <button 
                                    className={isCurrentPlan ? styles.buttonDisabled : plan.id === 'vip' ? styles.buttonVip : styles.buttonPrimary}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isCurrentPlan) {
                                            handleCheckout(plan.id);
                                        }
                                    }}
                                    disabled={loading || isCurrentPlan}
                                >
                                    {loading ? 'PROCESSANDO...' : isCurrentPlan ? 'PLANO ATUAL' : `ASSINAR ${plan.name.toUpperCase()}`}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className={styles.guaranteeBox}>
                    <h3>Garantia de 30 Dias</h3>
                    <p>Não ficou satisfeito? Oferecemos reembolso total em até 30 dias. Experimente sem riscos e veja como o Desenrola pode transformar seu negócio!</p>
                </div>

                <div className={styles.faqSection}>
                    <h2>❓ Perguntas Frequentes</h2>
                    {faqData.map(item => (
                        <div key={item.id} className={styles.faqWrapper}>
                            <div className={styles.faqItem} onClick={() => handleFaqToggle(item.id)}>
                                <h3>{item.question}</h3>
                                <span style={{ transform: openFaq === item.id ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                            </div>
                            {openFaq === item.id && (
                                <div className={styles.faqAnswer}>
                                    <p>{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}