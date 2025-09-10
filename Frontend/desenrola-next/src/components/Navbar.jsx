"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // 👈 importa o router
import { ChevronDown, Menu, X, User, Settings, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // 👉 Função de logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('/login'); // redireciona para a tela de login
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>D</div>
          Desenrola
        </Link>

        {/* Navigation Links - Desktop */}
        <div className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navLink} ${styles.active}`}>
            Dashboard
          </Link>
          <Link href="/servicos" className={styles.navLink}>
            Serviços
          </Link>
          <Link href="/clientes" className={styles.navLink}>
            Clientes
          </Link>
        </div>

        {/* User Section */}
        <div className={styles.userSection}>
          <div 
            className={styles.userProfile} 
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <div className={styles.avatar}>JM</div>
            <span className={styles.userName}>João Martins</span>
            <ChevronDown className={styles.dropdownIcon} />

            {/* Dropdown Menu */}
            <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
              <div className={styles.dropdownHeader}>
                <h3>João Martins</h3>
                <p>joao.martins@email.com</p>
              </div>
              <Link href="/perfil" className={styles.dropdownItem}>
                <User size={16} /> Meu Perfil
              </Link>
              <Link href="/configuracoes" className={styles.dropdownItem}>
                <Settings size={16} /> Configurações
              </Link>
              <div className={styles.dropdownDivider}></div>
              <button
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={handleLogout} // 👈 chama logout
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <Link href="/dashboard" className={styles.mobileNavLink}>Dashboard</Link>
        <Link href="/servicos" className={styles.mobileNavLink}>Serviços</Link>
        <Link href="/clientes" className={styles.mobileNavLink}>Clientes</Link>
      </div>
    </nav>
  );
}
