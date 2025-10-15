/**
 * @file Arquivo de testes para a página de listagem de Serviços (`ServicosPage`).
 * @description
 * Esta suíte de testes valida a funcionalidade da página de exploração de serviços,
 * cobrindo a renderização inicial, carregamento de dados, busca, filtros,
 * alternância de layout e o controle de acesso para usuários não autenticados.
 */

import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import ServicosPage from "./page.jsx";

// --- Mocks e Configuração Global ---

/**
 * Mock do módulo `next/navigation` para simular os hooks de roteamento
 * do Next.js, permitindo testar o componente de forma isolada.
 */
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => "/servicos",
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

/**
 * Mock do componente Navbar.
 */
jest.mock("../../../components/Navbar", () => () => <div data-testid="navbar">Navbar</div>);

/**
 * Mock do custom hook `useDebounce`. Retorna o valor imediatamente para
 * que os testes de busca não precisem esperar pelo delay do debounce.
 */
jest.mock("../../../hooks/useDebounce", () => ({
  useDebounce: (value) => value,
}));

/**
 * Suprime um warning específico do JSDOM relacionado à navegação.
 */
beforeAll(() => {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Not implemented: navigation')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

/**
 * Mocka as funções `scrollIntoView` e `scrollTo` do DOM, que não são
 * implementadas no JSDOM e podem causar erros nos testes.
 */
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.scrollTo = jest.fn();
});

/**
 * Mock do `localStorage` para simular o armazenamento do token de autenticação.
 */
beforeAll(() => {
  const store = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key) => store[key] || null,
      setItem: (key, val) => (store[key] = val),
      removeItem: (key) => delete store[key],
      clear: () => Object.keys(store).forEach((k) => delete store[k]),
    },
    writable: true,
  });
});

/**
 * Antes de cada teste, mocka a função `fetch` para simular a chamada à API
 * que busca a lista de serviços, retornando dados controlados.
 */
beforeEach(() => {
  global.fetch = jest.fn(async (url) => {
    await new Promise((r) => setTimeout(r, 50));
    if (url.includes("/api/provider/services/paged")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            { id: "1", title: "Instalação Elétrica Residencial", description: "Serviço completo...", category: "Eletrica", price: 250.0, isActive: true, providerId: "provider-1", providerName: "João Silva", dateTime: new Date().toISOString() },
            { id: "2", title: "Encanamento e Hidráulica", description: "Reparos e instalações...", category: "Hidraulica", price: 180.0, isActive: true, providerId: "provider-2", providerName: "Maria Santos", dateTime: new Date().toISOString() },
          ],
          totalPages: 1, totalItems: 2, currentPage: 1,
        }),
      });
    }
    return Promise.resolve({ ok: true, json: async () => [] });
  });
});

/**
 * Antes de cada teste, mocka `console.log` e `console.error` para manter o output limpo.
 */
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

/**
 * Após cada teste, limpa todos os mocks para garantir a independência entre os testes.
 */
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  localStorage.clear();
});


// --- Suite de Testes para a Página de Serviços ---

