import { useState } from 'react';
import { MoreVertical, Trash, ExternalLink, AlertTriangle, Edit, RefreshCw, Info, FileText, Eraser, ToggleLeft, LogIn } from 'lucide-react';
import { toggleDebug, deleteSite, loginWordPress, clearDebugLog, getDebugStatus } from '../../api/sites';
import { useDebugStatus } from '../../hooks/useDebugStatus';
import { useDebugLog } from '../../hooks/useDebugLog';
import DebugLogModal from './DebugLogModal';
import { useToast } from '@/hooks/use-toast';
import { useSiteStatus } from '../../hooks/useSiteStatus';
import SystemInfoModal from './SystemInfoModal';

const SiteCard = ({ site, onDelete, onDebugToggle, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Usar o hook personalizado para verificar o status do site
  const {
    data: statusData,
    isLoading: isStatusLoading,
    isError: isStatusError,
    refetch: refetchStatus,
    isFetching: isStatusFetching
  } = useSiteStatus(site.id);

  // Usar o hook personalizado para verificar o status de depuração
  const {
    data: debugStatusData,
    isLoading: isDebugStatusLoading,
    refetch: refetchDebugStatus
  } = useDebugStatus(site.id, {
    enabled: site.debug_enabled, // Só verifica se o debug estiver ativado
    refetchOnMount: true // Verifica quando o componente é montado
  });

  // Estado local para controlar a animação do botão de atualização
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estado para controlar a abertura dos modais
  const [isSystemInfoModalOpen, setIsSystemInfoModalOpen] = useState(false);
  const [isDebugLogModalOpen, setIsDebugLogModalOpen] = useState(false);

  // Usar o hook personalizado para obter o log de depuração
  const {
    data: debugLogData,
    isLoading: isDebugLogLoading,
    refetch: refetchDebugLog
  } = useDebugLog(site.id, {
    enabled: isDebugLogModalOpen && site.debug_enabled && debugStatusData?.wp_debug_log,
    refetchOnMount: true // Verifica quando o componente é montado
  });

  // Função para atualizar o status com feedback visual
  const handleRefreshStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRefreshing(true);
    console.log('Atualizando status do site...');
    try {
      await refetchStatus();
      toast({
        title: "Status atualizado",
        description: `Status de ${site.name} atualizado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar status do site",
        variant: "destructive",
      });
    } finally {
      // Aguardar um pouco para garantir que a animação seja visível
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const loginResult = await loginWordPress(site.id);

      if (loginResult.success) {
        // Abrir o painel administrativo em uma nova aba
        window.open(loginResult.adminUrl, '_blank');

        toast({
          title: "Login realizado",
          description: `Login realizado com sucesso em ${site.name}`,
        });
      } else {
        throw new Error(loginResult.error || "Falha ao fazer login");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error.message || "Falha ao fazer login no WordPress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir ${site.name}?`)) {
      try {
        await deleteSite(site.id);
        onDelete(site.id);
        toast({
          title: "Site removido",
          description: `${site.name} foi removido dos seus sites`,
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir site",
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenDebugLog = () => {
    setIsDebugLogModalOpen(true);
  };

  return (
    <>
      <div className="card flex flex-col bg-secondary">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white">
              {site.name?.charAt(0) || 'W'}
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{site.name}</h3>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 flex items-center hover:text-primary"
              >
                {site.url} <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          </div>

          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-secondary rounded shadow-lg z-10 py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-foreground/10 flex items-center"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEdit(site.id);
                  }}
                >
                  <Edit size={16} className="mr-2" />
                  Editar Site
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-foreground/10 flex items-center"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDebugToggle(site.id, !site.debug_enabled);
                  }}
                >
                  <AlertTriangle size={16} className="mr-2" />
                  {site.debug_enabled ? 'Desativar Depuração' : 'Ativar Depuração'}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-secondary-foreground/10 flex items-center text-red-400"
                  onClick={handleDelete}
                >
                  <Trash size={16} className="mr-2" />
                  Remover Site
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Status</span>
            <div className="flex items-center">
              <span className="flex items-center text-sm">
                {isStatusLoading ? (
                  <span className="inline-block w-3 h-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin mr-1"></span>
                ) : (
                  <span className={`w-2 h-2 rounded-full mr-1 ${statusData?.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                )}
                {isStatusLoading ? 'Verificando...' :
                 statusData?.status === 'online' ? 'Online' : 'Offline'}
              </span>
              <button
                onClick={handleRefreshStatus}
                className="ml-2 text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-primary/10"
                title="Atualizar status"
                disabled={isStatusLoading || isRefreshing || isStatusFetching}
                type="button"
              >
                <RefreshCw size={14} className={isStatusLoading || isRefreshing || isStatusFetching ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Versão WP</span>
            <span className="text-sm">{statusData?.wp_version || 'Desconhecido'}</span>
          </div>

          {statusData?.php_version && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Versão PHP</span>
              <span className="text-sm">{statusData.php_version}</span>
            </div>
          )}

          {statusData?.timezone && (
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">Fuso Horário</span>
              <span className="text-sm">{statusData.timezone}</span>
            </div>
          )}

          {site.debug_enabled && (
            <div className="mb-4 space-y-2">
              <div className="p-2 bg-yellow-500/10 rounded flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-yellow-500 mr-2" />
                  <span className="text-xs text-yellow-500">
                    {isDebugStatusLoading ? 'Verificando status...' :
                     debugStatusData?.wp_debug ? 'Modo de depuração ativado' : 'Modo de depuração parcial'}
                  </span>
                </div>
                <button
                  className="text-yellow-500 hover:text-yellow-600 p-1 rounded-full hover:bg-yellow-500/10 transition-colors"
                  onClick={() => onDebugToggle(site.id, false)}
                  title="Desativar depuração"
                >
                  <ToggleLeft size={16} />
                </button>
              </div>

              {debugStatusData && (
                <div className="p-2 bg-secondary/10 rounded text-xs space-y-1 border-0">
                  <div className="flex justify-between">
                    <span>WP_DEBUG:</span>
                    <span className={debugStatusData.wp_debug ? 'text-green-500' : 'text-gray-400'}>
                      {debugStatusData.wp_debug ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>WP_DEBUG_LOG:</span>
                    <span className={debugStatusData.wp_debug_log ? 'text-green-500' : 'text-gray-400'}>
                      {debugStatusData.wp_debug_log ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>WP_DEBUG_DISPLAY:</span>
                    <span className={debugStatusData.wp_debug_display ? 'text-green-500' : 'text-gray-400'}>
                      {debugStatusData.wp_debug_display ? 'Ativado' : 'Desativado'}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs flex items-center justify-center border-0"
                  onClick={handleOpenDebugLog}
                  disabled={!debugStatusData?.wp_debug_log}
                  title={!debugStatusData?.wp_debug_log ? 'Log de depuração não está ativado' : 'Ver log de depuração'}
                >
                  <FileText size={12} className="mr-1" />
                  Ver Log
                </button>

                <button
                  className="bg-secondary hover:bg-secondary/80 text-white py-1 px-2 rounded text-xs flex items-center justify-center border-0"
                  onClick={() => refetchDebugStatus()}
                  title="Atualizar status de depuração"
                >
                  <RefreshCw size={12} className="mr-1" />
                  Atualizar
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              className="bg-primary hover:bg-primary/80 text-white py-2 px-4 rounded transition-colors duration-200 flex justify-center items-center border-0"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={16} className="mr-2" />
                  Login
                </>
              )}
            </button>

            <button
              className="bg-secondary hover:bg-secondary/80 text-white py-2 px-4 rounded transition-colors duration-200 flex justify-center items-center border border-white/20"
              onClick={() => setIsSystemInfoModalOpen(true)}
              type="button"
            >
              <Info size={16} className="mr-2" />
              Info
            </button>
          </div>
        </div>
      </div>

      <SystemInfoModal
        isOpen={isSystemInfoModalOpen}
        onClose={() => setIsSystemInfoModalOpen(false)}
        siteId={site.id}
        siteName={site.name}
      />

      <DebugLogModal
        isOpen={isDebugLogModalOpen}
        onClose={() => setIsDebugLogModalOpen(false)}
        siteId={site.id}
        siteName={site.name}
        logContent={debugLogData}
        onRefresh={refetchDebugLog}
      />
    </>
  );
};

export default SiteCard;
