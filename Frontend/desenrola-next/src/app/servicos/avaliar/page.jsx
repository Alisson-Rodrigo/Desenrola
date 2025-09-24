'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import styles from './AvaliarServico.module.css';

/**
Página de Avaliação de Prestador de Serviços

Essa página permite que um usuário autenticado avalie um prestador de serviços,
atribuindo uma nota de 1 a 5 estrelas e escrevendo um comentário.

Funcionalidades principais:
- Captura o `providerId` da URL para identificar o prestador.
- Busca e exibe o nome do prestador usando o endpoint de perfil.
- Verifica se o usuário já avaliou o prestador antes.
- Exibe formulário de avaliação caso ainda não tenha avaliado.
- Exibe mensagens de sucesso ou erro de acordo com a resposta da API.
*/
export default function AvaliarServicoPage() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get("providerId");

  const [jaAvaliado, setJaAvaliado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providerName, setProviderName] = useState("");
  const [providerNotFound, setProviderNotFound] = useState(false);

  /**
   * Efeito que roda ao carregar a página para:
   * 1. Buscar o nome do prestador
   * 2. Verificar se o usuário já avaliou o prestador
   */
  useEffect(() => {
    const buscarDadosProvider = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token || !providerId) {
        setLoading(false);
        return;
      }

      try {
        // Buscar dados do prestador
        const profileResponse = await fetch(`http://localhost:5087/api/provider/profile/specify?Id=${providerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProviderName(profileData.userName || "Prestador");
        } else {
          console.error("Prestador não encontrado");
          setProviderNotFound(true);
          setLoading(false);
          return;
        }

        // Verificar se já foi avaliado
        const evaluationResponse = await fetch(`http://localhost:5087/api/evaluation/provider/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (evaluationResponse.ok) {
          const evaluationData = await evaluationResponse.json();
          if (evaluationData?.hasEvaluated) {
            setJaAvaliado(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do prestador:", error);
        setProviderNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosProvider();
  }, [providerId]);

  /**
   * Função responsável por enviar a avaliação ao backend.
   * - Valida se o usuário está autenticado.
   * - Envia via POST para a API.
   * - Trata mensagens de erro específicas (ex: já avaliou).
   *
   * @param {number} nota - Nota da avaliação (1 a 5)
   * @param {string} comentario - Texto do comentário escrito pelo usuário
   */
  const handleAvaliar = async (nota, comentario) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Você precisa estar autenticado para enviar uma avaliação.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("ProviderId", providerId);
      formData.append("Note", nota.toString());
      formData.append("Comment", comentario);

      const response = await fetch("http://localhost:5087/api/evaluation", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorJson = await response.json();

        if (errorJson?.message === "Você já avaliou este prestador.") {
          setJaAvaliado(true);
          alert("Você já avaliou este prestador.");
        } else if (errorJson?.message) {
          alert("Erro: " + errorJson.message);
        } else {
          alert("Erro ao enviar avaliação.");
        }
        return;
      }

      const data = await response.json();
      alert(data.message || "Avaliação enviada com sucesso!");
      setJaAvaliado(true);
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação. Verifique se o prestador existe, se você está autenticado e tente novamente.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>
          {providerName ? `Avaliar ${providerName}` : "Avaliar Prestador"}
        </h1>

        {loading ? (
          <p>Carregando...</p>
        ) : providerNotFound ? (
          <p className={styles.errorMessage}>❌ Prestador não encontrado ou você não tem permissão para acessar este perfil.</p>
        ) : providerId ? (
          jaAvaliado ? (
            <div className={styles.alreadyEvaluatedContainer}>
              <p className={styles.alreadyEvaluated}>✅ Você já avaliou {providerName}.</p>
            </div>
          ) : (
            <AvaliarForm onAvaliar={handleAvaliar} providerName={providerName} />
          )
        ) : (
          <p className={styles.emptyMessage}>⚠️ Nenhum prestador selecionado para avaliação.</p>
        )}
      </div>
    </>
  );
}

/**
 * Formulário de Avaliação
 *
 * Exibe:
 * - Botões de estrelas para seleção da nota.
 * - Campo de texto para comentário.
 * - Botão para envio da avaliação.
 *
 * @param {Function} onAvaliar - Função callback para processar o envio da avaliação
 * @param {string} providerName - Nome do prestador sendo avaliado
 */
function AvaliarForm({ onAvaliar, providerName }) {
  const [nota, setNota] = useState(null);
  const [comentario, setComentario] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nota) {
      alert("Por favor, escolha uma nota!");
      return;
    }

    await onAvaliar(nota, comentario);
    setNota(null);
    setComentario("");
  };

  return (
    <div className={styles.formContainer}>
      {providerName && (
        <p className={styles.providerInfo}>
          Avaliando: <strong>{providerName}</strong>
        </p>
      )}
      
      <form onSubmit={handleSubmit} className={styles.avaliarForm}>
        <div className={styles.ratingSection}>
          <label className={styles.ratingLabel}>Sua nota:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setNota(n);
                }}
                className={`${styles.starButton} ${nota === n ? styles.starSelected : ''}`}
                title={`${n} estrela${n > 1 ? 's' : ''}`}
              >
                ⭐
              </button>
            ))}
          </div>
          {nota && (
            <p className={styles.selectedRating}>
              Nota selecionada: {nota} estrela{nota > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className={styles.commentSection}>
          <label className={styles.commentLabel}>Comentário:</label>
          <textarea
            className={styles.textarea}
            placeholder={`Escreva um comentário sobre ${providerName || 'o prestador'}...`}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>
          Enviar Avaliação
        </button>
      </form>
    </div>
  );
}