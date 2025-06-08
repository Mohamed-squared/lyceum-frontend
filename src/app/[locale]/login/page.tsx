// src/app/[locale]/login/page.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMail, FiLock } from 'react-icons/fi';
import Image from 'next/image';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  const router = useRouter();

  const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (view === 'sign-in') {
      // Placeholder for Supabase sign-in logic
      console.log('Signing in with:', email, password);
    } else {
      // Placeholder for Supabase sign-up logic
      console.log('Signing up with:', email, password);
    }

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      // On successful auth, you'd navigate the user
      // router.push('/');
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      {/* Background Videos */}
      <video
        autoPlay
        loop
        muted
        playsInline
        key="light-video"
        className="dark:hidden fixed inset-0 w-full h-full object-cover -z-10"
        src="/auth/atrium-bg-light.mp4"
      />
      <video
        autoPlay
        loop
        muted
        playsInline
        key="dark-video"
        className="hidden dark:block fixed inset-0 w-full h-full object-cover -z-10"
        src="/auth/atrium-bg-dark.mp4"
      />

      {/* Form Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 space-y-6 bg-black/30 dark:bg-gray-900/40 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/30"
      >
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-4xl font-serif font-bold text-white">
            {view === 'sign-in' ? t('headingSignIn') : t('headingSignUp')}
          </h1>
          <p className="mt-2 text-gray-300 dark:text-gray-400">
            {view === 'sign-in' ? t('subheadingSignIn') : t('subheadingSignUp')}
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer h-12 w-full border-b-2 border-gray-400 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400"
                placeholder="email@example.com"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm"
              >
                {t('emailLabel')}
              </label>
              <FiMail className="absolute top-3.5 right-0 text-gray-400" />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer h-12 w-full border-b-2 border-gray-400 bg-transparent text-white placeholder-transparent focus:outline-none focus:border-blue-400"
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-blue-400 peer-focus:text-sm"
              >
                {t('passwordLabel')}
              </label>
              <FiLock className="absolute top-3.5 right-0 text-gray-400" />
            </motion.div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 px-6 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                 <Image src="/auth/astrolabe-spinner.svg" alt="Loading..." width={28} height={28} className="animate-spin" />
              ) : (
                view === 'sign-in' ? t('signInButton') : t('signUpButton')
              )}
            </button>
          </motion.div>
        </form>

        {/* View Toggle */}
        <p className="text-center text-sm text-gray-300 dark:text-gray-400">
          {view === 'sign-in' ? t('promptSignUp') : t('promptSignIn')}
          <button
            onClick={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
            className="font-medium text-blue-400 hover:underline ml-1"
          >
            {view === 'sign-in' ? t('signUpLink') : t('signInLink')}
          </button>
        </p>
      </motion.div>
    </main>
  );
}
