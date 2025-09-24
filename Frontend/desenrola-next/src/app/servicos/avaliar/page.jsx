'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import styles from './AvaliarServico.module.css';
import { EvaluationService } from '@/services/evaluationService';

export default function AvaliarServicoPage() {
  // 🔧 Mock para exibição; ideal seria carregar via API futuramente
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      titulo: "Conserto de Encanamento",
      prestador: "João Silva",
      providerId: "f99d1cbe-aaa1-4e9d-91bd-3825e6e6cbe4",
      descricao: "Troca de cano na cozinha",
      data: "2025-09-10",
      nota: null,
      comentario: "",
    },
    {
      id: 2,
      titulo: "Instalação de Ar-Condicionado",
      prestador: "Maria Oliveira",
      providerId: "9aaf7e8d-50ec-4955-a557-8d3cd1a6b4e2",
      descricao: "Split 12.000 BTUs",
      data: "2025-09-05",
      nota: 5,
      comentario: "Serviço rápido e de qualidade!",
    },
  ]);

  const handleAvaliar = async (id, providerId, nota, comentario) => {
    try {
      await EvaluationService.createEvaluation({
        providerId,
        rating: nota,
        comment: comentario,
      });

      setAvaliacoes((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, nota, comentario } : a
        )
      );

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

        <ul className={styles.servicoList}>
          {avaliacoes.map((s) => (
            <li key={s.id} className={styles.servicoCard}>
              <h2>{s.titulo}</h2>
              <p><strong>Prestador:</strong> {s.prestador}</p>
              <p>{s.descricao}</p>
              <p><strong>Data de realização:</strong> {formatDate(s.data)}</p>

              {s.nota ? (
                <div className={styles.avaliacaoFeita}>
                  <p className={styles.avaliado}>⭐ {s.nota}/5</p>
                  <p className={styles.comentario}>
                    <strong>Comentário:</strong> {s.comentario}
                  </p>
                </div>
              ) : (
                <AvaliarForm servico={s} onAvaliar={handleAvaliar} />
              )}
            </li>
          ))}
        </ul>
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
