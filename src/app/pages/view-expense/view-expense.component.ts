import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import {
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-view-expense',
  templateUrl: './view-expense.component.html',
  styleUrls: ['./view-expense.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule],
})
export class ViewExpenseComponent implements OnInit {
  expenseData: any;

  modelCtrl = inject(ModalController);
  navParams = inject(NavParams);

  close(): any {
    return this.modelCtrl.dismiss({
      expenseDeleted: false,
    });
  }

  ngOnInit(): void {
    this.expenseData = this.navParams.get('expense');
  }
}
