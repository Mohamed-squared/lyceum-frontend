import OnboardingForm from '@/components/OnboardingForm';
import { FC } from 'react';

interface OnboardingPageProps {
  params: {
    locale: string;
  };
}

const OnboardingPage: FC<OnboardingPageProps> = ({ params: { locale } }) => {
  return <OnboardingForm />;
};

export default OnboardingPage;
