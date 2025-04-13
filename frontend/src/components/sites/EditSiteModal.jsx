import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { updateSite, getSiteById } from '../../api/sites';
import { useToast } from '@/hooks/use-toast';

const EditSiteModal = ({ isOpen, onClose, onSiteUpdated, siteId }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && siteId) {
      fetchSiteData();
    }
  }, [isOpen, siteId]);

  const fetchSiteData = async () => {
    try {
      setIsFetching(true);
      const siteData = await getSiteById(siteId);
      setName(siteData.name || '');
      setUrl(siteData.url || '');
      setApiKey(''); // Não exibimos a chave API por segurança
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do site",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!name.trim() || !url.trim()) {
      toast({
        title: "Erro",
        description: "Nome e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const siteData = { 
        name: name.trim(), 
        url: url.trim() 
      };
      
      // Só incluir a chave API se foi fornecida
      if (apiKey.trim()) {
        siteData.apiKey = apiKey.trim();
      }
      
      const updatedSite = await updateSite(siteId, siteData);
      
      onSiteUpdated(updatedSite);
      toast({
        title: "Site atualizado",
        description: "As informações do site foram atualizadas com sucesso",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao atualizar site",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-background border border-border rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-6">Editar Site WordPress</h2>
        
        {isFetching ? (
          <div className="flex justify-center items-center py-10">
            <div className="inline-block w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nome do Site</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Meu Site WordPress"
                className="input"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">URL do Site</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className="input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Chave API</label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Digite a nova chave API (opcional)"
                className="input"
              />
              <p className="text-xs text-gray-400 mt-1">Deixe em branco para manter a chave atual</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditSiteModal;
