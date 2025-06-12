import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { updateUserProfile, getUserProfile } from '@/lib/supabase/actions/user.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client'; // Ensure this path is correct

// Define Zod schema based on translations for dynamic error messages
const getSchema = (t: any) => z.object({
  name: z.string().min(1, t('errors.fieldRequired')),
  role: z.enum(['student', 'teacher'], { errorMap: () => ({ message: t('errors.fieldRequired') }) }),
  websiteLanguage: z.string().min(1, t('errors.fieldRequired')),
  explanationLanguage: z.string().min(1, t('errors.fieldRequired')),
  materialLanguage: z.string().min(1, t('errors.fieldRequired')),
  major: z.string().min(1, t('errors.fieldRequired')),
  majorLevel: z.string().min(1, t('errors.fieldRequired')),
  studiedSubjects: z.array(z.string()).optional(),
  interestedMajors: z.array(z.string()).optional(),
  hobbies: z.array(z.string()).optional(),
  newsTopics: z.array(z.string()).optional(),
  newsletter: z.boolean().optional(),
  dailyQuotes: z.boolean().optional(),
  profilePicture: z.any().optional(),
  profileBanner: z.any().optional(),
  bio: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  agreeToTerms: z.boolean().refine(val => val === true, { message: t('onboarding.agreements.mustAgreeTerms') }),
  agreeToPersonalization: z.boolean().optional(),
});

type OnboardingFormData = z.infer<ReturnType<typeof getSchema>>;

