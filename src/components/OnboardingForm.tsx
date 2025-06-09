// Path: src/components/OnboardingForm.tsx
"use client";

import { useState, FC, ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import RoleSelectionCard from './ui/RoleSelectionCard';
import TagInput from './ui/TagInput';

// The complete data structure for our form
interface OnboardingData {
  displayName: string;
  userRole: 'teacher' | 'student' | '';
  preferred_website_language: string;
  preferred_course_explanation_language: string;
  preferred_course_material_language: string;
  major: string;
  major_level: string;
  studied_subjects: string[];
  interested_majors: string[];
  hobbies: string[];
  interested_news_topics: string[];
  subscribed_to_newsletter: boolean;
  receive_quotes: boolean;
  bio: string;
  github_url: string;
  // ... other social links
  agreed_to_terms: boolean;
  agreed_to_personalization: boolean;
}

const OnboardingForm: FC = () => {
  const t = useTranslations('onboarding');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: '',
    userRole: '',
    preferred_website_language: 'en',
    preferred_course_explanation_language: 'en',
    preferred_course_material_language: 'en',
    major: '',
    major_level: '',
    studied_subjects: [],
    interested_majors: [],
    hobbies: [],
    interested_news_topics: [],
    subscribed_to_newsletter: false,
    receive_quotes: false,
    bio: '',
    github_url: '',
    agreed_to_terms: false,
    agreed_to_personalization: false,
  });

  const totalSteps = 13;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final submission logic will go here
      console.log('Final Form Data:', formData);
      alert('Onboarding Complete!');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (name: keyof OnboardingData, tags: string[]) => {
      setFormData(prev => ({ ...prev, [name]: tags }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome
        return (
            <div className="w-full">
              <h2 className="text-2xl font-bold">{t('welcome.title')}</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('welcome.description')}</p>
              <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} placeholder={t('welcome.placeholder')} className="mt-4 w-full input-style" required />
            </div>
        );
      case 1: // Role
        return (
            <div className="w-full text-center">
                <h2 className="text-2xl font-bold mb-6">{t('role.title')}</h2>
                <div className="flex justify-center gap-8">
                    <RoleSelectionCard icon="/assets/onboarding/icon-teacher.svg" title={t('role.teacher')} isSelected={formData.userRole === 'teacher'} onClick={() => setFormData(prev => ({ ...prev, userRole: 'teacher' }))} />
                    <RoleSelectionCard icon="/assets/onboarding/icon-student.svg" title={t('role.student')} isSelected={formData.userRole === 'student'} onClick={() => setFormData(prev => ({ ...prev, userRole: 'student' }))} />
                </div>
            </div>
        );
      case 2: // Languages
        return (
            <div className="w-full space-y-4">
                <h2 className="text-2xl font-bold">{t('languages.title')}</h2>
                {[
                  { name: 'preferred_website_language', label: t('languages.website') },
                  { name: 'preferred_course_explanation_language', label: t('languages.explanation') },
                  { name: 'preferred_course_material_language', label: t('languages.material') },
                ].map(lang => (
                  <div key={lang.name}>
                      <label className="block text-sm font-medium mb-1">{lang.label}</label>
                      <select name={lang.name} value={formData[lang.name as keyof OnboardingData] as string} onChange={handleChange} className="w-full input-style">
                          <option value="en">English</option>
                          <option value="de">Deutsch</option>
                          <option value="tr">Türkçe</option>
                          <option value="ar">العربية</option>
                      </select>
                  </div>
                ))}
            </div>
        );
      case 3: // Major
        return (
            <div className="w-full">
                <h2 className="text-2xl font-bold">{t('major.title')}</h2>
                <input type="text" name="major" value={formData.major} onChange={handleChange} placeholder={t('major.placeholder')} className="mt-4 w-full input-style" />
            </div>
        );
      case 4: // Major Level
        return (
            <div className="w-full">
                <h2 className="text-2xl font-bold">{t('majorLevel.title')}</h2>
                <select name="major_level" value={formData.major_level} onChange={handleChange} className="mt-4 w-full input-style">
                    <option value="" disabled>Select your level</option>
                    <option value="bachelor">{t('majorLevel.bachelor')}</option>
                    <option value="master">{t('majorLevel.master')}</option>
                    <option value="phd">{t('majorLevel.phd')}</option>
                    <option value="postdoc">{t('majorLevel.postdoc')}</option>
                    <option value="hobbyist">{t('majorLevel.hobbyist')}</option>
                </select>
            </div>
        );
      case 5: // Studied Subjects
      case 6: // Interested Majors
      case 7: // Hobbies
      case 8: // News Topics
        // const fields = ['studiedSubjects', 'interestedMajors', 'hobbies', 'news']; // Original incorrect keys
        // const currentField = fields[currentStep - 5] as keyof OnboardingData;
        // It needs to match the key in OnboardingData exactly.
        // Let's adjust the fields array to match the keys in OnboardingData
        const correctedFields = ['studied_subjects', 'interested_majors', 'hobbies', 'interested_news_topics'];
        const correctedCurrentField = correctedFields[currentStep - 5] as keyof OnboardingData;

        return (
            <div className="w-full">
                <h2 className="text-2xl font-bold">{t(`${correctedCurrentField}.title`)}</h2>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(`${correctedCurrentField}.description`)}</p>
                <TagInput value={formData[correctedCurrentField] as string[]} onChange={(tags) => handleMultiSelectChange(correctedCurrentField, tags)} placeholder={t(`${correctedCurrentField}.placeholder`)} />
            </div>
        );
      case 9: // Content Preferences
        return (
            <div className="w-full space-y-4">
                <h2 className="text-2xl font-bold">{t('contentPrefs.title')}</h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="subscribed_to_newsletter" checked={formData.subscribed_to_newsletter} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
                    <span>{t('contentPrefs.newsletter')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="receive_quotes" checked={formData.receive_quotes} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
                    <span>{t('contentPrefs.quotes')}</span>
                </label>
            </div>
        );
      case 10: // Profile Customization
        return (
            <div className="w-full space-y-4">
                <h2 className="text-2xl font-bold">{t('profile.title')}</h2>
                {/* Note: File upload logic will be added later */}
                <div>
                    <label className="block text-sm font-medium">{t('profile.picture')}</label>
                    <input type="file" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">{t('profile.banner')}</label>
                    <input type="file" className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                </div>
                <div>
                    <label className="block text-sm font-medium">{t('profile.bio')}</label>
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder={t('profile.bioPlaceholder')} className="mt-1 w-full input-style" rows={3}></textarea>
                </div>
            </div>
        );
      case 11: // Socials
          return (
              <div className="w-full space-y-4">
                  <h2 className="text-2xl font-bold">{t('socials.title')}</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('socials.description')}</p>
                  <input type="url" name="github_url" value={formData.github_url} onChange={handleChange} placeholder="GitHub URL" className="w-full input-style" />
                  {/* Add other social inputs here as needed */}
              </div>
          );
      case 12: // Agreements
        return (
            <div className="w-full space-y-4">
                <h2 className="text-2xl font-bold">{t('agreements.title')}</h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="agreed_to_terms" checked={formData.agreed_to_terms} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
                    <span>{t('agreements.terms')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="agreed_to_personalization" checked={formData.agreed_to_personalization} onChange={handleChange} className="form-checkbox h-5 w-5 text-blue-600" />
                    <span>{t('agreements.personalization')}</span>
                </label>
            </div>
        );
      default:
        return <div>Step not found</div>;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 12) { // Agreements step
      return !formData.agreed_to_terms || !formData.agreed_to_personalization;
    }
    // Disable next if role is not selected in step 1
    if (currentStep === 1 && formData.userRole === '') {
        return true;
    }
    // Disable next if display name is not entered in step 0
    if (currentStep === 0 && formData.displayName.trim() === '') {
        return true;
    }
    return false;
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <style jsx global>{`
        .input-style {
          @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white;
        }
      `}</style>
      <video autoPlay loop muted playsInline poster="/auth/atrium-bg-dark-poster.jpg" className="absolute top-0 left-0 w-full h-full object-cover -z-10">
        <source src="/auth/atrium-bg-dark.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />

      <div className="w-full max-w-2xl p-6 md:p-8 space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl">
        <div>
          <p className="text-sm text-right text-gray-600 dark:text-gray-400">{t('step')} {currentStep + 1} {t('of')} {totalSteps}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }} />
          </div>
        </div>

        <div className="min-h-[250px] flex items-center justify-center">
          {renderStepContent()}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-700">
          <button onClick={handlePrevious} disabled={currentStep === 0} className="px-6 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500">
            {t('buttons.previous')}
          </button>
          <div className="flex items-center gap-4">
            {/* Removed Skip button as per discussion that important fields should not be skippable */}
            {/* <button onClick={handleNext} className="px-6 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-800">
              {t('buttons.skip')}
            </button> */}
            <button onClick={handleNext} disabled={isNextDisabled()} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {currentStep === totalSteps - 1 ? t('buttons.finish') : t('buttons.next')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
