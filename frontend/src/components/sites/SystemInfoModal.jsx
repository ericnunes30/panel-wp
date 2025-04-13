import { useSystemInfo } from '../../hooks/useSystemInfo';
import { X, Server, Package, Palette, Globe, Database, Monitor, Cpu } from 'lucide-react';

const SystemInfoModal = ({ isOpen, onClose, siteId, siteName }) => {
  const {
    data: systemInfo,
    isLoading,
    isError,
    error
  } = useSystemInfo(siteId, {
    enabled: isOpen && !!siteId
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Informações do Sistema - {siteName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="ml-2">Carregando informações do sistema...</span>
            </div>
          ) : isError ? (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded">
              <h3 className="text-red-500 font-medium mb-2">Erro ao carregar informações</h3>
              <p className="text-sm">{error?.message || 'Ocorreu um erro ao buscar as informações do sistema.'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* WordPress */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Globe size={18} className="mr-2" />
                  WordPress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/10 rounded">
                    <span className="text-sm text-gray-400">Versão</span>
                    <p className="font-medium text-white">{systemInfo?.wordpress?.versao || systemInfo?.wordpress_version || 'Desconhecido'}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded">
                    <span className="text-sm text-gray-400">URL</span>
                    <p className="font-medium truncate text-white">{systemInfo?.wordpress?.url || systemInfo?.site_url || 'Desconhecido'}</p>
                  </div>
                  {systemInfo?.wordpress?.admin_email && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Email Admin</span>
                      <p className="font-medium text-white">{systemInfo.wordpress.admin_email}</p>
                    </div>
                  )}
                  {systemInfo?.wordpress?.linguagem && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Idioma</span>
                      <p className="font-medium text-white">{systemInfo.wordpress.linguagem}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PHP */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Server size={18} className="mr-2" />
                  PHP
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/10 rounded">
                    <span className="text-sm text-gray-400">Versão</span>
                    <p className="font-medium text-white">{systemInfo?.php?.versao || systemInfo?.php_version || 'Desconhecido'}</p>
                  </div>
                  {systemInfo?.php?.max_execution_time && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Tempo Máx. Execução</span>
                      <p className="font-medium text-white">{systemInfo.php.max_execution_time}s</p>
                    </div>
                  )}
                  {systemInfo?.php?.memory_limit && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Limite de Memória</span>
                      <p className="font-medium text-white">{systemInfo.php.memory_limit}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Banco de Dados */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Database size={18} className="mr-2" />
                  Banco de Dados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary/10 rounded">
                    <span className="text-sm text-gray-400">Tipo</span>
                    <p className="font-medium text-white">{systemInfo?.banco_dados?.tipo || 'MySQL'}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded">
                    <span className="text-sm text-gray-400">Versão</span>
                    <p className="font-medium text-white">{systemInfo?.banco_dados?.versao || systemInfo?.mysql_version || 'Desconhecido'}</p>
                  </div>
                  {systemInfo?.banco_dados?.prefixo_tabelas && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Prefixo das Tabelas</span>
                      <p className="font-medium text-white">{systemInfo.banco_dados.prefixo_tabelas}</p>
                    </div>
                  )}
                  {systemInfo?.banco_dados?.tamanho_total && (
                    <div className="p-3 bg-secondary/10 rounded">
                      <span className="text-sm text-gray-400">Tamanho Total</span>
                      <p className="font-medium text-white">{systemInfo.banco_dados.tamanho_total}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações do Servidor */}
              {systemInfo?.informacoes_servidor && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Cpu size={18} className="mr-2" />
                    Informações do Servidor
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {systemInfo.informacoes_servidor.so && (
                      <div className="p-3 bg-secondary/10 rounded">
                        <span className="text-sm text-gray-400">Sistema Operacional</span>
                        <p className="font-medium text-white">{systemInfo.informacoes_servidor.so}</p>
                      </div>
                    )}
                    {systemInfo.informacoes_servidor.arquitetura && (
                      <div className="p-3 bg-secondary/10 rounded">
                        <span className="text-sm text-gray-400">Arquitetura</span>
                        <p className="font-medium text-white">{systemInfo.informacoes_servidor.arquitetura}</p>
                      </div>
                    )}
                    {systemInfo.informacoes_servidor.servidor_web && (
                      <div className="p-3 bg-secondary/10 rounded">
                        <span className="text-sm text-gray-400">Servidor Web</span>
                        <p className="font-medium text-white">{systemInfo.informacoes_servidor.servidor_web}</p>
                      </div>
                    )}
                    {systemInfo.informacoes_servidor.ip_servidor && (
                      <div className="p-3 bg-secondary/10 rounded">
                        <span className="text-sm text-gray-400">IP do Servidor</span>
                        <p className="font-medium text-white">{systemInfo.informacoes_servidor.ip_servidor}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tema atual */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Palette size={18} className="mr-2" />
                  Tema Atual
                </h3>
                <div className="p-3 bg-secondary/10 rounded">
                  <p className="font-medium text-white">{systemInfo?.tema_atual || 'Desconhecido'}</p>
                </div>
              </div>

              {/* Plugins ativos */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Package size={18} className="mr-2" />
                  Plugins Ativos ({systemInfo?.plugins_ativos?.length || 0})
                </h3>
                {systemInfo?.plugins_ativos?.length > 0 ? (
                  <ul className="space-y-2">
                    {systemInfo.plugins_ativos.map((plugin, index) => (
                      <li key={index} className="p-3 bg-secondary/10 rounded text-white">
                        {plugin}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">Nenhum plugin ativo encontrado.</p>
                )}
              </div>
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

export default SystemInfoModal;
