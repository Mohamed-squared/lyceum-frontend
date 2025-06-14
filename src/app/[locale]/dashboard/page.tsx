// Full code for src/app/[locale]/dashboard/page.tsx

import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import DashboardCard from '@/components/DashboardCard'; // Assuming this is the correct path
import { getAuthenticated } from '@/utils/apiClient'; // Added import

// Import the new components
import TestGenSnapshotCard from '@/components/dashboard/TestGenSnapshotCard';
import CoursesSnapshotCard from '@/components/dashboard/CoursesSnapshotCard';
import InspirationalQuoteCard from '@/components/dashboard/InspirationalQuoteCard';
import LyceumNewsCard from '@/components/dashboard/LyceumNewsCard';
import QuickLinksCard from '@/components/dashboard/QuickLinksCard';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
    return null; // Ensure component returns null after redirect
  }

  const t = await getTranslations('Dashboard'); // Assuming 'Dashboard' namespace holds these keys

  let dashboardData: any;
  let apiError: string | null = null;

  try {
    dashboardData = await getAuthenticated('/api/v1/dashboard', session.access_token);
  } catch (error) {
    console.error('API Error fetching dashboard data:', error);
    apiError = 'Failed to load dashboard content. Please try again later.';
  }

  return (
    <div className="container mx-auto p-4">
      <header className="relative">
        {/* Banner Image */}
        <div className="w-full h-52 rounded-lg overflow-hidden">
          <Image
            src={dashboardData?.profileBannerUrl || '/assets/dashboard/default-banner.jpg'}
            alt="Profile Banner"
            width={1200}
            height={208}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Image
            src={dashboardData?.profilePictureUrl || '/assets/dashboard/default-pfp.svg'}
            alt="Profile Picture"
            width={144}
            height={144}
            className="rounded-full border-4 border-yellow-400"
          />
        </div>
      </header>

      {/* Welcome Text - Adjusted margin top to account for PFP */}
      <div className="text-center mt-20 mb-8">
        <h2 className="text-2xl font-semibold text-slate-50">
          {dashboardData?.welcomeMessage || t('welcomeMessage') || 'Welcome!'}
        </h2>
        <p className="text-md text-slate-300">
          {dashboardData?.credits || t('credits') || 'We are glad to have you.'}
        </p>
      </div>

      <main>
        <h1 className="text-3xl font-bold text-slate-100 mb-6">
          {t('title')}
        </h1>

        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

        {!apiError && dashboardData && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              <TestGenSnapshotCard
                key="testgen"
                title={dashboardData.testGen?.title || t('testGenCard.title') || 'Test Generation'}
                subject={dashboardData.testGen?.subject || t('testGenCard.subjectPlaceholder') || 'N/A'}
                chapters={dashboardData.testGen?.chapters || t('testGenCard.chaptersPlaceholder') || 'N/A'}
                lastExam={dashboardData.testGen?.lastExam || t('testGenCard.lastExamPlaceholder') || 'N/A'}
                pendingExams={dashboardData.testGen?.pendingExams || t('testGenCard.pendingExamsPlaceholder') || 'N/A'}
                buttonText={dashboardData.testGen?.buttonText || t('testGenCard.buttonText') || 'View Tests'}
              />,
              <CoursesSnapshotCard
                key="courses"
                title={dashboardData.courses?.title || t('coursesCard.title') || 'Your Courses'}
                enrollmentStatus={dashboardData.courses?.enrollmentStatus || t('coursesCard.enrollmentPlaceholder') || 'N/A'}
                todaysFocus={dashboardData.courses?.todaysFocus || t('coursesCard.focusPlaceholder') || 'N/A'}
                buttonText={dashboardData.courses?.buttonText || t('coursesCard.buttonText') || 'View Courses'}
              />,
              <InspirationalQuoteCard
                key="quote"
                title={dashboardData.quote?.title || t('quoteCard.title') || 'Inspirational Quote'}
                quote={dashboardData.quote?.quote || t('quoteCard.quotePlaceholder') || 'No quote available'}
                author={dashboardData.quote?.author || t('quoteCard.authorPlaceholder') || 'Unknown author'}
                buttonText={dashboardData.quote?.buttonText || 'Refresh'}
              />,
              <LyceumNewsCard
                key="news"
                title={dashboardData.news?.title || t('newsCard.title') || 'Lyceum News'}
                items={dashboardData.news?.items || t.raw('newsCard.items') || []}
              />,
              <QuickLinksCard
                key="links"
                title={dashboardData.quickLinks?.title || t('quickLinksCard.title') || 'Quick Links'}
                links={dashboardData.quickLinks?.links || t.raw('quickLinksCard.links') || []}
              />,
            ].map((Component, index) => (
              <DashboardCard key={index}>
                {Component}
              </DashboardCard>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
