'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div 
        className="flex min-h-screen items-center justify-center bg-gray-100 p-4 relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://picsum.photos/seed/market-bg/1920/1080')"}}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <Card className="relative z-10 w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <CardHeader className="text-center p-0 mb-6">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Acesso ao Sistema</CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-2">Use suas credenciais para entrar.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mt-1 rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 text-white font-semibold rounded-md py-2.5 mt-6 hover:bg-blue-700 transition shadow-md" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>
            <div className="text-center mt-4">
                 <a href="#" className="text-xs text-gray-500 hover:text-blue-600">Esqueceu a senha?</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
