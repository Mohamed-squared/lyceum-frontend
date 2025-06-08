'use client';

import { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import Image from 'next/image';
import { useSupabase } from '@/app/supabase-provider';

export default function SignUpPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();
  const supabase = useSupabase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- NEW CODE START ---
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (lightVideoRef.current) {
      lightVideoRef.current.src = "/auth/atrium-bg-light.mp4";
    }
    if (darkVideoRef.current) {
      darkVideoRef.current.src = "/auth/atrium-bg-dark.mp4";
    }
  }, []);
  // --- NEW CODE END ---

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // ... (handleSubmit logic remains the same)
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      alert(t('checkEmail'));
      router.push('/login');
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    // ... (handleGoogleSignIn logic remains the same)
    setIsGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center text-white">
      {/* Background Videos - NOTE THE REMOVED `src` ATTRIBUTE */}
      <video
        ref={lightVideoRef} // Add ref
        autoPlay
        loop
        muted
        playsInline
        key="light-video"
        poster="/auth/atrium-bg-light-poster.jpg"
        className="dark:hidden fixed inset-0 w-full h-full object-cover -z-10"
      />
      <video
        ref={darkVideoRef} // Add ref
        autoPlay
        loop
        muted
        playsInline
        key="dark-video"
        poster="/auth/atrium-bg-dark-poster.jpg"
        className="hidden dark:block fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* The rest of the component's JSX remains the same */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} /* ... */>
        {/* ... all form content ... */}
      </motion.div>
    </main>
  );
}
