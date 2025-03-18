import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themesKey = 'THEMES_TOKEN'; // The key used for storing theme preference
  private themePreference: 'dark' | 'light' | 'system' = 'system'; // Default theme

  constructor(private storage: Storage) {
    this.init(); // Initialize storage on service instantiation
  }

  // Initialize the storage for Ionic Storage
  async init() {
    await this.storage.create();
    await this.applyTheme(); // Apply stored theme on initialization
  }

  // Set the theme in storage, default is 'dark' if no value is provided
  async setThemes(data: 'dark' | 'light' | 'system' = 'dark') {
    try {
      this.themePreference = data; // Store the selected theme in the service
      await this.storage.set(this.themesKey, data); // Save theme preference in storage
      this.applyTheme(); // Apply the selected theme to the document body
    } catch (error) {
      console.log('Failed to store theme preference:', error);
    }
  }

  // Get the theme preference from storage
  async getThemes(): Promise<'dark' | 'light' | 'system'> {
    const data = await this.storage.get(this.themesKey);
    return data ? data : 'system'; // Return 'system' if no preference is found
  }

  // Apply the theme based on the preference stored in the service or the system preference
  private async applyTheme() {
    const themePreference = await this.getThemes(); // Get theme preference

    if (themePreference === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (themePreference === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    } else {
      // For system theme, detect system preference
      const prefersDark = window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (prefersDark) {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      }
    }
  }

  // This is the method where you can pass a theme value
  // Directly set a theme (dark, light, or system) based on user selection
  async setTheme(theme: 'dark' | 'light' | 'system') {
    await this.setThemes(theme); // Apply the selected theme
  }

  // Set theme as system (default system preference)
  async setSystemTheme() {
    await this.setThemes('system');
  }
}
