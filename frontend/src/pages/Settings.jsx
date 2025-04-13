
import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    apiTimeout: 30,
    defaultDebugLevel: 'info',
    theme: 'system', // Usar o tema do sistema
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular chamada de API
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso",
      });
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Configurações</h1>
            <p className="text-gray-400 mt-1">Gerencie as configurações da aplicação</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Configurações Gerais</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium">Ativar Notificações</label>
                        <p className="text-sm text-gray-400">Receber notificações sobre mudanças de status do site</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="notifications"
                          checked={settings.notifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Tempo limite da API (segundos)</label>
                      <input
                        type="number"
                        name="apiTimeout"
                        value={settings.apiTimeout}
                        onChange={handleChange}
                        className="input max-w-xs"
                        min="5"
                        max="120"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Nível de Depuração Padrão</label>
                      <select
                        name="defaultDebugLevel"
                        value={settings.defaultDebugLevel}
                        onChange={handleChange}
                        className="input max-w-xs"
                      >
                        <option value="info">Informação</option>
                        <option value="warning">Aviso</option>
                        <option value="error">Erro</option>
                        <option value="all">Todos</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Seção de tema temporariamente removida */}

                <div className="pt-6 border-t border-border flex justify-end">
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                    ) : (
                      <Save size={18} className="mr-2" />
                    )}
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
