'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useTranslation } from '@/providers/translation-provider';
import { useToast } from '@/hooks/use-toast';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: initial, 1: code sent, 2: success
  const [otp, setOtp] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

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
        setError(t('login.unknown_error'));
      }
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setForgotPasswordStep(0);
    setIsForgotPasswordOpen(true);
  };
  
  const handleSendCode = () => {
    // Here you would typically call an API to send the code
    setForgotPasswordStep(1);
    toast({
        title: "Código enviado",
        description: "Um código de verificação foi enviado para o e-mail imaginesinta@gmail.com.",
    });
  }

  const handleVerifyCode = () => {
    if (otp.length === 6) {
        // Here you would verify the code
        setForgotPasswordStep(2);
    } else {
        toast({
            variant: "destructive",
            title: "Código inválido",
            description: "Por favor, insira o código de 6 dígitos.",
        })
    }
  }
  
  const onRecaptchaChange = (token: string | null) => {
      setRecaptchaToken(token);
  }

  return (
    <div 
        className="flex min-h-screen items-center justify-center bg-gray-100 p-4 relative bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1580614524463-de359d7477e3?q=80&w=2072&auto=format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <Card className="relative z-10 w-full max-w-md">
        <CardHeader className="text-center p-8 pb-6">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
          <CardDescription className="mt-2">{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('login.username_placeholder')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-center">
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    onChange={onRecaptchaChange}
                />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full mt-4 py-2.5" disabled={isLoading || !recaptchaToken}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('login.login_button')}
            </Button>
            <div className="text-center mt-3">
                 <a href="#" onClick={handleForgotPasswordClick} className="text-xs text-muted-foreground hover:text-primary">{t('login.forgot_password')}</a>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            {forgotPasswordStep < 2 && <DialogDescription>
                {forgotPasswordStep === 0
                    ? "Para redefinir sua senha, enviaremos um código de verificação para o seu e-mail cadastrado (imaginesinta@gmail.com)."
                    : "Insira o código de 6 dígitos que você recebeu por e-mail."}
            </DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {forgotPasswordStep === 0 && (
                <p className="text-sm text-muted-foreground">Clique em "Enviar Código" para receber seu código de verificação.</p>
            )}
            {forgotPasswordStep === 1 && (
                <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            )}
            {forgotPasswordStep === 2 && (
                 <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-700">Uma nova senha foi enviada para o seu e-mail.</p>
                </div>
            )}
          </div>
          <DialogFooter>
             {forgotPasswordStep === 0 && (
                <Button onClick={handleSendCode}>Enviar Código</Button>
            )}
             {forgotPasswordStep === 1 && (
                <Button onClick={handleVerifyCode}>Verificar Código</Button>
            )}
             {forgotPasswordStep === 2 && (
                <Button onClick={() => setIsForgotPasswordOpen(false)}>Fechar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
