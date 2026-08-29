import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  User, 
  KeyRound, 
  X, 
  Loader2, 
  AlertOctagon, 
  ShieldCheck, 
  ArrowRight,
  Fingerprint,
  Radio
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface EnterpriseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnterDemo: () => void;
}

export const EnterpriseLoginModal: React.FC<EnterpriseLoginModalProps> = ({
  isOpen,
  onClose,
  onEnterDemo
}) => {
  const { language } = useLanguage();
  const isEs = language === 'es';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeMessage(null);
    setAuthError(null);

    if (!username.trim() || !password.trim()) {
      setAuthError(
        isEs 
          ? 'Error: Complete todos los campos de autenticación obligatorios.' 
          : 'Error: Complete all required authentication fields.'
      );
      return;
    }

    setIsSubmitting(true);

    // Impossible to login by design as requested: Always reject with enterprise security error
    setTimeout(() => {
      setIsSubmitting(false);
      setAuthError(
        isEs
          ? '[ERROR 403: ACCESO DENEGADO] Credenciales no reconocidas en el nodo central de producción. Terminal no autorizada por directiva de seguridad SOC2 / TLS Hardware. Acceso bloqueado.'
          : '[ERROR 403: ACCESS DENIED] Unauthorized credentials on central production node. Terminal blocked by corporate SOC2 / TLS Hardware security policy.'
      );
    }, 1200);
  };

  const handleRegisterClick = () => {
    setAuthError(null);
    setNoticeMessage(
      isEs
        ? '⚠️ [REGISTRO RESTRINGIDO] El alta autónoma de cuentas está bloqueada por políticas de infraestructura. Solicite aprovisionamiento a su Administrador de TI / NOC.'
        : '⚠️ [REGISTRATION RESTRICTED] Self-provisioning is disabled by corporate security. Contact your IT Administrator / NOC.'
    );
  };

  const handleForgotPasswordClick = () => {
    setAuthError(null);
    setNoticeMessage(
      isEs
        ? '🔒 [RECUPERACIÓN BLOQUEADA] El restablecimiento remoto de credenciales está deshabilitado en redes públicas. Contacte a la mesa de ayuda corporativa.'
        : '🔒 [RECOVERY BLOCKED] Remote password reset is disabled on public networks. Contact corporate Help Desk.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-mono-data">
      <div 
        className="relative w-full max-w-md bg-[#0A0A0A] border border-[#262626] shadow-2xl p-6 text-[#E2E2E2] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accents */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1F1F23]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-950/50 border border-red-500/40 text-red-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>{isEs ? 'AUTENTICACIÓN DE NODO' : 'NODE AUTHENTICATION'}</span>
                <span className="text-[9px] bg-red-950 text-red-400 px-1.5 py-0.2 border border-red-500/30">
                  RESTRICTED
                </span>
              </div>
              <div className="text-[10px] text-[#777]">
                {isEs ? 'Terminal central de producción' : 'Production command node'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#666] hover:text-white hover:bg-[#1A1A1A] border border-transparent hover:border-[#333] transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Security Notice Pill */}
        <div className="mt-4 p-2.5 bg-[#050505] border border-[#1F1F23] flex items-center justify-between text-[10px] text-[#888]">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-red-500 animate-pulse" />
            <span>SSL TLS 1.3 • AES-256</span>
          </span>
          <span className="text-red-400 font-bold uppercase tracking-wider">CLUSTER TOK-04</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* User/Email Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[#AAA] uppercase font-bold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#888]" />
              <span>{isEs ? 'Usuario o Correo Corporativo' : 'Corporate User or Email'}</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isEs ? 'ej: usuario@stovue-retail.com' : 'e.g. user@stovue-retail.com'}
              className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#2A2A2A] focus:border-red-500 focus:outline-none text-xs text-white placeholder-[#444] transition"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] text-[#AAA] uppercase font-bold flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-[#888]" />
                <span>{isEs ? 'Contraseña de Acceso' : 'Access Password'}</span>
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 bg-[#050505] border border-[#2A2A2A] focus:border-red-500 focus:outline-none text-xs text-white placeholder-[#444] transition"
            />
          </div>

          {/* Links: Forgot password & Register */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-[#888] hover:text-red-400 hover:underline transition cursor-pointer"
            >
              {isEs ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}
            </button>
            <button
              type="button"
              onClick={handleRegisterClick}
              className="text-[#888] hover:text-[#00FF41] hover:underline transition cursor-pointer"
            >
              {isEs ? 'Registrarse' : 'Sign up'}
            </button>
          </div>

          {/* Error Banner */}
          {authError && (
            <div className="p-3 bg-red-950/70 border border-red-600/70 text-red-300 text-xs leading-relaxed flex items-start gap-2 animate-fade-in">
              <AlertOctagon className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
              <div>{authError}</div>
            </div>
          )}

          {/* Notice Message */}
          {noticeMessage && (
            <div className="p-3 bg-amber-950/60 border border-amber-600/50 text-amber-200 text-xs leading-relaxed flex items-start gap-2 animate-fade-in">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-400" />
              <div>{noticeMessage}</div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{isEs ? 'VERIFICANDO CREDENCIALES...' : 'VERIFYING CREDENTIALS...'}</span>
              </>
            ) : (
              <>
                <Fingerprint className="h-4 w-4" />
                <span>{isEs ? 'INICIAR SESIÓN' : 'LOG IN'}</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Track Link */}
        <div className="mt-5 pt-4 border-t border-[#1F1F23] flex items-center justify-between text-[11px] text-[#777]">
          <span>{isEs ? '¿Acceso de evaluación?' : 'Evaluation access?'}</span>
          <button
            onClick={() => {
              onClose();
              onEnterDemo();
            }}
            className="text-[#00FF41] hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{isEs ? 'Entrar con Perfil Demo' : 'Enter with Demo Profile'}</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
