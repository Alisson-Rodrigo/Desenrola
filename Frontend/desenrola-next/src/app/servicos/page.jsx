"use client";
import Link from "next/link";
import styles from "./Index.module.css";

export default function ServicosPage() {
  return (
    <div className={styles.servicosPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Serviços</h1>
          <p className={styles.pageSubtitle}>
            Gerencie e acompanhe todas as suas solicitações em um só lugar
          </p>
        </div>
      </header>

      <main className={styles.container}>
        <nav className={styles.menuGrid}>
          <Link href="/servicos/solicitarservico" className={styles.menuCard}>
            <h2>📌 Solicitar Serviço</h2>
            <p>Abra uma nova solicitação de serviço com rapidez.</p>
          </Link>

          <Link href="/servicos/realizados" className={styles.menuCard}>
            <h2>✅ Serviços Realizados</h2>
            <p>Acompanhe os serviços já concluídos e seus detalhes.</p>
          </Link>

          <Link href="/servicos/avaliados" className={styles.menuCard}>
            <h2>⭐ Avaliar Serviços</h2>
            <p>Dê seu feedback e ajude a melhorar a experiência.</p>
          </Link>
        </nav>
      </main>
    </div>
  );
}
