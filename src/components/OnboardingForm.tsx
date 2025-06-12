// FILE: src/components/OnboardingForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';
import RoleSelectionCard from './ui/RoleSelectionCard';
import TagInput from './ui/TagInput';
import studentIcon from '../../public/assets/onboarding/icon-student.svg';
import teacherIcon from '../../public/assets/onboarding/icon-teacher.svg';

// Interface for our form data state
interface OnboardingData {
  display_name: string;
  role: 'student' | 'teacher' | null;
  major: string;
  major_level: string;
  studied_subjects: string[];
}

// Define the component's props
interface OnboardingFormProps {
  session: Session | null;
}

export function OnboardingForm({ session }: OnboardingFormProps) {
  // Scoping t to 'onboarding' for steps, and creating a separate one for general errors
  const t = useTranslations('onboarding');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    display_name: '',
    role: null,
    major: '',
    major_level: '',
    studied_subjects: [],
  });

  const handleChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // CORRECTED: The 'id' now matches the keys in OnboardingData
  const steps = [
    { id: 'display_name', title: t('welcome.title'), description: t('welcome.description'), required: true },
    { id: 'role', title: t('role.title'), required: true },
    { id: 'major', title: t('major.title'), required: true },
    { id: 'major_level', title: t('majorLevel.title'), required: true },
    { id: 'studied_subjects', title: t('studiedSubjects.title'), description: t('studiedSubjects.description'), required: false },
  ];

  const handleNext = () => {
    setError(null);
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig.required) {
      const value = formData[currentStepConfig.id as keyof OnboardingData];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError(tErrors('fieldRequired')); // Using translation key
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!session?.user) {
      setError(tErrors('authError'));
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ...formData, onboarding_completed: true })
      .eq('id', session.user.id);

    if (updateError) {
      setError(tErrors('profileUpdateFailed', { details: updateError.message }));
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  const renderStepContent = () => {
    // CORRECTED: The switch case now uses the updated id
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'display_name':
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
            placeholder={t('welcome.placeholder')}
            value={formData.display_name}
            onChange={(e) => handleChange('display_name', e.target.value)}
            required
          />
        );
      case 'role':
        return (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <RoleSelectionCard icon={studentIcon} title={t('role.student')} isSelected={formData.role === 'student'} onClick={() => handleChange('role', 'student')} />
            <RoleSelectionCard icon={teacherIcon} title={t('role.teacher')} isSelected={formData.role === 'teacher'} onClick={() => handleChange('role', 'teacher')} />
          </div>
        );
      case 'major':
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
            placeholder={t('major.placeholder')}
            value={formData.major}
            onChange={(e) => handleChange('major', e.target.value)}
            required
          />
        );
      case 'major_level':
        return (
            <select
                className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={formData.major_level}
                onChange={(e) => handleChange('major_level', e.target.value)}
                required
            >
                <option value="" disabled>Select your level...</option> {/* Consider translating this default option */}
                <option value="bachelor">{t('majorLevel.bachelor')}</option>
                <option value="master">{t('majorLevel.master')}</option>
                <option value="phd">{t('majorLevel.phd')}</option>
                <option value="postdoc">{t('majorLevel.postdoc')}</option>
                <option value="hobbyist">{t('majorLevel.hobbyist')}</option>
            </select>
        );
      case 'studied_subjects':
        return (
            <TagInput
                value={formData.studied_subjects || []}
                onChange={(tags) => handleChange('studied_subjects', tags)}
                placeholder={t('studiedSubjects.placeholder')}
            />
        );
      default:
        return <div>Step not configured yet.</div>; // Consider translating or making this a more user-friendly message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 mb-2">{t('step')} {currentStep + 1} {t('of')} {steps.length}</p>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
        {steps[currentStep].description && (
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">{steps[currentStep].description}</p>
        )}
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="min-h-[150px] flex items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {renderStepContent()}
          </div>
      </div>

      <div className="flex justify-between mt-10">
        {currentStep > 0 ? (
          <button type="button" onClick={handleBack} className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
            {t('buttons.previous')}
          </button>
        ) : <div />}

        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
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
