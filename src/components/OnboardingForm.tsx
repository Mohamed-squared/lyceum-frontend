// FILE: src/components/OnboardingForm.tsx

'use client';

import { useState, useEffect, useRef } from 'react'; // Ensure useEffect and useRef is imported
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';
// Session type is not directly used in this component after previous refactor, but good to keep if needed for other Supabase interactions.
// import type { Session } from '@supabase/supabase-js';

// New imports for the new onboarding flow
import { onboardingSteps } from '@/lib/onboarding-steps';
import RoleSelectionCard from '@/components/ui/RoleSelectionCard';
import TagInput from '@/components/ui/TagInput';
import ImageCropper from '@/components/ui/ImageCropper';
import UserProfilePreview from '@/components/UserProfilePreview';

// New type definition for formData
export type OnboardingData = {
  [key: string]: any;
};

// Type for checkbox group states
type CheckboxState = {
  [key: string]: boolean;
};

// Define the component's props
interface OnboardingFormProps {
  // session prop is no longer needed as we fetch it inside the component
}

export function OnboardingForm({}: OnboardingFormProps) {
  const router = useRouter();
  const t = useTranslations('onboarding');
  const supabase = createClient();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({}); // This stores step-specific data, not the final submission structure
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const profileBannerInputRef = useRef<HTMLInputElement>(null);

  // --- Local State for ALL Step Inputs (used for direct binding and final submission mapping) ---
  const [welcomeName, setWelcomeName] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [languageSelections, setLanguageSelections] = useState<{ website: string; explanation: string; material: string }>({ website: 'en', explanation: 'en', material: 'en' });
  const [majorName, setMajorName] = useState<string>('');
  const [selectedMajorLevel, setSelectedMajorLevel] = useState<string>('');
  const [currentStudiedSubjects, setCurrentStudiedSubjects] = useState<string[]>([]);
  const [currentInterestedMajors, setCurrentInterestedMajors] = useState<string[]>([]);
  const [currentHobbies, setCurrentHobbies] = useState<string[]>([]);
  const [currentNewsPrefs, setCurrentNewsPrefs] = useState<string[]>([]); // For 'news' step, if needed for backend
  const [contentPrefsValues, setContentPrefsValues] = useState<CheckboxState>({}); // For 'contentPrefs' e.g., quotes
  const [agreementValues, setAgreementValues] = useState<CheckboxState>({}); // For 'agreements' e.g., newsletter
  const [profileBio, setProfileBio] = useState<string>('');
  const [socials, setSocials] = useState<{ twitter: string; github: string; linkedin: string }>({ twitter: '', github: '', linkedin: '' });

  // States for file objects and previews (not directly sent to backend JSON, URLs would be)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profileBannerFile, setProfileBannerFile] = useState<File | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [cropAspectRatio, setCropAspectRatio] = useState<number>(1);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profileBannerPreview, setProfileBannerPreview] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [profileBannerUrl, setProfileBannerUrl] = useState<string | null>(null);

  const currentStep = onboardingSteps[currentStepIndex];
  const totalSteps = onboardingSteps.length;

  // useEffect to populate step-specific states when currentStep or formData changes
  useEffect(() => {
    if (!currentStep) return;
    // formData here is the object storing data by step ID. We use this to rehydrate inputs if user navigates back/forth.
    const stepData = formData[currentStep.id];

    switch (currentStep.id) {
      case 'welcome': if(stepData !== undefined) setWelcomeName(stepData); break;
      case 'role': if(stepData !== undefined) setSelectedRole(stepData); break;
      case 'languages': if(stepData !== undefined) setLanguageSelections(stepData); else setLanguageSelections({ website: 'en', explanation: 'en', material: 'en' }); break;
      case 'major': if(stepData !== undefined) setMajorName(stepData); break;
      case 'majorLevel': if(stepData !== undefined) setSelectedMajorLevel(stepData); break;
      case 'studiedSubjects': if(stepData !== undefined) setCurrentStudiedSubjects(stepData); else setCurrentStudiedSubjects([]); break;
      case 'interestedMajors': if(stepData !== undefined) setCurrentInterestedMajors(stepData); else setCurrentInterestedMajors([]); break;
      case 'hobbies': if(stepData !== undefined) setCurrentHobbies(stepData); else setCurrentHobbies([]); break;
      case 'news': if(stepData !== undefined) setCurrentNewsPrefs(stepData); else setCurrentNewsPrefs([]); break; // Assuming 'news' maps to currentNewsPrefs
      case 'contentPrefs': if(stepData !== undefined) setContentPrefsValues(stepData); else setContentPrefsValues({}); break;
      case 'profile':
        if(stepData?.bio !== undefined) setProfileBio(stepData.bio); else setProfileBio('');
        // Note: File previews are handled by their own state and updated via ImageCropper.
        // If formData stored URLs (e.g., from a previous session), you'd load them here.
        break;
      case 'socials': if(stepData !== undefined) setSocials(stepData); else setSocials({ twitter: '', github: '', linkedin: '' }); break;
      case 'agreements': if(stepData !== undefined) setAgreementValues(stepData); else setAgreementValues({}); break;
    }
  }, [currentStep, formData]);

  const handleImageUpload = async (imageBlob: Blob, storagePath: 'avatars' | 'banners') => {
    const supabase = createClient(); // createClient is already available in the outer scope, but creating a new instance is fine.
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError(t('errors.authError', { defaultMessage: 'You must be logged in to upload images.' }));
      return;
    }

    const fileName = `${user.id}-${storagePath}-${Date.now()}.png`;
    const filePath = `${user.id}/${fileName}`; // Store images in a folder per user for better organization

    try {
      setIsSubmitting(true); // Indicate loading state
      const { error: uploadError } = await supabase.storage
        .from(storagePath) // 'avatars' or 'banners'
        .upload(filePath, imageBlob, {
          cacheControl: '3600',
          upsert: false, // Important: set to true if you want to overwrite, false if you want to prevent overwriting.
        });

      if (uploadError) {
        console.error(`Error uploading to ${storagePath}:`, uploadError);
        setError(t('errors.uploadFailed', { details: uploadError.message, defaultMessage: 'Image upload failed.' }));
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(storagePath)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        setError(t('errors.uploadFailed', { details: 'Failed to get public URL.', defaultMessage: 'Image upload failed.' }));
        setIsSubmitting(false);
        return;
      }

      const url = publicUrlData.publicUrl;

      if (storagePath === 'avatars') {
        setProfilePictureUrl(url);
        // Update formData for profile step if it exists, or handle it directly in final submission
        setFormData(prevData => ({
          ...prevData,
          profile: { ...(prevData.profile || {}), profile_picture_url: url }
        }));
      } else if (storagePath === 'banners') {
        setProfileBannerUrl(url);
        setFormData(prevData => ({
          ...prevData,
          profile: { ...(prevData.profile || {}), profile_banner_url: url }
        }));
      }

      // Update preview (optional, if you want the preview to show the uploaded image URL)
      // For now, existing preview logic using blob URLs will remain.
      // If you want to switch preview to new URL:
      // if (storagePath === 'avatars') setProfilePicturePreview(url);
      // else setProfileBannerPreview(url);

    } catch (e: any) {
      console.error(`Unexpected error during image upload to ${storagePath}:`, e);
      setError(t('errors.unexpectedError', { defaultMessage: 'An unexpected error occurred during upload.' }));
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleProceed = () => {
    if (!currentStep) return;
    let dataToStoreInFormData: any; // This is what gets stored in the formData state object, keyed by step.id

    // Collect data from current step's local state to store in formData
    switch (currentStep.id) {
      case 'welcome': dataToStoreInFormData = welcomeName; break;
      case 'role': dataToStoreInFormData = selectedRole; break;
      case 'languages': dataToStoreInFormData = languageSelections; break;
      case 'major': dataToStoreInFormData = majorName; break;
      case 'majorLevel': dataToStoreInFormData = selectedMajorLevel; break;
      case 'studiedSubjects': dataToStoreInFormData = currentStudiedSubjects; break;
      case 'interestedMajors': dataToStoreInFormData = currentInterestedMajors; break;
      case 'hobbies': dataToStoreInFormData = currentHobbies; break;
      case 'news': dataToStoreInFormData = currentNewsPrefs; break;
      case 'contentPrefs': dataToStoreInFormData = contentPrefsValues; break;
      case 'profile': dataToStoreInFormData = { bio: profileBio }; break; // Only bio is part of this step's direct form data for now
      case 'socials': dataToStoreInFormData = socials; break;
      case 'agreements': dataToStoreInFormData = agreementValues; break;
      default: console.warn(`No data collection logic for step: ${currentStep.id}`); dataToStoreInFormData = {};
    }
    // Update formData with the collected data for the current step
    setFormData(prevData => ({ ...prevData, [currentStep.id]: dataToStoreInFormData }));

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      // Corrected: Decrement the index to go to the previous step
      setCurrentStepIndex(prevIndex => prevIndex - 1);
    }
  };

  const processAndSubmitData = async (dataForBackend: any) => {
    console.log('--- DEBUG: processAndSubmitData triggered');
    setIsSubmitting(true);
    setError(null);

    try {
      // This dataForBackend is already mapped to the backend structure
      console.log('--- DEBUG: Mapped data being submitted to backend:', dataForBackend);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error('--- DEBUG: Error fetching session or no active session found:', sessionError);
        setError(t('errors.authError', { defaultMessage: 'Authentication error. Please sign in again.' }));
        setIsSubmitting(false); // Added to ensure isSubmitting is reset
        return;
      }
      console.log('--- DEBUG: Session found'); // Removed session object from log for brevity

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiUrl) {
        console.error('--- DEBUG: NEXT_PUBLIC_API_BASE_URL is not set.');
        setError(t('errors.configError', { defaultMessage: 'Configuration error. Please contact support.' }));
        setIsSubmitting(false); // Added to ensure isSubmitting is reset
        return;
      }
      console.log('--- DEBUG: API Base URL found'); // Removed apiUrl from log

      const fullApiUrl = `${apiUrl}/api/v1/onboarding`;
      console.log('--- DEBUG: Calling API URL:', fullApiUrl);

      // Note: File uploads (profilePictureFile, profileBannerFile) are not handled here.
      // This function assumes that if images are part of the submission, their URLs
      // would be included in `dataForBackend` by `handleFormSubmitEvent` if needed.
      // The current Go backend struct does not include image URLs, so we are good.

      const response = await fetch(fullApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(dataForBackend), // dataForBackend is now the correctly mapped object
      });

      console.log('--- DEBUG: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('--- DEBUG: API response error text:', errorText);
        setError(t('errors.submissionFailed', { status: response.status, details: errorText, defaultMessage: `Submission failed: API responded with ${response.status}` }));
        throw new Error(`API responded with ${response.status}`);
      }

      console.log('--- DEBUG: Onboarding data submitted successfully.');
      router.push('/dashboard');

    } catch (e: any) {
      console.error('--- DEBUG: Error during form submission process:', e);
      const errorMessage = e.message.includes("API responded with") ? e.message : t('errors.unexpectedError', { defaultMessage: 'An unexpected error occurred. Please try again.' });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmitEvent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('--- DEBUG: handleFormSubmitEvent triggered');

    // Part 1: Transform data to match Go backend structure
    const backendData = {
      displayName: welcomeName || "",
      userRole: selectedRole || "",
      preferred_website_language: languageSelections.website || "en",
      preferred_course_explanation_language: languageSelections.explanation || "en",
      preferred_course_material_language: languageSelections.material || "en",
      major: majorName || "",
      majorLevel: selectedMajorLevel || "",
      studied_subjects: currentStudiedSubjects || [],
      interested_majors: currentInterestedMajors || [],
      hobbies: currentHobbies || [],
      bio: profileBio || "",
      github_url: socials.github || "",
      // Ensure boolean conversion, defaulting to false if undefined
      subscribed_to_newsletter: !!agreementValues.newsletter,
      receive_quotes: !!contentPrefsValues.quotes,
      // Add the new URLs
      profile_picture_url: profilePictureUrl || "", // Get from state
      profile_banner_url: profileBannerUrl || "",   // Get from state
    };

    // Pass the correctly-mapped object to processAndSubmitData
    await processAndSubmitData(backendData);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, imageType: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl);
      setCropAspectRatio(imageType === 'profile' ? 1 : 16 / 9);
      setCropperOpen(true);
      if (event.target) event.target.value = '';
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
        else if (currentStep.id === 'news') { tagValue = currentNewsPrefs; setTagValue = setCurrentNewsPrefs; } // Added for 'news' step
        return (<TagInput value={tagValue} onChange={setTagValue} placeholder={t(`${currentStep.id}.placeholder`)} />);
      }
      case 'multi-field':
        return (
          <UserProfilePreview
            formData={{...formData, profile: {...(formData.profile || {}), bio: profileBio} }}
            profilePicturePreview={profilePicturePreview}
            profileBannerPreview={profileBannerPreview}
            onBioChange={(newBio) => setProfileBio(newBio)}
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
        // Example keys for agreements: 'terms', 'personalization', 'newsletter'
        // Example keys for contentPrefs: 'quotes', 'updates'
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

  if (isSubmitting && currentStepIndex === totalSteps -1) {
    return <div className="text-center p-10">{t('submitting')}</div>;
  }

  const isLastStep = currentStepIndex === totalSteps - 1;
  // Ensure agreementValues.terms and agreementValues.personalization are checked for the 'agreements' step before enabling finish.
  // Assuming 'terms' and 'personalization' are keys in agreementValues for the agreements step.
  const agreementsMet = currentStep?.id === 'agreements' ? (!!agreementValues.terms && !!agreementValues.personalization) : true;
  const finishButtonDisabled = isSubmitting || (isLastStep && !agreementsMet);


  return (
    <form onSubmit={handleFormSubmitEvent} onKeyDown={handleKeyDown} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
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
          onSave={async (croppedBlob) => { // Changed from onCropComplete
            // Determine storage path based on aspect ratio or another state if available
            const storagePath = cropAspectRatio === 1 ? 'avatars' : 'banners';
            await handleImageUpload(croppedBlob, storagePath);

            // Keep existing preview logic using the blob from cropper for immediate feedback
            const newPreviewUrl = URL.createObjectURL(croppedBlob);
            if (storagePath === 'avatars') {
              setProfilePictureFile(croppedBlob as File); // Keep if state is used elsewhere, otherwise can remove
              if (profilePicturePreview && profilePicturePreview.startsWith('blob:')) { URL.revokeObjectURL(profilePicturePreview); }
              setProfilePicturePreview(newPreviewUrl);
            } else {
              setProfileBannerFile(croppedBlob as File); // Keep if state is used elsewhere, otherwise can remove
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
          <div className="w-full max-w-md mx-auto">
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
