/**
 * @file Arquivo de testes para o componente da página de Planos (`/planos`).
 *
 * @description
 * Esta suíte de testes valida de forma completa o componente da página de Planos,
 * cobrindo os seguintes cenários principais:
 *
 * 1.  **Testes de Renderização:**
 * - Garante que o layout inicial, incluindo Navbar, título, descrições e os três cards de plano, é renderizado corretamente.
 * - Verifica a presença de elementos-chave como preços, badges ("MAIS POPULAR"), lista de recursos e seções de FAQ e Garantia.
 *
 * 2.  **Testes de Interação do Usuário:**
 * - Simula a alternância entre os ciclos de pagamento Mensal e Anual, verificando se os preços são atualizados.
 * - Testa a funcionalidade de abrir e fechar as perguntas da seção FAQ.
 * - Confirma que o botão do plano gratuito está desabilitado por padrão.
 *
 * 3.  **Testes do Fluxo de Checkout:**
 * - Valida a lógica de autenticação, impedindo que usuários não logados prossigam e exibindo um alerta.
 * - Testa o fluxo de sucesso, confirmando que uma chamada `fetch` é feita para a API correta com o ID do plano e o token de autorização.
 * - Verifica a exibição do estado de carregamento ("PROCESSANDO...") nos botões durante a chamada à API.
 * - Garante que erros de rede ou da API durante o checkout são tratados adequadamente.
 */

import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";

import Planos from "./page.jsx";

// --- Mock do Navbar ---
jest.mock("../../components/Navbar", () => () => <div data-testid="navbar">Navbar</div>);

// --- Mock dos ícones ---
jest.mock("react-icons/fi", () => ({
  FiCheck: () => <span data-testid="check-icon">✓</span>,
  FiX: () => <span data-testid="x-icon">✗</span>,
}));

// --- Suprimir warning de navegação do jsdom ---
const originalError = console.error;
beforeAll(() => {
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

// --- Mock de window.alert ---
beforeAll(() => {
  window.alert = jest.fn();
});

// --- Mock de localStorage ---
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

// --- Mock global do fetch ---
beforeEach(() => {
  global.fetch = jest.fn(async (url) => {
    await new Promise((r) => setTimeout(r, 50));

    if (url.includes("/api/payments/checkout")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          checkoutUrl: "https://checkout.stripe.com/mock-session-id",
        }),
      });
    }

    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

// --- Mock de console ---
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

// --- Limpar após cada teste ---
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  localStorage.clear();
});

