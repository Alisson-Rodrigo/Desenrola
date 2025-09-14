"use client";

import { useState } from "react";
import Navbar from '../../../../../components/Navbar'; // 1. IMPORTAÇÃO DA NAVBAR
import styles from "./GerenciarServicos.module.css";

export default function GerenciarServicos() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [servicos, setServicos] = useState([
    {
      id: 1,
      titulo: "Conserto de Encanamento",
      cliente: {
        nome: "Maria Silva",
        telefone: "(89) 99999-1111",
        email: "maria@email.com",
      },
      endereco: "Rua das Flores, 123 - Centro",
      dataHora: "2024-12-16T08:00",
      preco: "R$ 100",
      observacoes: "Vazamento na pia da cozinha, precisa ser urgente",
      status: "pendente",
      dataSolicitacao: "2024-12-15T14:30",
    },
    {
      id: 2,
      titulo: "Instalação de Torneira",
      cliente: {
        nome: "João Santos",
        telefone: "(89) 99999-2222",
        email: "joao@email.com",
      },
      endereco: "Av. Principal, 456 - Bairro Novo",
      dataHora: "2024-12-17T14:00",
      preco: "R$ 80",
      observacoes: "Torneira nova, já comprada pelo cliente",
      status: "aceito",
      dataSolicitacao: "2024-12-14T10:15",
    },
  ]);

  const handleAceitarServico = (servicoId) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === servicoId ? { ...s, status: "aceito" } : s))
    );
  };

  const handleRecusarServico = (servicoId) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === servicoId ? { ...s, status: "recusado" } : s))
    );
  };

  const servicosFiltrados = servicos.filter((s) =>
    filtroStatus === "todos" ? true : s.status === filtroStatus
  );

  return (
    <>
      {/* ✅ Navbar sempre fixa no topo */}
      <Navbar />

      <div className={styles.container}>
        <div className={styles.maxWidth}>
          {/* Header */}
          <div className={styles.pageHeader}>
            <div className={styles.headerContent}>
              <div>
                <h1 className={styles.pageTitle}>Gerenciar Serviços</h1>
                <p className={styles.pageSubtitle}>
                  Visualize e gerencie suas solicitações de serviço
                </p>
              </div>
              <div className={styles.filtroButtons}>
                <button
                  className={`${styles.filtroButton} ${
                    filtroStatus === "todos" ? styles.ativo : ""
                  }`}
                  onClick={() => setFiltroStatus("todos")}
                >
                  Todos
                </button>
                <button
                  className={`${styles.filtroButton} ${
                    filtroStatus === "pendente" ? styles.ativo : ""
                  }`}
                  onClick={() => setFiltroStatus("pendente")}
                >
                  Pendentes
                </button>
                <button
                  className={`${styles.filtroButton} ${
                    filtroStatus === "aceito" ? styles.ativo : ""
                  }`}
                  onClick={() => setFiltroStatus("aceito")}
                >
                  Aceitos
                </button>
                <button
                  className={`${styles.filtroButton} ${
                    filtroStatus === "recusado" ? styles.ativo : ""
                  }`}
                  onClick={() => setFiltroStatus("recusado")}
                >
                  Recusados
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Serviços */}
          <div className={styles.servicosContainer}>
            {servicosFiltrados.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhum serviço encontrado</p>
              </div>
            ) : (
              servicosFiltrados.map((servico) => (
                <div key={servico.id} className={styles.servicoCard}>
                  <h3>{servico.titulo}</h3>
                  <p>
                    <strong>Cliente:</strong> {servico.cliente.nome} (
                    {servico.cliente.telefone})
                  </p>
                  <p>
                    <strong>Email:</strong> {servico.cliente.email}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {servico.endereco}
                  </p>
                  <p>
                    <strong>Data/Hora:</strong>{" "}
                    {new Date(servico.dataHora).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(servico.dataHora).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Preço:</strong> {servico.preco}
                  </p>
                  {servico.observacoes && (
                    <p>
                      <strong>Observações:</strong> {servico.observacoes}
                    </p>
                  )}
                  <p>
                    <strong>Status:</strong> {servico.status}
                  </p>
                  <p>
                    <strong>Solicitado em:</strong>{" "}
                    {new Date(
                      servico.dataSolicitacao
                    ).toLocaleDateString("pt-BR")}{" "}
                    às{" "}
                    {new Date(servico.dataSolicitacao).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </p>

                  {servico.status === "pendente" && (
                    <div className={styles.cardActions}>
                      <button
                        onClick={() => handleAceitarServico(servico.id)}
                        className={styles.btnAceitar}
                      >
                        Aceitar
                      </button>
                      <button
                        onClick={() => handleRecusarServico(servico.id)}
                        className={styles.btnRecusar}
                      >
                        Recusar
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
