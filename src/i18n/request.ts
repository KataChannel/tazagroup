import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes((locale ?? 'vi') as any)) notFound();

  const validLocale = locale ?? 'vi';

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default,
    timeZone: 'Asia/Ho_Chi_Minh',
    now: new Date(),
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        },
        medium: {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        }
      },
      number: {
        currency: {
          style: 'currency',
          currency: locale === 'vi' ? 'VND' : 'USD'
        }
      }
    }
  };
});
