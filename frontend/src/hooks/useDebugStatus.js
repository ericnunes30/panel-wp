import { useQuery } from '@tanstack/react-query';
import { getDebugStatus } from '../api/sites';

/**
 * Hook personalizado para obter o status de depuração de um site WordPress
 * @param {number} siteId - ID do site a ser verificado
 * @param {object} options - Opções adicionais para o React Query
 * @returns {object} - Objeto com dados de status, estado de carregamento e erro
 */
export const useDebugStatus = (siteId, options = {}) => {
  return useQuery({
    queryKey: ['debugStatus', siteId],
    queryFn: () => getDebugStatus(siteId),
    // Configurações padrão que podem ser sobrescritas pelas opções
    enabled: !!siteId && options.enabled !== false, // Só executa se siteId for fornecido e enabled não for false
    refetchInterval: options.refetchInterval || false, // Não verifica automaticamente por padrão
    staleTime: 5 * 60 * 1000, // Considerar os dados "frescos" por 5 minutos
    cacheTime: 30 * 60 * 1000, // Manter em cache por 30 minutos
    retry: 1, // Tentar novamente 1 vez em caso de falha
    refetchOnWindowFocus: false, // Não verificar quando a janela ganha foco
    refetchOnMount: 'if-stale', // Só verificar quando o componente é montado se os dados estiverem obsoletos
    ...options
  });
};
