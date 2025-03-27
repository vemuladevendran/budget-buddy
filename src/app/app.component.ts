import { Component, Renderer2 } from '@angular/core';
import { ThemeService } from './services/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private renderer: Renderer2, private themeCtrl: ThemeService) {}


  async applyInitialTheme(): Promise<void>{
    try {
      await this.themeCtrl.setInitialTheme();
    } catch (error) {
      console.log("Fail to apply themes");
    }
  }

  ngOnInit() {
    
  }
}
