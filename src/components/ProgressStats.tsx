import React from 'react';

interface ProgressStatsProps {
  stats: {
    total: number;
    toStudy: number;
    done: number;
  };
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  const { total, toStudy, done } = stats;
  
  // Calculate progress percentage
  const progressPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
  
  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
        Study Progress
      </h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {progressPercentage}% Complete
          </span>
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {done}/{total}
          </span>
        </div>
        <div className="w-full bg-[var(--color-border-primary)] rounded-full h-2.5">
          <div 
            className="bg-[var(--color-accent-primary)] h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">To Study</h3>
          <p className="text-2xl font-bold text-[var(--color-accent-secondary)]">{toStudy}</p>
        </div>
        <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Completed</h3>
          <p className="text-2xl font-bold text-[var(--color-accent-primary)]">{done}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;