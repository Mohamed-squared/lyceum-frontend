'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client'; // Our client utility
import type { SupabaseClient } from '@supabase/supabase-js'; // Changed from @supabase/auth-helpers-nextjs
import type { Database } from '@/lib/database.types'; // Stays the same, acknowledged as potentially missing for now

// Define the shape of the context value
type SupabaseContextType = {
  supabase: SupabaseClient<Database>;
};

// Create the context with an undefined initial value
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  // Initialize the Supabase client using our utility function
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    // Subscribe to authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Refresh the page to sync server and client auth state
      router.refresh();
    });

    // Unsubscribe from the listener when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// Custom hook to use the Supabase client
export const useSupabase = (): SupabaseClient<Database> => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context.supabase;
};
