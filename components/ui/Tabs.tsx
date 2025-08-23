import React from 'react';

interface TabsProps {
  tabs: { id: string; label: string; disabled?: boolean }[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick, className }) => {
  return (
    <div className={`border-b border-border ${className}`}>
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabClick(tab.id)}
            disabled={tab.disabled}
            className={`
              whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
              }
              ${
                tab.disabled 
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
