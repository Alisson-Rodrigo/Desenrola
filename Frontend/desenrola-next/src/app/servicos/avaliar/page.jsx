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
- Verifica se o usuário já avaliou o prestador antes.
- Exibe formulário de avaliação caso ainda não tenha avaliado.
- Exibe mensagens de sucesso ou erro de acordo com a resposta da API.
*/
export default function AvaliarServicoPage() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get("providerId");

  const [jaAvaliado, setJaAvaliado] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Efeito que roda ao carregar a página para verificar
   * se o usuário já avaliou o prestador.
   */
  useEffect(() => {
    const verificarAvaliacao = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token || !providerId) return;

      try {
        const response = await fetch(`http://localhost:5087/api/evaluation/provider/${providerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.hasEvaluated) {
            setJaAvaliado(true);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar avaliação:", error);
      } finally {
        setLoading(false);
      }
    };

    verificarAvaliacao();
  }, [providerId]);

 /**
Função responsável por enviar a avaliação ao backend.
- Valida se o usuário está autenticado.
- Envia via POST para a API.
- Trata mensagens de erro específicas (ex: já avaliou).

@param {number} nota - Nota da avaliação (1 a 5)
@param {string} comentario - Texto do comentário escrito pelo usuário
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
        <h1 className={styles.pageTitle}>Avaliar Prestador</h1>

        {loading ? (
          <p>Carregando...</p>
        ) : providerId ? (
          jaAvaliado ? (
            <p className={styles.alreadyEvaluated}>✅ Você já avaliou este prestador.</p>
          ) : (
            <AvaliarForm onAvaliar={handleAvaliar} />
          )
        ) : (
          <p className={styles.emptyMessage}>⚠️ Nenhum prestador selecionado para avaliação.</p>
        )}
      </div>
    </>
  );
}

/**
Formulário de Avaliação

Exibe:
- Botões de estrelas para seleção da nota.
- Campo de texto para comentário.
- Botão para envio da avaliação.

@param {Function} onAvaliar - Função callback para processar o envio da avaliação
*/
function AvaliarForm({ onAvaliar }) {
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
    <form onSubmit={handleSubmit} className={styles.avaliarForm}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setNota(n);
            }}
            className={nota === n ? styles.starSelected : ""}
          >
            ⭐
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Escreva um comentário sobre o prestador..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button type="submit" className={styles.btnPrimary}>
        Enviar Avaliação
      </button>
    </form>
  );
}
