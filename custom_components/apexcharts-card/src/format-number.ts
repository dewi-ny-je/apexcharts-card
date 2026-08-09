// Vendored from the Home Assistant frontend
// (https://github.com/home-assistant/frontend, src/common/number/format_number.ts)
// instead of pulling it from `custom-card-helpers`, whose copy predates the
// `quote_decimal` number format and the `none` formatting rules.

import { FrontendLocaleData, NumberFormat } from './types-ha';

export function numberFormatToLocale(localeOptions: FrontendLocaleData): string | string[] | undefined {
  switch (localeOptions.number_format) {
    case NumberFormat.comma_decimal:
      return ['en-US', 'en']; // Use United States with fallback to English formatting 1,234,567.89
    case NumberFormat.decimal_comma:
      return ['de', 'es', 'it']; // Use German with fallback to Spanish then Italian formatting 1.234.567,89
    case NumberFormat.space_comma:
      return ['fr', 'sv', 'cs']; // Use French with fallback to Swedish and Czech formatting 1 234 567,89
    case NumberFormat.quote_decimal:
      return ['de-CH']; // Use German (Switzerland) formatting 1'234'567.89
    case NumberFormat.system:
      return undefined;
    default:
      return localeOptions.language;
  }
}

// Constructing an Intl.NumberFormat is comparatively expensive and this card
// formats every data label, tooltip and legend entry on each render, so cache
// the instances instead of rebuilding them on every call.
const numberFormatCache = new Map<string, Intl.NumberFormat>();

function getNumberFormatter(
  locale: string | string[] | undefined,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = JSON.stringify([locale, options]);
  let formatter = numberFormatCache.get(key);
  if (!formatter) {
    try {
      formatter = new Intl.NumberFormat(locale, options);
    } catch (err) {
      // Don't fail on an unsupported locale, e.g. the "TEST" language.
      // eslint-disable-next-line no-console
      console.warn('apexcharts-card: ', err);
      formatter = new Intl.NumberFormat(undefined, options);
    }
    numberFormatCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Generates default options for Intl.NumberFormat
 * @param num The number to be formatted
 * @param options The Intl.NumberFormatOptions that should be included in the returned options
 */
export function getDefaultFormatOptions(
  num: string | number,
  options?: Intl.NumberFormatOptions,
): Intl.NumberFormatOptions {
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    ...options,
  };

  if (typeof num !== 'string') {
    return defaultOptions;
  }

  // Keep decimal trailing zeros if they are present in a string numeric value
  if (!options || (options.minimumFractionDigits === undefined && options.maximumFractionDigits === undefined)) {
    const digits = num.indexOf('.') > -1 ? num.split('.')[1].length : 0;
    defaultOptions.minimumFractionDigits = digits;
    defaultOptions.maximumFractionDigits = digits;
  }

  return defaultOptions;
}

/**
 * Formats a number based on the user's preference with thousands separator(s) and decimal character for better legibility.
 * @param num The number to format
 * @param localeOptions The user-selected language and number format, from `hass.locale`
 * @param options Intl.NumberFormatOptions to use
 */
export function formatNumber(
  num: string | number,
  localeOptions?: FrontendLocaleData,
  options?: Intl.NumberFormatOptions,
): string {
  const locale = localeOptions ? numberFormatToLocale(localeOptions) : undefined;

  if (localeOptions?.number_format !== NumberFormat.none && !Number.isNaN(Number(num))) {
    return getNumberFormatter(locale, getDefaultFormatOptions(num, options)).format(Number(num));
  }

  if (!Number.isNaN(Number(num)) && num !== '' && localeOptions?.number_format === NumberFormat.none) {
    // If NumberFormat is none, use en-US format without grouping.
    return getNumberFormatter('en-US', getDefaultFormatOptions(num, { ...options, useGrouping: false })).format(
      Number(num),
    );
  }

  return `${num}`;
}
