
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { User, Mail, Key, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, update, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Atualizar o formulário quando os dados do usuário forem carregados
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação de senha
    if (
      (formData.newPassword || formData.confirmPassword) &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast({
        title: "Erro",
        description: "As novas senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    // Validação de senha atual
    if (formData.newPassword && !formData.currentPassword) {
      toast({
        title: "Erro",
        description: "Digite sua senha atual para confirmar a alteração",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Preparar dados para atualização
      const updateData = {};

      // Só enviar os campos que foram alterados
      if (formData.name) {
        console.log('Nome atual:', user?.name);
        console.log('Novo nome:', formData.name);
        updateData.name = formData.name;
      }

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      console.log('Dados a serem enviados:', updateData);

      // Chamar a API de atualização
      await update(updateData);

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso",
      });

      // Resetar campos de senha
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao atualizar perfil",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col lg:ml-64">
        <Navbar />

        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <p className="text-gray-400 mt-1">Gerencie os detalhes da sua conta</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <span className="ml-2">Carregando dados do perfil...</span>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 mb-6 md:mb-0">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl text-white">
                  {formData.name?.charAt(0) || 'U'}
                </div>
                <div className="mt-4">
                  <h3 className="font-medium">{formData.name}</h3>
                  <p className="text-sm text-gray-400">{formData.email}</p>
                </div>
              </div>

              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Informações Pessoais</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Nome Completo</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <User size={18} />
                            </span>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="input pl-10 border-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Endereço de Email</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Mail size={18} />
                            </span>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="input pl-10 border-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <h3 className="text-lg font-medium mb-4">Alterar Senha</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Senha Atual</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Key size={18} />
                            </span>
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="input pl-10 border-white"
                              placeholder="Digite sua senha atual"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Nova Senha</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Key size={18} />
                            </span>
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="input pl-10 border-white"
                              placeholder="Digite a nova senha"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                              <Key size={18} />
                            </span>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className="input pl-10 border-white"
                              placeholder="Confirme a nova senha"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

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
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
