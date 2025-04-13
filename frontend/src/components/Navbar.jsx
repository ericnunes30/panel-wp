
import { useAuth } from '../context/AuthContext';
// import { Bell } from 'lucide-react'; // Temporariamente não utilizado

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between h-16 px-6 bg-secondary border-b border-border">
      <div className="text-lg font-medium text-white lg:hidden">Panel WP</div>

      <div className="flex-1 lg:ml-64"></div>

      <div className="flex items-center space-x-4">
        {/* Ícone de notificação temporariamente oculto
        <button className="relative p-2 rounded-full hover:bg-secondary-foreground/10">
          <Bell size={20} className="text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        */}

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="ml-2 text-sm text-gray-300 hidden sm:inline-block">
            {user?.name || 'Usuário'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
