import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ViewExpenseComponent } from 'src/app/pages/view-expense/view-expense.component';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [ModalController],
})
export class ExpensesListComponent implements OnInit {
  @Input() expenseList: any = [];
  @Input() fromPage: string = '';
  private modalCtrl = inject(ModalController);
  private sharedCtrl = inject(SharedService);

  async openViewExpense(expense: any) {
    const modal = await this.modalCtrl.create({
      component: ViewExpenseComponent,
      componentProps: {
        expense: {
          data: expense,
          page: this.fromPage,
        },
      },
    });
    modal.present();

    const result = await modal.onWillDismiss();

    if (result?.data?.expenseDeleted) {
      this.sharedCtrl.notifyAddExpenseModalClosed(result?.data);
    }
  }

  constructor() {}

  ngOnInit() {}
}
