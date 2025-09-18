'use client';

import { useState } from 'react';
import Navbar from '../../../../../components/Navbar';
import styles from "./CadastrarServico.module.css";


/**
CadastrarServico - Página de cadastro de novos serviços.

permite que o usuário cadastre um serviço preenchendo título, descrição, preço,
categoria, disponibilidade e opcionalmente uma foto ilustrativa. 
Valida o formato da imagem e mostra uma pré-visualização antes do envio.

O que faz:
- Mostra um formulário para cadastro de serviço.
- Permite enviar título, descrição, preço, categoria, disponibilidade e uma foto.
- Faz validação do tipo de imagem (somente JPG, JPEG, PNG, GIF).
- Exibe mensagens de sucesso ou erro durante o processo.
- Limpa o formulário e remove a pré-visualização após envio.

Estados internos:
- form (objeto): armazena os dados do serviço (titulo, descricao, preco, categoria, foto).
- mensagem (string): mostra feedback de erro ou sucesso para o usuário.
- preview (string|null): armazena a URL da pré-visualização da imagem.

Funções principais:
- handleChange: atualiza o estado do formulário e valida arquivos de imagem.
- handleSubmit: processa o envio do formulário, exibe mensagem de sucesso e limpa os campos.

Dependências:
- Navbar: componente de navegação superior.
- styles (CSS Module): estilização da página.

*/

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto") {
      const file = files[0];

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
          setMensagem("❌ Formato inválido. Só são aceitos: JPG, JPEG, PNG, GIF.");
          setForm((prev) => ({ ...prev, foto: null }));
          setPreview(null);
          return;
        }

        setForm((prev) => ({ ...prev, foto: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("Title", form.titulo);
      formData.append("Description", form.descricao);
      formData.append("Price", parseFloat(form.preco));
      formData.append("Category", parseInt(form.categoria));

      if (form.foto) {
        formData.append("Images", form.foto);
      }

      // 🔑 Pega o token salvo no localStorage
      const token = localStorage.getItem("auth_token");

      const response = await fetch("http://localhost:5087/api/provider/services", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Token vai no cabeçalho
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "❌ Erro ao cadastrar serviço.";
        try {
          const error = await response.json();
          console.error("Erro no cadastro:", error);
          errorMessage += ` (${error.message || "Verifique os dados"})`;
        } catch {
          console.error("Erro no cadastro:", response.status);
        }
        setMensagem(errorMessage);
        return;
      }

      setMensagem("✅ Serviço cadastrado com sucesso!");
      setForm({ titulo: '', descricao: '', preco: '', categoria: '', foto: null });
      setPreview(null);

      setTimeout(() => setMensagem(''), 5000);
    } catch (err) {
      console.error(err);
      setMensagem("❌ Ocorreu um erro inesperado.");
    }
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
              step="0.01"
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
              <option value="1">Elétrica</option>
              <option value="2">Hidráulica</option>
              <option value="3">Pintura</option>
              <option value="4">Jardinagem</option>
              <option value="5">Limpeza</option>
              <option value="6">Reformas e Construção</option>
              <option value="7">Tecnologia da Informação (TI)</option>
              <option value="8">Transporte e Mudanças</option>
              <option value="9">Beleza e Estética</option>
              <option value="10">Educação e Aulas Particulares</option>
              <option value="11">Saúde e Bem-estar</option>
              <option value="12">Serviços Automotivos</option>
              <option value="13">Marcenaria e Móveis Planejados</option>
              <option value="14">Serralheria</option>
              <option value="15">Climatização</option>
              <option value="16">Instalação de Eletrodomésticos</option>
              <option value="17">Fotografia e Filmagem</option>
              <option value="18">Eventos e Festas</option>
              <option value="19">Consultoria Financeira e Contábil</option>
              <option value="20">Assistência Técnica</option>
              <option value="21">Design e Publicidade</option>
              <option value="22">Serviços Jurídicos</option>
              <option value="23">Segurança</option>
              <option value="24">Marketing Digital</option>
              <option value="25">Consultoria Empresarial</option>
              <option value="26">Tradução e Idiomas</option>
              <option value="27">Serviços Domésticos Gerais</option>
              <option value="28">Manutenção Predial e Industrial</option>
              <option value="29">Pet Care</option>
              <option value="30">Culinária e Gastronomia</option>
            </select>
          </div>

          <div>
            <label htmlFor="foto" className={styles.label}>
             Caso tenha, adicione uma foto do seu serviço
            </label>
            <input
              id="foto"
              name="foto"
              type="file"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={handleChange}
              className={styles.input}
            />
            {preview && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img
                  src={preview}
                  alt="Pré-visualização"
                  style={{ maxWidth: '200px', borderRadius: '8px' }}
                />
              </div>
            )}
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
