import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '', 
  showIcon = true 
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div 
      id="language-switcher"
      className={`inline-flex items-center bg-[#080808] border border-[#1F1F23] hover:border-[#333] transition-colors p-0.5 font-mono text-[10px] ${className}`}
      title="Intercalar idioma / Switch language (EN/ES)"
    >
      {showIcon && (
        <span className="px-1.5 text-[#555] flex items-center justify-center">
          <Globe className="h-3 w-3 text-[#00FF41]" />
        </span>
      )}
      
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-1.5 py-0.5 uppercase font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#00FF41] text-black shadow-xs'
            : 'text-[#666] hover:text-[#CCC]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>

      <span className="text-[#333] select-none text-[9px] px-0.5">/</span>

      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`px-1.5 py-0.5 uppercase font-bold transition-all cursor-pointer ${
          language === 'es'
            ? 'bg-[#00FF41] text-black shadow-xs'
            : 'text-[#666] hover:text-[#CCC]'
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  );
};
