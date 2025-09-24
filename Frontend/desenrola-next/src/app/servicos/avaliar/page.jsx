'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import styles from './AvaliarServico.module.css';
import { EvaluationService } from '../../../services/evaluationService';

export default function AvaliarServicoPage() {
  const params = useParams();
  const providerId = params?.id; // pega o ID do prestador da URL

  const handleAvaliar = async (nota, comentario) => {
    try {
      await EvaluationService.createEvaluation({
        providerId,
        rating: nota,
        comment: comentario,
      });

      alert(`Avaliação enviada com sucesso!`);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar avaliação. Verifique se o prestador existe e tente novamente.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Avaliar Prestador</h1>

        <AvaliarForm onAvaliar={handleAvaliar} />
      </div>
    </>
  );
}

// 🔹 Formulário de avaliação
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
            onClick={() => setNota(n)}
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
