'use client';

import { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import styles from "./CadastrarServico.module.css";
// Importando ícones do lucide-react
import { 
  Wand2, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ClipboardList, 
  DollarSign, 
  Target, 
  Camera, 
  Image, 
  Rocket 
} from 'lucide-react';

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

  // Lista de categorias SEM ícones
  const categorias = [
    { id: 0, nome: "Elétrica" },
    { id: 1, nome: "Hidráulica" },
    { id: 2, nome: "Pintura" },
    { id: 3, nome: "Jardinagem" },
    { id: 4, nome: "Limpeza" },
    { id: 5, nome: "Reformas e Construção" },
    { id: 6, nome: "Tecnologia da Informação (TI)" },
    { id: 7, nome: "Transporte e Mudanças" },
    { id: 8, nome: "Beleza e Estética" },
    { id: 9, nome: "Educação e Aulas Particulares" },
    { id: 10, nome: "Saúde e Bem-estar" },
    { id: 11, nome: "Serviços Automotivos" },
    { id: 12, nome: "Marcenaria e Móveis Planejados" },
    { id: 13, nome: "Serralheria" },
    { id: 14, nome: "Climatização" },
    { id: 15, nome: "Instalação de Eletrodomésticos" },
    { id: 16, nome: "Fotografia e Filmagem" },
    { id: 17, nome: "Eventos e Festas" },
    { id: 18, nome: "Consultoria Financeira e Contábil" },
    { id: 19, nome: "Assistência Técnica" },
    { id: 20, nome: "Design e Publicidade" },
    { id: 21, nome: "Serviços Jurídicos" },
    { id: 22, nome: "Segurança" },
    { id: 23, nome: "Marketing Digital" },
    { id: 24, nome: "Consultoria Empresarial" },
    { id: 25, nome: "Tradução e Idiomas" },
    { id: 26, nome: "Serviços Domésticos Gerais" },
    { id: 27, nome: "Manutenção Predial e Industrial" },
    { id: 28, nome: "Pet Care" },
    { id: 29, nome: "Culinária e Gastronomia" }
  ];
  
  /**
  Lida com as mudanças nos campos do formulário, incluindo o upload e preview da imagem.
  Valida o tipo da imagem ao selecionar um arquivo.
  @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e Evento de input
  */
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

  /**
  Envia os dados do formulário para a API para cadastrar um novo serviço.
  Cria um FormData, adiciona o token JWT e trata erros de resposta.
  @param {React.FormEvent<HTMLFormElement>} e Evento de envio do formulário
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("Title", form.titulo);
      formData.append("Description", form.descricao);
      formData.append("Price", parseFloat(form.preco));
      
      // Conversão explícita e log para debug
      const categoryId = parseInt(form.categoria);
      const selectedCategory = categorias.find(cat => cat.id === categoryId);
      
      console.log('Categoria selecionada:', selectedCategory);
      console.log('Category ID enviado:', categoryId);
      
      formData.append("Category", categoryId);

      if (form.foto) {
        formData.append("Images", form.foto);
      }

      const token = localStorage.getItem("auth_token");

      const response = await fetch("https://api.desenrola.shop/api/provider/services", {
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

  /**
  Retorna a classe CSS de aviso com base no conteúdo da mensagem.
  Usado para definir estilo de sucesso, erro ou neutro.
  @return {string} Classe CSS correspondente
  */
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
              {/* Emoji substituído por ícone Lucide */}
              <Wand2 className={styles.iconLarge} />
            </div>
            <h1 className={styles.title}>Cadastrar Novo Serviço</h1>
            <p className={styles.subtitle}>
              Compartilhe seu talento e conecte-se com pessoas que precisam dos seus serviços
            </p>
          </div>

          {/* Mensagem de feedback */}
          {mensagem && (
            <div className={getMensagemClass()}>
              {/* Emojis substituídos por ícones Lucide */}
              <span className={styles.mensagemIcon}>
                {mensagem.includes("sucesso") ? <CheckCircle /> : <AlertTriangle />}
              </span>
              {mensagem}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Título */}
            <div className={styles.inputGroup}>
              <label htmlFor="titulo" className={styles.label}>
                {/* Emoji substituído por ícone Lucide */}
                <FileText className={styles.labelIcon} />
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
                {/* Emoji substituído por ícone Lucide */}
                <ClipboardList className={styles.labelIcon} />
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
                  {/* Emoji substituído por ícone Lucide */}
                  <DollarSign className={styles.labelIcon} />
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
                  {/* Emoji substituído por ícone Lucide */}
                  <Target className={styles.labelIcon} />
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
                  {/* Emojis removidos do dropdown */}
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Upload de Foto */}
            <div className={styles.inputGroup}>
              <label htmlFor="foto" className={styles.label}>
                {/* Emoji substituído por ícone Lucide */}
                <Camera className={styles.labelIcon} />
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
                      {/* Emoji substituído por ícone Lucide */}
                      <Image className={styles.uploadIcon} />
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
                    {/* Emoji substituído por ícone Lucide */}
                    <Rocket className={styles.buttonIcon} />
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