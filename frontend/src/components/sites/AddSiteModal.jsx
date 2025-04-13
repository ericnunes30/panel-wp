
import { useState } from 'react';
import { X } from 'lucide-react';
import { addSite } from '../../api/sites';
import { useToast } from '@/hooks/use-toast';

const AddSiteModal = ({ isOpen, onClose, onSiteAdded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!name.trim() || !url.trim() || !apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Nome, URL e Chave API são obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const siteData = { name: name.trim(), url: url.trim(), api_key: apiKey.trim() };
      const newSite = await addSite(siteData);
      
      onSiteAdded(newSite);
      toast({
        title: "Site adicionado",
        description: "Seu site WordPress foi adicionado com sucesso",
      });
      
      // Resetar formulário
      setName('');
      setUrl('');
      setApiKey('');
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Falha ao adicionar site",
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
        
        <h2 className="text-xl font-semibold mb-6">Adicionar Site WordPress</h2>
        
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
              placeholder="Digite a chave API"
              className="input"
              required
            />
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
                'Adicionar Site'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal;
