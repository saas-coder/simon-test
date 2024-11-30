import React from 'react';

interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function TabSelector({ tabs, activeTab, onChange }: TabSelectorProps) {
  return (
    <div className="bg-[#1C1D24]/50 backdrop-blur-sm p-1 rounded-2xl inline-flex">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            px-6 py-3 text-sm font-medium rounded-xl transition-all
            ${activeTab === tab.id
              ? 'bg-[#6563fc] text-white shadow-lg shadow-[#6563fc]/25'
              : 'text-gray-400 hover:text-white'
            }
            ${tab.disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}