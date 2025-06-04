import { initI18next } from '../i18n'; // Adjust path
import { useTranslation } from 'react-i18next/hooks'; // Or from the instance directly

// Example of fetching translations for a server component
export default async function HomePage({ params: { locale } }: { params: { locale: string }}) {
  const { t, i18n } = await initI18next(locale, ['common']);

  return (
    <div>
      <h1>{t('hero.headline')}</h1>
      <p>{t('hero.subheadline')}</p>
      {/* More components will go here */}
    </div>
  );
}
