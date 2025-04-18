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
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { TokenService } from 'src/app/services/token/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule
  ],
})
export class AddExpensesComponent implements OnInit {
  modalCtrl = inject(ModalController);
  iconsCtrl = inject(IconService);
  expenseCtrl = inject(ExpenseService);
  loaderCtrl = inject(LoaderService);
  tokenServe = inject(TokenService);
  authServe = inject(AuthService);

  categoryIcons: any = [];
  incomeIcons: any = [];

  transaction_type = 'expense';
  selectedCategory = '';
  totalAmount = 0;

  userSummaryData:any;

  selectedGroup = new FormControl('general')

  close(status: Boolean): any {
    return this.modalCtrl.dismiss({
      expenseCreated: status,
    });
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
      const data = await this.iconsCtrl.getIconsList();
      this.categoryIcons = data?.categoryIcons;
      this.selectedCategory = this.categoryIcons[0].name;
      this.incomeIcons = data?.incomeIcons;
      this.userSummaryData = await this.tokenServe.getUserSummary();
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
        group_name: this.selectedGroup.value,
        ...e,
      };
      this.loaderCtrl.showLoading();
      const currentYearDetails = {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      };
      await this.expenseCtrl.createExpense(data, currentYearDetails);
      await this.getUserSummary();
      this.close(true);
    } catch (error) {
      console.log('Fail', error);
    } finally {
      this.loaderCtrl.hideLoading();
    }
  }



  // get user summary
  async getUserSummary(): Promise<void> {
    try {
      const data = await this.authServe.getUserSummary();
      await this.tokenServe.saveUserSummary(data);
    } catch (error) {
      console.log(error, 'Fail to get user summary');
    }
  }

  ngOnInit(): void {
    this.getIcons();
  }
}
