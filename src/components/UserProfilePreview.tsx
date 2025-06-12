import React from 'react';
import { useTranslations } from 'next-intl';
import type { OnboardingData } from './OnboardingForm'; // Added import

// Removed the local OnboardingData definition as we are importing it.

export interface UserProfilePreviewProps {
  formData: OnboardingData; // Changed to use imported OnboardingData
  profilePicturePreview: string | null;
  profileBannerPreview: string | null;
}

const UserProfilePreview: React.FC<UserProfilePreviewProps> = ({
  formData,
  profilePicturePreview,
  profileBannerPreview,
}) => {
  const t = useTranslations('onboarding');
  // Component logic and JSX will be added in subsequent steps.
  return (
    <div className="bg-gray-50 min-h-screen"> {/* Main container for the preview page */}
      <div className="relative">
        {/* Banner */}
        <div className={`w-full h-48 sm:h-64 ${profileBannerPreview ? '' : 'bg-gray-300'}`}>
          {profileBannerPreview && (
            <img
              src={profileBannerPreview}
              alt={t('profileBannerAltText') || 'Profile Banner'} // Added alt text with i18n
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Profile Picture & Overlay Content Container */}
        {/* Positioning adjusted for better centering and responsiveness */}
        <div className="absolute top-36 sm:top-48 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white bg-gray-200 shadow-lg flex items-center justify-center">
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt={t('profilePictureAltText') || 'Profile Picture'} // Added alt text with i18n
                className="w-full h-full object-cover"
              />
            ) : (
              // SVG Icon as placeholder
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            )}
          </div>
        </div>
      </div>

      {/* User Info Section - below banner, accounting for profile pic height */}
      {/* sm:ml-44 is roughly sm:w-32 (pic width) + sm:left-10 (pic offset) + some spacing */}
      <div className="pt-16 sm:pt-6 text-center sm:text-left sm:ml-48 px-4 pb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {formData.welcome || t('defaultWelcomeName') || 'User Name'}
        </h1>
        {formData.role && (
          <span className="mt-2 inline-block px-4 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
            {t(formData.role as string) || formData.role}
          </span>
        )}
        {/* Display bio only if it exists and is not empty */}
        {formData.profile?.bio && (formData.profile.bio as string).trim() !== '' && (
          <p className="mt-3 text-md text-gray-700 max-w-prose mx-auto sm:mx-0">
            {formData.profile.bio}
          </p>
        )}
      </div>

      {/* Cards Section */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Academic Profile Card */}
        {(formData.major || formData.majorLevel || (formData.studiedSubjects && (formData.studiedSubjects as string[]).length > 0)) && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('academicProfileTitle') || 'Academic Profile'}</h2>

            {formData.major && (
              <div className="mb-3">
                <p className="text-sm text-gray-500">{t('majorLabel') || 'Major'}</p>
                <p className="text-md text-gray-800">{formData.major as string}</p>
              </div>
            )}

            {formData.majorLevel && (
              <div className="mb-3">
                <p className="text-sm text-gray-500">{t('majorLevelLabel') || 'Level'}</p>
                <p className="text-md text-gray-800">{t(`majorLevel.${formData.majorLevel as string}`) || formData.majorLevel}</p>
              </div>
            )}

            {formData.studiedSubjects && (formData.studiedSubjects as string[]).length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">{t('studiedSubjectsLabel') || 'Studied Subjects'}</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.studiedSubjects as string[]).map((subject, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interests Card */}
        {formData.hobbies && (formData.hobbies as string[]).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {t('interestsTitle') || 'Interests'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(formData.hobbies as string[]).map((hobby, index) => (
                <span key={index} className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Socials Card */}
        {(formData.socials?.twitter || formData.socials?.github || formData.socials?.linkedin) && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {t('socialsTitle') || 'Socials'}
            </h2>
            <div className="flex space-x-4">
              {/* Twitter (X) Link */}
              {formData.socials?.twitter && (
                <a
                  href={(formData.socials.twitter as string).startsWith('http') ? formData.socials.twitter as string : `https://twitter.com/${formData.socials.twitter as string}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('twitterAriaLabel') || 'Twitter Profile'}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </a>
              )}
              {/* GitHub Link */}
              {formData.socials?.github && (
                <a
                  href={(formData.socials.github as string).startsWith('http') ? formData.socials.github as string : `https://github.com/${formData.socials.github as string}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('githubAriaLabel') || 'GitHub Profile'}
                  className="text-gray-500 hover:text-gray-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </a>
              )}
              {/* LinkedIn Link */}
              {formData.socials?.linkedin && (
                <a
                  href={(formData.socials.linkedin as string).startsWith('http') ? formData.socials.linkedin as string : `https://linkedin.com/in/${formData.socials.linkedin as string}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('linkedinAriaLabel') || 'LinkedIn Profile'}
                  className="text-gray-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePreview;
