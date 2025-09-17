'use client';

import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';

function HomePage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <section className="home-section">
        <h1 className="home-title">
          Encontre o serviço que você precisa
        </h1>
        <p className="home-subtitle">
          Conectando você aos melhores profissionais de Picos-PI com qualidade e confiança
        </p>
      </section>
    </div>
  );
}

export default withAuth(HomePage);
