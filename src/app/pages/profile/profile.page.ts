import { Component, inject, OnInit } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular/standalone'; // Import ModalController from Ionic
import { CategoryIconsComponent } from '../category-icons/category-icons.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
  providers: [ModalController],
})
export class ProfilePage implements OnInit {
  regularlyUsedIcons: any = [
    { name: 'Category', path: 'category.svg', action: 'openCategory' },
    { name: 'Budget', path: 'budget.svg', action: 'openBudget' },
    { name: 'Calendar', path: 'calendar.svg', action: 'openCalendar' },
    { name: 'Ledger', path: 'ledger.svg', action: 'openLedger' },
    { name: 'Savings', path: 'savings.svg', action: 'openSavings' },
    { name: 'Tag', path: 'tag.svg', action: 'openTag' },
  ];

  otherIcons: any = [
    { name: 'Themes', path: 'themes.svg', action: 'openThemes' },
    { name: 'Sync Data', path: 'sync.svg', action: 'syncData' },
    { name: 'Share App', path: 'share.svg', action: 'shareApp' },
    { name: 'Reminders', path: 'reminder.svg', action: 'openReminders' },
    { name: 'Privacy Policy', path: 'policy.svg', action: 'openPrivacyPolicy' },
  ];

  userSummaryData: any;

  // Inject ModalController using 'inject()'
  private modalCtrl = inject(ModalController);
  private authCtrl = inject(AuthService);
  private tokenCtrl = inject(TokenService);

  logout(): void {
    this.authCtrl.logout();
  }

  async openCategoryIconPage() {
    const modal = await this.modalCtrl.create({
      component: CategoryIconsComponent,
    });
    modal.present();
  }

  handleIconClick(action: any) {
    switch (action) {
      case 'openCategory':
        this.openCategoryIconPage();
        break;
      case 'openBudget':
        break;
      case 'openCalendar':
        break;
      case 'openLedger':
        break;
      case 'openSavings':
        break;
      case 'openTag':
        break;
      case 'openThemes':
        break;
      case 'syncData':
        break;
      case 'shareApp':
        break;
      case 'openReminders':
        break;
      case 'openPrivacyPolicy':
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  async getUserSummaryData(): Promise<void> {
    try {
      const data = await this.tokenCtrl.getUserSummary();
      this.userSummaryData = data;
    } catch (error) {
      console.log(error, 'Fail to get user data');
    }
  }

  ngOnInit() {
    this.getUserSummaryData();
  }
}
