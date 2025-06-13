// src/components/dashboard/QuickLinksCard.tsx
import React from 'react';
import Image from 'next/image';

interface QuickLinkButtonProps {
  href: string;
  iconSrc: string;
  label: string;
}

const QuickLinkButton = ({ href, iconSrc, label }: QuickLinkButtonProps) => {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-center transition-colors"
    >
      <div className="w-10 h-10 relative mb-1.5">
        <Image src={iconSrc} alt={label} layout="fill" objectFit="contain" />
      </div>
      <span className="text-xs text-slate-50">{label}</span>
    </a>
  );
};

const QuickLinksCard = () => {
  const links = [
    { href: "#", iconSrc: "/assets/icons/icon-test.svg", label: "Generate Test" },
    { href: "#", iconSrc: "/assets/icons/icon-courses.svg", label: "Browse Courses" },
    { href: "#", iconSrc: "/assets/icons/icon-chat.svg", label: "AI Chat Studio" },
    { href: "#", iconSrc: "/assets/icons/icon-my-courses.svg", label: "My Courses" },
    { href: "#", iconSrc: "/assets/icons/icon-leaderboard.svg", label: "Leaderboard" },
  ];

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow text-slate-50 h-full">
      <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {links.map((link) => (
          <QuickLinkButton key={link.label} href={link.href} iconSrc={link.iconSrc} label={link.label} />
        ))}
      </div>
    </div>
  );
};

export default QuickLinksCard;
