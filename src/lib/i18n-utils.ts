import { useLocale, useFormatter } from 'next-intl';

export function useCurrencyFormatter() {
  const locale = useLocale();
  const format = useFormatter();

  const formatCurrency = (amount: number): string => {
    if (locale === 'vi') {
      return format.number(amount, {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      // Convert VND to USD for display (approximate rate)
      const usdAmount = amount / 24000; // Approximate VND to USD rate
      return format.number(usdAmount, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const formatNumber = (value: number): string => {
    return format.number(value, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number): string => {
    return format.number(value / 100, {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
  };

  return {
    formatCurrency,
    formatNumber,
    formatPercentage,
    locale,
  };
}

export function formatCurrencyStatic(amount: number, locale: string = 'vi'): string {
  if (locale === 'vi') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    const usdAmount = amount / 24000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }
}

export function formatNumberStatic(value: number, locale: string = 'vi'): string {
  return new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDateStatic(date: Date, locale: string = 'vi'): string {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTimeStatic(date: Date, locale: string = 'vi'): string {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: locale === 'en',
  }).format(date);
}

export function formatDateTimeStatic(date: Date, locale: string = 'vi'): string {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: locale === 'en',
  }).format(date);
}
