// src/app/page.js
'use client';

import Navbar from '../components/Navbar';
import { withAuth } from '../hooks/withAuth';

function HomePage() {
  return (
    <div>
      <Navbar />
   
    </div>
  );
}

export default withAuth(HomePage);
