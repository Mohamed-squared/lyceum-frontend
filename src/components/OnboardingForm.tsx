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

// Fully expanded interface for all onboarding data
interface OnboardingData {
  display_name: string;
  role: 'student' | 'teacher' | null;
  major: string;
  major_level: string;
  studied_subjects: string[];
  interested_majors: string[];
  hobbies: string[];
  news_topics: string[];
  website_language: string;
  explanation_language: string;
  material_language: string;
  subscribe_newsletter: boolean;
  daily_quotes: boolean;
  bio: string;
  agreed_to_terms: boolean;
  agreed_to_personalization: boolean;
  // profile_picture_url and profile_banner_url will be handled separately
}

interface OnboardingFormProps {
  session: Session | null;
}

export function OnboardingForm({ session }: OnboardingFormProps) {
  const t = useTranslations('onboarding');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const supabase = createClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expanded state object with defaults for all fields
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    display_name: '',
    role: null,
    major: '',
    major_level: '',
    studied_subjects: [],
    interested_majors: [],
    hobbies: [],
    news_topics: [],
    website_language: 'en', // Default value
    explanation_language: 'en',
    material_language: 'en',
    subscribe_newsletter: false,
    daily_quotes: false,
    bio: '',
    agreed_to_terms: false,
    agreed_to_personalization: false,
  });

  const handleChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Fully expanded steps array
  const steps = [
    { id: 'display_name', title: t('welcome.title'), required: true },
    { id: 'role', title: t('role.title'), required: true },
    { id: 'major', title: t('major.title'), required: true },
    { id: 'major_level', title: t('majorLevel.title'), required: true },
    { id: 'studied_subjects', title: t('studiedSubjects.title'), description: t('studiedSubjects.description'), required: false },
    { id: 'interested_majors', title: t('interestedMajors.title'), description: t('interestedMajors.description'), required: false },
    { id: 'hobbies', title: t('hobbies.title'), description: t('hobbies.description'), required: false },
    { id: 'news_topics', title: t('news.title'), description: t('news.description'), required: false },
    { id: 'languages', title: t('languages.title'), required: true }, // Assuming language selection is required
    { id: 'contentPrefs', title: t('contentPrefs.title'), required: false },
    { id: 'profile', title: t('profile.title'), required: false }, // Bio is optional
    { id: 'socials', title: t('socials.title'), description: t('socials.description'), required: false },
    { id: 'agreements', title: t('agreements.title'), required: true }, // Terms agreement is required
  ];

  const handleNext = () => {
    setError(null);
    const currentStepConfig = steps[currentStep];
    if (currentStepConfig.required) {
      let value = formData[currentStepConfig.id as keyof OnboardingData];
       // Special handling for 'agreements' step validation
      if (currentStepConfig.id === 'agreements') {
        value = formData.agreed_to_terms; // Only check the terms agreement for proceeding
      }
      // Special handling for 'languages' step (example, could be more complex if needed)
      // For now, we assume individual language fields are handled by their 'required' if any, or are part of a group
      // If 'languages' step itself is marked required, it implies all sub-fields within it are collectively required or have defaults.
      // The current setup implies that if 'languages' step is 'required:true', the user must interact with it,
      // but individual select defaults prevent empty values. A more robust validation might check each language field.

      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError(tErrors('fieldRequired'));
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
    // Final check for terms agreement before submitting
    if (!formData.agreed_to_terms) {
      // This error message should ideally be translated as well
      setError(t('agreements.mustAgreeTerms', 'You must agree to the Terms and Privacy Policy to complete onboarding.'));
      setIsLoading(false); // Ensure loading is stopped
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!session?.user) {
      setError(tErrors('authError'));
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ ...formData, onboarding_completed: true }) // Send all collected data
      .eq('id', session.user.id);

    if (updateError) {
      setError(tErrors('profileUpdateFailed', { details: updateError.message }));
    } else {
      router.push('/dashboard'); // Redirect on success
    }
    setIsLoading(false);
  };

  const renderStepContent = () => {
    const stepId = steps[currentStep].id;
    switch (stepId) {
      case 'display_name': return <input type="text" className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('welcome.placeholder')} value={formData.display_name} onChange={(e) => handleChange('display_name', e.target.value)} required />;
      case 'role': return <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8"><RoleSelectionCard icon={studentIcon} title={t('role.student')} isSelected={formData.role === 'student'} onClick={() => handleChange('role', 'student')} /><RoleSelectionCard icon={teacherIcon} title={t('role.teacher')} isSelected={formData.role === 'teacher'} onClick={() => handleChange('role', 'teacher')} /></div>;
      case 'major': return <input type="text" className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('major.placeholder')} value={formData.major} onChange={(e) => handleChange('major', e.target.value)} required />;
      case 'major_level': return <select className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" value={formData.major_level || ''} onChange={(e) => handleChange('major_level', e.target.value)} required><option value="" disabled>{t('majorLevel.selectPlaceholder', 'Select your level...')}</option><option value="bachelor">{t('majorLevel.bachelor')}</option><option value="master">{t('majorLevel.master')}</option><option value="phd">{t('majorLevel.phd')}</option><option value="postdoc">{t('majorLevel.postdoc')}</option><option value="hobbyist">{t('majorLevel.hobbyist')}</option></select>;
      case 'studied_subjects': return <TagInput value={formData.studied_subjects || []} onChange={(tags) => handleChange('studied_subjects', tags)} placeholder={t('studiedSubjects.placeholder')} />;
      case 'interested_majors': return <TagInput value={formData.interested_majors || []} onChange={(tags) => handleChange('interested_majors', tags)} placeholder={t('interestedMajors.placeholder')} />;
      case 'hobbies': return <TagInput value={formData.hobbies || []} onChange={(tags) => handleChange('hobbies', tags)} placeholder={t('hobbies.placeholder')} />;
      case 'news_topics': return <TagInput value={formData.news_topics || []} onChange={(tags) => handleChange('news_topics', tags)} placeholder={t('news.placeholder')} />;
      case 'languages': return <div className="space-y-4"><div><label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t('languages.website')}</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500" value={formData.website_language} onChange={(e) => handleChange('website_language', e.target.value)}><option value="en">English</option><option value="ar">العربية</option><option value="de">Deutsch</option><option value="tr">Türkçe</option></select></div><div><label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t('languages.explanation')}</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500" value={formData.explanation_language} onChange={(e) => handleChange('explanation_language', e.target.value)}><option value="en">English</option><option value="ar">العربية</option><option value="de">Deutsch</option><option value="tr">Türkçe</option></select></div><div><label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t('languages.material')}</label><select className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500" value={formData.material_language} onChange={(e) => handleChange('material_language', e.target.value)}><option value="en">English</option><option value="ar">العربية</option><option value="de">Deutsch</option><option value="tr">Türkçe</option></select></div></div>;
      case 'contentPrefs': return <div className="space-y-3"><label className="flex items-center gap-3 p-3 border rounded-md dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"><input type="checkbox" className="h-5 w-5 accent-blue-600" checked={!!formData.subscribe_newsletter} onChange={(e) => handleChange('subscribe_newsletter', e.target.checked)} /><span>{t('contentPrefs.newsletter')}</span></label><label className="flex items-center gap-3 p-3 border rounded-md dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"><input type="checkbox" className="h-5 w-5 accent-blue-600" checked={!!formData.daily_quotes} onChange={(e) => handleChange('daily_quotes', e.target.checked)} /><span>{t('contentPrefs.quotes')}</span></label></div>;
      case 'profile': return <div className="space-y-4"><div><label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{t('profile.bio')}</label><textarea className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 h-24 focus:ring-2 focus:ring-blue-500" placeholder={t('profile.bioPlaceholder')} value={formData.bio} onChange={(e) => handleChange('bio', e.target.value)} /></div><div className="text-center text-sm text-gray-500 dark:text-gray-400">{t('profile.uploadsPlaceholder', 'Profile picture and banner uploads coming soon!')}</div></div>;
      case 'socials': return <div className="text-center text-sm text-gray-500 dark:text-gray-400">{t('socials.placeholder', 'Social links component coming soon!')}</div>; // Placeholder for future social links component
      case 'agreements': return <div className="space-y-3"><label className="flex items-center gap-3 p-3 border rounded-md dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"><input type="checkbox" className="h-5 w-5 accent-blue-600" checked={!!formData.agreed_to_terms} onChange={(e) => handleChange('agreed_to_terms', e.target.checked)} required /><span>{t('agreements.terms')}</span></label><label className="flex items-center gap-3 p-3 border rounded-md dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"><input type="checkbox" className="h-5 w-5 accent-blue-600" checked={!!formData.agreed_to_personalization} onChange={(e) => handleChange('agreed_to_personalization', e.target.checked)} /><span>{t('agreements.personalization')}</span></label></div>;
      default: return <div>{t('stepNotConfigured', 'Step not configured yet.')}</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 mb-2">{t('step')} {currentStep + 1} {t('of')} {steps.length}</p>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
        {steps[currentStep].description && <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">{steps[currentStep].description}</p>}
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md text-sm">{error}</p>}

      <div className="min-h-[200px] flex items-center justify-center px-2">
        <div className="w-full max-w-md mx-auto">{renderStepContent()}</div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4">
        {currentStep > 0 ? (
          <button type="button" onClick={handleBack} className="w-full sm:w-auto px-6 py-2.5 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
            {t('buttons.previous')}
          </button>
        ) : <div className="sm:w-auto" />} {/* Spacer for alignment */}

        {currentStep < steps.length - 1 ? (
          <button type="button" onClick={handleNext} className="w-full sm:w-auto px-6 py-2.5 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            {t('buttons.next')}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading || !formData.agreed_to_terms}
            className="w-full sm:w-auto px-6 py-2.5 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? t('buttons.saving', 'Saving...') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
