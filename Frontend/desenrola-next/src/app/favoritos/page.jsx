// page.jsx (VERSÃO FINAL INTERATIVA)
'use client';

import { useState, useMemo } from 'react';
import styles from './Favoritos.module.css';
import { FaHeart, FaStar } from 'react-icons/fa';
import { FiMessageSquare, FiUser, FiMapPin, FiHeart } from 'react-icons/fi';
import Navbar from '../../components/Navbar';

/**
 * Tipagem local para um prestador (mock).
 * @typedef {Object} Prestador
 * @property {number} id - Identificador único
 * @property {string} nome
 * @property {string} especialidade
 * @property {string} localizacao
 * @property {number} avaliacao
 * @property {number} avaliacoes
 * @property {number} servicos
 * @property {number} anos
 * @property {number} satisfacao
 * @property {string[]} especialidades
 */

/**
 * Dados mock de prestadores — cada item segue a tipagem `Prestador`.
 * O array é usado apenas para demonstração/visualização nesta UI.
 * @type {Prestador[]}
 */
const prestadoresMock = [
  { id: 1, nome: 'Usuário 1', especialidade: 'Eletricista', localizacao: 'Centro, Picos-PI', avaliacao: 5.0, avaliacoes: 45, servicos: 89, anos: 3, satisfacao: 98, especialidades: ['Instalação Elétrica', 'Chuveiros'] },
  { id: 2, nome: 'Usuário 2', especialidade: 'Diarista', localizacao: 'Junco, Picos-PI', avaliacao: 4.9, avaliacoes: 67, servicos: 156, anos: 2, satisfacao: 100, especialidades: ['Limpeza Residencial', 'Organização'] },
  { id: 3, nome: 'Usuário 3', especialidade: 'Montador de Móveis', localizacao: 'Canto da Várzea, Picos-PI', avaliacao: 4.8, avaliacoes: 22, servicos: 78, anos: 1.5, satisfacao: 96, especialidades: ['Móveis Planejados', 'Estantes'] },
  { id: 4, nome: 'Usuário 4', especialidade: 'Diarista', localizacao: 'Centro, Picos-PI', avaliacao: 4.9, avaliacoes: 108, servicos: 234, anos: 4, satisfacao: 99, especialidades: ['Limpeza Pós-obra', 'Guarda-roupas'] }
];

/**
 * Componente da página de Favoritos.
 * Exibe prestadores favoritados, filtros e cartões com informações básicas.
 * @returns {JSX.Element}
 */
