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
  let myCoursesData: any = null; // Add this line and initialize to null
  let apiError: string | null = null;

  try {
    // Fetch both sets of data concurrently for better performance
    [dashboardData, myCoursesData] = await Promise.all([
      getAuthenticated('/api/v1/dashboard', session.access_token),
      getAuthenticated('/api/v1/courses', session.access_token)
    ]);
  } catch (error) {
    console.error('API Error fetching dashboard data:', error);
    apiError = 'Failed to load dashboard content. Please try again later.';
    // Ensure myCoursesData is initialized in case of an error before this point,
    // or handle it by ensuring it's an empty array for the prop.
    // The current prop passing `myCoursesData?.data || []` handles this.
  }

  return (
    <DashboardClient
      session={session}
      initialData={dashboardData?.data}
      myCourses={myCoursesData?.data || []} // Verify this line
      apiError={apiError}
    />
  );
}
