import React from 'react';
import { useApp } from '../context/AppContext';
import { DownloadZipModal } from './DownloadZipModal';

export const GlobalZipModal: React.FC = () => {
  const { showZipModal, setShowZipModal } = useApp();
  return (
    <DownloadZipModal
      isOpen={showZipModal}
      onClose={() => setShowZipModal(false)}
    />
  );
};
