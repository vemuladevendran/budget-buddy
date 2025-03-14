import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.setDarkTheme();
  }

  setDarkTheme() {
    // Check system theme preference or local storage preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }

    // Optionally, you can store the theme preference in localStorage or use a setting from the user preferences.
  }

  toggleDarkTheme() {
    // Toggle between dark and light themes based on user interaction
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
      this.renderer.removeClass(document.body, 'dark-theme');
    } else {
      this.renderer.addClass(document.body, 'dark-theme');
    }
  }
}
