import React from 'react';
import { Home, Compass, Music, Flame, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TabType } from '../types';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'journey', label: 'Journey', icon: Flame },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      id="bottom-tab-navigation"
      aria-label="Bottom tab navigation"
      className="w-full bg-[#090909]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 flex items-center justify-around z-40 relative select-none"
    >
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center justify-center flex-1 py-1 transition-colors duration-150 relative cursor-pointer"
          >
            {/* Subtle top active indicator */}
            {isActive && (
              <span className="absolute -top-2 w-3 h-[2px] bg-[#C99A4A] rounded-full" />
            )}

            <div className={`transition-colors duration-150 ${isActive ? 'text-[#C99A4A]' : 'text-[#6F6F6F] hover:text-[#9B9B9B]'}`}>
              <Icon className="w-5 h-5 stroke-[1.75]" />
            </div>

            <span
              className={`text-[10px] tracking-normal mt-1 transition-colors duration-150 ${
                isActive ? 'text-[#C99A4A] font-medium' : 'text-[#6F6F6F]'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
