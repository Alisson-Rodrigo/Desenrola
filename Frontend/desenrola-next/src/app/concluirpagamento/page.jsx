// Importação padrão do React, necessária para criar componentes com JSX.
import React from 'react';

// Importa nosso arquivo de estilos usando CSS Modules. 
// Isso garante que as classes (ex: styles.container) sejam únicas para este componente, evitando conflitos.
import styles from './Concluirpagamento.module.css';

// Importa especificamente o ícone 'FiCheck' da biblioteca 'react-icons'.
// O 'fi' no final indica que é do pacote "Feather Icons".
import { FiCheck } from 'react-icons/fi';


/**
 * Componente funcional que renderiza a página de confirmação de pagamento.
 * @returns {JSX.Element} O elemento JSX que representa a página.
 */
const PaginaFinal = () => {

  /**
   * Função chamada quando o usuário clica no botão "Voltar para o Início".
   * Em uma aplicação real, aqui estaria a lógica de navegação,
   * por exemplo, usando o hook `useNavigate` do React Router DOM.
   */
  const handleVoltar = () => {
    // Por enquanto, apenas exibe uma mensagem no console do navegador para teste.
    console.log("Voltando...");
    // Exemplo de como seria com React Router:
    // const navigate = useNavigate();
    // navigate('/'); 
  };

  // O `return` define o que o componente vai renderizar na tela.
  return (
    // Container principal. Ele ocupa a tela inteira (definido no CSS)
    // e é responsável por centralizar o card no meio da página.
    <div className={styles.container}>
      
      {/* O card branco que agrupa todo o conteúdo de sucesso. */}
      <div className={styles.card}>

        {/* Esta div serve como um wrapper para criar o círculo verde em volta do ícone. */}
        <div className={styles.iconWrapper}>
          {/* Renderiza o componente do ícone que importamos lá em cima. */}
          <FiCheck className={styles.icon} />
        </div>

        {/* O título principal da página de confirmação. */}
        <h1 className={styles.title}>
          Pagamento Realizado com Sucesso!
        </h1>

        {/* O parágrafo de subtítulo, com uma mensagem descritiva. */}
        <p className={styles.subtitle}>
          Sua transação foi processada e sua assinatura está ativa.
        </p>

        {/* O botão de ação principal para o usuário. */}
        <button
          className={styles.button}
          // A propriedade `onClick` recebe a função que deve ser executada quando o botão é clicado.
          onClick={handleVoltar}
        >
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

// Exporta o componente `PaginaFinal` como padrão deste arquivo.
// Isso permite que outros arquivos (como o `main.jsx`) possam importá-lo e usá-lo.
export default PaginaFinal;