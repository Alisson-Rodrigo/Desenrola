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
    foto: null,
  });

  const [mensagem, setMensagem] = useState('');
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mapeamento das categorias para os valores numéricos esperados pela API
  const categoriaMapping = {
    "Eletrica": 0,
    "Hidraulica": 1,
    "Pintura": 2,
    "Jardinagem": 3,
    "Limpeza": 4,
    "Reformas": 5,
    "TI": 6,
    "Transporte": 7,
    "Beleza": 8,
    "Educacao": 9,
    "Saude": 10,
    "Automotivo": 11,
    "Marcenaria": 12,
    "Serralheria": 13,
    "Climatizacao": 14,
    "InstalacaoEletrodomesticos": 15,
    "Fotografia": 16,
    "Eventos": 17,
    "ConsultoriaFinanceira": 18,
    "AssistenciaTecnica": 19,
    "DesignPublicidade": 20,
    "Juridico": 21,
    "Seguranca": 22,
    "MarketingDigital": 23,
    "ConsultoriaEmpresarial": 24,
    "TraducaoIdiomas": 25,
    "ServicosDomesticos": 26,
    "ManutencaoPredial": 27,
    "PetCare": 28,
    "Gastronomia": 29
  };

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

        // Validar tamanho do arquivo (opcional - máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setMensagem("❌ Arquivo muito grande. Máximo 5MB permitido.");
          setForm((prev) => ({ ...prev, foto: null }));
          setPreview(null);
          return;
        }

        setForm((prev) => ({ ...prev, foto: file }));
        setPreview(URL.createObjectURL(file));
        setMensagem(''); // Limpar mensagem de erro
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const uploadImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Remove o prefixo "data:image/...;base64," se necessário
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');

    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Token de autenticação não encontrado. Faça login novamente.');
      }

      // Preparar os dados para envio
      const serviceData = {
        title: form.titulo,
        description: form.descricao,
        price: parseFloat(form.preco),
        category: categoriaMapping[form.categoria],
        images: []
      };

      // Se houver imagem, converter para base64 e adicionar ao array
      if (form.foto) {
        try {
          const base64Image = await uploadImageToBase64(form.foto);
          serviceData.images = [base64Image];
        } catch (error) {
          throw new Error('Erro ao processar a imagem');
        }
      }

      // Fazer a requisição para a API
      const response = await fetch('http://localhost:5087/api/provider/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ${response.status}: ${errorData}`);
      }

      // Verificar se há resposta JSON
      const contentType = response.headers.get('content-type');
      let responseData = null;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
        console.log('Serviço cadastrado com sucesso:', responseData);
      }

      setMensagem('✅ Serviço cadastrado com sucesso!');

      // Limpar o formulário após sucesso
      setForm({
        titulo: '',
        descricao: '',
        preco: '',
        categoria: '',
        disponibilidade: '',
        foto: null,
      });
      setPreview(null);

      // Limpar preview da URL para evitar memory leak
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setTimeout(() => setMensagem(''), 5000);

    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      setMensagem(`❌ Erro ao cadastrar serviço: ${error.message}`);
      
      setTimeout(() => setMensagem(''), 8000);
    } finally {
      setLoading(false);
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
              disabled={loading}
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
              disabled={loading}
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
              min="0"
              value={form.preco}
              onChange={handleChange}
              className={styles.input}
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
            <button 
              type="submit" 
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Serviço'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}