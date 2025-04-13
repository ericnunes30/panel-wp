import { useQuery } from '@tanstack/react-query';
import { getSystemInfo } from '../api/sites';

/**
 * Hook personalizado para obter informações detalhadas do sistema WordPress
 * @param {number} siteId - ID do site a ser verificado
 * @param {object} options - Opções adicionais para o React Query
 * @returns {object} - Objeto com dados do sistema, estado de carregamento e erro
 */
export const useSystemInfo = (siteId, options = {}) => {
  return useQuery({
    queryKey: ['systemInfo', siteId],
    queryFn: () => getSystemInfo(siteId),
    // Configurações padrão que podem ser sobrescritas pelas opções
    enabled: !!siteId, // Só executa se siteId for fornecido
    staleTime: 5 * 60 * 1000, // Considerar os dados obsoletos após 5 minutos
    retry: 1, // Tentar novamente 1 vez em caso de falha
    ...options
  });
};
