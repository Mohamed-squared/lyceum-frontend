"use client";

import { useState, FC, ChangeEvent } from 'react';

// Data structure for our form, mirroring the database
interface OnboardingData {
  displayName: string;
  userRole: 'teacher' | 'student' | '';
  // Add other fields from your schema here with appropriate types
  // For now, we'll keep it simple.
}

const OnboardingForm: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    displayName: '',
    userRole: '',
  });

  const totalSteps = 13; // Based on our plan

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission logic here
      console.log('Form Submitted!', formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    // For now, skip just goes to the next step.
    // We can add more complex logic later.
    handleNext();
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // This function will render the content for the current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome & Display Name
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Lyceum! What should we call you?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              This will be your public display name.
            </p>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
        );
      case 1:
        return <div><h2 className="text-2xl font-bold">Step 2: Are you a teacher or a student?</h2></div>;
      case 2:
        return <div><h2 className="text-2xl font-bold">Step 3: Language Preferences</h2></div>;
      // ... add placeholders for other steps
      default:
        return <div><h2 className="text-2xl font-bold">Final Step: Agreements</h2></div>;
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/auth/atrium-bg-dark-poster.jpg" // Use dark poster for both for simplicity
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        {/* The video source logic can be improved with a theme context, but this works for now */}
        <source src="/auth/atrium-bg-dark.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10" />


      {/* Onboarding Card */}
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl">
        {/* Progress Bar */}
        <div>
          <p className="text-sm text-right text-gray-600 dark:text-gray-400">Step {currentStep + 1} of {totalSteps}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[200px] flex items-center">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Previous
          </button>

          <div className="flex items-center gap-4">
            <button
                onClick={handleSkip}
                className="px-6 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-800"
              >
                Skip
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
