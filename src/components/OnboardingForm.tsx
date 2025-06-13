// FILE: src/components/OnboardingForm.tsx

'use client';

import { useState, useEffect, useRef } from 'react'; // Ensure useEffect and useRef is imported
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
import type { Session } from '@supabase/supabase-js';

// New imports for the new onboarding flow
import { onboardingSteps } from '@/lib/onboarding-steps';
import RoleSelectionCard from '@/components/ui/RoleSelectionCard';
import TagInput from '@/components/ui/TagInput';
import ImageCropper from '@/components/ui/ImageCropper';
import UserProfilePreview from '@/components/UserProfilePreview';
// All placeholder components LanguageSelectPlaceholder, SelectPlaceholder, CheckboxGroupPlaceholder, SocialsPlaceholder
// have been implemented directly in this file, so their imports are no longer needed.

// Icons (assuming these might still be used or managed differently later)
// Commenting out unused icons to avoid build errors if files are not present or paths are incorrect
// import studentIcon from '../../public/assets/onboarding/icon-student.svg';
// import teacherIcon from '../../public/assets/onboarding/icon-teacher.svg';

// New type definition for formData
export type OnboardingData = { // Added export
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

  // Refs for file inputs
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const profileBannerInputRef = useRef<HTMLInputElement>(null);


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
      setError(t('errors.authError', { defaultMessage: 'Authentication error. Please sign in again.'}));
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = { ...finalData };
    // Note: Actual file upload to Supabase storage would happen here or before this.
    // For this example, we assume profilePictureFile and profileBannerFile might be URLs if already uploaded,
    // or would be handled by a separate upload mechanism.
    // Supabase user_profile typically stores URLs, not raw File objects.
    delete dataToSubmit.profilePictureFile;
    delete dataToSubmit.profileBannerFile;


    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ user_profile: dataToSubmit, onboarding_completed: true })
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
    const profileStepData = formData.profile || {};
    const currentProfileData = {
      ...profileStepData,
      bio: profileBio, // Ensure the latest bio from state is included
    };

    const fullFormData = {
        ...formData,
        profile: currentProfileData, // Update profile entry with latest bio
        // The actual File objects for picture/banner are in profilePictureFile/profileBannerFile states
        // and are not directly part of the JSON `formData` sent to Supabase unless converted/uploaded.
    };
    // Pass the File objects separately if your submission logic handles uploads
    // For now, they are not part of `fullFormData` sent to `processAndSubmitData`
    // as `processAndSubmitData` expects serializable data for `user_profile`.
    await processAndSubmitData(fullFormData);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  // --- Local State for Step Inputs ---
  const [welcomeName, setWelcomeName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [languageSelections, setLanguageSelections] = useState<{ website: string; explanation: string; material: string }>({ website: 'en', explanation: 'en', material: 'en' });
  const [majorName, setMajorName] = useState<string>('');
  const [selectedMajorLevel, setSelectedMajorLevel] = useState<string>('');
  const [currentStudiedSubjects, setCurrentStudiedSubjects] = useState<string[]>([]);
  const [currentInterestedMajors, setCurrentInterestedMajors] = useState<string[]>([]);
  const [currentHobbies, setCurrentHobbies] = useState<string[]>([]);
  const [currentNewsPrefs, setCurrentNewsPrefs] = useState<string[]>([]);
  const [contentPrefsValues, setContentPrefsValues] = useState<CheckboxState>({});
  const [agreementValues, setAgreementValues] = useState<CheckboxState>({});
  const [profileBio, setProfileBio] = useState<string>('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [socials, setSocials] = useState<{ twitter: string; github: string; linkedin: string }>({ twitter: '', github: '', linkedin: '' });

  // New state for image cropping and preview
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [cropAspectRatio, setCropAspectRatio] = useState<number>(1);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profileBannerPreview, setProfileBannerPreview] = useState<string | null>(null);


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
        setProfileBio(stepData?.bio || '');
        // Previews (profilePicturePreview, profileBannerPreview) are managed by their own state
        // and updated upon successful crop via ImageCropper's onCropComplete.
        // If you store URLs in `formData.profile.pictureUrl` etc., you could load them here:
        // setProfilePicturePreview(stepData?.pictureUrl || null);
        // setProfileBannerPreview(stepData?.bannerUrl || null);
        break;
      case 'socials': setSocials(stepData || { twitter: '', github: '', linkedin: '' }); break;
      case 'agreements': setAgreementValues(stepData || {}); break;
    }
  }, [currentStep, formData]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, imageType: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl);
      setCropAspectRatio(imageType === 'profile' ? 1 : 16 / 9);
      setCropperOpen(true);
      if (event.target) event.target.value = ''; // Reset file input to allow re-selection
    }
  };

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
        // The bio is now managed by profileBio state, updated via UserProfilePreview's onBioChange
        dataToSubmit = { bio: profileBio };
        // Files (profilePictureFile, profileBannerFile) are handled by their own state variables
        // and are not part of the step-specific data here.
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
            placeholder={t(`${currentStep.id}.placeholder`)}
            value={textValue}
            onChange={(e) => setText(e.target.value)}
          />
        );
      }
      case 'role':
        return (
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
            <RoleSelectionCard
              title={t('role.student')}
              isSelected={selectedRole === 'student'}
              onClick={() => setSelectedRole('student')}
            />
            <RoleSelectionCard
              title={t('role.teacher')}
              isSelected={selectedRole === 'teacher'}
              onClick={() => setSelectedRole('teacher')}
            />
          </div>
        );
      case 'language-select': {
        const languageOptions = [
          { value: 'en', label: 'English' },
          { value: 'de', label: 'German' },
          { value: 'tr', label: 'Turkish' },
          { value: 'ar', label: 'Arabic' },
        ];
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="website-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.website')}</label>
              <select id="website-lang" name="website" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" value={languageSelections.website} onChange={(e) => setLanguageSelections(prev => ({ ...prev, website: e.target.value }))}>
                {languageOptions.map(option => (<option key={`website-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="explanation-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.explanation')}</label>
              <select id="explanation-lang" name="explanation" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" value={languageSelections.explanation} onChange={(e) => setLanguageSelections(prev => ({ ...prev, explanation: e.target.value }))}>
                {languageOptions.map(option => (<option key={`explanation-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="material-lang" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('languages.material')}</label>
              <select id="material-lang" name="material" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" value={languageSelections.material} onChange={(e) => setLanguageSelections(prev => ({ ...prev, material: e.target.value }))}>
                {languageOptions.map(option => (<option key={`material-${option.value}`} value={option.value}>{option.label}</option>))}
              </select>
            </div>
          </div>
        );
      }
      case 'select': {
        if (currentStep.id === 'majorLevel') {
          const majorLevelOptionsObject = t.raw('majorLevel') as Record<string, any>;
          const majorLevelKeys = Object.keys(majorLevelOptionsObject).filter(key => !['title', 'description', 'placeholder'].includes(key));
          return (
            <select name="majorLevel" id="majorLevel" className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" value={selectedMajorLevel} onChange={(e) => setSelectedMajorLevel(e.target.value)}>
              <option value="" disabled>{t('majorLevel.placeholder')}</option>
              {majorLevelKeys.map(key => (<option key={key} value={key}>{t(`majorLevel.${key}`)}</option>))}
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
        return (<TagInput value={tagValue} onChange={setTagValue} placeholder={t(`${currentStep.id}.placeholder`)} />);
      }
      case 'multi-field': // This is the profile step
        // The UserProfilePreview component now handles bio input and image click triggers
        return (
          <UserProfilePreview
            formData={{...formData, profile: {...(formData.profile || {}), bio: profileBio} }} // Pass current bio state along with other formData
            profilePicturePreview={profilePicturePreview}
            profileBannerPreview={profileBannerPreview}
            onBioChange={(newBio) => setProfileBio(newBio)} // Update profileBio state directly
            onPictureClick={() => profilePictureInputRef.current?.click()}
            onBannerClick={() => profileBannerInputRef.current?.click()}
          />
        );
      case 'checkbox-group': {
        const isAgreementsStep = currentStep.id === 'agreements';
        const checkboxValue = isAgreementsStep ? agreementValues : contentPrefsValues;
        const setCheckboxValue = isAgreementsStep ? setAgreementValues : setContentPrefsValues;
        const checkboxOptionsObject = t.raw(currentStep.id) as Record<string, any>;
        const checkboxKeys = Object.keys(checkboxOptionsObject).filter(key => !['title', 'description', 'placeholder'].includes(key));
        return (
          <div>
            {checkboxKeys.map(key => (
              <div key={key} className="flex items-center mb-3 p-3 border border-gray-300 rounded-lg shadow-sm dark:border-gray-600">
                <input id={`${currentStep.id}-${key}`} name={`${currentStep.id}-${key}`} type="checkbox" className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" checked={!!checkboxValue[key]} onChange={(e) => setCheckboxValue(prev => ({ ...prev, [key]: e.target.checked, }))} />
                <label htmlFor={`${currentStep.id}-${key}`} className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{t(`${currentStep.id}.${key}`)}</label>
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
            <div><label htmlFor="socials-twitter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('socials.twitter')}</label><input type="text" id="socials-twitter" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.twitterPlaceholder')} value={socials.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} /></div>
            <div><label htmlFor="socials-github" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('socials.github')}</label><input type="text" id="socials-github" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.githubPlaceholder')} value={socials.github} onChange={(e) => handleSocialChange('github', e.target.value)} /></div>
            <div><label htmlFor="socials-linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('socials.linkedin')}</label><input type="text" id="socials-linkedin" className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500" placeholder={t('socials.linkedinPlaceholder')} value={socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} /></div>
          </div>
        );
      }
      default:
        const defaultMessage = "Unsupported step type: " + currentStep.type;
        return <div>{defaultMessage}</div>;
    }
  };

  if (isSubmitting) {
    return <div className="text-center p-10">{t('submitting')}</div>;
  }

  const isLastStep = currentStepIndex === totalSteps - 1;
  const finishButtonDisabled = isSubmitting || (currentStep?.id === 'agreements' && (!agreementValues.terms || !agreementValues.personalization));

  return (
    <form onSubmit={handleFormSubmitEvent} onKeyDown={handleKeyDown} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      {/* Hidden File Inputs */}
      <input type="file" ref={profilePictureInputRef} onChange={(e) => handleFileChange(e, 'profile')} accept="image/*" className="hidden" id="profilePictureInput" />
      <input type="file" ref={profileBannerInputRef} onChange={(e) => handleFileChange(e, 'banner')} accept="image/*" className="hidden" id="profileBannerInput" />

      {cropperOpen && imageToCrop && (
        <ImageCropper
          imageSrc={imageToCrop}
          aspectRatio={cropAspectRatio}
          onClose={() => {
            setCropperOpen(false);
            if (imageToCrop && imageToCrop.startsWith('blob:')) { URL.revokeObjectURL(imageToCrop); }
            setImageToCrop(null);
          }}
          onCropComplete={(croppedFile) => {
            const newPreviewUrl = URL.createObjectURL(croppedFile);
            if (cropAspectRatio === 1) { // Profile picture
              setProfilePictureFile(croppedFile);
              if (profilePicturePreview && profilePicturePreview.startsWith('blob:')) { URL.revokeObjectURL(profilePicturePreview); }
              setProfilePicturePreview(newPreviewUrl);
            } else { // Banner
              setProfileBannerFile(croppedFile);
              if (profileBannerPreview && profileBannerPreview.startsWith('blob:')) { URL.revokeObjectURL(profileBannerPreview); }
              setProfileBannerPreview(newPreviewUrl);
            }
            setCropperOpen(false);
            if (imageToCrop && imageToCrop.startsWith('blob:')) { URL.revokeObjectURL(imageToCrop); }
            setImageToCrop(null);
          }}
        />
      )}
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 mb-2">{t('step')} {currentStepIndex + 1} {t('of')} {totalSteps}</p>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t(`${currentStep?.id}.title`)}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">{currentStep?.id ? t(`${currentStep.id}.description`) : ''}</p>
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="min-h-[200px] flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto"> {/* Ensure this div allows UserProfilePreview to take appropriate width */}
            {renderStepContent()}
          </div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={handleBack} className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors" disabled={isSubmitting || currentStepIndex === 0}>
          {t('buttons.previous')}
        </button>
        {!isLastStep && (
          <button type="button" onClick={handleProceed} disabled={isSubmitting} className="px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400">
            {t('buttons.next')}
          </button>
        )}
        {isLastStep && (
          <button type="submit" disabled={finishButtonDisabled} className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed">
            {isSubmitting ? t('submitting') : t('buttons.finish')}
          </button>
        )}
      </div>
    </form>
  );
}
