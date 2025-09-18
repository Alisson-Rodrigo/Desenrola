import React from 'react';
import styles from './Favoritos.module.css';
// Importando os ícones necessários da biblioteca react-icons
import { FaHeart, FaStar } from 'react-icons/fa';
import { FiMessageSquare, FiUser, FiMapPin, FiHeart } from 'react-icons/fi';

/**
 * @typedef {object} Prestador
 * @property {string} nome - O nome do prestador de serviços.
 * @property {string} especialidade - A principal área de atuação do prestador.
 * @property {string} localizacao - A cidade e bairro do prestador.
 * @property {number} avaliacao - A nota média de avaliação (de 0 a 5).
 * @property {number} avaliacoes - O número total de avaliações recebidas.
 * @property {number} servicos - O número total de serviços realizados.
 * @property {number} anos - Anos de experiência do prestador.
 * @property {number} satisfacao - A porcentagem de satisfação dos clientes.
 * @property {string[]} especialidades - Um array com tags de suas especialidades.
 */

/**
 * @const {Prestador[]} prestadores
 * @description Array de dados de exemplo (mock) para a lista de prestadores.
 * No futuro, estes dados podem ser substituídos por uma chamada a uma API ou banco de dados.
 */
const prestadores = [
  {
    nome: 'Nome do Prestador',
    especialidade: 'Eletricista',
    localizacao: 'Centro, Picos-PI',
    avaliacao: 5.0,
    avaliacoes: 45,
    servicos: 89,
    anos: 3,
    satisfacao: 98,
    especialidades: ['Instalação Elétrica', 'Chuveiros']
  },
  {
    nome: 'Nome do Prestador',
    especialidade: 'Diarista',
    localizacao: 'Junco, Picos-PI',
    avaliacao: 4.9,
    avaliacoes: 67,
    servicos: 156,
    anos: 2,
    satisfacao: 100,
    especialidades: ['Limpeza Residencial', 'Organização']
  },
  {
    nome: 'Nome do Prestador',
    especialidade: 'Montadora de Móveis',
    localizacao: 'Canto da Várzea, Picos-PI',
    avaliacao: 4.8,
    avaliacoes: 22,
    servicos: 78,
    anos: 1.5,
    satisfacao: 96,
    especialidades: ['Móveis Planejados', 'Estantes']
  },
  {
    nome: 'Nome do Prestador',
    especialidade: 'Diarista',
    localizacao: 'Centro, Picos-PI',
    avaliacao: 4.9,
    avaliacoes: 108,
    servicos: 234,
    anos: 4,
    satisfacao: 99,
    especialidades: ['Limpeza Pós-obra', 'Guarda-roupas']
  }
];

/**
 * @component FavoritosPage
 * @description Renderiza a página "Meus Favoritos", que exibe uma navbar, estatísticas
 * e uma lista de prestadores de serviço favoritados pelo usuário.
 * @returns {JSX.Element} A página de favoritos completa.
 */
const FavoritosPage = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Navbar Principal. 
        OBS: Idealmente, este componente de navegação deveria estar no arquivo `layout.js` 
        principal do projeto para ser reaproveitado em todas as páginas do site.
      */}
      <nav className={styles.navbar}>
        <div className={styles.navLogo}>Desenrola</div>
        <div className={styles.navLinks}>
          <a href="#">Início</a>
          <a href="#">Serviços</a>
          <a href="#">Prestadores</a>
          <a href="#" className={styles.activeLink}>Favoritos</a>
        </div>
        <div className={styles.navUser}>
          <div className={styles.userAvatar}>MS</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Nome do Usuário</span>
            <span className={styles.userPlan}>VIP</span>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal da página */}
      <main className={styles.mainContent}>
        
        {/* Card de Cabeçalho da Página "Meus Favoritos" */}
        <div className={styles.favoritesHeader}>
          <FaHeart className={styles.headerIcon} />
          <h1>Meus Favoritos</h1>
          <p>Aqui estão os prestadores que você mais gosta! Tenha acesso rápido aos profissionais de confiança e solicite serviços com facilidade.</p>
        </div>

        {/* Grid de Estatísticas Rápidas do Usuário */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h2>4</h2>
            <p>Prestadores Favoritos</p>
          </div>
          <div className={styles.statCard}>
            <h2>12</h2>
            <p>Serviços Realizados</p>
          </div>
          <div className={styles.statCard}>
            <h2>4.9</h2>
            <p>Avaliação Média</p>
          </div>
        </div>

        {/* Seção Principal de Listagem de Prestadores */}
        <div className={styles.providersSection}>
          <div className={styles.providersHeader}>
            <h2>Prestadores</h2>
            <div className={styles.filterButtons}>
              <button className={`${styles.filterButton} ${styles.activeFilter}`}>Todos</button>
              <button className={styles.filterButton}>Eletricista</button>
              <button className={styles.filterButton}>Diarista</button>
              <button className={styles.filterButton}>Montador</button>
            </div>
          </div>

          {/* Grid que renderiza os cards de prestadores dinamicamente */}
          <div className={styles.providersGrid}>
            {/* Loop sobre o array 'prestadores' para criar um card para cada objeto de dados */}
            {prestadores.map((prestador, index) => (
              <div key={index} className={styles.providerCard}>
                
                {/* Cabeçalho do Card: Avatar, informações de texto e ícone de favorito */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardAvatar}>
                    <img src={`https://i.pravatar.cc/150?img=${index + 10}`} alt={prestador.nome} />
                    <div className={styles.onlineIndicator}></div>
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{prestador.nome}</h3>
                    <p>{prestador.especialidade}</p>
                    <span><FiMapPin /> {prestador.localizacao}</span>
                  </div>
                  <FiHeart className={styles.cardHeartIcon} />
                </div>

                {/* Bloco de Avaliação em estrelas e número de reviews */}
                <div className={styles.cardRating}>
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  <span>{prestador.avaliacao.toFixed(1)} ({prestador.avaliacoes} avaliações)</span>
                </div>

                {/* Estatísticas numéricas do prestador */}
                <div className={styles.cardStats}>
                  <div><span>{prestador.servicos}</span> <p>SERVIÇOS</p></div>
                  <div><span>{prestador.anos}</span> <p>ANOS</p></div>
                  <div><span>{prestador.satisfacao}%</span> <p>SATISFAÇÃO</p></div>
                </div>

                {/* Seção com as tags de Especialidades */}
                <div className={styles.cardSpecialties}>
                  <h4>Especialidades:</h4>
                  <div>
                    {prestador.especialidades.map(esp => <span key={esp} className={styles.tag}>{esp}</span>)}
                  </div>
                </div>
                
                {/* Botões de Ação no final do card */}
                <div className={styles.cardButtons}>
                  <button className={styles.buttonPrimary}><FiMessageSquare /> Solicitar Serviço</button>
                  <button className={styles.buttonSecondary}><FiUser /> Ver Perfil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FavoritosPage;