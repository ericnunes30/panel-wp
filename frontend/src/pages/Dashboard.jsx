import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import SiteCard from '../components/sites/SiteCard';
import AddSiteModal from '../components/sites/AddSiteModal';
import EditSiteModal from '../components/sites/EditSiteModal';
import { getSites, toggleDebug } from '../api/sites';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['sites'],
    queryFn: getSites,
    staleTime: 5 * 60 * 1000, // Considerar os dados "frescos" por 5 minutos
    cacheTime: 30 * 60 * 1000, // Manter em cache por 30 minutos
    refetchOnWindowFocus: false, // Não verificar quando a janela ganha foco
    refetchOnMount: 'if-stale', // Só verificar quando o componente é montado se os dados estiverem obsoletos
  });

  useEffect(() => {
    if (data) {
      setSites(data.sites || []);
    }
  }, [data]);

  const handleSiteAdded = (newSite) => {
    setSites([...sites, newSite]);
  };

  const handleSiteDelete = (siteId) => {
    setSites(sites.filter(site => site.id !== siteId));
  };

  const handleSiteUpdated = (updatedSite) => {
    setSites(sites.map(site => {
      if (site.id === updatedSite.id) {
        return { ...site, ...updatedSite };
      }
      return site;
    }));
  };

  const handleEditSite = (siteId) => {
    setEditingSiteId(siteId);
    setIsEditModalOpen(true);
  };

  const handleDebugToggle = async (siteId, debugEnabled) => {
    try {
      // Chamar a API para ativar/desativar a depuração
      const result = await toggleDebug(siteId, debugEnabled);
      
      // Atualizar o estado local
      setSites(sites.map(site => {
        if (site.id === siteId) {
          return { ...site, debug_enabled: debugEnabled };
        }
        return site;
      }));
      
      // Mostrar mensagem de sucesso
      toast({
        title: debugEnabled ? "Depuração ativada" : "Depuração desativada",
        description: debugEnabled ? 
          "Modo de depuração ativado com sucesso" : 
          "Modo de depuração desativado com sucesso",
      });
      
      // Invalidar o cache de status do site
      queryClient.invalidateQueries(['debugStatus', siteId]);
    } catch (error) {
      console.error(`Erro ao ${debugEnabled ? 'ativar' : 'desativar'} depuração:`, error);
      
      // Mostrar mensagem de erro
      toast({
        title: "Erro",
        description: `Falha ao ${debugEnabled ? 'ativar' : 'desativar'} depuração: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Função para invalidar o cache de status de todos os sites
  const invalidateAllSiteStatus = () => {
    if (sites && sites.length > 0) {
      console.log('Invalidando cache de status de todos os sites...');
      sites.forEach(site => {
        queryClient.invalidateQueries(['siteStatus', site.id]);
        console.log(`Cache de status do site ${site.id} (${site.name}) invalidado`);
      });
    }
  };

  // Filtrar sites com base no termo de pesquisa
  const filteredSites = sites.filter(site => {
    if (!searchTerm.trim()) return true; // Se o termo de pesquisa estiver vazio, retorna todos os sites

    const search = searchTerm.toLowerCase().trim();

    const nameMatch = site.name.toLowerCase().includes(search);
    const urlMatch = site.url.toLowerCase().includes(search);

    return nameMatch || urlMatch;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Painel</h1>
              {isFetching && (
                <span className="inline-block w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-secondary/10 border border-border rounded-md py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Pesquisar sites por nome ou URL..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn-secondary flex items-center bg-secondary"
                onClick={async () => {
                  toast({
                    title: "Atualizando",
                    description: "Atualizando lista de sites...",
                  });

                  try {
                    // Primeiro, atualiza a lista de sites
                    await refetch();

                    // Depois, invalida o cache de status de todos os sites
                    setTimeout(() => {
                      invalidateAllSiteStatus();
                      toast({
                        title: "Status atualizado",
                        description: "Verificando status de todos os sites...",
                      });
                    }, 500); // Pequeno delay para garantir que a lista de sites foi atualizada
                  } catch (error) {
                    console.error('Erro ao atualizar sites:', error);
                    toast({
                      title: "Erro",
                      description: "Falha ao atualizar lista de sites",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={isFetching}
              >
                <RefreshCw size={18} className={`mr-1 ${isFetching ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                className="btn-primary flex items-center border-0"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={18} className="mr-1" />
                Adicionar Site
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-400">Carregando sites...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <p className="text-red-500">Falha ao carregar sites</p>
              <button
                className="mt-2 text-sm text-primary hover:underline"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          ) : sites.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2">Nenhum Site Encontrado</h3>
              <p className="text-gray-400 mb-4">Adicione seu primeiro site WordPress para começar</p>
              <button
                className="btn-primary"
                onClick={() => setIsAddModalOpen(true)}
              >
                Adicionar Site WordPress
              </button>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-10 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2">Nenhum Site Encontrado</h3>
              <p className="text-gray-400 mb-4">Nenhum site corresponde à pesquisa "{searchTerm}"</p>
              <button
                className="btn-secondary"
                onClick={() => setSearchTerm('')}
              >
                Limpar Pesquisa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map(site => (
                <SiteCard
                  key={site.id}
                  site={site}
                  onDelete={handleSiteDelete}
                  onDebugToggle={handleDebugToggle}
                  onEdit={handleEditSite}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSiteAdded={handleSiteAdded}
      />

      <EditSiteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSiteId(null);
        }}
        onSiteUpdated={handleSiteUpdated}
        siteId={editingSiteId}
      />
    </div>
  );
};

export default Dashboard;
