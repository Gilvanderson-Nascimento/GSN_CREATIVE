'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DataContext } from '@/context/data-context';
import en from '@/locales/en-US.json';
import pt from '@/locales/pt-BR.json';

const translations = {
  'en-US': en,
  'pt-BR': pt,
};

type Language = 'en-US' | 'pt-BR';
type Currency = 'USD' | 'BRL';

type TranslationContextType = {
  language: Language;
  t: (key: string, options?: { [key: string]: string | number }) => string;
  formatCurrency: (value: number, precision?: number) => string;
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
  const [currency, setCurrency] = useState<Currency>(settings.sistema.moeda as Currency || 'BRL');

  useEffect(() => {
    setLanguage(settings.sistema.idioma as Language || 'pt-BR');
    setCurrency(settings.sistema.moeda as Currency || 'BRL');
  }, [settings.sistema.idioma, settings.sistema.moeda]);

  const t = useCallback((key: string, options?: { [key: string]: string | number }) => {
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
  }, [language]);

  const formatCurrency = useCallback((value: number, precision: number = 2) => {
    const prefix = currency === 'USD' ? '$' : 'R$';
    return `${prefix} ${value.toFixed(precision)}`;
  }, [currency]);
  

  return (
    <TranslationContext.Provider value={{ language, t, formatCurrency }}>
      {children}
    </TranslationContext.Provider>
  );
};
