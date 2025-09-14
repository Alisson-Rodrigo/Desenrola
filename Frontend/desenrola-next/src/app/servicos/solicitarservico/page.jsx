"use client";
import React, { useState } from "react";
import {
  Upload,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
} from "lucide-react";
import styles from "./SolicitacaoServicos.module.css";

const SolicitacaoServicos = () => {
  // 🔹 Valores iniciais já preenchidos (estáticos, simulação)
  const [formData, setFormData] = useState({
    categoria: "Eletricista",
    titulo: "Troca de disjuntor",
    descricao: "Preciso da troca de um disjuntor que está queimado no quadro de energia.",
    endereco: "Rua das Flores, 123 - Centro, Picos/PI",
    cep: "64600-000",
    data: "2025-09-20",
    hora: "14:00",
    nome: "João da Silva",
    telefone: "(89) 99999-1234",
    email: "joao.silva@email.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Solicitação enviada:", formData);
    alert("Solicitação enviada com sucesso!");
  };

  return (
    <div className={styles.solicitacaoPage}>
      {/* Cabeçalho */}
      <header className={styles.header}>
        <button className={styles.backBtn}>

        </button>

        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Solicitar Serviço</h1>
          <p className={styles.pageSubtitle}>
            Você está solicitando o serviço de <strong>Pedro Eletricista ⚡</strong>
          </p>
        </div>
      </header>

      {/* Formulário */}
      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.solicitacaoForm}>
          <div className={styles.formStep}>
            <div className={styles.stepHeader}>
              <h2>Detalhes do Serviço</h2>
              <p>Verifique as informações e ajuste se necessário antes de enviar.</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <MapPin size={16} className={styles.labelIcon} />
                Categoria
              </label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={styles.formTextarea}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Calendar size={16} className={styles.labelIcon} />
                  Data
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Clock size={16} className={styles.labelIcon} />
                  Hora
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <h3>Seus dados</h3>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <User size={16} className={styles.labelIcon} />
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Phone size={16} className={styles.labelIcon} />
                  Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  <Mail size={16} className={styles.labelIcon} />
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                <Upload size={18} /> Enviar Solicitação
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SolicitacaoServicos;
