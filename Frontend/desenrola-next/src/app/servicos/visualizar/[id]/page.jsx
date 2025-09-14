"use client";

import Link from "next/link";
import styles from "./VisualizarServico.module.css";

export default function VisualizarServico({ params }) {
  const { id } = params;

  // 🔹 Dados estáticos para teste
  const servico = {
    id,
    titulo: "Conserto de Encanamento",
    descricao:
    "Realizo reparos hidráulicos, conserto de vazamentos e instalações de torneiras, registros e chuveiros. Atendimento rápido e de qualidade.",
    categoria: "Encanamento",
    endereco: "Rua das Flores, 123 - Centro",
    prestador: {
      nome: "João Silva",
      telefone: "(89) 99999-0000",
      email: "joao@email.com",
      iniciais: "JS",
      especialidade: "Encanador Profissional"
    },
    status: "Disponível",
    preco: "R$ 80-120",
    duracao: "2-3 horas",
    urgencia: "Média"
  };

  const getInitials = (nome) => {
    return nome.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.container}>
      <div className={styles.maxWidth}>
        {/* Service Header */}
        <div className={styles.serviceHeader}>
          <div className={styles.categoryBadge}>
            🔧 {servico.categoria}
          </div>
          
          <h1 className={styles.serviceTitle}>{servico.titulo}</h1>
          
          <div className={styles.serviceDescription}>
            {servico.descricao}
          </div>

          <div className={styles.addressSection}>
            <svg className={styles.addressIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span><strong>Endereço:</strong> {servico.endereco}</span>
          </div>
        </div>

        {/* Service Details */}
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoValue}>{servico.preco}</div>
              <div className={styles.infoLabel}>Preço Estimado</div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.infoValue}>{servico.duracao}</div>
              <div className={styles.infoLabel}>Duração Estimada</div>
            </div>
            
            <div className={styles.infoCard}>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                {servico.status}
              </div>
              <div className={styles.infoLabel}>Status</div>
            </div>
          </div>
        </div>

        {/* Prestador Card */}
        <div className={styles.prestadorCard}>
          <h3 className={styles.infoTitle}>Prestador</h3>
          
          <div className={styles.prestadorHeader}>
            <div className={styles.prestadorAvatar}>
              {getInitials(servico.prestador.nome)}
            </div>
            <div className={styles.prestadorInfo}>
              <h3>{servico.prestador.nome}</h3>
              <p className={styles.prestadorTitle}>{servico.prestador.especialidade}</p>
            </div>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <div className={styles.contactText}>{servico.prestador.telefone}</div>
            </div>

            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <div className={styles.contactText}>{servico.prestador.email}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href="/servicos/solicitarservico">
            <button className={styles.btnPrimary}>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              Solicitar Serviço
            </button>
          </Link>

          <Link href={`/servicos/agenda/${servico.id}`}>
            <button className={styles.btnSecondary}>
              <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8h6m0 0v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H10a2 2 0 00-2 2v6"/>
            </svg>
            Ver Agenda do Prestador
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}