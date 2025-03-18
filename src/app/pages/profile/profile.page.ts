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
    { name: 'Category', path: 'category.svg' },
    { name: 'Budget', path: 'budget.svg' },
    { name: 'Calendar', path: 'calendar.svg' },
    { name: 'Ledger', path: 'ledger.svg' },
    { name: 'Savings', path: 'savings.svg' },
    { name: 'Tag', path: 'tag.svg' },
  ];

  otherIcons: any = [
    { name: 'Themes', path: 'themes.svg' },
    { name: 'Sync Data', path: 'sync.svg' },
    { name: 'Share App', path: 'share.svg' },
    { name: 'Reminders', path: 'reminder.svg' },
    { name: 'Privacy Policy', path: 'policy.svg' },
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
