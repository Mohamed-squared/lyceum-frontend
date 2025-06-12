// FILE: src/components/OnboardingForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Component Imports
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

  // State for form data - renamed for clarity
  const [role, setRole] = useState<'student' | 'teacher' | null>(null);
  const [studiedSubjects, setStudiedSubjects] = useState<string[]>([]);

  // Corrected step definitions using valid translation keys
  const steps = [
    { title: t('role.title'), description: '' }, // The title is self-explanatory, so no description needed.
    { title: t('studiedSubjects.title'), description: t('studiedSubjects.description') },
  ];

  const handleRoleSelect = (selectedRole: 'student' | 'teacher') => {
    setRole(selectedRole);
  };

  const handleNext = () => {
    if (currentStep === 0 && !role) {
        // Using a generic error key for now, you can add this to your JSON
        setError('Please select a role to continue.');
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
        // Using a generic error key for now
        setError('Authentication error. Please log in again.');
        setIsLoading(false);
        return;
    }

    // Ensure your 'profiles' table has columns 'role' (text) and 'studied_subjects' (text[])
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: role,
        studied_subjects: studiedSubjects, // Updated field name
        onboarding_completed: true,
      })
      .eq('id', session.user.id);

    if (updateError) {
      setError(`Failed to save profile: ${updateError.message}`);
    } else {
      // On success, redirect to the dashboard
      router.push('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
        {steps[currentStep].description && (
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">{steps[currentStep].description}</p>
        )}
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      {currentStep === 0 && (
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <RoleSelectionCard
                icon={studentIcon}
                title={t('role.student')} // Corrected key
                isSelected={role === 'student'}
                onClick={() => handleRoleSelect('student')}
            />
            <RoleSelectionCard
                icon={teacherIcon}
                title={t('role.teacher')} // Corrected key
                isSelected={role === 'teacher'}
                onClick={() => handleRoleSelect('teacher')}
            />
        </div>
      )}

      {currentStep === 1 && (
        <div className="max-w-md mx-auto">
            <TagInput
                value={studiedSubjects}
                onChange={setStudiedSubjects} // Corrected state setter
                placeholder={t('studiedSubjects.placeholder')} // Corrected key
            />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {currentStep > 0 ? (
          <button type="button" onClick={handleBack} className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
            {t('buttons.previous')}
          </button>
        ) : <div />} {/* This div acts as a spacer */}

        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={!role}>
            {t('buttons.next')}
          </button>
        ) : (
          <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
            {isLoading ? t('buttons.saving') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
