import { useState, useEffect } from 'react';
import { X, Copy, Eraser, RefreshCw } from 'lucide-react';
import { clearDebugLog } from '../../api/sites';
import { useToast } from '@/hooks/use-toast';

const DebugLogModal = ({ isOpen, onClose, siteId, siteName, logContent, onRefresh }) => {
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estado para controlar a animação do botão de copiar
  const [isCopied, setIsCopied] = useState(false);

  // Função para copiar o conteúdo do log para a área de transferência
  const handleCopyLog = () => {
    if (!logContent) return;

    navigator.clipboard.writeText(logContent)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Copiado!",
          description: "Log de depuração copiado para a área de transferência",
        });

        // Resetar o estado após 2 segundos
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((error) => {
        console.error('Erro ao copiar log:', error);
        toast({
          title: "Erro",
          description: "Falha ao copiar log para a área de transferência",
          variant: "destructive",
        });
      });
  };

  // Função para limpar o log de depuração
  const handleClearLog = async () => {
    if (window.confirm(`Tem certeza que deseja limpar o log de depuração de ${siteName}?`)) {
      try {
        console.log('Iniciando limpeza do log para o site ID:', siteId);
        setIsClearing(true);

        const result = await clearDebugLog(siteId);
        console.log('Resultado da limpeza do log:', result);

        toast({
          title: "Log limpo",
          description: "Log de depuração foi limpo com sucesso",
        });

        // Atualizar o conteúdo do log após limpar
        if (onRefresh) {
          console.log('Atualizando conteúdo do log após limpeza...');
          await onRefresh();
        }
      } catch (error) {
        console.error('Erro ao limpar log:', error);
        toast({
          title: "Erro",
          description: `Falha ao limpar log de depuração: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsClearing(false);
      }
    }
  };

  // Função para atualizar o log
  const handleRefreshLog = async () => {
    if (!onRefresh) {
      console.warn('Função onRefresh não disponível');
      return;
    }

    try {
      console.log('Iniciando atualização do log...');
      setIsRefreshing(true);
      const result = await onRefresh();
      console.log('Resultado da atualização do log:', result);

      toast({
        title: "Log atualizado",
        description: "Log de depuração foi atualizado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao atualizar log:', error);
      toast({
        title: "Erro",
        description: `Falha ao atualizar log de depuração: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Log de Depuração - {siteName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b border-border bg-secondary/10">
          <button
            onClick={handleCopyLog}
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors duration-200"
            disabled={!logContent || isCopied}
            title={!logContent ? "Não há conteúdo para copiar" : isCopied ? "Copiado!" : "Copiar todo o log"}
          >
            {isCopied ? (
              <>
                <span className="inline-block w-3 h-3 bg-white rounded-full mr-1"></span>
                Copiado!
              </>
            ) : (
              <>
                <Copy size={14} className="mr-1" />
                Copiar
              </>
            )}
          </button>

          <button
            onClick={handleClearLog}
            className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
            disabled={isClearing || !logContent}
            title={!logContent ? "Não há conteúdo para limpar" : "Limpar todo o log"}
          >
            {isClearing ? (
              <span className="inline-block w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-1"></span>
            ) : (
              <Eraser size={14} />
            )}
            Limpar
          </button>

          <button
            onClick={handleRefreshLog}
            className="flex items-center gap-1 px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
            disabled={isRefreshing}
            title="Atualizar log"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {logContent ? (
            <pre className="whitespace-pre-wrap break-words bg-black/90 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              {logContent}
            </pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p className="text-lg mb-2">Nenhum log de depuração encontrado</p>
              <p className="text-sm">O arquivo de log está vazio ou não foi possível carregá-lo.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugLogModal;
