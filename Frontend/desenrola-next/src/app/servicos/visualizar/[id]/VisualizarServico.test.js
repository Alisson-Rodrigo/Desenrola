import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import VisualizarServico from './page'; // Ajuste se o nome do arquivo do componente for diferente
import { FavoritesService } from '../../../../services/favoriteService'; // Ajuste o caminho conforme sua estrutura

// --- MOCKS GLOBAIS ---

// 1. Mock do next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// 2. Mock do Navbar e Link
jest.mock('../../../../components/Navbar', () => {
  return function DummyNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

// 3. Mock do FavoritesService
jest.mock('../../../../services/favoriteService', () => ({
  FavoritesService: {
    getAll: jest.fn(),
    add: jest.fn(),
    remove: jest.fn(),
  },
}));

// 4. Mock do fetch global
global.fetch = jest.fn();

// 5. Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 6. Mock do Lucide Icons
jest.mock('lucide-react', () => ({
  MessageSquare: () => <span data-testid="icon-message" />,
  Calendar: () => <span data-testid="icon-calendar" />,
}));

// --- DADOS DE TESTE (FIXTURES) ---

const mockServiceId = '123';
const mockProviderId = 'provider-abc';
const mockUserId = 'user-def';

const mockServiceData = {
  items: [
    {
      id: mockServiceId,
      providerId: mockProviderId,
      userId: mockUserId,
      title: 'Reparo de Encanamento',
      description: 'Conserto vazamentos e troco torneiras.',
      category: 'Hidraulica',
      providerName: 'Mario Bros',
      isAvailable: true,
      price: 150.0,
      dateTime: '2025-11-20T10:00:00',
      images: ['http://example.com/img1.jpg'],
    },
  ],
};

const mockEvaluations = [
  {
    id: 'ev1',
    userName: 'Luigi',
    note: 5,
    comment: 'Serviço excelente!',
    userImage: null,
  },
];

const mockAverage = { average: 4.8 };

const mockAgenda = [
  {
    id: 'ag1',
    dayOfWeek: 1, // Segunda-feira
    startTime: '08:00',
    endTime: '18:00',
    isAvailable: true,
  },
];

// --- SUITE DE TESTES ---

describe('VisualizarServico Page', () => {
  
  // Helper para renderizar o componente que usa 'use(params)'
  // Precisamos passar uma Promise e envolver em Suspense
  const renderComponent = async (serviceId = mockServiceId) => {
    const params = Promise.resolve({ id: serviceId });
    
    await act(async () => {
      render(
        <React.Suspense fallback={<div>Suspense Loading...</div>}>
          <VisualizarServico params={params} />
        </React.Suspense>
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Setup Default Mocks
    FavoritesService.getAll.mockResolvedValue([]);
    
    // Mock Inteligente do Fetch
    fetch.mockImplementation((url, options) => {
      // 1. Detalhes do Serviço
      if (url.includes('/services/paged')) {
        // Simula retorno vazio se o ID for 'not-found'
        if (url.includes('ServiceId=not-found')) {
          return Promise.resolve({ ok: true, json: async () => ({ items: [] }) });
        }
        return Promise.resolve({ ok: true, json: async () => mockServiceData });
      }
      
      // 2. Média de Avaliações
      if (url.includes('/evaluation/provider') && url.includes('/average')) {
        return Promise.resolve({ ok: true, json: async () => mockAverage });
      }
      
      // 3. Lista de Avaliações
      if (url.includes('/evaluation/provider')) {
        return Promise.resolve({ ok: true, json: async () => mockEvaluations });
      }
      
      // 4. Agenda
      if (url.includes('/schedule/provider')) {
        return Promise.resolve({ ok: true, json: async () => mockAgenda });
      }

      // 5. Envio de Mensagem
      if (url.includes('/Message/send') && options?.method === 'POST') {
        return Promise.resolve({ ok: true, json: async () => ({ success: true }) });
      }

      return Promise.resolve({ ok: false, status: 404, json: async () => ({}) });
    });

    // Mock do window.alert e console.error/log para não poluir o output
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('deve renderizar os detalhes do serviço corretamente (Caminho Feliz)', async () => {
    await renderComponent();

    // Aguarda o carregamento
    await waitFor(() => {
      expect(screen.queryByText('Carregando dados do serviço...')).not.toBeInTheDocument();
    });

    // Verifica Título e Descrição
    expect(screen.getByText('Reparo de Encanamento')).toBeInTheDocument();
    expect(screen.getByText('Conserto vazamentos e troco torneiras.')).toBeInTheDocument();
    
    // Verifica Prestador e Categoria
    expect(screen.getByText('Mario Bros')).toBeInTheDocument();
    expect(screen.getByText(/Hidraulica/)).toBeInTheDocument();
    
    // Verifica Preço
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();

    // Verifica Avaliações
    expect(screen.getByText('Luigi')).toBeInTheDocument();
    expect(screen.getByText('"Serviço excelente!"')).toBeInTheDocument();
  });

  test('deve exibir mensagem de erro se o serviço não for encontrado', async () => {
    await renderComponent('not-found'); // ID que retorna lista vazia no mock

    await waitFor(() => {
      expect(screen.getByText('Serviço não encontrado')).toBeInTheDocument();
    });
    expect(screen.getByText('O serviço solicitado não foi encontrado.')).toBeInTheDocument();
  });

  test('deve permitir favoritar e desfavoritar o serviço', async () => {
    await renderComponent();
    await waitFor(() => screen.getByText('Reparo de Encanamento'));

    const favButton = screen.getByText('Adicionar favorito');
    
    // 1. Adicionar Favorito
    FavoritesService.add.mockResolvedValue({});
    
    await act(async () => {
      fireEvent.click(favButton);
    });

    expect(FavoritesService.add).toHaveBeenCalledWith(mockProviderId);
    expect(await screen.findByText('Remover favorito')).toBeInTheDocument();

    // 2. Remover Favorito
    FavoritesService.remove.mockResolvedValue({});
    const removeButton = screen.getByText('Remover favorito');

    await act(async () => {
      fireEvent.click(removeButton);
    });

    expect(FavoritesService.remove).toHaveBeenCalledWith(mockProviderId);
    expect(await screen.findByText('Adicionar favorito')).toBeInTheDocument();
  });

  test('deve impedir envio de mensagem se usuário não estiver logado', async () => {
    await renderComponent();
    await waitFor(() => screen.getByText('Reparo de Encanamento'));

    const msgButton = screen.getByText('Enviar Mensagem');
    
    await act(async () => {
      fireEvent.click(msgButton);
    });

    expect(window.alert).toHaveBeenCalledWith('Você precisa estar logado para enviar mensagens.');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  test('deve enviar mensagem e redirecionar para o chat se logado', async () => {
    localStorageMock.setItem('auth_token', 'fake-valid-token');

    await renderComponent();
    await waitFor(() => screen.getByText('Reparo de Encanamento'));

    const msgButton = screen.getByText('Enviar Mensagem');
    
    await act(async () => {
      fireEvent.click(msgButton);
    });

    // Verifica chamada da API
    expect(fetch).toHaveBeenCalledWith(
      'https://api.desenrola.shop/api/Message/send',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer fake-valid-token'
        }),
        body: JSON.stringify({
          receiverId: mockUserId,
          content: 'Olá! Vi seu serviço na plataforma e gostaria de mais informações.'
        })
      })
    );

    // Verifica redirecionamento
    expect(mockPush).toHaveBeenCalledWith(`/chat?receiverId=${mockUserId}`);
  });

  test('deve abrir o modal de agenda e carregar horários', async () => {
    await renderComponent();
    await waitFor(() => screen.getByText('Reparo de Encanamento'));

    const agendaButton = screen.getByText('Ver Agenda do Prestador');
    
    // Abre modal
    await act(async () => {
      fireEvent.click(agendaButton);
    });

    // Verifica chamada da API de agenda
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/schedule/provider/${mockProviderId}`),
      expect.objectContaining({ method: 'GET' })
    );

    // Verifica conteúdo do modal
    expect(await screen.findByText('Agenda de Mario Bros')).toBeInTheDocument();
    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
    
    // Fecha modal
    const closeButton = screen.getByText('Fechar');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Agenda de Mario Bros')).not.toBeInTheDocument();
    });
  });
});