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
- form (objeto): armazena os dados do serviço (titulo, descricao, preco, categoria, disponibilidade, foto).
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
    disponibilidade: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", form.titulo);
    formData.append("descricao", form.descricao);
    formData.append("preco", form.preco);
    formData.append("categoria", form.categoria);
    formData.append("disponibilidade", form.disponibilidade);
    if (form.foto) {
      formData.append("foto", form.foto);
    }

    console.log("Serviço enviado:", {
      ...form,
      foto: form.foto ? form.foto.name : null,
    });

    setMensagem('✅ Serviço cadastrado com sucesso!');

    setForm({
      titulo: '',
      descricao: '',
      preco: '',
      categoria: '',
      disponibilidade: '',
      foto: null,
    });
    setPreview(null);

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
              <option value="Climatizacao">Climatização</option>
              <option value="InstalacaoEletrodomesticos">Instalação de Eletrodomésticos</option>
              <option value="Fotografia">Fotografia e Filmagem</option>
              <option value="Eventos">Eventos e Festas</option>
              <option value="ConsultoriaFinanceira">Consultoria Financeira e Contábil</option>
              <option value="AssistenciaTecnica">Assistência Técnica</option>
              <option value="DesignPublicidade">Design e Publicidade</option>
              <option value="Juridico">Serviços Jurídicos</option>
              <option value="Seguranca">Segurança</option>
              <option value="MarketingDigital">Marketing Digital</option>
              <option value="ConsultoriaEmpresarial">Consultoria Empresarial</option>
              <option value="TraducaoIdiomas">Tradução e Idiomas</option>
              <option value="ServicosDomesticos">Serviços Domésticos Gerais</option>
              <option value="ManutencaoPredial">Manutenção Predial e Industrial</option>
              <option value="PetCare">Pet Care</option>
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
