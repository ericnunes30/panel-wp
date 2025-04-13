
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login(email, password);
      console.log("Login successful, redirecting to dashboard");
      navigate('/');
      toast({
        title: "Login realizado",
        description: "Bem-vindo ao Panel WP",
      });
    } catch (error) {
      console.error("Login component error:", error);
      toast({
        title: "Falha no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 login-container">
      <div className="bg-card border border-border rounded-lg w-full max-w-md p-8 login-form">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Panel WP</h1>
          <p className="text-gray-400 text-muted-foreground">Gerenciador Multi-site WordPress</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="login-input"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium mb-1 text-foreground">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Entrar</span>
                </>
              )}
            </div>
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Entre com suas credenciais de conta</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
