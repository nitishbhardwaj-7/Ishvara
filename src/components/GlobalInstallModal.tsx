import React from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallModal } from './PWAInstallModal';

export const GlobalInstallModal: React.FC = () => {
  const { showInstallModal, setShowInstallModal } = useApp();
  return (
    <PWAInstallModal
      isOpen={showInstallModal}
      onClose={() => setShowInstallModal(false)}
    />
  );
};
