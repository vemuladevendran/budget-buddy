import { Component, inject, OnInit } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular/standalone';  // Import ModalController from Ionic
import { CategoryIconsComponent } from '../category-icons/category-icons.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonContent],
  providers: [ModalController]
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

  // Inject ModalController using 'inject()'
  private modalCtrl = inject(ModalController);

  constructor() {}

  async openCategoryIconPage() {
    const modal = await this.modalCtrl.create({
      component: CategoryIconsComponent,
    });
    modal.present();
  }

  ngOnInit() {}
}
