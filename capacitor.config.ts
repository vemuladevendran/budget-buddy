import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.aplan.mymoney',
  appName: 'budget-buddy',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "585745388517-bmf5odf1pcegje7nv0p9otug0dmck39m.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
