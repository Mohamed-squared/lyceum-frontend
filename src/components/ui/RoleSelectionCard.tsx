// Path: src/components/ui/RoleSelectionCard.tsx
import { FC } from 'react';
import Image from 'next/image';

interface RoleSelectionCardProps {
  icon: string;
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

const RoleSelectionCard: FC<RoleSelectionCardProps> = ({ icon, title, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg transition-all duration-200 w-48 h-48
        ${isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
          : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50/50'
        }`}
    >
      <Image src={icon} alt={`${title} icon`} width={64} height={64} className="mb-4" />
      <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</span>
    </button>
  );
};

export default RoleSelectionCard;
