import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['vi', 'en'],

  // Used when no locale matches
  defaultLocale: 'vi',

  // The prefix for the default locale
  localePrefix: {
    mode: 'as-needed'
  },

  // Pathnames for localized routes
  pathnames: {
    '/': '/',
    '/dashboard': {
      vi: '/bang-dieu-khien',
      en: '/dashboard'
    },
    '/campaigns': {
      vi: '/chien-dich',
      en: '/campaigns'
    },
    '/reports': {
      vi: '/bao-cao',
      en: '/reports'
    },
    '/payments': {
      vi: '/thanh-toan',
      en: '/payments'
    },
    '/profile': {
      vi: '/ho-so',
      en: '/profile'
    },
    '/tools': {
      vi: '/cong-cu',
      en: '/tools'
    },
    '/analytics': {
      vi: '/phan-tich',
      en: '/analytics'
    },
    '/training': {
      vi: '/dao-tao',
      en: '/training'
    },
    '/support': {
      vi: '/ho-tro',
      en: '/support'
    },
    '/links': {
      vi: '/lien-ket',
      en: '/links'
    },
    '/favorites': {
      vi: '/yeu-thich',
      en: '/favorites'
    },
    '/api-docs': {
      vi: '/tai-lieu-api',
      en: '/api-docs'
    },
    '/security': {
      vi: '/bao-mat',
      en: '/security'
    }
  }
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
