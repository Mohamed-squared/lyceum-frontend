"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

// Import Components
import DashboardCard from '@/components/DashboardCard';
import MyCoursesCard from '@/components/dashboard/MyCoursesCard'; // Import MyCoursesCard
import TestGenSnapshotCard from '@/components/dashboard/TestGenSnapshotCard';
import CoursesSnapshotCard from '@/components/dashboard/CoursesSnapshotCard';
import InspirationalQuoteCard from '@/components/dashboard/InspirationalQuoteCard';
import LyceumNewsCard from '@/components/dashboard/LyceumNewsCard';
import QuickLinksCard from '@/components/dashboard/QuickLinksCard';
import CreateCourseModal from '@/components/dashboard/CreateCourseModal';

// Define the expected props shape
interface DashboardClientProps {
  session: any; // Using 'any' for now, can be tightened with Supabase types later
  initialData: any;
  myCourses: any[]; // Add this line
  apiError: string | null;
}

export default function DashboardClient({ session, initialData, myCourses, apiError }: DashboardClientProps) {
  const t = useTranslations('Dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCourseCreated = (newCourse: any) => {
    // For now, we'll just log it. Later we can update the UI.
    console.log('New course created successfully:', newCourse);
    // TODO: Implement a toast notification or state update
  };

  return (
    <div className="container mx-auto p-4">
      <header className="relative">
        {/* Banner Image */}
        <div className="w-full h-52 rounded-lg overflow-hidden">
          <Image
            src={initialData?.profileBannerUrl || '/assets/dashboard/default-banner.jpg'}
            alt="Profile Banner"
            width={1200}
            height={208}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <Image
            src={initialData?.profilePictureUrl || '/assets/dashboard/default-pfp.svg'}
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
          {initialData?.welcomeMessage || t('welcomeMessage') || 'Welcome!'}
        </h2>
        <p className="text-md text-slate-300">
          {initialData?.credits || t('credits') || 'We are glad to have you.'}
        </p>
      </div>

      <main>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-100">
            {t('title')}
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-2 px-4 rounded"
          >
            + Create New Course
          </button>
        </div>

        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>}

        {!apiError && initialData && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              // Add the new card here
              <MyCoursesCard
                key="my-courses"
                title={t('myCoursesCard.title') || 'My Courses'}
                courses={myCourses}
              />,
              <TestGenSnapshotCard key="testgen" {...initialData.testGen} />,
              <CoursesSnapshotCard key="courses" {...initialData.courses} />,
              <InspirationalQuoteCard key="quote" {...initialData.quote} />,
              <LyceumNewsCard key="news" {...initialData.news} />,
              <QuickLinksCard key="links" {...initialData.quickLinks} />,
            ].map((Component, index) => (
              <DashboardCard key={index}>
                {Component}
              </DashboardCard>
            ))}
          </section>
        )}
      </main>

      <CreateCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sessionToken={session.access_token}
        onCourseCreated={handleCourseCreated}
      />
    </div>
  );
}