describe("ServicosPage", () => {
  /**
   * Testa se o layout inicial da página é renderizado corretamente,
   * incluindo a Navbar, o título principal e o campo de busca.
   */
  test("renderiza layout inicial com navbar e título", async () => {
    await act(async () => { render(<ServicosPage />); });
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Explore Todos os Serviços")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por serviço, categoria ou profissional...")).toBeInTheDocument();
  });

  /**
   * Verifica se os serviços mockados pela API são carregados e exibidos na tela.
   */
  test("carrega e exibe serviços inicialmente", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => {
      expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument();
      expect(screen.getByText("Encanamento e Hidráulica")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /**
   * Garante que a mensagem de "Carregando..." é exibida enquanto os dados
   * da API estão sendo buscados.
   */
  test("exibe estado de carregamento", async () => {
    await act(async () => { render(<ServicosPage />); });
    expect(screen.getByText("Carregando serviços...")).toBeInTheDocument();
  });

  /**
   * Simula o usuário digitando no campo de busca para filtrar os serviços.
   */
  test("permite buscar serviços", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const searchInput = screen.getByPlaceholderText("Buscar por serviço, categoria ou profissional...");
    await act(async () => { fireEvent.change(searchInput, { target: { value: "elétrica" } }); });
    expect(searchInput.value).toBe("elétrica");
  });

  /**
   * Testa a funcionalidade de alternar a visualização dos serviços entre grade e lista.
   */
  test("alterna entre visualização em grade e lista", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const buttons = screen.getAllByRole("button");
    const listViewButton = buttons.find(btn => btn.querySelector("svg") && btn.className.includes("viewButton"));
    if (listViewButton) {
      await act(async () => { fireEvent.click(listViewButton); });
    }
  });

  /**
   * Simula o clique no botão de filtros para abrir e fechar o painel lateral.
   */
  test("abre e fecha painel de filtros", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const filterButton = screen.getByText("Filtros");
    await act(async () => { fireEvent.click(filterButton); });
    await waitFor(() => { expect(screen.getByText("Categoria")).toBeInTheDocument(); });
    const closeButton = screen.getAllByRole("button").find(btn => btn.querySelector("svg") && btn.className.includes("closeFiltersButton"));
    if (closeButton) {
      await act(async () => { fireEvent.click(closeButton); });
    }
  });

  /**
   * Simula um usuário não autenticado clicando em um card de serviço.
   * Verifica se o overlay "Acesso Necessário" é exibido, bloqueando o acesso.
   */
  test("exibe overlay quando usuário não está autenticado", async () => {
    localStorage.removeItem("auth_token");
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const serviceCard = screen.getByText("Instalação Elétrica Residencial").closest("article");
    await act(async () => { fireEvent.click(serviceCard); });
    await waitFor(() => { expect(screen.getByText("Acesso Necessário")).toBeInTheDocument(); });
  });

  /**
   * Verifica se o contador de serviços encontrados é exibido corretamente.
   */
  test("exibe contador de resultados", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("2 serviços encontrados")).toBeInTheDocument(); }, { timeout: 3000 });
  });

  /**
   * Confirma que os preços dos serviços são formatados como moeda (R$).
   */
  test("formata preços corretamente", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => {
      expect(screen.getByText(/R\$\s*250,00/)).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*180,00/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /**
   * Garante que os nomes das categorias dos serviços são exibidos.
   */
  test("exibe categorias formatadas", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => {
      expect(screen.getByText("Elétrica")).toBeInTheDocument();
      expect(screen.getByText("Hidráulica")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /**
   * Verifica se o status de disponibilidade do serviço é exibido nos cards.
   */
  test("exibe status do serviço (Disponível/Indisponível)", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => {
      const statusElements = screen.getAllByText("Disponível");
      expect(statusElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  /**
   * Confirma que o nome do prestador de serviço é exibido em cada card.
   */
  test("exibe nome do prestador", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => {
      expect(screen.getByText("João Silva")).toBeInTheDocument();
      expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /**
   * Simula a abertura do painel de filtros e o clique no botão "Limpar Filtros".
   */
  test("limpa filtros ao clicar em limpar", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const filterButton = screen.getByText("Filtros");
    await act(async () => { fireEvent.click(filterButton); });
    await waitFor(() => { expect(screen.getByText("Limpar Filtros")).toBeInTheDocument(); });
    const clearButton = screen.getByText("Limpar Filtros");
    await act(async () => { fireEvent.click(clearButton); });
    expect(global.fetch).toHaveBeenCalled();
  });

  /**
   * Testa o cenário em que a API não retorna nenhum serviço.
   * Verifica se a mensagem de estado vazio é exibida.
   */
  test("exibe estado vazio quando não há serviços", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], totalPages: 0, totalItems: 0, currentPage: 1, }),
    });
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Nenhum serviço encontrado")).toBeInTheDocument(); }, { timeout: 3000 });
  });

  /**
   * Garante que o botão "Ver Detalhes" para um usuário não logado
   * também aciona o overlay de "Acesso Necessário".
   */
  test("botão Ver Detalhes não redireciona sem autenticação", async () => {
    localStorage.removeItem("auth_token");
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const detailButtons = screen.getAllByText("Ver Detalhes");
    await act(async () => { fireEvent.click(detailButtons[0]); });
    await waitFor(() => { expect(screen.getByText("Acesso Necessário")).toBeInTheDocument(); });
  });

  /**
   * Testa se o overlay de acesso pode ser fechado ao clicar no botão "Voltar".
   */
  test("fecha overlay ao clicar em Voltar", async () => {
    localStorage.removeItem("auth_token");
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const serviceCard = screen.getByText("Instalação Elétrica Residencial").closest("article");
    await act(async () => { fireEvent.click(serviceCard); });
    await waitFor(() => { expect(screen.getByText("Acesso Necessário")).toBeInTheDocument(); });
    const backButton = screen.getByText("Voltar");
    await act(async () => { fireEvent.click(backButton); });
    await waitFor(() => { expect(screen.queryByText("Acesso Necessário")).not.toBeInTheDocument(); });
  });

  /**
   * Testa se o botão "Aplicar Filtros" no painel de filtros
   * dispara uma nova busca por serviços.
   */
  test("aplica filtros ao clicar em Aplicar Filtros", async () => {
    await act(async () => { render(<ServicosPage />); });
    await waitFor(() => { expect(screen.getByText("Instalação Elétrica Residencial")).toBeInTheDocument(); });
    const filterButton = screen.getByText("Filtros");
    await act(async () => { fireEvent.click(filterButton); });
    await waitFor(() => { expect(screen.getByText("Aplicar Filtros")).toBeInTheDocument(); });
    const applyButton = screen.getByText("Aplicar Filtros");
    await act(async () => { fireEvent.click(applyButton); });
    expect(global.fetch).toHaveBeenCalled();
  });
});