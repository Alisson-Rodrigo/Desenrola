import { jwtDecode } from "jwt-decode";

// Função para debugar o token e verificar dados do usuário


/**
 * Decodifica o token JWT do localStorage e tenta extrair os possíveis campos de ID do usuário.
 * Útil para depuração e verificação de dados presentes no token.
 * @returns {object|null} Objeto com token completo, userId utilizado e possíveis IDs, ou null se falhar.
 */

export const debugUserToken = () => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    console.error('❌ Token não encontrado');
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    console.log('🔍 Token decodificado:', decoded);
    
    // Possíveis campos onde pode estar o UserId
    const possibleUserIds = {
      sub: decoded.sub,
      nameid: decoded.nameid, 
      UserId: decoded.UserId,
      id: decoded.id,
      user_id: decoded.user_id,
      uid: decoded.uid
    };
    
    console.log('🆔 Possíveis UserIds encontrados:', possibleUserIds);
    
    // Retorna o primeiro ID válido encontrado
    const userId = decoded.sub || decoded.nameid || decoded.UserId || decoded.id || decoded.user_id || decoded.uid;
    console.log('✅ UserId que será usado:', userId);
    
    return {
      fullToken: decoded,
      userId: userId,
      possibleIds: possibleUserIds
    };
    
  } catch (error) {
    console.error('❌ Erro ao decodificar token:', error);
    return null;
  }
};



/**
 * Verifica se o usuário autenticado já possui status de prestador via requisição à API.
 * @returns {object|null} Resultado da API com o status do prestador, ou null se não for prestador ou ocorrer erro.
 * @throws {Error} Se o token não estiver presente no localStorage.
 */

// Função para verificar se usuário já é prestador
export const checkProviderStatus = async () => {
  const API_URL = 'https://api.desenrola.shop/api';
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('Token não encontrado');
  }

  try {
    const response = await fetch(`${API_URL}/provider/check-status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('📋 Status do prestador:', result);
      return result;
    } else {
      console.log('ℹ️ Usuário ainda não é prestador ou endpoint não existe');
      return null;
    }
  } catch (error) {
    console.log('ℹ️ Erro ao verificar status (pode ser normal):', error.message);
    return null;
  }
};