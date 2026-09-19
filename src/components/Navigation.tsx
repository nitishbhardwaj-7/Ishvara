import React from 'react';
import { Home, Compass, Music, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

const TABS: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'audio', label: 'Songs', icon: Music },
  { id: 'journey', label: 'Journey', icon: Flame },
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav
      aria-label="Main navigation"
      className="safe-bottom w-full bg-[#090909]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 pt-2 flex items-center justify-around z-40 relative select-none"
    >
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className="flex flex-col items-center justify-center flex-1 py-1 relative cursor-pointer"
          >
            {isActive && <span className="absolute -top-2 w-3 h-[2px] bg-[#C99A4A] rounded-full" />}
            <Icon className={`w-5 h-5 stroke-[1.75] ${isActive ? 'text-[#C99A4A]' : 'text-[#6F6F6F]'}`} />
            <span className={`text-[10px] mt-1 ${isActive ? 'text-[#C99A4A] font-medium' : 'text-[#6F6F6F]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
