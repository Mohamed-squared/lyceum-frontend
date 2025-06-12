// FILE: src/components/OnboardingForm.tsx

'use client';

import { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

// New imports for the new onboarding flow
import { onboardingSteps } from '@/lib/onboarding-steps';
import RoleSelectionCard from '@/components/ui/RoleSelectionCard';
import TagInput from '@/components/ui/TagInput';
import LanguageSelectPlaceholder from '@/components/ui/LanguageSelectPlaceholder';
import SelectPlaceholder from '@/components/ui/SelectPlaceholder';
import MultiFieldPlaceholder from '@/components/ui/MultiFieldPlaceholder';
import CheckboxGroupPlaceholder from '@/components/ui/CheckboxGroupPlaceholder';
import SocialsPlaceholder from '@/components/ui/SocialsPlaceholder';

// Icons (assuming these might still be used or managed differently later)
import studentIcon from '../../public/assets/onboarding/icon-student.svg'; // This path might also need aliasing if public is not directly servable like that. For now, focus on @/ components and lib.
import teacherIcon from '../../public/assets/onboarding/icon-teacher.svg';

// Interface for our form data state (old one, to be replaced or adapted)
// interface OnboardingData {
//   display_name: string;
//   role: 'student' | 'teacher' | null;
//   major: string;
//   major_level: string;
//   studied_subjects: string[];
// }

// New type definition for formData
type OnboardingData = {
  [key: string]: any;
};

// Type for checkbox group states
type CheckboxState = {
  [key: string]: boolean;
};

// Define the component's props
interface OnboardingFormProps {
  session: Session | null;
}

export function OnboardingForm({ session }: OnboardingFormProps) {
  const router = useRouter();
  const t = useTranslations('onboarding');
  const supabase = createClient(); // Keep supabase client

  // New state for the new onboarding flow
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({}); // Apply the OnboardingData type
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Keep error state

  // Old state (commenting out for now, will be removed/replaced)
  // const tErrors = useTranslations('errors');
  // const [currentStep, setCurrentStep] = useState(0);
  // const [isLoading, setIsLoading] = useState(false);
  // const [formData, setFormData] = useState<Partial<OnboardingData>>({
  //   display_name: '',
  //   role: null,
  //   major: '',
  //   major_level: '',
  //   studied_subjects: [],
  // });

  // Old handleChange, will be replaced
  // const handleChange = (field: keyof OnboardingData, value: any) => {
  const handleChange = (field: string, value: any) => { // Updated handleChange for new formData structure
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Determine Current Step Configuration
  const currentStep = onboardingSteps[currentStepIndex];
  const totalSteps = onboardingSteps.length;

  // New handleNext function
  const handleNext = (stepId: string, data: any) => {
    setFormData(prevData => ({ ...prevData, [stepId]: data }));
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
    // The 'else' case (submitting from 'Next' on the final step) is removed.
    // Final submission is handled by the form's onSubmit event (via the "Finish" button)
    // or by handleFinalStep if a component calls it directly.
  };

  // New handleBack function
  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  };

  // New processAndSubmitData function (replaces old handleSubmit logic)
  const processAndSubmitData = async (finalData: any) => {
    setIsSubmitting(true);
    setError(null);
    console.log('Final Onboarding Data:', finalData);

    if (!session?.user) {
      setError('Authentication error. Please sign in again.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_profile: finalData, onboarding_completed: true })
        .eq('id', session.user.id);

      if (updateError) {
        setError(`Profile update failed: ${updateError.message}`);
      } else {
        router.push('/dashboard');
      }
    } catch (e:any) {
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function for the final step (e.g., 'agreements') to call for submission
  const handleFinalStep = (stepId: string, data: any) => {
    const finalData = { ...formData, [stepId]: data };
    // It's important that `data` for the `stepId` is correctly passed here
    // For example, if it's the agreements step, data would be { terms: true, personalization: false }
    // And formData should already contain all previous steps.
    setFormData(finalData); // Ensure formData state is updated before submission, if processAndSubmitData relies on it directly
    processAndSubmitData(finalData);
  };

  // This function handles the form's native onSubmit event
  const handleFormSubmitEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // On the final step, handleProceed will have already updated formData
    // if it was called by the "Finish" button.
    // Or, if "Finish" is the submit button itself, it directly calls processAndSubmitData.
    await processAndSubmitData(formData);
  };

  // --- Local State for Step Inputs ---
  const [welcomeName, setWelcomeName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>(''); // As per requirement
  const [languageSelections, setLanguageSelections] = useState<{ website: string; explanation: string; material: string }>({ website: '', explanation: '', material: '' });
  const [majorName, setMajorName] = useState<string>('');
  const [selectedMajorLevel, setSelectedMajorLevel] = useState<string>('');
  const [currentStudiedSubjects, setCurrentStudiedSubjects] = useState<string[]>([]);
  const [currentInterestedMajors, setCurrentInterestedMajors] = useState<string[]>([]);
  const [currentHobbies, setCurrentHobbies] = useState<string[]>([]);
  const [currentNewsPrefs, setCurrentNewsPrefs] = useState<string[]>([]);
  const [contentPrefsValues, setContentPrefsValues] = useState<CheckboxState>({});
  // For profile: bio is string, picture/banner are files
  const [profileBio, setProfileBio] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  // socialsData to socialLinks as per naming convention in prompt
  const [socialLinks, setSocialLinks] = useState<{ platform: string; username: string }[]>([]);
  const [agreementValues, setAgreementValues] = useState<CheckboxState>({});

  useEffect(() => {
    // Populate local state when currentStep changes or formData for that step is initialized
    // Note: `profileData` which was an object is now split into `profileBio`, `profilePictureFile`, `profileBannerFile`
    // `socialsData` is now `socialLinks`
    if (!currentStep) return;
    const stepData = formData[currentStep.id];

    switch (currentStep.id) {
      case 'welcome':
        setWelcomeName(stepData || '');
        break;
      case 'role':
        setSelectedRole(stepData || ''); // Adjusted initial state to empty string
        break;
      case 'languages':
        setLanguageSelections(stepData || { website: '', explanation: '', material: '' });
        break;
      case 'major':
        setMajorName(stepData || '');
        break;
      case 'majorLevel':
        setSelectedMajorLevel(stepData || '');
        break;
      case 'studiedSubjects':
        setCurrentStudiedSubjects(stepData || []);
        break;
      case 'interestedMajors':
        setCurrentInterestedMajors(stepData || []);
        break;
      case 'hobbies':
        setCurrentHobbies(stepData || []);
        break;
      case 'news':
        setCurrentNewsPrefs(stepData || []);
        break;
      case 'contentPrefs':
        setContentPrefsValues(stepData || {});
        break;
      case 'profile':
        // Assuming stepData for profile might contain bio, picture, and banner info
        // For local state, we're primarily managing bio text and file objects separately
        setProfileBio(typeof stepData === 'object' && stepData?.bio ? stepData.bio : '');
        // File states (profilePictureFile, profileBannerFile) are typically not stored in formData directly
        // but handled upon selection. Initialization here is for completeness if direct URL/reference were stored.
        // setProfilePictureFile(null); // Or from stepData if applicable
        // setProfileBannerFile(null); // Or from stepData if applicable
        break;
      case 'socials':
        setSocialLinks(stepData || []);
        break;
      case 'agreements':
        setAgreementValues(stepData || {});
        break;
    }
  }, [currentStep, formData]);

  const handleProceed = () => {
    if (!currentStep) return;
    let dataToSubmit: any = {};

    switch (currentStep.id) {
      case 'welcome':
        dataToSubmit = welcomeName;
        break;
      case 'role':
        dataToSubmit = selectedRole;
        break;
      case 'languages':
        dataToSubmit = languageSelections;
        break;
      case 'major':
        dataToSubmit = majorName;
        break;
      case 'majorLevel':
        dataToSubmit = selectedMajorLevel;
        break;
      case 'studiedSubjects':
        dataToSubmit = currentStudiedSubjects;
        break;
      case 'interestedMajors':
        dataToSubmit = currentInterestedMajors;
        break;
      case 'hobbies':
        dataToSubmit = currentHobbies;
        break;
      case 'news':
        dataToSubmit = currentNewsPrefs;
        break;
      case 'contentPrefs':
        dataToSubmit = contentPrefsValues;
        break;
      case 'profile':
        // Consolidate profile data for submission. Files would be handled separately (e.g., upload then store URL).
        dataToSubmit = { bio: profileBio /*, picture: pictureUrl, banner: bannerUrl */ };
        break;
      case 'socials':
        dataToSubmit = socialLinks;
        break;
      case 'agreements':
        dataToSubmit = agreementValues;
        // For the last step, if proceeding via "Finish", data is already up-to-date in formData
        // and handleFormSubmitEvent will be called. This case is for consistency if handleProceed
        // was somehow called.
        break;
      default:
        console.warn(`No data collection logic for step: ${currentStep.id}`);
    }

    // Update formData with the collected data for the current step
    setFormData(prevData => ({ ...prevData, [currentStep.id]: dataToSubmit }));

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    } else {
      // This 'else' means "Finish" button was clicked and it called handleProceed.
      // The form's onSubmit will handle the submission.
      // We ensure formData is up-to-date here.
      // processAndSubmitData(formData); // This would be redundant if Finish is type="submit"
    }
  };


  const renderStepContent = () => {
    if (!currentStep) return <div>Loading step...</div>;

    switch (currentStep.type) {
      case 'text':
        const isWelcome = currentStep.id === 'welcome';
        const textValue = isWelcome ? welcomeName : majorName;
        const setText = isWelcome ? setWelcomeName : setMajorName;
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
            placeholder={t(`${currentStep.id}.placeholder`)}
            value={textValue}
            onChange={(e) => setText(e.target.value)}
          />
        );
      case 'role':
        return (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <RoleSelectionCard
              icon={studentIcon}
              title={t('role.student')}
              isSelected={selectedRole === 'student'}
              onClick={() => setSelectedRole('student')}
            />
            <RoleSelectionCard
              icon={teacherIcon}
              title={t('role.teacher')}
              isSelected={selectedRole === 'teacher'}
              onClick={() => setSelectedRole('teacher')}
            />
          </div>
        );
      case 'language-select':
        return <LanguageSelectPlaceholder value={languageSelections} onChange={setLanguageSelections} />;
      case 'select':
        const selectOptions = currentStep.id === 'majorLevel' ? [
          { value: 'bachelor', label: t('majorLevel.bachelor') },
          { value: 'master', label: t('majorLevel.master') },
          { value: 'phd', label: t('majorLevel.phd') },
          { value: 'postdoc', label: t('majorLevel.postdoc') },
          { value: 'hobbyist', label: t('majorLevel.hobbyist') },
        ] : [];
        return <SelectPlaceholder options={selectOptions} value={selectedMajorLevel} onChange={setSelectedMajorLevel} />;
      case 'tag-input':
        let tagValue: string[] = [];
        let setTagValue: (tags: string[]) => void = () => {};
        if (currentStep.id === 'studiedSubjects') {
          tagValue = currentStudiedSubjects;
          setTagValue = setCurrentStudiedSubjects;
        } else if (currentStep.id === 'interestedMajors') {
          tagValue = currentInterestedMajors;
          setTagValue = setCurrentInterestedMajors;
        } else if (currentStep.id === 'hobbies') {
          tagValue = currentHobbies;
          setTagValue = setCurrentHobbies;
        } else if (currentStep.id === 'news') {
            tagValue = currentNewsPrefs;
            setTagValue = setCurrentNewsPrefs;
        }
        return (
          <TagInput
            value={tagValue}
            onChange={setTagValue}
            placeholder={t(`${currentStep.id}.placeholder`)}
          />
        );
      case 'multi-field': // This is the profile step, currentStep.id === 'profile'
        return (
          <>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('profile.bio')}
            </label>
            <textarea
              id="bio"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
              rows={3}
              placeholder={t('profile.bioPlaceholder')}
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
            />

            {/* Profile Picture upload placeholder */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.picture')}</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {/* TODO: Placeholder for image preview, if profilePictureFile is set, show preview */}
                  {profilePictureFile && <img src={URL.createObjectURL(profilePictureFile)} alt="Preview" className="h-full w-full object-cover" />}
                </span>
                <input
                  type="file"
                  id="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setProfilePictureFile(e.target.files ? e.target.files[0] : null)}
                />
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer ml-5 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  {t('profile.changeButton') || 'Change'} {/* Added fallback for translation key */}
                </label>
              </div>
            </div>

            {/* Profile Banner upload placeholder */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.banner')}</label>
              {/* Actual file input will be implemented later */}
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 dark:border-slate-600">
                <div className="space-y-1 text-center">
                  {/* TODO: Placeholder for icon/text, show banner preview if profileBannerFile is set */}
                  {profileBannerFile ?
                    <img src={URL.createObjectURL(profileBannerFile)} alt="Banner Preview" className="max-h-32 mx-auto" /> :
                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                  <div className="flex text-sm text-slate-600 dark:text-slate-400">
                    <label htmlFor="profileBanner" className="relative cursor-pointer rounded-md bg-white dark:bg-slate-800 font-medium text-indigo-600 dark:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 hover:text-indigo-500 dark:hover:text-indigo-300">
                      <span>{t('profile.uploadFile') || 'Upload a file'}</span>
                      <input id="profileBanner" name="profileBanner" type="file" className="sr-only" accept="image/*" onChange={(e) => setProfileBannerFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">{t('profile.dragAndDrop') || 'or drag and drop'}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('profile.imageTypes') || 'PNG, JPG, GIF up to 10MB'}</p>
                </div>
              </div>
            </div>
          </>
        );
      case 'checkbox-group':
        const isAgreements = currentStep.id === 'agreements';
        const checkboxValue = isAgreements ? agreementValues : contentPrefsValues;
        const setCheckboxValue = isAgreements ? setAgreementValues : setContentPrefsValues;

        let options: { id: string, label: string }[] = [];
        if (isAgreements) {
          options = [
            { id: 'terms', label: t('agreements.terms') },
            { id: 'personalization', label: t('agreements.personalization') },
          ];
        } else { // contentPrefs
          options = [
            { id: 'newsletter', label: t('contentPrefs.newsletter') },
            { id: 'quotes', label: t('contentPrefs.quotes') },
          ];
        }
        return (
          <CheckboxGroupPlaceholder
            name={currentStep.id}
            options={options}
            value={checkboxValue} // This should be CheckboxState
            onChange={(newValues) => {
                 setCheckboxValue(prev => ({...prev, ...newValues} as CheckboxState));
            }}
          />
        );
      case 'socials':
        return <SocialsPlaceholder value={socialLinks} onChange={setSocialLinks} />;
      default:
        return <div>Unsupported step type: {currentStep.type}</div>;
    }
  };

  if (isSubmitting) {
    return <div className="text-center p-10">{t('submitting')}</div>;
  }

  const isLastStep = currentStepIndex === totalSteps - 1;
  const finishButtonDisabled = isSubmitting || (currentStep?.id === 'agreements' && (!agreementValues.terms || !agreementValues.personalization));


  return (
    <form onSubmit={handleFormSubmitEvent} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 mb-2">{t('step')} {currentStepIndex + 1} {t('of')} {totalSteps}</p>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t(`${currentStep?.id}.title`)}</h2>
        {/* Updated description styling */}
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">{t(`${currentStep?.id}.description`)}</p>
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="min-h-[200px] flex flex-col items-center justify-center"> {/* Increased min-h for content */}
          <div className="w-full max-w-md mx-auto">
            {renderStepContent()}
          </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={handleBack}
          className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
          disabled={isSubmitting || currentStepIndex === 0}
        >
          {t('buttons.previous')}
        </button>

        {!isLastStep && (
          <button
            type="button"
            onClick={handleProceed}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {t('buttons.next')}
          </button>
        )}

        {isLastStep && (
          <button
            type="submit" // Form submission triggers handleFormSubmitEvent
            disabled={finishButtonDisabled}
            className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('buttons.saving') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
