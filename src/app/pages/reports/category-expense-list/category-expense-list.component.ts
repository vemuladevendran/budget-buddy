import { Component, inject, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import {
  IonContent,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';
import { ExpensesListComponent } from "../../../common-components/expenses-list/expenses-list.component";

@Component({
  selector: 'app-category-expense-list',
  templateUrl: './category-expense-list.component.html',
  styleUrls: ['./category-expense-list.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, ExpensesListComponent],
})
export class CategoryExpenseListComponent implements OnInit {
  expenseList: any[] = [];

  modelCtrl = inject(ModalController);
  navParams = inject(NavParams);

  close(): any {
    return this.modelCtrl.dismiss();
  }

  ngOnInit() {
    this.expenseList = this.navParams.get('expenses');
  }
}