interface OnboardingFormProps {
  userId: string;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ userId }) => {
  const { t, i18n } = useTranslation(['common']);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const router = useRouter();

  const FormSchema = getSchema(t);

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid, isSubmitting } } = useForm<OnboardingFormData>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange', // Validate on change to enable/disable Next button
    defaultValues: {
      name: '',
      role: undefined,
      websiteLanguage: i18n.language,
      explanationLanguage: i18n.language,
      materialLanguage: i18n.language,
      major: '',
      majorLevel: undefined,
      studiedSubjects: [],
      interestedMajors: [],
      hobbies: [],
      newsTopics: [],
      newsletter: false,
      dailyQuotes: false,
      bio: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      agreeToTerms: false,
      agreeToPersonalization: false,
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(userId);
        if (profile) {
          // Pre-fill form with existing data
          Object.keys(profile).forEach(key => {
            if (key in FormSchema.shape) {
              setValue(key as keyof OnboardingFormData, profile[key]);
            }
          });
          // If profile indicates onboarding is complete, redirect
          if (profile.onboarding_completed) {
            router.push('/dashboard'); // Or whatever the main app page is
          }
        }
      } catch (error) {
        toast.error(t('errors.profileLoadFailed'));
        console.error("Profile loading error:", error);
      } finally {
        setIsProfileLoading(false);
      }
    };
    fetchProfile();
  }, [userId, setValue, router, t, FormSchema.shape]);


  const onSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true);
    try {
      // Convert optional array fields to empty arrays if undefined
      const processedData = {
        ...data,
        studiedSubjects: data.studiedSubjects || [],
        interestedMajors: data.interestedMajors || [],
        hobbies: data.hobbies || [],
        newsTopics: data.newsTopics || [],
        onboarding_completed: true, // Mark onboarding as complete
      };

      await updateUserProfile(userId, processedData);
      toast.success(t('onboarding.profileUpdatedSuccess'));
      router.push('/dashboard'); // Redirect after successful submission
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error(t('errors.profileUpdateFailed', { details: (error as Error).message }));
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    // Step 1: Welcome
    {
      title: t('onboarding.welcome.title'),
      description: t('onboarding.welcome.description'),
      fields: ['name'] as const,
      content: (
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('onboarding.welcome.placeholder')} className="mt-1 block w-full" />
          )}
        />
      )
    },
    // Step 2: Role
    {
      title: t('onboarding.role.title'),
      fields: ['role'] as const,
      content: (
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">{t('onboarding.role.student')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">{t('onboarding.role.teacher')}</Label>
              </div>
            </RadioGroup>
          )}
        />
      )
    },
    // Step 3: Language Preferences
    {
      title: t('onboarding.languages.title'),
      fields: ['websiteLanguage', 'explanationLanguage', 'materialLanguage'] as const,
      content: (
        <div className="space-y-4">
          <div>
            <Label>{t('onboarding.languages.website')}</Label>
            <Controller
              name="websiteLanguage"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder={t('onboarding.languages.selectPlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>{t('onboarding.languages.explanation')}</Label>
            <Controller
              name="explanationLanguage"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder={t('onboarding.languages.selectPlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>{t('onboarding.languages.material')}</Label>
            <Controller
              name="materialLanguage"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder={t('onboarding.languages.selectPlaceholder')} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="tr">Türkçe</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      )
    },
    // Step 4: Major & Level
    {
      title: t('onboarding.major.title'),
      fields: ['major', 'majorLevel'] as const,
      content: (
        <div className="space-y-4">
          <Controller
            name="major"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder={t('onboarding.major.placeholder')} />
            )}
          />
          <Controller
            name="majorLevel"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={t('onboarding.majorLevel.selectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelor">{t('onboarding.majorLevel.bachelor')}</SelectItem>
                  <SelectItem value="master">{t('onboarding.majorLevel.master')}</SelectItem>
                  <SelectItem value="phd">{t('onboarding.majorLevel.phd')}</SelectItem>
                  <SelectItem value="postdoc">{t('onboarding.majorLevel.postdoc')}</SelectItem>
                  <SelectItem value="hobbyist">{t('onboarding.majorLevel.hobbyist')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )
    },
    // Step 5: Studied Subjects (Tag Input)
    {
      title: t('onboarding.studiedSubjects.title'),
      description: t('onboarding.studiedSubjects.description'),
      fields: ['studiedSubjects'] as const, // Technically optional, but good to check if needed
      content: (
        <Controller
          name="studiedSubjects"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value || []}
              onChange={field.onChange}
              placeholder={t('onboarding.studiedSubjects.placeholder')}
            />
          )}
        />
      )
    },
    // Step 6: Interested Majors (Tag Input)
    {
      title: t('onboarding.interestedMajors.title'),
      description: t('onboarding.interestedMajors.description'),
      fields: ['interestedMajors'] as const,
      content: (
        <Controller
          name="interestedMajors"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value || []}
              onChange={field.onChange}
              placeholder={t('onboarding.interestedMajors.placeholder')}
            />
          )}
        />
      )
    },
    // Step 7: Hobbies (Tag Input)
    {
      title: t('onboarding.hobbies.title'),
      description: t('onboarding.hobbies.description'),
      fields: ['hobbies'] as const,
      content: (
        <Controller
          name="hobbies"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value || []}
              onChange={field.onChange}
              placeholder={t('onboarding.hobbies.placeholder')}
            />
          )}
        />
      )
    },
    // Step 8: News Topics (Tag Input)
    {
      title: t('onboarding.news.title'),
      description: t('onboarding.news.description'),
      fields: ['newsTopics'] as const,
      content: (
        <Controller
          name="newsTopics"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value || []}
              onChange={field.onChange}
              placeholder={t('onboarding.news.placeholder')}
            />
          )}
        />
      )
    },
    // Step 9: Content Preferences
    {
      title: t('onboarding.contentPrefs.title'),
      fields: ['newsletter', 'dailyQuotes'] as const,
      content: (
        <div className="space-y-2">
          <Controller
            name="newsletter"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="newsletter">{t('onboarding.contentPrefs.newsletter')}</Label>
              </div>
            )}
          />
          <Controller
            name="dailyQuotes"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="dailyQuotes" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="dailyQuotes">{t('onboarding.contentPrefs.quotes')}</Label>
              </div>
            )}
          />
        </div>
      )
    },
    // Step 10: Profile Customization
    {
      title: t('onboarding.profile.title'),
      fields: ['bio'] as const, // Removed picture/banner for simplicity, add back if needed
      content: (
        <div className="space-y-4">
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder={t('onboarding.profile.bioPlaceholder')} />
            )}
          />
          {/* Add file inputs for profilePicture and profileBanner if needed, ensure storage is set up */}
        </div>
      )
    },
    // Step 11: Social Links
    {
      title: t('onboarding.socials.title'),
      description: t('onboarding.socials.description'),
      fields: ['linkedin', 'twitter', 'github', 'website'] as const,
      content: (
        <div className="space-y-4">
          <Controller name="linkedin" control={control} render={({ field }) => <Input {...field} placeholder="LinkedIn URL" />} />
          <Controller name="twitter" control={control} render={({ field }) => <Input {...field} placeholder="Twitter/X URL" />} />
          <Controller name="github" control={control} render={({ field }) => <Input {...field} placeholder="GitHub URL" />} />
          <Controller name="website" control={control} render={({ field }) => <Input {...field} placeholder="Personal Website URL" />} />
        </div>
      )
    },
    // Step 12: Agreements
    {
      title: t('onboarding.agreements.title'),
      fields: ['agreeToTerms', 'agreeToPersonalization'] as const,
      content: (
        <div className="space-y-2">
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="agreeToTerms" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="agreeToTerms">{t('onboarding.agreements.terms')}</Label>
              </div>
            )}
          />
          <Controller
            name="agreeToPersonalization"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox id="agreeToPersonalization" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="agreeToPersonalization">{t('onboarding.agreements.personalization')}</Label>
              </div>
            )}
          />
        </div>
      )
    }
  ];

  const currentFields = steps[currentStep].fields;
  const isCurrentStepValid = currentFields.every(field => !errors[field] && watch(field) !== '' && watch(field) !== undefined);

  const nextStep = () => {
    // Trigger validation for current step's fields before proceeding
    // This can be more granular if needed by using `trigger(currentFields)`
    if (isCurrentStepValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isCurrentStepValid) {
      // Optionally, display a generic message or rely on individual field errors
      toast.warning(t('errors.fillAllRequired'));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isProfileLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">{t('onboarding.title', { step: currentStep + 1, totalSteps: steps.length })}</h1>
      <p className="text-sm text-gray-600 mb-1 text-center">{steps[currentStep].title}</p>
      {steps[currentStep].description && <p className="text-xs text-gray-500 mb-6 text-center">{steps[currentStep].description}</p>}

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-center mt-1">{t('onboarding.step')} {currentStep +1} {t('onboarding.of')} {steps.length}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="min-h-[200px]"> {/* Ensure consistent height for content area */}
          {steps[currentStep].content}
          {currentFields.map(fieldName => errors[fieldName] && (
            <p key={fieldName} className="text-red-500 text-xs mt-1">{(errors[fieldName] as any)?.message}</p>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button type="button" onClick={prevStep} disabled={currentStep === 0 || isSubmitting} variant="outline">
            {t('onboarding.buttons.previous')}
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} disabled={!isCurrentStepValid || isSubmitting}>
              {t('onboarding.buttons.next')}
            </Button>
          ) : (
            <Button type="submit" disabled={!isValid || isSubmitting || isLoading}>
              {isLoading || isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('onboarding.buttons.finish')}
            </Button>
          )}
        </div>
      </form>
      <Button variant="link" onClick={() => router.push('/dashboard')} className="mt-4 text-sm mx-auto block">
        {t('onboarding.buttons.skip')}
      </Button>
    </div>
  );
};


// TagInput component (can be moved to its own file if preferred)
interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border rounded-md">
        {value.map((tag, index) => (
          <span key={index} className="flex items-center bg-primary/10 text-primary text-sm px-2 py-1 rounded-md">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-2 text-primary hover:text-red-500"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-grow border-none focus:ring-0 focus:outline-none shadow-none p-0 h-auto"
        />
      </div>
    </div>
  );
};

export default OnboardingForm;
