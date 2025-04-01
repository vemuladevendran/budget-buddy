import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ViewExpenseComponent } from 'src/app/pages/view-expense/view-expense.component';

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

  private modalCtrl = inject(ModalController);

  async openViewExpense(expense: any) {
    const modal = await this.modalCtrl.create({
      component: ViewExpenseComponent,
      componentProps: {
        expense: expense, 
      },
    });
    modal.present();
  }

  constructor() {}

  ngOnInit() {}
}
