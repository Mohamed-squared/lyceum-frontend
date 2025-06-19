import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getAuthenticated } from '@/utils/apiClient';
import DashboardClient from '@/components/dashboard/DashboardClient';
import MyCoursesCard from '@/components/dashboard/MyCoursesCard';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
    return null; // Ensure component returns null after redirect
  }

  let dashboardData: any = null;
  let apiError: string | null = null;

  try {
    // getAuthenticated will be run on the server here
    dashboardData = await getAuthenticated('/api/v1/dashboard', session.access_token);
    const myCoursesData = await getAuthenticated('/api/v1/courses', session.access_token);
  } catch (error) {
    console.error('API Error fetching dashboard data:', error);
    apiError = 'Failed to load dashboard content. Please try again later.';
  }

  return (
    <DashboardClient
      session={session}
      initialData={dashboardData?.data} // Pass the nested 'data' object
      myCourses={myCoursesData?.data || []} // Add this new prop
      apiError={apiError}
    />
  );
}
