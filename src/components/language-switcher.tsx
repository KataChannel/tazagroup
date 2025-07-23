'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCommandItem,
} from '@/components/ui/dropdown-menu';
import { Globe, Check, Languages, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const languages = [
  { 
    code: 'vi', 
    name: 'Tiếng Việt', 
    flag: '🇻🇳',
    region: 'Vietnam',
    progress: 100,
    isDefault: true
  },
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇺🇸',
    region: 'United States',
    progress: 100,
    isDefault: false
  },
];

export function LanguageSwitcher() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    const targetLanguage = languages.find(lang => lang.code === newLocale);
    
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      toast.success(`Switched to ${targetLanguage?.name || newLocale}`);
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 transition-all hover:scale-105"
          disabled={isPending}
        >
          <Globe className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          Language Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {languages.map((language) => (
          <DropdownMenuCommandItem
            key={language.code}
            icon={<span className="text-base">{language.flag}</span>}
            shortcut={language.isDefault ? 'Default' : undefined}
            description={`${language.region} • ${language.progress}% complete`}
            onClick={() => handleLanguageChange(language.code)}
            className={locale === language.code ? 'bg-accent' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{language.name}</span>
              {locale === language.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuCommandItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="text-muted-foreground text-xs cursor-default"
          disabled
        >
          <Sparkles className="h-3 w-3 mr-2" />
          More languages coming soon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LocaleSwitcher() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// Hook for easy language detection
export function useCurrentLanguage() {
  const locale = useLocale();
  return languages.find(lang => lang.code === locale) || languages[0];
}

// Get available languages
export function getAvailableLanguages() {
  return languages;
}
