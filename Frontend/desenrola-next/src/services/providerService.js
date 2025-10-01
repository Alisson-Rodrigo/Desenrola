import { jwtDecode } from "jwt-decode";

const API_URL = 'http://localhost:5087/api';
/**
 * Envia os dados de cadastro do prestador para a API.
 * Extrai o `UserId` do token JWT e anexa todas as informações necessárias, incluindo
 * documentos e categorias. Trata erros de rede e erros de validação do backend.
 *
 * @param {Object} providerData - Dados do formulário de cadastro do prestador.
 * @param {string} token - Token JWT de autenticação do usuário.
 * @returns {Promise<Object>} Resultado da requisição, podendo conter mensagem ou dados do cadastro.
 * @throws {Error} Em caso de falha na requisição ou erro de validação.
 */

export const submitProviderRegistration = async (providerData, token) => {
  const data = new FormData();

  // 📌 Extrai UserId do token
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.sub || decoded.nameid || decoded.UserId; // depende de como o backend gera
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
  }

  if (userId) {
    data.append("UserId", userId);
  }

  // Campos obrigatórios
  data.append("CPF", providerData.CPF);
  data.append("RG", providerData.RG);
  data.append("Address", providerData.Address);
  data.append("ServiceName", providerData.ServiceName);
  data.append("Description", providerData.Description);
  data.append("PhoneNumber", providerData.PhoneNumber);

  // 📌 CORREÇÃO: Categories como array de números
  // Se for um único valor, ainda assim envie como array
  const categories = Array.isArray(providerData.Category) 
    ? providerData.Category 
    : [parseInt(providerData.Category)]; // Converte string para número
    
  categories.forEach((category, index) => {
    data.append(`Categories[${index}]`, category);
  });

  // 📌 CORREÇÃO: Upload de arquivos como DocumentPhotos (array de files)
  // A API espera DocumentPhotos como array, então sempre enviamos mesmo que vazio
  if (providerData.DocumentPhotos && providerData.DocumentPhotos.length > 0) {
    providerData.DocumentPhotos.forEach((file, index) => {
      data.append(`DocumentPhotos`, file); // Remove o [index] - some APIs preferem assim
    });
  } else {
    // Se não há arquivos, pode ser necessário enviar um campo vazio ou erro no frontend
    console.warn("Nenhum arquivo selecionado para DocumentPhotos");
  }

  // Debug - para ver o que está sendo enviado
  console.log("Dados sendo enviados:");
  for (let [key, value] of data.entries()) {
    console.log(`${key}:`, value);
  }

  const headers = new Headers();
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_URL}/provider`, {
      method: "POST",
      headers,
      body: data,
    });

    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: Falha ao enviar os dados.`;

      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          errorMessage = errorBody.message;
        } else if (errorBody?.errors) {
          // Trata erros de validação do .NET
          const validationErrors = Object.values(errorBody.errors).flat().join(', ');
          errorMessage = `Erros de validação: ${validationErrors}`;
        }
      } catch {
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch {
          // Mantém a mensagem padrão
        }
      }

      throw new Error(errorMessage);
    }

    // Tenta fazer parse da resposta
    try {
      const result = await response.json();
      return result;
    } catch {
      // Se não conseguir fazer parse, assume que deu certo
      return { 
        success: true, 
        message: "Cadastro realizado com sucesso!" 
      };
    }

  } catch (error) {
    // Se for erro de rede ou outro erro não relacionado à resposta
    if (error instanceof TypeError) {
      throw new Error("Erro de conexão com o servidor. Verifique sua internet.");
    }
    
    // Relança o erro original se já foi tratado
    throw error;
  }
};