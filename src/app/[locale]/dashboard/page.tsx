import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('Dashboard'); // Assuming 'Dashboard' is the namespace for dashboard translations

  return (
    <div className="container mx-auto p-4">
      <header className="relative mb-8">
        {/* Placeholder for Profile Banner */}
        <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        {/* Placeholder for Profile Picture */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gray-400 dark:bg-gray-600 rounded-full border-4 border-white dark:border-gray-800"></div>
      </header>

      {/* Add margin-top to account for the overlaid profile picture */}
      <main className="mt-16">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          {t('dashboardTitle')}
        </h1>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder Cards */}
          {[
            "TestGen Snapshot Card",
            "Courses Snapshot Card",
            "Analytics Snapshot Card",
            "Settings Snapshot Card",
            "Help Snapshot Card",
          ].map((cardTitle, index) => (
            <div
              key={index}
              className="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg shadow-md min-h-[150px] flex items-center justify-center"
            >
              <p className="text-blue-700 dark:text-blue-300">{cardTitle}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
