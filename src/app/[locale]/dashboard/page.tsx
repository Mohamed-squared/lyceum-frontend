import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components/dashboard/dashboard'; // Import the new Dashboard
import { getDictionary } from '@/i18n'; // Assuming you might need this for localized text later
import { Locale } from '@/i18n-config'; // Assuming you might need this

export default async function DashboardPage({ params: { locale } }: { params: { locale: Locale } }) {
  const supabase = createServerClient();
  // const dictionary = await getDictionary(locale); // Example if you need translations

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/login`); // Ensure locale is part of redirect
  }

  return (
    <Dashboard /> // Render the new Dashboard component
  );
}
