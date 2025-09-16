'use client';

import { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import styles from "./CadastrarServico.module.css";

export default function CadastrarServico() {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    categoria: '',
    disponibilidade: '',
  });

  const [mensagem, setMensagem] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Serviço enviado:', form);

    setMensagem('⚠️ Serviço cadastrado com sucesso!');

    setForm({
      titulo: '',
      descricao: '',
      preco: '',
      categoria: '',
      disponibilidade: '',
    });

    setTimeout(() => setMensagem(''), 5000);
  };

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title}>Cadastrar Novo Serviço</h1>

        {mensagem && (
          <div className={styles.aviso}>
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="titulo" className={styles.label}>
              Título do Serviço
            </label>
            <input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div>
            <label htmlFor="descricao" className={styles.label}>
              Descrição
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
              className={styles.textarea}
              required
            />
          </div>

          <div>
            <label htmlFor="preco" className={styles.label}>
              Preço Sugerido (R$)
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              value={form.preco}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div>
            <label htmlFor="categoria" className={styles.label}>
              Categoria
            </label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className={styles.select}
              required
            >
                <option value="">Selecione...</option>
                <option value="Eletrica">Elétrica</option>
                <option value="Hidraulica">Hidráulica</option>
                <option value="Pintura">Pintura</option>
                <option value="Jardinagem">Jardinagem</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Reformas">Reformas e Construção</option>
                <option value="TI">Tecnologia da Informação (TI)</option>
                <option value="Transporte">Transporte e Mudanças</option>
                <option value="Beleza">Beleza e Estética</option>
                <option value="Educacao">Educação e Aulas Particulares</option>
                <option value="Saude">Saúde e Bem-estar</option>
                <option value="Automotivo">Serviços Automotivos</option>
                <option value="Marcenaria">Marcenaria e Móveis Planejados</option>
                <option value="Serralheria">Serralheria</option>
                <option value="Climatizacao">Climatização (Ar-condicionado e Ventilação)</option>
                <option value="InstalacaoEletrodomesticos">Instalação de Eletrodomésticos</option>
                <option value="Fotografia">Fotografia e Filmagem</option>
                <option value="Eventos">Eventos e Festas</option>
                <option value="ConsultoriaFinanceira">Consultoria Financeira e Contábil</option>
                <option value="AssistenciaTecnica">Assistência Técnica (Eletrônicos)</option>
                <option value="DesignPublicidade">Design e Publicidade</option>
                <option value="Juridico">Serviços Jurídicos</option>
                <option value="Seguranca">Segurança (Câmeras, Alarmes, Portões)</option>
                <option value="MarketingDigital">Marketing Digital e Social Media</option>
                <option value="ConsultoriaEmpresarial">Consultoria Empresarial</option>
                <option value="TraducaoIdiomas">Tradução e Idiomas</option>
                <option value="ServicosDomesticos">Serviços Domésticos Gerais</option>
                <option value="ManutencaoPredial">Manutenção Predial e Industrial</option>
                <option value="PetCare">Pet Care (Banho, Tosa e Passeio)</option>
                <option value="Gastronomia">Culinária e Gastronomia</option>
            </select>
          </div>

          <div>
            <label htmlFor="disponibilidade" className={styles.label}>
              Disponibilidade
            </label>
            <select
              id="disponibilidade"
              name="disponibilidade"
              value={form.disponibilidade}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Selecione...</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="integral">Integral</option>
            </select>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" className={styles.button}>
              Cadastrar Serviço
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
