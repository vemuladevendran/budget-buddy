import { Component, inject, model, OnInit } from '@angular/core';
import {
  IonContent,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { CategoryIconsComponent } from '../category-icons/category-icons.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { CommonModule } from '@angular/common';
import { SelectThemeComponent } from '../select-theme/select-theme.component';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders
import { CalendarComponent } from '../calendar/calendar.component';
import { LedgergroupsComponent } from '../ledgergroups/ledgergroups.component';

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
    { name: 'Calendar', path: 'calendar.svg', action: 'openCalendar' },
    { name: 'Category', path: 'category.svg', action: 'openCategory' },
    { name: 'Groups', path: 'ledger.svg', action: 'openGroup' },
    { name: 'Budget', path: 'budget.svg', action: 'openBudget' },
    { name: 'Savings', path: 'savings.svg', action: 'openSavings' },
    { name: 'Tag', path: 'tag.svg', action: 'openTag' },
  ];

  otherIcons: any = [
    { name: 'Themes', path: 'themes.svg', action: 'openThemes' },
    { name: 'Share App', path: 'share.svg', action: 'shareApp' },
    { name: 'Reminders', path: 'reminder.svg', action: 'openReminders' },
    { name: 'Sync Data', path: 'sync.svg', action: 'syncData' },
    { name: 'Privacy Policy', path: 'policy.svg', action: 'openPrivacyPolicy' },
  ];

  userSummaryData: any;
  splitWiseAuthCode: string | null = null;
  userExpenses: any[] = [];
  splitWiseAccessToken: string | null = null; // Store the access token

  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);
  private authCtrl = inject(AuthService);
  private tokenCtrl = inject(TokenService);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient); // Inject HttpClient
  private router = inject(Router);

  async logout(): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Logout ⏻',
        message: 'Are you sure you want to logout',
        buttons: [
          {
            text: 'No ❌',
            role: 'cancel',
            handler: () => {
              console.log('Alert canceled');
              return;
            },
          },
          {
            text: 'Yes ✔️',
            role: 'confirm',
            handler: () => {
              this.authCtrl.logout();
            },
          },
        ],
      });

      await alert.present();
    } catch (error) {
      console.log(error, 'fail to logout');
    }
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

  async openCalendarpage() {
    const modal = await this.modalCtrl.create({
      component: CalendarComponent,
    });
    modal.present();
  }

  async openGroups() {
    const modal = await this.modalCtrl.create({
      component: LedgergroupsComponent,
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
        this.openCalendarpage();
        break;
      case 'openGroup':
        this.openGroups();
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
        this.router.navigate(['privacy-policy']);
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

  async splitwiseAuthorization(): Promise<void> {
    try {
      const clientId = environment.splitWiseClientId;
      const redirectUri = 'http://localhost:8100/profile/';
      const authUrl = `/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}`;
      window.location.href = authUrl;
    } catch (error) {
      console.log('Failed to authorize with Splitwise:', error);
    }
  }

  async getSplitwiseAccessToken(code: string): Promise<void> {
    const clientId = environment.splitWiseClientId;
    const clientSecret = environment.splitWiseClientSecret;
    const redirectUri = 'http://localhost:8100/profile/';

    const body = new URLSearchParams();
    body.set('client_id', clientId);
    body.set('client_secret', clientSecret);
    body.set('code', code);
    body.set('grant_type', 'authorization_code');
    body.set('redirect_uri', redirectUri);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    try {
      const response: any = await this.http
        .post('/oauth/token', body.toString(), {
          headers: headers,
        })
        .toPromise();

      this.splitWiseAccessToken = response.access_token;
      console.log('Splitwise Access Token:', this.splitWiseAccessToken);
      await this.fetchSplitwiseExpenses();
    } catch (error) {
      console.error('Failed to get Splitwise access token:', error);
    }
  }
  async fetchSplitwiseExpenses(): Promise<void> {
    if (!this.splitWiseAccessToken) {
      console.error('Access token is missing.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.splitWiseAccessToken}`,
    });

    try {
      const response: any = await this.http
        .get('/api/v3.0/get_expenses', { headers: headers })
        .toPromise();

      this.userExpenses = response.expenses;
      console.log('Splitwise Expenses:', this.userExpenses);
    } catch (error) {
      console.error('Failed to fetch Splitwise expenses:', error);
    }
  }

  ngOnInit() {
    this.getUserSummaryData();

    this.route.queryParams.subscribe((params) => {
      this.splitWiseAuthCode = params['code'];

      if (this.splitWiseAuthCode) {
        this.getSplitwiseAccessToken(this.splitWiseAuthCode);
      }
    });
  }
}
