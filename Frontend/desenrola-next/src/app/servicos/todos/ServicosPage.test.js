// ServicosPage.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import ServicosPage from './page.jsx'; // Correto!
// --- Mocks Iniciais ---

// Mockar o global fetch
global.fetch = jest.fn();

// Mockar o localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mockar window.scrollTo (usado na paginação)
window.scrollTo = jest.fn();

// Mockar 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mockar o hook 'useDebounce' para retornar o valor imediatamente
jest.mock('../../../hooks/useDebounce', () => ({
  useDebounce: (value) => value,
}));

// Mockar o Navbar para não testar sua implementação
jest.mock('../../../components/Navbar', () => {
  return function DummyNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

// Mockar 'lucide-react' para evitar problemas de renderização de SVG
// Isso transforma todos os ícones em simples 'divs'
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="icon-search" />,
  ChevronLeft: () => <div data-testid="icon-chevron-left" />,
  ChevronRight: () => <div data-testid="icon-chevron-right" />,
  User: () => <div data-testid="icon-user" />,
  MapPin: () => <div data-testid="icon-map-pin" />,
  Loader2: () => <div data-testid="icon-loader" className="spin" />,
  X: () => <div data-testid="icon-x" />,
  Clock: () => <div data-testid="icon-clock" />,
  ArrowRight: () => <div data-testid="icon-arrow-right" />,
  Grid3x3: () => <div data-testid="icon-grid" />,
  List: () => <div data-testid="icon-list" />,
  SlidersHorizontal: () => <div data-testid="icon-sliders" />,
}));

// --- Configuração dos Testes ---

describe('ServicosPage', () => {
  
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    fetch.mockClear();
    localStorageMock.clear();
    window.scrollTo.mockClear();
  });

  // --- Caso de Teste 1: Caminho Feliz (Serviços Encontrados) ---
  test('deve renderizar os serviços quando a busca for bem-sucedida', async () => {
    // Dados Falsos (Mock) da API
    const mockServicesResponse = {
      items: [
        {
          id: '1',
          title: 'Serviço de Elétrica Rápido',
          description: 'Instalação de tomadas e chuveiros.',
          price: 150.0,
          category: 'Eletrica',
          providerName: 'Jorge Eletricista',
          providerId: 'p1',
          dateTime: new Date().toISOString(),
          isActive: true,
        },
      ],
      totalPages: 1,
      totalItems: 1,
    };

    // Configurar o mock do fetch para este teste
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockServicesResponse,
    });
    
    // Simular que o usuário está logado
    localStorageMock.setItem('auth_token', 'fake-token');

    render(<ServicosPage />);

    // Verificar se o título da página aparece
    expect(screen.getByText('Explore Todos os Serviços')).toBeInTheDocument();

    // Esperar o serviço aparecer na tela (pois a busca é assíncrona)
    const serviceTitle = await screen.findByText('Serviço de Elétrica Rápido');
    expect(serviceTitle).toBeInTheDocument();

    // Verificar se outros dados do serviço também aparecem
    expect(screen.getByText('Jorge Eletricista')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    
    // Verificar a contagem de resultados
    expect(screen.getByText('1 serviço encontrado')).toBeInTheDocument();
  });

  // --- Caso de Teste 2: Estado Vazio (Nenhum Serviço) ---
  test('deve mostrar o estado vazio se nenhum serviço for encontrado', async () => {
    // Mock da API com resposta vazia
    const mockEmptyResponse = {
      items: [],
      totalPages: 0,
      totalItems: 0,
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockEmptyResponse,
    });
    
    localStorageMock.setItem('auth_token', 'fake-token');

    render(<ServicosPage />);

    // Esperar a mensagem de estado vazio aparecer
    const emptyStateTitle = await screen.findByText('Nenhum serviço encontrado');
    expect(emptyStateTitle).toBeInTheDocument();
    
    expect(screen.getByText('Tente ajustar os filtros ou buscar por outros termos.')).toBeInTheDocument();
  });

  // --- Caso de Teste 3: Overlay de Autenticação ---
  test('deve mostrar o overlay de login ao clicar no serviço sem token', async () => {
    // Mock da API com um serviço
    const mockServicesResponse = {
      items: [
        {
          id: '1',
          title: 'Serviço Protegido',
          description: 'Clique aqui para ver.',
          price: 50.0,
          category: 'Limpeza',
          providerName: 'Limpa Tudo',
          providerId: 'p2',
          dateTime: new Date().toISOString(),
          isActive: true,
        },
      ],
      totalPages: 1,
      totalItems: 1,
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockServicesResponse,
    });
    
    // Garantir que o usuário NÃO está logado
    localStorageMock.clear();

    render(<ServicosPage />);

    // Esperar o card do serviço aparecer
    const serviceCard = await screen.findByText('Serviço Protegido');
    
    // Simular o clique no card
    fireEvent.click(serviceCard);

    // Esperar o overlay de "Acesso Necessário" aparecer
    const overlayTitle = await screen.findByText('Acesso Necessário');
    expect(overlayTitle).toBeInTheDocument();
    
    expect(screen.getByText('Fazer Login')).toBeInTheDocument();
  });
});