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
    // Consolidate data before final submission if necessary, or directly use formData
    // For now, directly using formData which should be up-to-date.
    await processAndSubmitData(formData);
  };

  // Local state for text input, specific to 'text' type steps
  // This will be reset when the step changes if the new step is also 'text'
  const [textInputValue, setTextInputValue] = useState('');

  useEffect(() => {
    if (currentStep?.type === 'text') {
      setTextInputValue(formData[currentStep.id] || '');
    }
    // Clear textInputValue if the step changes and is not 'text', or if it's a new 'text' step.
    // This is a simple way to manage; more complex scenarios might need per-field state or refs.
    return () => {
      if (currentStep?.type === 'text') {
         // Optionally save back to formData if user navigates away using browser buttons for example
         // For now, data is saved on "Next" button click.
      }
    };
  }, [currentStep, formData]);


  const renderStepContent = () => {
    if (!currentStep) return <div>Loading step...</div>;

    // Common title and description rendering can be part of the main layout
    // This function will focus on rendering the input part of the step.

    switch (currentStep.type) {
      case 'text':
        // Specific handling for 'major' id for now as it's the only text type other than welcome
        // Welcome step is special and might not need a generic input field.
        // For this example, 'major' will use the local textInputValue state.
        // All 'text' types will use this for now.
        return (
          <>
            <input
              type="text"
              className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
              placeholder={t(`${currentStep.id}.placeholder`, {}, { defaultValue: `Enter ${currentStep.id}` })}
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
            />
            {currentStepIndex < totalSteps - 1 && (
                 <button
                    type="button"
                    onClick={() => {
                        handleNext(currentStep.id, textInputValue);
                        // setTextInputValue(''); // Clear after next, useEffect will repopulate if returning
                    }}
                    className="mt-4 px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('buttons.next', 'Next')}
                  </button>
            )}
          </>
        );
      case 'role':
        // Assuming RoleSelectionCard's onChange calls handleNext directly
        return (
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                <RoleSelectionCard
                    icon={studentIcon}
                    title={t('role.student', 'Student')}
                    isSelected={formData[currentStep.id] === 'student'}
                    onClick={() => handleNext(currentStep.id, 'student')}
                />
                <RoleSelectionCard
                    icon={teacherIcon}
                    title={t('role.teacher', 'Teacher')}
                    isSelected={formData[currentStep.id] === 'teacher'}
                    onClick={() => handleNext(currentStep.id, 'teacher')}
                />
            </div>
        );
      case 'language-select':
        return <LanguageSelectPlaceholder value={formData[currentStep.id]} onChange={(value) => handleNext(currentStep.id, value)} />;
      case 'select':
        const selectOptions = currentStep.id === 'majorLevel' ? [
          { value: 'bachelor', label: t('majorLevel.bachelor', 'Bachelor') },
          { value: 'master', label: t('majorLevel.master', 'Master') },
          { value: 'phd', label: t('majorLevel.phd', 'PhD') },
          { value: 'postdoc', label: t('majorLevel.postdoc', 'Postdoc') },
          { value: 'hobbyist', label: t('majorLevel.hobbyist', 'Hobbyist') },
        ] : [];
        return <SelectPlaceholder options={selectOptions} value={formData[currentStep.id]} onChange={(value) => handleNext(currentStep.id, value)} />;
      case 'tag-input':
         // TagInput's onChange should call handleNext directly if it provides the final array of tags.
         // If TagInput needs a separate "Next" button, the approach would be similar to 'text' or 'checkbox-group' (contentPrefs)
        return (
            <>
                <TagInput
                    value={formData[currentStep.id] || []}
                    onChange={(tags) => setFormData(prev => ({ ...prev, [currentStep.id]: tags }))} // Update formData continuously
                    placeholder={t(`${currentStep.id}.placeholder`, {}, {defaultValue: 'Add tags...'})}
                />
                {currentStepIndex < totalSteps - 1 && (
                    <button
                        type="button"
                        onClick={() => handleNext(currentStep.id, formData[currentStep.id] || [])}
                        className="mt-4 px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        {t('buttons.next', 'Next')}
                    </button>
                )}
            </>
        );
      case 'multi-field':
        // Assuming MultiFieldPlaceholder's onChange provides the complete data object for this step
        return <MultiFieldPlaceholder value={formData[currentStep.id]} onChange={(data) => handleNext(currentStep.id, data)} />;
      case 'checkbox-group':
        const commonProps = {
          value: formData[currentStep.id] || {},
        };
        if (currentStep.id === 'agreements') {
          const agreementOptions = [
            { id: 'terms', label: t('agreements.terms', 'I agree to the terms and conditions') },
            { id: 'personalization', label: t('agreements.personalization', 'I agree to content personalization') },
          ];
          return (
            <CheckboxGroupPlaceholder
              name={currentStep.id}
              options={agreementOptions}
              value={formData[currentStep.id] || {}} // Ensure value is an object
              onChange={(newValues) => {
                // Update formData immediately so UI reflects the check
                const updatedAgreementsData = { ...formData[currentStep.id], ...newValues };
                setFormData(prev => ({ ...prev, [currentStep.id]: updatedAgreementsData }));

                // Check for auto-submission condition
                // Issue: "when both required boxes are checked"
                // Assuming 'terms' and 'personalization' are the IDs of these required boxes.
                if (updatedAgreementsData.terms && updatedAgreementsData.personalization) {
                  handleFinalStep(currentStep.id, updatedAgreementsData);
                }
              }}
            />
            // No "Next" button here, auto-submission or main "Finish" button.
          );
        } else { // e.g., contentPrefs
          const contentPrefsOptions = [
            { id: 'newsletter', label: t('contentPrefs.newsletter', 'Receive newsletter') },
            { id: 'newFeatures', label: t('contentPrefs.newFeatures', 'Get notified about new features') },
            // Add other options as needed
          ];
          return (
            <>
              <CheckboxGroupPlaceholder
                name={currentStep.id}
                options={contentPrefsOptions}
                {...commonProps}
                onChange={(value) => setFormData(prev => ({ ...prev, [currentStep.id]: value }))}
              />
              {currentStepIndex < totalSteps - 1 && (
                 <button
                    type="button"
                    onClick={() => handleNext(currentStep.id, formData[currentStep.id] || {})}
                    className="mt-4 px-6 py-2 rounded-md font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {t('buttons.next', 'Next')}
                  </button>
              )}
            </>
          );
        }
      case 'socials':
        // Assuming SocialsPlaceholder's onChange provides the complete data object for this step
        return <SocialsPlaceholder value={formData[currentStep.id]} onChange={(data) => handleNext(currentStep.id, data)} />;
      default:
        return <div>Unsupported step type: {currentStep.type}</div>;
    }
  };

  if (isSubmitting) {
    return <div className="text-center p-10">{t('submitting', 'Submitting...')}</div>;
  }

  return (
    <form onSubmit={handleFormSubmitEvent} className="w-full max-w-2xl mx-auto p-8 rounded-lg shadow-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className="text-center mb-8">
        <p className="text-sm font-semibold text-blue-500 mb-2">{t('step', 'Step')} {currentStepIndex + 1} {t('of')} {totalSteps}</p>
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t(`${currentStep?.id}.title`, {}, { defaultValue: currentStep?.id })}</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">{t(`${currentStep?.id}.description`, {}, { defaultValue: '' })}</p>
      </div>

      {error && <p className="text-red-500 mb-4 text-center bg-red-100 dark:bg-red-900/20 p-3 rounded-md">{error}</p>}

      <div className="min-h-[150px] flex flex-col items-center justify-center"> {/* Changed to flex-col for button placement */}
          <div className="w-full max-w-md mx-auto">
            {renderStepContent()}
          </div>
      </div>

      <div className="flex justify-between mt-10">
        {currentStepIndex > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 rounded-md font-semibold bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
            disabled={isSubmitting} // Disable while submitting
          >
            {t('buttons.previous', 'Back')}
          </button>
        ) : <div />}

        {/* General Next button is removed from here if steps provide their own or navigate on change */}
        {/* The "Finish" button is the form's submit button, shown only on the last step conceptually, */}
        {/* or if all steps use their own "Next" and this serves as the final action. */}
        {currentStepIndex === totalSteps - 1 && ( // Only show Finish button on the last step
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('buttons.saving', 'Saving...') : t('buttons.finish', 'Finish')}
          </button>
        )}
      </div>
    </form>
  );
}
