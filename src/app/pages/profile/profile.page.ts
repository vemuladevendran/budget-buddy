import { Component, inject, OnInit } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular/standalone'; // Import ModalController from Ionic
import { CategoryIconsComponent } from '../category-icons/category-icons.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { CommonModule } from '@angular/common';
import { SelectThemeComponent } from '../select-theme/select-theme.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

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

  splitWiseAuthCode: string | null = null;

  // Inject ModalController using 'inject()'
  private modalCtrl = inject(ModalController);
  private authCtrl = inject(AuthService);
  private tokenCtrl = inject(TokenService);
  private route = inject(ActivatedRoute);

  logout(): void {
    this.authCtrl.logout();
  }

  async openCategoryIconPage() {
    const modal = await this.modalCtrl.create({
      component: CategoryIconsComponent,
    });
    modal.present();
  }

  async openThemesPage() {
    const modal = await this.modalCtrl.create({
      component: SelectThemeComponent,
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
        this.openThemesPage();
        break;
      case 'syncData':
        this.splitwiseAuthorization();
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

  // authorization splitwise

  async splitwiseAuthorization(): Promise<void> {
    try {
      const clientId = environment.splitWiseClientId; // Get your Splitwise client ID from environment variables
      const redirectUri = 'https://budgetbuddy-27.web.app/home'; // Set your redirect URI here
      const authUrl = `https://secure.splitwise.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;

      // Redirect the user to the Splitwise authorization URL
      window.location.href = authUrl;

    } catch (error) {
      console.log('Failed to authorize with Splitwise:', error);
    }
  }

  ngOnInit() {
    this.getUserSummaryData();

    this.route.queryParams.subscribe((params) => {
      this.splitWiseAuthCode = params['code'];

      if (this.splitWiseAuthCode) {
        console.log(this.splitWiseAuthCode, '===============');
      }
    });
  }
}
