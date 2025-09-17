'use client';

import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';

function HomePage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center px-4 py-20">
        {/* Título principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4 leading-tight">
          Encontre o serviço que você precisa
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-green-700 max-w-2xl">
          Conectando você aos melhores profissionais de Picos-PI 
          com qualidade e confiança
        </p>
      </section>
    </div>
  );
}

export default withAuth(HomePage);
