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
import MultiFieldPlaceholder from '@/components/ui/MultiFieldPlaceholder';
// All placeholder components LanguageSelectPlaceholder, SelectPlaceholder, CheckboxGroupPlaceholder, SocialsPlaceholder
// have been implemented directly in this file, so their imports are no longer needed.

// Icons (assuming these might still be used or managed differently later)
// Commenting out unused icons to avoid build errors if files are not present or paths are incorrect
// import studentIcon from '../../public/assets/onboarding/icon-student.svg';
// import teacherIcon from '../../public/assets/onboarding/icon-teacher.svg';

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
  const t = useTranslations('onboarding'); // Scoped to 'onboarding'
  const supabase = createClient();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentStep = onboardingSteps[currentStepIndex];
  const totalSteps = onboardingSteps.length;

  const handleNext = (stepId: string, data: any) => {
    setFormData(prevData => ({ ...prevData, [stepId]: data }));
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  };

  const processAndSubmitData = async (finalData: any) => {
    setIsSubmitting(true);
    setError(null);
    console.log('Final Onboarding Data:', finalData);

    if (!session?.user) {
      setError(t('errors.authError', { defaultMessage: 'Authentication error. Please sign in again.'})); // Using t from 'onboarding' for consistency
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_profile: finalData, onboarding_completed: true })
        .eq('id', session.user.id);

      if (updateError) {
        setError(t('errors.profileUpdateFailed', { details: updateError.message, defaultMessage: `Profile update failed: ${updateError.message}` }));
      } else {
        router.push('/dashboard');
      }
    } catch (e:any) {
      setError(t('errors.unexpectedError', { message: e.message, defaultMessage: `An unexpected error occurred: ${e.message}` }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmitEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await processAndSubmitData(formData);
  };

  // --- Local State for Step Inputs ---
  const [welcomeName, setWelcomeName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [languageSelections, setLanguageSelections] = useState<{ website: string; explanation: string; material: string }>({ website: 'en', explanation: 'en', material: 'en' });
  const [majorName, setMajorName] = useState<string>('');
  const [selectedMajorLevel, setSelectedMajorLevel] = useState<string>(''); // Used for 'select' case
  const [currentStudiedSubjects, setCurrentStudiedSubjects] = useState<string[]>([]);
  const [currentInterestedMajors, setCurrentInterestedMajors] = useState<string[]>([]);
  const [currentHobbies, setCurrentHobbies] = useState<string[]>([]);
  const [currentNewsPrefs, setCurrentNewsPrefs] = useState<string[]>([]);
  const [contentPrefsValues, setContentPrefsValues] = useState<CheckboxState>({}); // Used for 'checkbox-group' for contentPrefs
  const [agreementValues, setAgreementValues] = useState<CheckboxState>({}); // Used for 'checkbox-group' for agreements
  const [profileBio, setProfileBio] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [socials, setSocials] = useState<{ twitter: string; github: string; linkedin: string }>({ twitter: '', github: '', linkedin: '' });

  useEffect(() => {
    if (!currentStep) return;
    const stepData = formData[currentStep.id];

    switch (currentStep.id) {
      case 'welcome': setWelcomeName(stepData || ''); break;
      case 'role': setSelectedRole(stepData || ''); break;
      case 'languages': setLanguageSelections(stepData || { website: 'en', explanation: 'en', material: 'en' }); break;
      case 'major': setMajorName(stepData || ''); break;
      case 'majorLevel': setSelectedMajorLevel(stepData || ''); break;
      case 'studiedSubjects': setCurrentStudiedSubjects(stepData || []); break;
      case 'interestedMajors': setCurrentInterestedMajors(stepData || []); break;
      case 'hobbies': setCurrentHobbies(stepData || []); break;
      case 'news': setCurrentNewsPrefs(stepData || []); break;
      case 'contentPrefs': setContentPrefsValues(stepData || {}); break;
      case 'profile':
        setProfileBio(typeof stepData === 'object' && stepData?.bio ? stepData.bio : '');
        break;
      case 'socials': setSocials(stepData || { twitter: '', github: '', linkedin: '' }); break;
      case 'agreements': setAgreementValues(stepData || {}); break;
    }
  }, [currentStep, formData]);

  const handleProceed = () => {
    if (!currentStep) return;
    let dataToSubmit: any = {};

    switch (currentStep.id) {
      case 'welcome': dataToSubmit = welcomeName; break;
      case 'role': dataToSubmit = selectedRole; break;
      case 'languages': dataToSubmit = languageSelections; break;
      case 'major': dataToSubmit = majorName; break;
      case 'majorLevel': dataToSubmit = selectedMajorLevel; break;
      case 'studiedSubjects': dataToSubmit = currentStudiedSubjects; break;
      case 'interestedMajors': dataToSubmit = currentInterestedMajors; break;
      case 'hobbies': dataToSubmit = currentHobbies; break;
      case 'news': dataToSubmit = currentNewsPrefs; break;
      case 'contentPrefs': dataToSubmit = contentPrefsValues; break;
      case 'profile':
        dataToSubmit = { bio: profileBio };
        // Note: File uploads would typically be handled separately, e.g., upload then store URL.
        // For this form data, we're primarily concerned with the bio text.
        break;
      case 'socials': dataToSubmit = socials; break;
      case 'agreements': dataToSubmit = agreementValues; break;
      default: console.warn(`No data collection logic for step: ${currentStep.id}`);
    }
    setFormData(prevData => ({ ...prevData, [currentStep.id]: dataToSubmit }));

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return <div>Loading step...</div>;

    switch (currentStep.type) {
      case 'text': {
        const isWelcome = currentStep.id === 'welcome';
        const textValue = isWelcome ? welcomeName : majorName;
        const setText = isWelcome ? setWelcomeName : setMajorName;
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
            placeholder={t(`${currentStep.id}.placeholder`)} // Corrected path
            value={textValue}
            onChange={(e) => setText(e.target.value)}
          />
        );
      }
      case 'role':
        return (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <RoleSelectionCard
              title={t('role.student')} // Corrected path
              isSelected={selectedRole === 'student'}
              onClick={() => setSelectedRole('student')}
            />
            <RoleSelectionCard
              title={t('role.teacher')} // Corrected path
              isSelected={selectedRole === 'teacher'}
              onClick={() => setSelectedRole('teacher')}
            />
          </div>
        );
      case 'language-select': {
        const languageOptions = [
          { value: 'en', label: 'English' }, // Labels could be translated if needed: t('languages.options.en')
          { value: 'de', label: 'German' },
          { value: 'tr', label: 'Turkish' },
          { value: 'ar', label: 'Arabic' },
        ];
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="website-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.website')}</label>
              <select
                id="website-lang" name="website"
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={languageSelections.website}
                onChange={(e) => setLanguageSelections(prev => ({ ...prev, website: e.target.value }))}
              >
                {languageOptions.map(option => (<option key={`website-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="explanation-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.explanation')}</label>
              <select
                id="explanation-lang" name="explanation"
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={languageSelections.explanation}
                onChange={(e) => setLanguageSelections(prev => ({ ...prev, explanation: e.target.value }))}
              >
                {languageOptions.map(option => (<option key={`explanation-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="material-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.material')}</label>
              <select
                id="material-lang" name="material"
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                value={languageSelections.material}
                onChange={(e) => setLanguageSelections(prev => ({ ...prev, material: e.target.value }))}
              >
                {languageOptions.map(option => (<option key={`material-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
          </div>
        );
      }
      case 'select': { // For majorLevel
        if (currentStep.id === 'majorLevel') {
          // Using selectedMajorLevel and setSelectedMajorLevel as per existing state
          const majorLevelOptionsObject = t.raw('majorLevel') as Record<string, any>; // t.raw to get the object
          const majorLevelKeys = Object.keys(majorLevelOptionsObject).filter(key => !['title', 'description', 'placeholder'].includes(key));

          return (
            <select
              name="majorLevel"
              id="majorLevel"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={selectedMajorLevel}
              onChange={(e) => setSelectedMajorLevel(e.target.value)}
            >
              <option value="" disabled>{t('majorLevel.placeholder')}</option>
              {majorLevelKeys.map(key => (
                <option key={key} value={key}>{t(`majorLevel.${key}`)}</option>
              ))}
            </select>
          );
        }
        return <div>Unsupported select step: {currentStep.id}</div>;
      }
      case 'tag-input': {
        let tagValue: string[] = [];
        let setTagValue: (tags: string[]) => void = () => {};
        if (currentStep.id === 'studiedSubjects') { tagValue = currentStudiedSubjects; setTagValue = setCurrentStudiedSubjects; }
        else if (currentStep.id === 'interestedMajors') { tagValue = currentInterestedMajors; setTagValue = setCurrentInterestedMajors; }
        else if (currentStep.id === 'hobbies') { tagValue = currentHobbies; setTagValue = setCurrentHobbies; }
        else if (currentStep.id === 'news') { tagValue = currentNewsPrefs; setTagValue = setCurrentNewsPrefs; }
        return (
          <TagInput
            value={tagValue}
            onChange={setTagValue}
            placeholder={t(`${currentStep.id}.placeholder`)} // Corrected path
          />
        );
      }
      case 'multi-field': // This is the profile step
        return (
          <>
            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.bio')}</label>
            <textarea
              id="bio"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600"
              rows={3}
              placeholder={t('profile.bioPlaceholder')}
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.picture')}</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  {profilePictureFile && <img src={URL.createObjectURL(profilePictureFile)} alt="Preview" className="h-full w-full object-cover" />}
                </span>
                <input type="file" id="profilePicture" className="hidden" accept="image/*" onChange={(e) => setProfilePictureFile(e.target.files ? e.target.files[0] : null)} />
                <label htmlFor="profilePicture" className="cursor-pointer ml-5 rounded-md border border-slate-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                  {t('profile.changeButton')}
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('profile.banner')}</label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 dark:border-slate-600">
                <div className="space-y-1 text-center">
                  {profileBannerFile ? <img src={URL.createObjectURL(profileBannerFile)} alt="Banner Preview" className="max-h-32 mx-auto" /> :
                    <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>}
                  <div className="flex text-sm text-slate-600 dark:text-slate-400">
                    <label htmlFor="profileBanner" className="relative cursor-pointer rounded-md bg-white dark:bg-slate-800 font-medium text-indigo-600 dark:text-indigo-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 hover:text-indigo-500 dark:hover:text-indigo-300">
                      <span>{t('profile.uploadFile')}</span>
                      <input id="profileBanner" name="profileBanner" type="file" className="sr-only" accept="image/*" onChange={(e) => setProfileBannerFile(e.target.files ? e.target.files[0] : null)} />
                    </label>
                    <p className="pl-1">{t('profile.dragAndDrop')}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('profile.imageTypes')}</p>
                </div>
              </div>
            </div>
          </>
        );
      case 'checkbox-group': {
        const isAgreementsStep = currentStep.id === 'agreements';
        // Use existing state: contentPrefsValues for 'contentPrefs', agreementValues for 'agreements'
        const checkboxValue = isAgreementsStep ? agreementValues : contentPrefsValues;
        // Use existing state setters
        const setCheckboxValue = isAgreementsStep ? setAgreementValues : setContentPrefsValues;

        const checkboxOptionsObject = t.raw(currentStep.id) as Record<string, any>;
        const checkboxKeys = Object.keys(checkboxOptionsObject).filter(key => !['title', 'description', 'placeholder'].includes(key)); // Filter non-option keys

        return (
          <div>
            {checkboxKeys.map(key => (
              <div key={key} className="flex items-center mb-3 p-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600">
                <input
                  id={`${currentStep.id}-${key}`}
                  name={`${currentStep.id}-${key}`} // Ensure name is unique if needed for form submission, though handled by state here
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={!!checkboxValue[key]} // Use the correct state variable
                  onChange={(e) =>
                    setCheckboxValue(prev => ({ // Use the correct state setter
                      ...prev,
                      [key]: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor={`${currentStep.id}-${key}`}
                  className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  {t(`${currentStep.id}.${key}`)}
                </label>
              </div>
            ))}
          </div>
        );
      }
      case 'socials': {
        const handleSocialChange = (platform: keyof typeof socials, value: string) => {
          setSocials(prev => ({ ...prev, [platform]: value }));
        };
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="socials-twitter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Twitter</label> {/* Label could be t('socials.twitterLabel') */}
              <input type="text" id="socials-twitter" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.twitterPlaceholder', { defaultMessage: 'https://twitter.com/username'})} value={socials.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} />
            </div>
            <div>
              <label htmlFor="socials-github" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GitHub</label> {/* Label could be t('socials.githubLabel') */}
              <input type="text" id="socials-github" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.githubPlaceholder', { defaultMessage: 'https://github.com/username'})} value={socials.github} onChange={(e) => handleSocialChange('github', e.target.value)} />
            </div>
            <div>
              <label htmlFor="socials-linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">LinkedIn</label> {/* Label could be t('socials.linkedinLabel') */}
              <input type="text" id="socials-linkedin" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.linkedinPlaceholder', { defaultMessage: 'https://linkedin.com/in/username'})} value={socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} />
            </div>
          </div>
        );
      }
      default:
        return <div>Unsupported step type: {currentStep.type}</div>;
    }
  };

  if (isSubmitting) {
    return <div className="text-center p-10">{t('submitting')}</div>; // Correct path
  }

  const isLastStep = currentStepIndex === totalSteps - 1;
  // Assuming 'terms' and 'personalization' are direct keys in 'agreementValues'
  const finishButtonDisabled = isSubmitting || (currentStep?.id === 'agreements' && (!agreementValues.terms || !agreementValues.personalization));


  return (
    <form onSubmit={handleFormSubmitEvent} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 mb-2">{t('step')} {currentStepIndex + 1} {t('of')} {totalSteps}</p>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t(`${currentStep?.id}.title`)}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">{t(`${currentStep?.id}.description`)}</p>
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="min-h-[200px] flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto">
            {renderStepContent()}
          </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          type="button" onClick={handleBack}
          className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
          disabled={isSubmitting || currentStepIndex === 0}
        >
          {t('buttons.previous')}
        </button>

        {!isLastStep && (
          <button
            type="button" onClick={handleProceed} disabled={isSubmitting}
            className="px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {t('buttons.next')}
          </button>
        )}

        {isLastStep && (
          <button
            type="submit" disabled={finishButtonDisabled}
            className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('buttons.saving') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
