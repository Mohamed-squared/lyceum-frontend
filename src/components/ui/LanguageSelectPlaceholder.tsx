import React from 'react';

interface LanguageSelectPlaceholderProps {
  value?: any;
  onChange?: (value: any) => void;
}

const LanguageSelectPlaceholder: React.FC<LanguageSelectPlaceholderProps> = ({ value, onChange }) => {
  return (
    <div>
      <p>Language Select Placeholder</p>
      {/* Render 3 text inputs as per issue description for now */}
      <input type="text" placeholder="Website Interface Language" style={{ border: '1px solid black', margin: '2px' }} />
      <input type="text" placeholder="AI Explanation Language" style={{ border: '1px solid black', margin: '2px' }} />
      <input type="text" placeholder="Course Material Language" style={{ border: '1px solid black', margin: '2px' }} />
    </div>
  );
};

export default LanguageSelectPlaceholder;
