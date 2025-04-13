import { useQuery } from '@tanstack/react-query';
import { getDebugLog } from '../api/sites';

/**
 * Hook personalizado para obter o log de depuração de um site WordPress
 * @param {number} siteId - ID do site a ser verificado
 * @param {object} options - Opções adicionais para o React Query
 * @returns {object} - Objeto com dados do log, estado de carregamento e erro
 */
export const useDebugLog = (siteId, options = {}) => {
  const queryResult = useQuery({
    queryKey: ['debugLog', siteId],
    queryFn: () => getDebugLog(siteId),
    // Configurações padrão que podem ser sobrescritas pelas opções
    enabled: !!siteId && options.enabled !== false, // Só executa se siteId for fornecido e enabled não for false
    refetchOnWindowFocus: false, // Não verifica automaticamente quando a janela ganha foco
    staleTime: 60000, // Considerar os dados obsoletos após 1 minuto (mantido curto para logs)
    cacheTime: 5 * 60 * 1000, // Manter em cache por 5 minutos
    retry: 1, // Tentar novamente 1 vez em caso de falha
    refetchOnMount: true, // Sempre verificar quando o modal é aberto
    ...options
  });

  // Envolver a função refetch para garantir que ela funcione corretamente
  const enhancedRefetch = async () => {
    try {
      console.log('Refetching debug log...');
      // Forçar a invalidation do cache antes de refetch
      await queryResult.refetch({ cancelRefetch: false });
      return true;
    } catch (error) {
      console.error('Error refetching debug log:', error);
      throw error;
    }
  };

  return {
    ...queryResult,
    refetch: enhancedRefetch
  };
};
