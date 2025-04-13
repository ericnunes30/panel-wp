import { useQuery } from '@tanstack/react-query';
import { checkSiteStatus } from '../api/sites';

/**
 * Hook personalizado para verificar o status de um site WordPress
 * @param {number} siteId - ID do site a ser verificado
 * @param {object} options - Opções adicionais para o React Query
 * @returns {object} - Objeto com dados de status, estado de carregamento e erro
 */
export const useSiteStatus = (siteId, options = {}) => {
  const queryResult = useQuery({
    queryKey: ['siteStatus', siteId],
    queryFn: () => checkSiteStatus(siteId),
    // Configurações padrão que podem ser sobrescritas pelas opções
    refetchInterval: 5 * 60 * 1000, // Verificar a cada 5 minutos (reduzido de 1 minuto)
    refetchOnWindowFocus: false, // Não verificar quando a janela ganha foco
    staleTime: 3 * 60 * 1000, // Considerar os dados "frescos" por 3 minutos
    cacheTime: 30 * 60 * 1000, // Manter em cache por 30 minutos
    retry: 2, // Tentar novamente 2 vezes em caso de falha
    refetchOnMount: 'if-stale', // Só verificar quando o componente é montado se os dados estiverem obsoletos
    // Importante: Manter os dados em cache mesmo quando o status é offline
    structuralSharing: (oldData, newData) => {
      // Se os dados antigos existirem e os novos dados indicarem que o site está offline,
      // manter algumas informações dos dados antigos para melhor experiência do usuário
      if (oldData && newData && newData.status === 'offline' && oldData.status === 'online') {
        console.log(`Site ${siteId} mudou de online para offline. Mantendo algumas informações anteriores.`);
        return {
          ...newData,
          wp_version: oldData.wp_version || newData.wp_version,
          php_version: oldData.php_version || newData.php_version,
          lastOnlineAt: oldData.checkedAt || oldData.lastOnlineAt
        };
      }
      return newData;
    },
    ...options
  });

  // Envolver a função refetch para garantir que ela funcione corretamente
  const enhancedRefetch = async () => {
    try {
      console.log(`Atualizando status do site ${siteId}...`);
      await queryResult.refetch();
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar status do site ${siteId}:`, error);
      throw error;
    }
  };

  return {
    ...queryResult,
    refetch: enhancedRefetch
  };
};
