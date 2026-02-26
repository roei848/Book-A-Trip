import { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  toggleLang: () => void;
  t: (section: 'home' | 'createTrip' | 'tripPage' | 'loginPage' | 'header', key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>('he');

  const toggleLang = () => setLang((prev) => (prev === 'he' ? 'en' : 'he'));

  const t = (section: 'home' | 'createTrip' | 'tripPage' | 'loginPage' | 'header', key: string): string => {
    const sectionObj = translations[lang][section] as Record<string, string>;
    return sectionObj[key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, isRtl: lang === 'he', toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
