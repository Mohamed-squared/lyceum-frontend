'use client';

// src/components/dashboard/QuickLinksCard.tsx
import React from 'react';
import Image from 'next/image'; // Assuming Next.js Image component is still desired

interface LinkItem {
  text: string;  // Was 'label'
  icon: string;  // Was 'iconSrc'
  href: string;
}

interface QuickLinkButtonProps {
  link: LinkItem;
}

const QuickLinkButton: React.FC<QuickLinkButtonProps> = ({ link }) => {
  return (
    <a
      href={link.href}
      className="flex flex-col items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
      target="_blank" // Good practice for external or distinct-section links
      rel="noopener noreferrer"
    >
      {/* Using a placeholder div if icon is an SVG string or needs specific handling.
          If 'icon' is a path to an image file, Next/Image can be used as before.
          The prompt mentioned 'icon' as a string, which might be an SVG component name or raw SVG.
          For simplicity, I'm assuming 'icon' is a URL/path for Next/Image.
          If 'icon' is meant to be an SVG component or raw SVG, this part needs adjustment.
      */}
      <div className="w-10 h-10 relative mb-1.5">
        {/* This assumes 'icon' is a URL. If it's an identifier for an SVG component,
            a mapping or different rendering approach would be needed. */}
        <Image src={link.icon} alt={link.text} layout="fill" objectFit="contain" />
      </div>
      <span className="text-xs text-slate-50">{link.text}</span>
    </a>
  );
};

interface Props {
  title: string;
  links: LinkItem[];
}

const QuickLinksCard: React.FC<Props> = ({ title, links }) => {
  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {links && links.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {links.map((linkItem) => (
            <QuickLinkButton key={linkItem.text} link={linkItem} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">No quick links available.</p>
      )}
    </div>
  );
};

export default QuickLinksCard;
