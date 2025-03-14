import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar, IonTitle } from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class ProfilePage implements OnInit {


  regularlyUsedIcons: any = [
    {
      name: 'Category',
      path: 'category.svg'
    },
    {
      name: 'Budget',
      path: 'budget.svg'
    },
    {
      name: 'Calendar',
      path: 'calendar.svg'
    },
    {
      name: 'Ledger',
      path: 'ledger.svg'
    },
    {
      name: 'Savings',
      path: 'savings.svg'
    },
    {
      name: 'Tag',
      path: 'tag.svg'
    },
  ]

  otherIcons: any = [
    {
      name: 'Themes',
      path: 'themes.svg'
    },
    {
      name: 'Sync Data',
      path: 'sync.svg'
    },
    {
      name: 'Share App',
      path: 'share.svg'
    },
    {
      name: 'Reminders',
      path: 'reminder.svg'
    },
    {
      name: 'Privacy Policy',
      path: 'policy.svg'
    },
  ]
  constructor() { }

  ngOnInit() {
  }

}
