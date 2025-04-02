import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { AlertController, NavParams } from '@ionic/angular';
import {
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule],
})
export class ViewExpenseComponent implements OnInit {
  expenseData: any;
  fromPage = '';

  modelCtrl = inject(ModalController);
  navParams = inject(NavParams);
  expenseCtrl = inject(ExpenseService);
  private alertCtrl = inject(AlertController);
  private loaderCtrl = inject(LoaderService);
  private toastCtrl = inject(ToastService);
  authServe = inject(AuthService);
  tokenServe = inject(TokenService);

  close(status: boolean): any {
    return this.modelCtrl.dismiss({
      expenseDeleted: status,
    });
  }

  async onDelete(id: string): Promise<void> {
    try {
      const alert = await this.alertCtrl.create({
        header: 'Delete',
        message: 'Are you sure you want to Delete 🗑️',
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
            handler: async () => {
              this.loaderCtrl.showLoading();
              await this.expenseCtrl.deleteExpense(id);
              this.toastCtrl.presentToast('Deleted Successfully');
              await this.getUserSummary();
              this.close(true);
            },
          },
        ],
      });
      await alert.present();
    } catch (error) {
      console.log(error);
      this.toastCtrl.presentToast('Fail to delete');
    } finally {
      this.loaderCtrl.hideLoading();
    }
  }

   // get user summary
   async getUserSummary(): Promise<void> {
    try {
      const data = await this.authServe.getUserSummary();
      this.tokenServe.saveUserSummary(data);
    } catch (error) {
      console.log(error, 'Fail to get user summary');
    }
  }


  ngOnInit(): void {
    const res = this.navParams.get('expense');
    this.expenseData = res?.data;
    this.fromPage = res?.page;
  }
}
