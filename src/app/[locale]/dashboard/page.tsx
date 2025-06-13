// Full code for src/app/[locale]/dashboard/page.tsx

import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import DashboardCard from '@/components/DashboardCard'; // Assuming this is the correct path

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations('Dashboard');

  const cardTitles = [
    "TestGen Snapshot Card",
    "Courses Snapshot Card",
    "Analytics Snapshot Card",
    "Settings Snapshot Card",
    "Help Snapshot Card",
  ];

  return (
    <div className="container mx-auto p-4">
      <header className="relative">
        {/* Banner Image */}
        <div className="w-full h-52 rounded-lg overflow-hidden">
          <Image
            src="/assets/dashboard/default-banner.jpg"
            alt="Profile Banner"
            width={1200} // Provide appropriate dimensions for aspect ratio
            height={208} // h-52 is 13rem = 208px
            className="w-full h-full object-cover" // object-cover with parent having h-full
          />
        </div>
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Image
            src="/assets/dashboard/default-pfp.svg"
            alt="Profile Picture"
            width={144} // w-36 is 9rem = 144px
            height={144} // h-36 is 9rem = 144px
            className="rounded-full border-4 border-yellow-400"
          />
        </div>
      </header>

      {/* Welcome Text - Adjusted margin top to account for PFP */}
      <div className="text-center mt-20 mb-8">
        <h2 className="text-2xl font-semibold text-slate-50">Welcome, Scholar!</h2>
        <p className="text-md text-slate-300">Scholar's Credits: 250</p>
      </div>

      <main>
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          {t('dashboardTitle')}
        </h1>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardTitles.map((cardTitle, index) => (
            <DashboardCard key={index}>
              <p className="text-slate-100">{cardTitle}</p> {/* Ensure text is visible on dark card bg */}
            </DashboardCard>
          ))}
        </section>
      </main>
    </div>
  );
}
