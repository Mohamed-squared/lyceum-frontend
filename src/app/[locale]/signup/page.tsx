'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/navigation'; // Using next-intl's Link
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiLogIn } from 'react-icons/fi';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      alert(t('checkEmail'));
      router.push('/login');
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const containerVariants = { /* ... (Same as login page) ... */ };
  const itemVariants = { /* ... (Same as login page) ... */ };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center text-white">
      {/* Backgrounds */}
      <video autoPlay loop muted playsInline key="light-video" poster="/auth/atrium-bg-light-poster.jpg" className="dark:hidden fixed inset-0 w-full h-full object-cover -z-10 bg-[url('/auth/atrium-bg-light-poster.jpg')] bg-cover" src="/auth/atrium-bg-light.mp4" />
      <video autoPlay loop muted playsInline key="dark-video" poster="/auth/atrium-bg-dark-poster.jpg" className="hidden dark:block fixed inset-0 w-full h-full object-cover -z-10 bg-[url('/auth/atrium-bg-dark-poster.jpg')] bg-cover" src="/auth/atrium-bg-dark.mp4" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full max-w-md p-8 space-y-6 bg-black/30 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-white">{t('headingSignUp')}</h1>
          <p className="mt-2 text-gray-300 dark:text-gray-400">{t('subheadingSignUp')}</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center p-3 space-x-2 text-sm text-center text-red-200 bg-red-800/50 rounded-lg">
            <FiAlertCircle className="flex-shrink-0 w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="space-y-4">
            <button onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading} className="w-full h-12 px-6 text-white font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 disabled:bg-gray-500 flex items-center justify-center gap-2">
                {isGoogleLoading ? <Image src="/auth/astrolabe-spinner.svg" alt="Loading..." width={24} height={24} className="animate-spin" /> : <FaGoogle />}
                {t('continueWithGoogle')}
            </button>
            <div className="flex items-center text-xs text-gray-400">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink mx-4">OR</span>
                <div className="flex-grow border-t border-gray-600"></div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields are the same as login page */}
          <div className="space-y-4">
            <div className="relative">
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="peer h-12 w-full border-b-2 border-gray-400 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400" placeholder="email@example.com" />
              <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm">{t('emailLabel')}</label>
              <FiMail className="absolute top-3.5 right-0 text-gray-400" />
            </div>
            <div className="relative">
              <input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="peer h-12 w-full border-b-2 border-gray-400 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400" placeholder="Password" />
              <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm">{t('passwordLabel')}</label>
              <FiLock className="absolute top-3.5 right-0 text-gray-400" />
            </div>
          </div>
          <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full h-12 px-6 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-500 flex items-center justify-center">
            {isLoading ? <Image src="/auth/astrolabe-spinner.svg" alt="Loading..." width={28} height={28} className="animate-spin" /> : t('signUpButton')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 dark:text-gray-400">
          {t('promptSignIn')} <Link href="/login" className="font-medium text-blue-400 hover:underline ml-1">{t('signInLink')}</Link>
        </p>
      </motion.div>
    </main>
  );
}
