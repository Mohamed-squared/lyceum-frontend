import { createClient } from '@/utils/supabase/server';
import { OnboardingForm } from '@/components/OnboardingForm';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function OnboardingPage() {
  const supabase = createClient();
  const locale = await getLocale();

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // If no user is logged in, redirect them to the login page for the current locale
    redirect(`/${locale}/login`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-gray-100 dark:bg-gray-900">
      <div className="w-full">
        <OnboardingForm session={session} />
      </div>
    </main>
  );
}
