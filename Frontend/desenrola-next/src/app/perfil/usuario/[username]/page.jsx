import React from 'react';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  // Dados fixos por enquanto
  const userData = {
    username: 'joao.silva',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(85) 99999-1234',
    city: 'Picos, Piauí',
    address: 'Rua das Flores, 123 - Centro',
    password: '********'
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Desenvolva</span>
        </div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>Home</a>
          <a href="#" className={styles.navLink}>Recursos</a>
          <a href="#" className={styles.navLink}>Sobre nós</a>
          <a href="#" className={styles.navLink}>Contato</a>
        </nav>
        <div className={styles.userInfo}>
          <span className={styles.username}>{userData.username}</span>
          <div className={styles.userAvatar}>JS</div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarLarge}>JS</div>
            <h3 className={styles.userName}>{userData.name}</h3>
            <p className={styles.userEmail}>{userData.email}</p>
            
            <button className={styles.btnPrimary}>Meu Perfil</button>
            
            <nav className={styles.sidebarNav}>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.icon}>📊</span>
                Meus Projetos
              </a>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.icon}>⚙️</span>
                Configurações
              </a>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.icon}>❓</span>
                Suporte
              </a>
            </nav>
            
            <button className={styles.btnSecondary}>
              Solicitar Convite de Desenvolvedor
            </button>
          </div>
        </aside>

        {/* Profile Content */}
        <section className={styles.profileContent}>
          <div className={styles.profileHeader}>
            <h1>Meu Perfil</h1>
            <button className={styles.btnEdit}>📝 Editar</button>
          </div>

          <div className={styles.profileForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>NOME COMPLETO</label>
                <input type="text" value={userData.name} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label>EMAIL</label>
                <input type="email" value={userData.email} readOnly />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>TELEFONE</label>
                <input type="tel" value={userData.phone} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label>DATA DE NASCIMENTO</label>
                <input type="text" value="15/03/1990" readOnly />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>CIDADE</label>
                <input type="text" value={userData.city} readOnly />
              </div>
              <div className={styles.formGroup}>
                <label>ENDEREÇO</label>
                <input type="text" value={userData.address} readOnly />
              </div>
            </div>

            <button className={styles.btnSave}>Salvar Usuário</button>

            <p className={styles.disclaimer}>
              Tenha certeza de que todos os dados estão corretos. Caso não seja possível alterar, solicite novamente a alteração. Para alterar seu logon, veja como em nossa plataforma Slack em #suporte.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserProfile;