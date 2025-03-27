import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  ModalController,
  IonRadio,
  IonRadioGroup,
  IonItem,
} from '@ionic/angular/standalone';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-select-theme',
  templateUrl: './select-theme.component.html',
  styleUrls: ['./select-theme.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonRadio, IonRadioGroup, IonItem],
})
export class SelectThemeComponent implements OnInit {
  modelCtrl = inject(ModalController);
  themeCtrl = inject(ThemeService);

  selectedTheme = 'system';
  close(): any {
    return this.modelCtrl.dismiss();
  }
  constructor() {}

  async setTheme(event: any): Promise<void> {
    try {
      await this.themeCtrl.setThemes(event.detail.value);
      this.selectedTheme = event.detail.value;
    } catch (error) {
      console.log('Fail to set theme');
    }
  }

  async getTheme(): Promise<void> {
    try {
      this.selectedTheme = await this.themeCtrl.getThemes();
    } catch (error) {
      console.log('Fail to load themes');
    }
  }

  ngOnInit() {
    this.getTheme();
  }
}
