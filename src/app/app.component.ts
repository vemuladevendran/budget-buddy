import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';
import { IconService } from './services/icon/icon.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private themeCtrl: ThemeService, private iconCtrl: IconService) {}

  async applyInitialTheme(): Promise<void> {
    try {
      await this.themeCtrl.setInitialTheme();
    } catch (error) {
      console.log('Fail to apply themes');
    }
  }

  async storeIconsInLocalStorage(): Promise<void> {
    try {
      await this.iconCtrl.setIconsToStorage();
    } catch (error) {
      console.log('Fail to store Icons');
    }
  }

  ngOnInit() {
    this.storeIconsInLocalStorage();
  }
}
