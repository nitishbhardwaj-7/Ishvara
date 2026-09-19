import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ishvara.sadhana',
  appName: 'Ishvara',
  webDir: 'dist',
  backgroundColor: '#090909',
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