export default function FavoritosPage() {
    // --- ESTADOS PARA INTERATIVIDADE ---
    /**
     * Filtro ativo para a lista (ex: 'Todos', 'Eletricista', 'Diarista', ...)
     * @type {[string, function]}
     */
    const [activeFilter, setActiveFilter] = useState('Todos');

    /**
     * Conjunto de IDs de prestadores marcados como favoritos.
     * Usamos `Set` para operações de adição/remoção O(1).
     * @type {[Set<number>, function]}
     */
    const [favoritedProviders, setFavoritedProviders] = useState(new Set([1, 3])); // Começa com os IDs 1 e 3 favoritados

    /**
     * ID do prestador selecionado atualmente na UI (ou null se nenhum).
     * @type {[number|null, function]}
     */
    const [selectedProvider, setSelectedProvider] = useState(null); // Nenhum selecionado no início

    // --- LÓGICA DE FILTRAGEM ---
    /**
     * Retorna a lista de prestadores filtrada pelo `activeFilter`.
     * useMemo evita recomputação desnecessária quando `activeFilter` não muda.
     */
    const filteredProviders = useMemo(() => {
        if (activeFilter === 'Todos') {
            return prestadoresMock;
        }
        return prestadoresMock.filter(p => p.especialidade.replace(' de Móveis', '') === activeFilter);
    }, [activeFilter]);
    
    // Lista de categorias para os botões de filtro, gerada dinamicamente
    const filterCategories = ['Todos', ...new Set(prestadoresMock.map(p => p.especialidade.replace(' de Móveis', '')))];

    // --- FUNÇÕES DE CLIQUE ---
    /**
     * Alterna o estado de favorito para um prestador.
     * O `event.stopPropagation()` evita que o mesmo clique dispare seleção do card.
     * @param {number} id
     * @param {React.SyntheticEvent} event
     */
    const handleFavoriteToggle = (id, event) => {
        event.stopPropagation(); // Impede que o clique no coração selecione o card inteiro
        const newFavorites = new Set(favoritedProviders);
        if (newFavorites.has(id)) {
            newFavorites.delete(id);

            newFavorites.add(id);
        }
        setFavoritedProviders(newFavorites);
    };
    return (
        <div className={styles.pageWrapper}>
            {/* Barra de navegação superior */}
            <Navbar />


            <main className={styles.mainContent}>
                {/* Cabeçalho da seção de favoritos */}
                <div className={styles.favoritesHeader}>
                    <FaHeart className={styles.headerIcon} />
                    <h1>Meus Favoritos</h1>
                    <p>Aqui estão os prestadores que você mais gosta! Tenha acesso rápido aos profissionais de confiança e solicite serviços com facilidade.</p>
                </div>

                {/* Painel com estatísticas rápidas */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}><h2>{favoritedProviders.size}</h2><p>Prestadores Favoritos</p></div>
                    <div className={styles.statCard}><h2>12</h2><p>Serviços Realizados</p></div>
                    <div className={styles.statCard}><h2>4.9</h2><p>Avaliação Média</p></div>
                </div>

                {/* Lista de prestadores com filtros e cards */}
                <div className={styles.providersSection}>
                    <div className={styles.providersHeader}>
                        <h2>Prestadores</h2>
                        <div className={styles.filterButtons}>
                            {filterCategories.map(category => (
                                <button
                                    key={category}
                                    className={`${styles.filterButton} ${activeFilter === category ? styles.activeFilter : ''}`}
                                    onClick={() => setActiveFilter(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid que mapeia e renderiza cada prestador filtrado */}
                    <div className={styles.providersGrid}>
                        {filteredProviders.map((prestador) => {
                            const isFavorited = favoritedProviders.has(prestador.id);
                            const isSelected = selectedProvider === prestador.id;
                            
                            return (
                                <div 
                                    key={prestador.id}
                                    className={`${styles.providerCard} ${isSelected ? styles.selectedCard : ''}`}
                                    onClick={() => setSelectedProvider(prestador.id)}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardAvatar}>
                                            {/* Avatar gerado via serviço de placeholder */}
                                            <img src={`https://i.pravatar.cc/150?img=${prestador.id + 10}`} alt={prestador.nome} />
                                            <div className={styles.onlineIndicator}></div>
                                        </div>
                                        <div className={styles.cardInfo}>
                                            <h3>{prestador.nome}</h3><p>{prestador.especialidade}</p>
                                            <span><FiMapPin /> {prestador.localizacao}</span>
                                        </div>
                                        {/* Ícone de favorito - clique apenas no ícone alterna favorito */}
                                        <FiHeart 
                                            className={`${styles.cardHeartIcon} ${isFavorited ? styles.favoritedHeart : ''}`}
                                            onClick={(e) => handleFavoriteToggle(prestador.id, e)}
                                        />
                                    </div>

                                    {/* Avaliação e número de avaliações */}
                                    <div className={styles.cardRating}>
                                        <FaStar /><span>{prestador.avaliacao.toFixed(1)} ({prestador.avaliacoes} avaliações)</span>
                                    </div>

                                    {/* Estatísticas rápidas do prestador */}
                                    <div className={styles.cardStats}>
                                        <div><span>{prestador.servicos}</span><p>SERVIÇOS</p></div>
                                        <div><span>{prestador.anos}</span><p>ANOS</p></div>
                                        <div><span>{prestador.satisfacao}%</span><p>SATISFAÇÃO</p></div>
                                    </div>

                                    {/* Tags de especialidades */}
                                    <div className={styles.cardSpecialties}>
                                        <h4>Especialidades:</h4>
                                        <div>{prestador.especialidades.map(esp => <span key={esp} className={styles.tag}>{esp}</span>)}</div>
                                    </div>
                                    
                                    {/* Ações rápidas: solicitar serviço ou ver perfil */}
                                    <div className={styles.cardButtons}>
                                        <button className={styles.buttonPrimary}><FiMessageSquare /> Solicitar Serviço</button>
                                        <button className={styles.buttonSecondary}><FiUser /> Ver Perfil</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};