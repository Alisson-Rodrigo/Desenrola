'use client';

import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';
import { useRouter } from 'next/navigation';

function HomePage({ hasToken }) {
  const router = useRouter();

  return (
    <div style={{ position: "relative" }}>
      <Navbar />

      <main style={{ padding: "2rem" }}>
        <h1>Bem-vindo à Home</h1>
        <p>Este conteúdo é visível, mas só interativo se você estiver logado.</p>
      </main>

      {!hasToken && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            zIndex: 50,
          }}
        >
          <p style={{ fontSize: "18px", marginBottom: "12px" }}>
            Você precisa estar logado para interagir.
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#10b981",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Ir para Login
          </button>
        </div>
      )}
    </div>
  );
}

export default withAuth(HomePage);
