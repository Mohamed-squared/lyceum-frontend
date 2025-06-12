import { ReactNode } from 'react';

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-screen">
      {/* Light Mode Video */}
      <video
        poster="/assets/onboarding_bg/onboarding-bg-light-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover -z-10 block dark:hidden"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/onboarding_bg/onboarding-bg-light.mp4" type="video/mp4" />
      </video>

      {/* Dark Mode Video */}
      <video
        poster="/assets/onboarding_bg/onboarding-bg-dark-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover -z-10 hidden dark:block"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/assets/onboarding_bg/onboarding-bg-dark.mp4" type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
