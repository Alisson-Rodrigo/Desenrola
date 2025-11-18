import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatPage from './page.jsx';

// --- MOCKS GLOBAIS ---

// 1. Mock do window.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// 2. Mock do fetch global
global.fetch = jest.fn();

// 3. Mock do localStorage
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

// 4. Mock do Navbar
jest.mock('../../components/Navbar', () => {
  return function DummyNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

// 5. Mock do SignalR
const mockSignalRStart = jest.fn().mockResolvedValue(true);
const mockSignalRStop = jest.fn().mockResolvedValue(true);
const mockSignalROn = jest.fn();
const mockSignalRBuild = jest.fn().mockReturnValue({
  start: mockSignalRStart,
  stop: mockSignalRStop,
  on: mockSignalROn,
  onreconnecting: jest.fn(),
  onreconnected: jest.fn(),
  onclose: jest.fn(),
});

jest.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: jest.fn(() => ({
    withUrl: jest.fn().mockReturnThis(),
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    configureLogging: jest.fn().mockReturnThis(),
    build: mockSignalRBuild,
  })),
  HttpTransportType: { WebSockets: 1 },
  LogLevel: { Information: 1 }
}));

// --- SETUP DE DADOS ---

const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiJ1c2VyMTIzIn0.Signature";

const mockConversations = [
  {
    conversationId: 'conv1',
    otherUserId: 'user456',
    otherUserName: 'Cliente Maria',
    lastMessage: 'Ola, tenho uma duvida',
    lastMessageDate: new Date().toISOString(),
    unreadMessagesCount: 2
  },
  {
    conversationId: 'conv2',
    otherUserId: 'user789',
    otherUserName: 'Prestador Joao',
    lastMessage: 'Servico concluido',
    lastMessageDate: new Date(Date.now() - 3600000).toISOString(),
    unreadMessagesCount: 0
  }
];

const mockMessages = [
  {
    id: 'msg1',
    senderId: 'user456',
    content: 'Ola, tenho uma duvida',
    sentAt: new Date().toISOString(),
    isRead: false
  },
  {
    id: 'msg2',
    senderId: 'user123',
    content: 'Pode falar!',
    sentAt: new Date().toISOString(),
    isRead: true
  }
];

// --- TESTES ---

describe('ChatPage', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.setItem('auth_token', FAKE_TOKEN);

    // Mock default para evitar erros de "reading ok of undefined" no polling
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => [],
    });
    
    // Spy no console.error para suprimir logs esperados e verificar chamadas
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  
  afterEach(() => {
      // Restaurar mocks do console
      console.error.mockRestore();
      console.log.mockRestore();
  });

  test('deve redirecionar para login se nao houver token', () => {
    localStorageMock.clear();

    // Como window.location é não-configurável no JSDOM, não podemos mockar diretamente 
    // sem causar erros de "Cannot redefine property" ou "Not implemented: navigation".
    // A estratégia aqui é verificar se a lógica chegou no ponto de redirecionamento
    // observando o console.error, e engolir o erro de navegação do JSDOM.

    try {
        render(<ChatPage />);
    } catch (error) {
        // JSDOM lança erro ao tentar navegar via window.location.href
        if (!error.message.includes('Not implemented: navigation')) {
            throw error; 
        }
    }

    // Verifica se o log de erro foi chamado, indicando que entrou no if (!token)
    expect(console.error).toHaveBeenCalledWith('Token não encontrado. Usuário não autenticado.');
  });

  test('deve carregar conversas e conectar ao SignalR ao montar', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConversations,
    });

    render(<ChatPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Message/conversations'),
        expect.any(Object)
      );
    });

    expect(await screen.findByText('Cliente Maria')).toBeInTheDocument();
    expect(screen.getByText('Ola, tenho uma duvida')).toBeInTheDocument();
    expect(screen.getByText('Prestador Joao')).toBeInTheDocument();

    expect(mockSignalRBuild).toHaveBeenCalled();
    expect(mockSignalRStart).toHaveBeenCalled();
  });

  test('deve carregar mensagens ao clicar em uma conversa', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockConversations,
    });

    render(<ChatPage />);

    const conversationItem = await screen.findByText('Cliente Maria');

    // Mock para buscar mensagens
    fetch.mockResolvedValueOnce({ 
      ok: true,
      json: async () => mockMessages,
    });
    
    // Mock para marcar como lida
    fetch.mockResolvedValueOnce({ 
      ok: true,
    });

    fireEvent.click(conversationItem);

    const headers = await screen.findAllByText('Cliente Maria');
    expect(headers.length).toBeGreaterThan(1);

    await waitFor(() => {
      expect(screen.getByText('Pode falar!')).toBeInTheDocument();
    });

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  test('deve enviar uma mensagem corretamente', async () => {
    // Mock inicial de conversas
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockConversations });
    
    render(<ChatPage />);
    
    const conversationItem = await screen.findByText('Cliente Maria');
    
    // Mock mensagens ao abrir
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockMessages });
    fireEvent.click(conversationItem);

    await waitFor(() => screen.getByText('Pode falar!'));

    const input = screen.getByPlaceholderText('Escreva sua mensagem');
    fireEvent.change(input, { target: { value: 'Nova mensagem de teste' } });
    
    const newMessageResponse = {
      id: 'msg3',
      senderId: 'user123',
      content: 'Nova mensagem de teste',
      sentAt: new Date().toISOString(),
      isRead: false
    };

    // Mock resposta do envio
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newMessageResponse
    });

    // Mock atualização da lista de conversas após envio
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockConversations });

    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/Message/send'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            receiverId: 'user456',
            content: 'Nova mensagem de teste'
          })
        })
      );
    });

    expect(input.value).toBe('');
  });
});