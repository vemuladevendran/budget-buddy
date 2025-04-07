import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { AddGroupComponent } from './add-group/add-group.component';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-ledgergroups',
  templateUrl: './ledgergroups.component.html',
  styleUrls: ['./ledgergroups.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class LedgergroupsComponent implements OnInit {
  modalCtrl = inject(ModalController);
  tokenCtrl = inject(TokenService);

  userSummaryData: any;

  close(): any {
    return this.modalCtrl.dismiss();
  }

  async openAddGroup() {
    const modal = await this.modalCtrl.create({
      component: AddGroupComponent,
    });
    modal.present();

    const result = await modal.onWillDismiss();

    if (result?.data?.status) {
      this.getUserSummaryData();
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
