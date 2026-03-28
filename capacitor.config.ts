import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medisetu.doctor',
  appName: 'MediSetu',
  webDir: 'dist',
  server: {
    url: 'https://doctor-webpage-one.vercel.app/',
    cleartext: true
  }
};

export default config;
