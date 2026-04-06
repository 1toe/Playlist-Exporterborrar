import React from 'react';

interface Tab {
  key: string;
  label: string;
  count: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex border-b border-surface-200 mb-6" role="tablist">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button 
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset ${isActive ? 'border-b-2 border-brand-500 text-brand-700 font-semibold' : 'border-b-2 border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300'}`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${isActive ? 'bg-brand-100 text-brand-700' : 'bg-surface-100 text-surface-600'}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
