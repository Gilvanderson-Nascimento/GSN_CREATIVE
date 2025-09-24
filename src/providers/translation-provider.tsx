'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DataContext } from '@/context/data-context';
import en from '@/locales/en-US.json';
import pt from '@/locales/pt-BR.json';

const translations = {
  'en-US': en,
  'pt-BR': pt,
};

type Language = 'en-US' | 'pt-BR';

type TranslationContextType = {
  language: Language;
  t: (key: string, options?: { [key: string]: string | number }) => string;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useContext(DataContext);
  const [language, setLanguage] = useState<Language>(settings.sistema.idioma as Language || 'pt-BR');

  useEffect(() => {
    setLanguage(settings.sistema.idioma as Language || 'pt-BR');
  }, [settings.sistema.idioma]);

  const t = (key: string, options?: { [key: string]: string | number }) => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        return key;
      }
    }

    if (typeof result === 'string' && options) {
      return result.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
        return options[varName] !== undefined ? String(options[varName]) : '';
      });
    }

    return result || key;
  };
  

  return (
    <TranslationContext.Provider value={{ language, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

    