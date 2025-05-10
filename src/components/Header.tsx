import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[var(--color-bg-secondary)] py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg 
              className="h-8 w-8 text-[var(--color-accent-primary)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h1 className="ml-2 text-2xl font-bold text-[var(--color-text-primary)]">
              PDF Study Tool
            </h1>
          </div>
          <div>
            <span className="text-[var(--color-text-secondary)]">
              Track and manage your study materials
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;