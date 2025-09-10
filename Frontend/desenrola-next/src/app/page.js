// src/app/page.js
'use client';

import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';

function HomePage() {
  return (
    <div>
      <Navbar />
      <h1>Bem-vindo ao painel!</h1>
    </div>
  );
}

export default withAuth(HomePage);
