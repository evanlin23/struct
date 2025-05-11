// Create a new file called PinIcon.tsx
import React from 'react';

interface PinIconProps {
  isPinned: boolean;
  className?: string;
}

const PinIcon: React.FC<PinIconProps> = ({ isPinned, className = '' }) => {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={isPinned ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isPinned ? (
        // Pinned icon (filled)
        <path d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2ZM12 12L12 22" />
      ) : (
        // Unpinned icon (outline)
        <>
          <circle cx="12" cy="7" r="5" fill="none" />
          <line x1="12" y1="12" x2="12" y2="22" />
        </>
      )}
    </svg>
  );
};

export default PinIcon;