'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import styles from './AvaliarServico.module.css';
import { EvaluationService } from '../../../services/evaluationService';

export default function AvaliarServicoPage() {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvaliacoes() {
      try {
        const data = await EvaluationService.getPendingEvaluations();
        setAvaliacoes(data);
      } catch (err) {
        console.error("Erro ao carregar serviços para avaliar:", err);
        alert("Erro ao carregar serviços para avaliar.");
      } finally {
        setLoading(false);
      }
    }

    fetchAvaliacoes();
  }, []);

  const handleAvaliar = async (id, providerId, nota, comentario) => {
    try {
      await EvaluationService.createEvaluation({
        providerId,
        rating: nota,
        comment: comentario,
      });

      // Remove serviço da lista após avaliação
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));

      alert(`Serviço ${id} avaliado com sucesso!`);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar avaliação. Verifique se o prestador existe e tente novamente.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Avaliação de serviços</h1>

        {loading ? (
          <p>Carregando avaliações...</p>
        ) : avaliacoes.length === 0 ? (
          <p>Nenhum serviço pendente de avaliação.</p>
        ) : (
          <ul className={styles.servicoList}>
            {avaliacoes.map((s) => (
              <li key={s.id} className={styles.servicoCard}>
                <h2>{s.titulo}</h2>
                <p><strong>Prestador:</strong> {s.prestador}</p>
                <p>{s.descricao}</p>
                <p><strong>Data de realização:</strong> {formatDate(s.data)}</p>

                <AvaliarForm servico={s} onAvaliar={handleAvaliar} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

// 🔹 Formulário de avaliação
function AvaliarForm({ servico, onAvaliar }) {
  const [nota, setNota] = useState(null);
  const [comentario, setComentario] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nota) {
      alert("Por favor, escolha uma nota!");
      return;
    }

    await onAvaliar(servico.id, servico.providerId, nota, comentario);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.avaliarForm}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setNota(n)}
            className={nota === n ? styles.starSelected : ""}
          >
            ⭐
          </button>
        ))}
      </div>

      <textarea
        className={styles.textarea}
        placeholder="Escreva um comentário sobre o serviço..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />

      <button type="submit" className={styles.btnPrimary}>
        Enviar Avaliação
      </button>
    </form>
  );
}

// 🔹 Função para formatar data no padrão brasileiro
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
