
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from "../components/ui/use-toast";

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const navItems = [
    { name: 'Painel', path: '/', icon: <LayoutDashboard size={20} /> },
    // Configurações temporariamente ocultas
    // { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Perfil', path: '/profile', icon: <User size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Usando o toast para feedback visual
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um problema ao tentar sair",
        variant: "destructive"
      });
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-secondary text-white"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out bg-secondary border-r border-border lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6">
            <h2 className="text-2xl font-bold text-white">Panel WP</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-secondary-foreground/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout button */}
          <div className="p-4 mt-auto border-t border-border">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-gray-300 rounded-md hover:bg-secondary-foreground/10 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
