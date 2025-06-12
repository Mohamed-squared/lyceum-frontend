export type OnboardingStep = {
  id: string;
  type: 'text' | 'role' | 'language-select' | 'select' | 'tag-input' | 'multi-field' | 'checkbox-group' | 'socials';
};

export const onboardingSteps: OnboardingStep[] = [
  { id: 'welcome', type: 'text' },
  { id: 'role', type: 'role' },
  { id: 'languages', type: 'language-select' },
  { id: 'major', type: 'text' },
  { id: 'majorLevel', type: 'select' },
  { id: 'studiedSubjects', type: 'tag-input' },
  { id: 'interestedMajors', type: 'tag-input' },
  { id: 'hobbies', type: 'tag-input' },
  { id: 'news', type: 'tag-input' },
  { id: 'contentPrefs', type: 'checkbox-group' },
  { id: 'profile', type: 'multi-field' },
  { id: 'socials', type: 'socials' },
  { id: 'agreements', type: 'checkbox-group' },
];
