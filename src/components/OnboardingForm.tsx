'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Corrected default imports
import RoleSelectionCard from './ui/RoleSelectionCard';
import TagInput from './ui/TagInput';

// Import icons for the roles
import studentIcon from '../../public/assets/onboarding/icon-student.svg';
import teacherIcon from '../../public/assets/onboarding/icon-teacher.svg';

// Define the component's props
interface OnboardingFormProps {
  session: Session | null;
}

export function OnboardingForm({ session }: OnboardingFormProps) {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for form data
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [interests, setInterests] = useState<string[]>([]);

  const steps = [
    { title: t('step1.title'), description: t('step1.description') },
    { title: t('step2.title'), description: t('step2.description') },
  ];

  const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
  };

  const handleNext = () => {
    if (currentStep === 0 && !role) {
        setError(t('errors.roleRequired'));
        return;
    }
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!session?.user) {
        setError(t('errors.notAuthenticated'));
        setIsLoading(false);
        return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: role,
        interests: interests,
        onboarding_completed: true,
      })
      .eq('id', session.user.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      // On success, redirect to a dashboard page (which we will create later)
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="w-full max-w-lg mx-auto p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{steps[currentStep].description}</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {currentStep === 0 && (
        <div className="flex justify-center gap-4 sm:gap-8">
            <RoleSelectionCard
                icon={studentIcon}
                title={t('step1.student')}
                isSelected={role === 'student'}
                onClick={() => handleRoleSelect('student')}
            />
            <RoleSelectionCard
                icon={teacherIcon}
                title={t('step1.teacher')}
                isSelected={role === 'teacher'}
                onClick={() => handleRoleSelect('teacher')}
            />
        </div>
      )}

      {currentStep === 1 && (
        <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">{t('step2.interestsLabel')}</label>
            <TagInput
                value={interests}
                onChange={setInterests}
                placeholder={t('step2.interestsPlaceholder')}
            />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {currentStep > 0 ? (
          <button type="button" onClick={handleBack} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100">
            {t('buttons.back')}
          </button>
        ) : <div />}

        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            {t('buttons.next')}
          </button>
        ) : (
          <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400">
            {isLoading ? t('buttons.saving') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
