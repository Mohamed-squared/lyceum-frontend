import React from 'react';

interface MultiFieldPlaceholderProps {
  value?: any;
  onChange?: (value: any) => void;
}

const MultiFieldPlaceholder: React.FC<MultiFieldPlaceholderProps> = ({ value, onChange }) => {
  return (
    <div>
      <p>Multi-Field Placeholder</p>
      {/* Example: Render a couple of text inputs for the 'profile' step which is multi-field */}
      <input type="text" placeholder="Profile Picture URL" style={{ border: '1px solid black', margin: '2px', display: 'block' }} />
      <input type="text" placeholder="Profile Banner URL" style={{ border: '1px solid black', margin: '2px', display: 'block' }} />
      <textarea placeholder="Bio" style={{ border: '1px solid black', margin: '2px', display: 'block' }} />
    </div>
  );
};

export default MultiFieldPlaceholder;
