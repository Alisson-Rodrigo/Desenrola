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
    foto: null,
  });

  const [mensagem, setMensagem] = useState('');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lista de categorias com ícones
  const categorias = [
    { id: "1", nome: "Elétrica", icon: "⚡" },
    { id: "2", nome: "Hidráulica", icon: "🔧" },
    { id: "3", nome: "Pintura", icon: "🎨" },
    { id: "4", nome: "Jardinagem", icon: "🌱" },
    { id: "5", nome: "Limpeza", icon: "🧽" },
    { id: "6", nome: "Reformas e Construção", icon: "🏗️" },
    { id: "7", nome: "Tecnologia da Informação (TI)", icon: "💻" },
    { id: "8", nome: "Transporte e Mudanças", icon: "🚚" },
    { id: "9", nome: "Beleza e Estética", icon: "💅" },
    { id: "10", nome: "Educação e Aulas Particulares", icon: "📚" },
    { id: "11", nome: "Saúde e Bem-estar", icon: "🏥" },
    { id: "12", nome: "Serviços Automotivos", icon: "🚗" },
    { id: "13", nome: "Marcenaria e Móveis Planejados", icon: "🪵" },
    { id: "14", nome: "Serralheria", icon: "🔨" },
    { id: "15", nome: "Climatização", icon: "❄️" },
    { id: "16", nome: "Instalação de Eletrodomésticos", icon: "📺" },
    { id: "17", nome: "Fotografia e Filmagem", icon: "📸" },
    { id: "18", nome: "Eventos e Festas", icon: "🎉" },
    { id: "19", nome: "Consultoria Financeira e Contábil", icon: "💰" },
    { id: "20", nome: "Assistência Técnica", icon: "🔧" },
    { id: "21", nome: "Design e Publicidade", icon: "🎯" },
    { id: "22", nome: "Serviços Jurídicos", icon: "⚖️" },
    { id: "23", nome: "Segurança", icon: "🛡️" },
    { id: "24", nome: "Marketing Digital", icon: "📊" },
    { id: "25", nome: "Consultoria Empresarial", icon: "📈" },
    { id: "26", nome: "Tradução e Idiomas", icon: "🗣️" },
    { id: "27", nome: "Serviços Domésticos Gerais", icon: "🏠" },
    { id: "28", nome: "Manutenção Predial e Industrial", icon: "🏢" },
    { id: "29", nome: "Pet Care", icon: "🐕" },
    { id: "30", nome: "Culinária e Gastronomia", icon: "👨‍🍳" }
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      const file = files[0];

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          setMensagem("Formato inválido. Só são aceitos: JPG, JPEG, PNG, GIF.");
          setForm((prev) => ({ ...prev, foto: null }));
          setPreview(null);
          return;
        }

        setForm((prev) => ({ ...prev, foto: file }));
        setPreview(URL.createObjectURL(file));
        setMensagem(''); // Limpa mensagem de erro ao selecionar arquivo válido
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("Title", form.titulo);
      formData.append("Description", form.descricao);
      formData.append("Price", parseFloat(form.preco));
      formData.append("Category", parseInt(form.categoria));

      if (form.foto) {
        formData.append("Images", form.foto);
      }

      const token = localStorage.getItem("auth_token");

      const response = await fetch("http://localhost:5087/api/provider/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Erro ao cadastrar serviço.";
        try {
          const error = await response.json();
          console.error("Erro no cadastro:", error);
          errorMessage += ` ${error.message || "Verifique os dados inseridos."}`;
        } catch {
          console.error("Erro no cadastro:", response.status);
        }
        setMensagem(errorMessage);
        return;
      }

      setMensagem("Serviço cadastrado com sucesso!");
      setForm({ titulo: '', descricao: '', preco: '', categoria: '', foto: null });
      setPreview(null);

      setTimeout(() => setMensagem(''), 8000);
    } catch (err) {
      console.error(err);
      setMensagem("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMensagemClass = () => {
    if (mensagem.includes("sucesso")) return styles.avisoSuccess;
    if (mensagem.includes("Erro") || mensagem.includes("inválido") || mensagem.includes("inesperado")) return styles.avisoError;
    return styles.aviso;
  };

  return (
    <>
      <Navbar />
      
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <span className={styles.iconLarge}>✨</span>
            </div>
            <h1 className={styles.title}>Cadastrar Novo Serviço</h1>
            <p className={styles.subtitle}>
              Compartilhe seu talento e conecte-se com pessoas que precisam dos seus serviços
            </p>
          </div>

          {/* Mensagem de feedback */}
          {mensagem && (
            <div className={getMensagemClass()}>
              <span className={styles.mensagemIcon}>
                {mensagem.includes("sucesso") ? "✅" : "⚠️"}
              </span>
              {mensagem}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Título */}
            <div className={styles.inputGroup}>
              <label htmlFor="titulo" className={styles.label}>
                <span className={styles.labelIcon}>📝</span>
                Título do Serviço
              </label>
              <input
                id="titulo"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className={styles.input}
                placeholder="Ex: Instalação elétrica residencial"
                required
              />
            </div>

            {/* Descrição */}
            <div className={styles.inputGroup}>
              <label htmlFor="descricao" className={styles.label}>
                <span className={styles.labelIcon}>📄</span>
                Descrição Detalhada
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                rows={4}
                className={styles.textarea}
                placeholder="Descreva seu serviço, experiência e o que está incluído..."
                required
              />
              <div className={styles.charCount}>
                {form.descricao.length}/500 caracteres
              </div>
            </div>

            {/* Grid para Preço e Categoria */}
            <div className={styles.gridContainer}>
              {/* Preço */}
              <div className={styles.inputGroup}>
                <label htmlFor="preco" className={styles.label}>
                  <span className={styles.labelIcon}>💰</span>
                  Preço Sugerido
                </label>
                <div className={styles.priceInput}>
                  <span className={styles.pricePrefix}>R$</span>
                  <input
                    id="preco"
                    name="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.preco}
                    onChange={handleChange}
                    className={styles.inputPrice}
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className={styles.inputGroup}>
                <label htmlFor="categoria" className={styles.label}>
                  <span className={styles.labelIcon}>🎯</span>
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
                  <option value="">Escolha a categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload de Foto */}
            <div className={styles.inputGroup}>
              <label htmlFor="foto" className={styles.label}>
                <span className={styles.labelIcon}>📷</span>
                Foto do Serviço (Opcional)
              </label>
              
              <div className={styles.uploadArea}>
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  onChange={handleChange}
                  className={styles.fileInput}
                />
                <div className={styles.uploadContent}>
                  {preview ? (
                    <div className={styles.previewContainer}>
                      <img
                        src={preview}
                        alt="Pré-visualização"
                        className={styles.previewImage}
                      />
                      <div className={styles.previewOverlay}>
                        <span>Clique para alterar</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <span className={styles.uploadIcon}>📸</span>
                      <p className={styles.uploadText}>
                        Clique ou arraste uma imagem aqui
                      </p>
                      <p className={styles.uploadSubtext}>
                        JPG, PNG ou GIF até 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botão de Submit */}
            <div className={styles.submitContainer}>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <span className={styles.buttonIcon}>🚀</span>
                    Cadastrar Serviço
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}