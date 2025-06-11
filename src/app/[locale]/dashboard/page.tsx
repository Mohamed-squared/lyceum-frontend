import { createServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Welcome to your Dashboard</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">This page is under construction.</p>
      <p className="mt-4 text-sm text-gray-500">Your User ID: {user.id}</p>
    </div>
  );
}
