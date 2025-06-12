import React from 'react';
import { useTranslations } from 'next-intl';
import type { OnboardingData } from './OnboardingForm'; // Added import

export interface UserProfilePreviewProps {
  formData: OnboardingData;
  profilePicturePreview: string | null;
  profileBannerPreview: string | null;
  onBioChange: (newBio: string) => void;
  onPictureClick: () => void;
  onBannerClick: () => void;
}

const UserProfilePreview: React.FC<UserProfilePreviewProps> = ({
  formData,
  profilePicturePreview,
  profileBannerPreview,
  onBioChange,
  onPictureClick,
  onBannerClick,
}) => {
  const t = useTranslations('onboarding'); // Ensuring 'onboarding' scope for all t() calls

  // SVG Icon for upload (example)
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-8 h-8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
  );


  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen"> {/* Main container for the preview page */}
      <div className="relative">
        {/* Banner */}
        <div
          role="button"
          tabIndex={0}
          onClick={onBannerClick}
          onKeyDown={(e) => e.key === 'Enter' && onBannerClick()}
          className={`w-full h-48 sm:h-64 ${profileBannerPreview ? '' : 'bg-gray-300 dark:bg-gray-700'} cursor-pointer relative group`}
        >
          {profileBannerPreview ? (
            <img
              src={profileBannerPreview}
              alt={t('profile.banner') || 'Profile Banner'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
              {/* Placeholder for when no banner is selected, could be an icon or text */}
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity">
            <div className="text-center hidden group-hover:block">
              <UploadIcon />
              <span className="text-white text-sm mt-1">{t('profile.uploadBannerButton')}</span>
            </div>
          </div>
        </div>

        {/* Profile Picture & Overlay Content Container */}
        <div className="absolute top-36 sm:top-48 left-1/2 -translate-x-1/2 sm:left-10 sm:translate-x-0">
          <div
            role="button"
            tabIndex={0}
            onClick={onPictureClick}
            onKeyDown={(e) => e.key === 'Enter' && onPictureClick()}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-600 shadow-lg flex items-center justify-center cursor-pointer relative group"
          >
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt={t('profile.picture') || 'Profile Picture'}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            )}
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity">
              <div className="text-center hidden group-hover:block">
                <UploadIcon/>
                <span className="text-white text-xs mt-1">{t('profile.uploadPictureButton')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Section - below banner, accounting for profile pic height */}
      <div className="pt-16 sm:pt-6 text-center sm:text-left sm:ms-48 px-4 pb-8"> {/* Changed ml-48 to ms-48 */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          {formData.welcome || t('welcome.placeholder') || 'User Name'}
        </h1>
        {formData.role && (
          <span className="mt-2 inline-block px-4 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
            {t(`role.${formData.role as string}` as any) || formData.role}
          </span>
        )}
        <textarea
          value={formData.profile?.bio || ''}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder={t('profile.bioPlaceholder')}
          className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none sm:text-sm"
          rows={3}
        />
      </div>

      {/* Cards Section */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* Academic Profile Card */}
        {(formData.major || formData.majorLevel || (formData.studiedSubjects && (formData.studiedSubjects as string[]).length > 0)) && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">{t('academicProfileTitle')}</h2>

            {formData.major && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('majorLabel')}</p>
                <p className="text-md text-gray-800 dark:text-white">{formData.major as string}</p>
              </div>
            )}

            {formData.majorLevel && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('majorLevelLabel')}</p>
                <p className="text-md text-gray-800 dark:text-white">{t(`majorLevel.${formData.majorLevel as string}` as any) || formData.majorLevel}</p>
              </div>
            )}

            {formData.studiedSubjects && (formData.studiedSubjects as string[]).length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('studiedSubjectsLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {(formData.studiedSubjects as string[]).map((subject, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
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
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
              {t('interestsTitle')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {(formData.hobbies as string[]).map((hobby, index) => (
                <span key={index} className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-200">
                  {hobby}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Socials Card */}
        {(formData.socials?.twitter || formData.socials?.github || formData.socials?.linkedin) && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
              {t('socialsTitle')}
            </h2>
            <div className="flex space-x-4 rtl:space-x-reverse"> {/* Added RTL support for spacing */}
              {/* Twitter (X) Link */}
              {formData.socials?.twitter && (
                <a
                  href={(formData.socials.twitter as string).startsWith('http') ? formData.socials.twitter as string : `https://twitter.com/${formData.socials.twitter as string}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('socials.twitterPlaceholder') || 'Twitter Profile'} // Using placeholder as aria-label is more specific
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
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
                  aria-label={t('socials.githubPlaceholder') || 'GitHub Profile'}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                  aria-label={t('socials.linkedinPlaceholder') || 'LinkedIn Profile'}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-500"
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
