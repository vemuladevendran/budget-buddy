import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
  ModalController,
} from '@ionic/angular/standalone';
import { IconService } from 'src/app/services/icon/icon.service';
import { CalculateKeyboardComponent } from '../../common-components/calculate-keyboard/calculate-keyboard.component';

@Component({
  selector: 'app-add-expenses',
  templateUrl: './add-expenses.component.html',
  styleUrls: ['./add-expenses.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
    CommonModule,
    CalculateKeyboardComponent,
  ],
})
export class AddExpensesComponent implements OnInit {
  modelCtrl = inject(ModalController);
  iconsCtrl = inject(IconService);

  categoryIcons: any = [];
  incomeIcons: any = [];

  transaction_type = 'expense';
  selectedCategory = '';
  totalAmount = 0;
  close(): any {
    return this.modelCtrl.dismiss();
  }

  checkActiveTab(e: any) {
    this.transaction_type = e?.detail.value;
    this.selectedCategory =
      this.transaction_type === 'expense'
        ? this.categoryIcons[0].name
        : this.incomeIcons[0].name;
  }

  async getIcons(): Promise<void> {
    try {
      this.categoryIcons = await this.iconsCtrl.getCategoryList();
      this.selectedCategory = this.categoryIcons[0].name;
      this.incomeIcons = await this.iconsCtrl.getIncomeList();
    } catch (error) {
      console.log('Fail to get Icons');
    }
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  // on submit the expenses
  async handleSubmit(e: any): Promise<void> {
    try {
      const data = {
        transaction_type: this.transaction_type,
        expense_type: this.selectedCategory,
        ...e,
      };

      console.log(data, '========');
      this.close()
    } catch (error) {
      console.log('Fail', error);
    }
  }

  ngOnInit(): void {
    this.getIcons();
  }
}
