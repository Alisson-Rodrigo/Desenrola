"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // 
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // 👈 estado para usuário
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Fecha dropdown ao clicar fora
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Recupera token e decodifica
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.unique_name,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
      }
    }
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    router.push('auth/login');
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
            {/* Avatar: iniciais do nome */}
            <div className={styles.avatar}>
              {user?.name ? user.name.substring(0,2).toUpperCase() : "??"}
            </div>
            <span className={styles.userName}>{user?.name || "Usuário"}</span>
            <ChevronDown className={styles.dropdownIcon} />

            {/* Dropdown Menu */}
            <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
              <div className={styles.dropdownHeader}>
                <h3>{user?.name || "Usuário"}</h3>
                <p>{user?.email || "email@dominio.com"}</p>
              </div>
              <Link href="/perfil/usuario/meu" className={styles.dropdownItem}>
                <User size={16} /> Meu Perfil
              </Link>
             
              <div className={styles.dropdownDivider}></div>
              <button
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={handleLogout}
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
