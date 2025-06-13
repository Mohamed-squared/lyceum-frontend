// Full code for src/app/[locale]/dashboard/page.tsx

import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import DashboardCard from '@/components/DashboardCard'; // Assuming this is the correct path

// Import the new components
import TestGenSnapshotCard from '@/components/dashboard/TestGenSnapshotCard';
import CoursesSnapshotCard from '@/components/dashboard/CoursesSnapshotCard';
import InspirationalQuoteCard from '@/components/dashboard/InspirationalQuoteCard';
import LyceumNewsCard from '@/components/dashboard/LyceumNewsCard';
import QuickLinksCard from '@/components/dashboard/QuickLinksCard';

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

  // The new components will be rendered directly in the grid
  const dashboardComponents = [
    <TestGenSnapshotCard key="testgen" />,
    <CoursesSnapshotCard key="courses" />,
    <InspirationalQuoteCard key="quote" />,
    <LyceumNewsCard key="news" />,
    <QuickLinksCard key="links" />,
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
          {dashboardComponents.map((Component, index) => (
            <DashboardCard key={index}>
              {Component}
            </DashboardCard>
          ))}
        </section>
      </main>
    </div>
  );
}
