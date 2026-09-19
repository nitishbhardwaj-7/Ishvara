import React, { useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { ReelsFeed } from './components/ReelsFeed';
import { ExploreScreen } from './components/ExploreScreen';
import { AudioScreen } from './components/AudioScreen';
import { JourneyScreen } from './components/JourneyScreen';
import { AskDivyaModal } from './components/AskDivyaModal';
import { ShareQuoteModal } from './components/ShareQuoteModal';
import { SettingsSheet } from './components/SettingsSheet';
import { MiniPlayer, FullPlayer } from './components/AudioPlayer';
import { devotionalAudioEngine } from './services/audioEngine';

/** Android hardware back button: close the top-most overlay, then go Home, then exit. */
const useBackButton = () => {
  const app = useApp();
  const ref = useRef(app);
  ref.current = app;

  useEffect(() => {
    const handle = CapacitorApp.addListener('backButton', () => {
      const s = ref.current;
      const player = devotionalAudioEngine.getState();
      if (player.isExpanded) devotionalAudioEngine.setExpanded(false);
      else if (s.shareModalItem) s.setShareModalItem(null);
      else if (s.showAskDivya) s.setShowAskDivya(false);
      else if (s.showSettings) s.setShowSettings(false);
      else if (s.activeTab !== 'home') s.setActiveTab('home');
      else CapacitorApp.exitApp();
    });
    return () => {
      handle.then(h => h.remove()).catch(() => {});
    };
  }, []);
};

const Shell: React.FC = () => {
  const { activeTab } = useApp();
  useBackButton();

  return (
    <div className="app-shell fixed inset-0 flex flex-col bg-[#090909] text-neutral-100 overflow-hidden">
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {activeTab === 'home' && <ReelsFeed />}
        {activeTab === 'explore' && <ExploreScreen />}
        {activeTab === 'audio' && <AudioScreen />}
        {activeTab === 'journey' && <JourneyScreen />}
      </main>

      {activeTab !== 'home' && <MiniPlayer />}
      <Navigation />

      <FullPlayer />
      <AskDivyaModal />
      <ShareQuoteModal />
      <SettingsSheet />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
