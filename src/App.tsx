import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileFrame } from './components/MobileFrame';
import { Navigation } from './components/Navigation';
import { ReelsFeed } from './components/ReelsFeed';
import { ExploreScreen } from './components/ExploreScreen';
import { AudioScreen } from './components/AudioScreen';
import { JourneyScreen } from './components/JourneyScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AskDivyaModal } from './components/AskDivyaModal';
import { PaywallModal } from './components/PaywallModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ShareQuoteModal } from './components/ShareQuoteModal';
import { CommentDrawer } from './components/CommentDrawer';
import { ReportModal } from './components/ReportModal';
import { AdminDashboard } from './components/AdminDashboard';
import { GlobalInstallModal } from './components/GlobalInstallModal';
import { GlobalZipModal } from './components/GlobalZipModal';

const MainScreen: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="flex-1 w-full h-full flex flex-col relative overflow-hidden bg-[#090909]">
      {/* Active Screen View */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
        {activeTab === 'home' && <ReelsFeed />}
        {activeTab === 'explore' && <ExploreScreen />}
        {activeTab === 'audio' && <AudioScreen />}
        {activeTab === 'journey' && <JourneyScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Persistent Bottom Tab Navigation */}
      <Navigation />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MobileFrame>
        <MainScreen />
      </MobileFrame>

      {/* Global Modals & Drawers */}
      <AskDivyaModal />
      <PaywallModal />
      <OnboardingFlow />
      <ShareQuoteModal />
      <CommentDrawer />
      <ReportModal />
      <AdminDashboard />
      <GlobalInstallModal />
      <GlobalZipModal />
    </AppProvider>
  );
}
