export const i18n = {
  locales: [
    { code: 'en-US', name: 'English', icon: '🇺🇸' },
    { code: 'ig-NG', name: 'Igbo', icon: '🇳🇬' },
    { code: 'ha-NG', name: 'Hausa', icon: '🇳🇬' },
    { code: 'yo-NG', name: 'Yoruba', icon: '🇳🇬' },
    { code: 'fr', name: 'Français', icon: '🇫🇷' },
    { code: 'ar', name: 'العربية', icon: '🇸🇦' },
  ],
  defaultLocale: 'en-US',
}

/**
 * Determines the text direction for a given locale.
 *
 * @param locale - The locale code to check (e.g., 'en-US', 'fr', 'ar').
 * @returns 'rtl' if the locale is Arabic ('ar'), otherwise 'ltr'.
 */

export const getDirection = (locale: string) => {
  return locale === 'ar' ? 'rtl' : 'ltr'
}
export type I18nConfig = typeof i18n
export type Locale = I18nConfig['locales'][number]