"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, Menu, X, User, LogOut, Shield, Plus } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prefetch das rotas principais
  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/servicos");
    router.prefetch("/clientes");
    router.prefetch("/perfil/usuario/meu");
    router.prefetch("/perfil/prestador/meu");
    router.prefetch("/auth/login");
    router.prefetch("/admin");
    router.prefetch("/perfil/prestador/servicos/cadastrar");
  }, [router]);

  // Normaliza role para string em minúsculo
  function normalizeRole(role) {
    if (role === undefined || role === null) return "";
    return String(role).toLowerCase();
  }

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    router.push("/auth/login");
    window.dispatchEvent(new Event("storage"));
  };

  // Carregar usuário do localStorage ou token
  function loadUser() {
    const userStorage = localStorage.getItem("auth_user");
    if (userStorage) {
      try {
        const userData = JSON.parse(userStorage);
        userData.role = normalizeRole(userData.role);
        setUser(userData);
        return;
      } catch (_) {}
    }

    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // ✅ Verificação de expiração
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.warn("Token expirado, removendo...");
          handleLogout();
          return;
        }

        const userData = {
          name: decoded.unique_name || "",
          email: decoded.email || "",
          role: normalizeRole(decoded.role),
        };
        setUser(userData);
      } catch (err) {
        console.error("Erro ao decodificar token:", err);
        handleLogout();
      }
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // helper para marcar ativo
  const getLinkClass = (href) =>
    `${styles.navLink} ${pathname === href ? styles.active : ""}`;

  // Verificação se é admin ou provider
  const isAdmin = user && (user.role === "0" || user.role === "admin");
  const isProvider = user && (user.role === "2" || user.role === "provider");

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>D</div>
          Desenrola
        </Link>

        {/* Links Desktop */}
        <div className={styles.nav}>
          <Link href="/" className={getLinkClass("/")}>
            Dashboard
          </Link>
          <Link href="/servicos" className={getLinkClass("/servicos")}>
            Serviços
          </Link>
          <Link href="/clientes" className={getLinkClass("/clientes")}>
            Clientes
          </Link>

          {/* Botão Cadastrar Serviço - só aparece para Provider */}
          {isProvider && (
            <Link
              href="/perfil/prestador/servicos/cadastrar"
              className={getLinkClass("/perfil/prestador/servicos/cadastrar")}
            >
              Cadastrar Serviço
            </Link>
          )}

          {/* Botão Admin */}
          {isAdmin && (
            <Link href="/admin" className={getLinkClass("/admin")}>
              Admin
            </Link>
          )}
        </div>

        {/* Seção Usuário */}
        <div className={styles.userSection}>
          {user ? (
            <div
              className={styles.userProfile}
              onClick={toggleDropdown}
              ref={dropdownRef}
            >
              <div className={styles.avatar}>
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "??"}
              </div>
              <span className={styles.userName}>
                {user?.name || "Usuário"}
              </span>
              <ChevronDown className={styles.dropdownIcon} />

              <div
                className={`${styles.dropdown} ${
                  isDropdownOpen ? styles.open : ""
                }`}
              >
                <div className={styles.dropdownHeader}>
                  <h3>{user?.name || "Usuário"}</h3>
                  <p>{user?.email || "email@dominio.com"}</p>
                </div>

                {/* Link Perfil condicional */}
                {isProvider ? (
                  <Link
                    href="/perfil/prestador/meu"
                    className={styles.dropdownItem}
                  >
                    <User size={16} /> Meu Perfil (Prestador)
                  </Link>
                ) : (
                  <Link
                    href="/perfil/usuario/meu"
                    className={styles.dropdownItem}
                  >
                    <User size={16} /> Meu Perfil
                  </Link>
                )}

                {/* Link Cadastrar Serviço */}
                {isProvider && (
                  <Link
                    href="/perfil/prestador/servicos/cadastrar"
                    className={styles.dropdownItem}
                  >
                    <Plus size={16} /> Cadastrar Serviço
                  </Link>
                )}

                {/* Link Admin */}
                {isAdmin && (
                  <Link href="/admin" className={styles.dropdownItem}>
                    <Shield size={16} /> Administração
                  </Link>
                )}

                <div className={styles.dropdownDivider}></div>
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </div>
          ) : (
            <button
              className={styles.loginButton}
              onClick={() => router.push("/auth/login")}
            >
              Entrar
            </button>
          )}

          {/* Botão Mobile */}
          <button
            className={styles.mobileMenuButton}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div
        className={`${styles.mobileMenu} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        <Link href="/" className={getLinkClass("/")}>
          Dashboard
        </Link>
        <Link href="/servicos" className={getLinkClass("/servicos")}>
          Serviços
        </Link>
        <Link href="/clientes" className={getLinkClass("/clientes")}>
          Clientes
        </Link>

        {/* Link Perfil condicional no Mobile */}
        {isProvider ? (
          <Link
            href="/perfil/prestador/meu"
            className={getLinkClass("/perfil/prestador/meu")}
          >
            Meu Perfil (Prestador)
          </Link>
        ) : (
          <Link
            href="/perfil/usuario/meu"
            className={getLinkClass("/perfil/usuario/meu")}
          >
            Meu Perfil
          </Link>
        )}

        {/* Link Cadastrar Serviço */}
        {isProvider && (
          <Link
            href="/perfil/prestador/servicos/cadastrar"
            className={getLinkClass("/perfil/prestador/servicos/cadastrar")}
          >
            Cadastrar Serviço
          </Link>
        )}

        {/* Link Admin */}
        {isAdmin && (
          <Link href="/admin" className={getLinkClass("/admin")}>
            Admin
          </Link>
        )}

        {!user && (
          <button
            className={styles.mobileNavLogin}
            onClick={() => router.push("/auth/login")}
          >
            Entrar
          </button>
        )}
      </div>
    </nav>
  );
}