describe("Planos Page", () => {
  test("renderiza layout inicial com navbar e título", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByText("Escolha o Plano Ideal para Você")).toBeInTheDocument();
  });

  test("exibe os três planos (Normal, VIP, Master)", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("VIP")).toBeInTheDocument();
    expect(screen.getByText("Master")).toBeInTheDocument();
  });

  test("alterna entre ciclo mensal e anual", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const monthlyButton = screen.getByText("Mensal");
    const annualButton = screen.getByText(/Anual/);

    expect(monthlyButton).toHaveClass("active");

    await act(async () => {
      fireEvent.click(annualButton);
    });

    expect(annualButton).toHaveClass("active");
  });

  test("exibe desconto no plano anual", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("-10%")).toBeInTheDocument();
  });

  test("exibe badge MAIS POPULAR no plano VIP", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("MAIS POPULAR")).toBeInTheDocument();
  });

  test("exibe preços formatados corretamente", async () => {
    await act(async () => {
      render(<Planos />);
    });

    // Plano Normal (gratuito)
    expect(screen.getByText("0,00")).toBeInTheDocument();
    
    // Plano VIP (29.90)
    expect(screen.getByText("29,90")).toBeInTheDocument();
    
    // Plano Master (59.90)
    expect(screen.getByText("59,90")).toBeInTheDocument();
  });

  test("desabilita botão do plano gratuito", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const freeButton = screen.getByText("PLANO GRATUITO");
    expect(freeButton).toBeDisabled();
  });

  test("permite selecionar diferentes planos", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const normalCard = screen.getByText("Normal").closest("div");
    const vipCard = screen.getByText("VIP").closest("div");

    await act(async () => {
      fireEvent.click(normalCard);
    });

    await act(async () => {
      fireEvent.click(vipCard);
    });

    // Verifica que o plano VIP tem a classe vipCard
    expect(vipCard).toHaveClass("vipCard");
  });

  test("exibe recursos de cada plano com ícones corretos", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const checkIcons = screen.getAllByTestId("check-icon");
    const xIcons = screen.getAllByTestId("x-icon");

    expect(checkIcons.length).toBeGreaterThan(0);
    expect(xIcons.length).toBeGreaterThan(0);
  });

  test("abre e fecha FAQ ao clicar", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const faqQuestion = screen.getByText("Posso cancelar a qualquer momento?");
    
    await act(async () => {
      fireEvent.click(faqQuestion);
    });

    await waitFor(() => {
      expect(screen.getByText(/Sim! Você pode cancelar sua assinatura/)).toBeInTheDocument();
    });

    // Clica novamente para fechar
    await act(async () => {
      fireEvent.click(faqQuestion);
    });

    await waitFor(() => {
      expect(screen.queryByText(/Sim! Você pode cancelar sua assinatura/)).not.toBeInTheDocument();
    });
  });

  test("exibe todas as perguntas do FAQ", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("Posso cancelar a qualquer momento?")).toBeInTheDocument();
    expect(screen.getByText("Como funciona o plano gratuito?")).toBeInTheDocument();
    expect(screen.getByText("Posso mudar de plano depois?")).toBeInTheDocument();
    expect(screen.getByText("Quais formas de pagamento vocês aceitam?")).toBeInTheDocument();
  });

  test("exibe seção de garantia de 30 dias", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("Garantia de 30 Dias")).toBeInTheDocument();
    expect(screen.getByText(/Não ficou satisfeito/)).toBeInTheDocument();
  });

  test("redireciona para login se não houver token ao assinar", async () => {
    localStorage.removeItem("auth_token");

    await act(async () => {
      render(<Planos />);
    });

    const vipButton = screen.getByText("ASSINAR VIP");
    
    await act(async () => {
      fireEvent.click(vipButton);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Você precisa estar logado para assinar um plano!");
    });
  });

  test("processa checkout com token válido", async () => {
    localStorage.setItem("auth_token", "fake-token-123");

    await act(async () => {
      render(<Planos />);
    });

    const vipButton = screen.getByText("ASSINAR VIP");
    
    await act(async () => {
      fireEvent.click(vipButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/payments/checkout/2"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Authorization": "Bearer fake-token-123",
          }),
        })
      );
    });
  });

  test("exibe estado de carregamento durante checkout", async () => {
    localStorage.setItem("auth_token", "fake-token-123");

    let resolveCheckout;
    global.fetch = jest.fn(() => 
      new Promise((resolve) => {
        resolveCheckout = () => {
          resolve({
            ok: true,
            json: async () => ({ checkoutUrl: "https://checkout.test.com" }),
          });
        };
      })
    );

    await act(async () => {
      render(<Planos />);
    });

    const masterButton = screen.getByText("ASSINAR MASTER");
    
    await act(async () => {
      fireEvent.click(masterButton);
    });

    // Verifica se TODOS os botões (menos o gratuito) mudaram para PROCESSANDO...
    const processingButtons = screen.getAllByText("PROCESSANDO...");
    expect(processingButtons.length).toBeGreaterThanOrEqual(2); // VIP e Master

    // Resolve a promise para limpar
    if (resolveCheckout) {
      await act(async () => {
        resolveCheckout();
      });
    }
  });

  test("mapeia corretamente IDs dos planos para checkout", async () => {
    localStorage.setItem("auth_token", "fake-token-123");

    await act(async () => {
      render(<Planos />);
    });

    // Testa plano VIP (ID 2)
    const vipButton = screen.getByText("ASSINAR VIP");
    await act(async () => {
      fireEvent.click(vipButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/checkout/2"),
        expect.any(Object)
      );
    });

    // Aguarda o fetch completar e reseta o componente
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Limpa e renderiza novamente para testar o próximo plano
    jest.clearAllMocks();
    
    // Re-renderiza para ter botões limpos
    const { rerender } = render(<Planos />);
    await act(async () => {
      rerender(<Planos />);
    });

    // Testa plano Master (ID 3) 
    const masterButtons = screen.getAllByText(/ASSINAR MASTER|PROCESSANDO/);
    const masterButton = masterButtons.find(btn => btn.textContent === "ASSINAR MASTER");
    
    if (masterButton) {
      await act(async () => {
        fireEvent.click(masterButton);
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/checkout/3"),
          expect.any(Object)
        );
      });
    }
  });

  test("trata erro ao processar checkout", async () => {
    localStorage.setItem("auth_token", "fake-token-123");

    global.fetch = jest.fn().mockRejectedValue(new Error("Erro de rede"));

    await act(async () => {
      render(<Planos />);
    });

    const vipButton = screen.getByText("ASSINAR VIP");
    
    await act(async () => {
      fireEvent.click(vipButton);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Erro no checkout:", expect.any(Error));
    });
  });

  test("atualiza preço ao mudar para anual", async () => {
    await act(async () => {
      render(<Planos />);
    });

    const annualButton = screen.getByText(/Anual/);

    await act(async () => {
      fireEvent.click(annualButton);
    });

    // Verifica preços anuais (com desconto de 10%)
    // VIP: 29.90 * 12 * 0.9 = 322.92
    expect(screen.getByText("322,92")).toBeInTheDocument();
    
    // Master: 59.90 * 12 * 0.9 = 646.92
    expect(screen.getByText("646,92")).toBeInTheDocument();
  });

  test("exibe descrição de cada plano", async () => {
    await act(async () => {
      render(<Planos />);
    });

    expect(screen.getByText("Perfeito para começar a usar o Desenrola")).toBeInTheDocument();
    expect(screen.getByText("Ideal para prestadores que querem se destacar")).toBeInTheDocument();
    expect(screen.getByText("Para profissionais que querem dominar o mercado")).toBeInTheDocument();
  });

  test("não permite clicar em plano Normal para checkout", async () => {
    localStorage.setItem("auth_token", "fake-token-123");

    await act(async () => {
      render(<Planos />);
    });

    const normalButton = screen.getByText("PLANO GRATUITO");
    
    await act(async () => {
      fireEvent.click(normalButton);
    });

    // Fetch não deve ser chamado para plano gratuito
    expect(global.fetch).not.toHaveBeenCalled();
  });
});