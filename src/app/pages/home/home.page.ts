import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ExpensesListComponent } from '../../common-components/expenses-list/expenses-list.component';
import { SharedService } from 'src/app/services/shared/shared.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ExpensesListComponent],
})
export class HomePage implements OnInit {
  today: string = new Date().toISOString().slice(0, 10);
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  submitType: Boolean = false;
  monthList = [
    { month: 1, name: 'January' },
    { month: 2, name: 'February' },
    { month: 3, name: 'March' },
    { month: 4, name: 'April' },
    { month: 5, name: 'May' },
    { month: 6, name: 'June' },
    { month: 7, name: 'July' },
    { month: 8, name: 'August' },
    { month: 9, name: 'September' },
    { month: 10, name: 'October' },
    { month: 11, name: 'November' },
    { month: 12, name: 'December' },
  ];

  @ViewChild(IonModal) modal!: IonModal;

  expenseList: any = [];
  userSummaryData: any;
  constructor(
    private loaderCtrl: LoaderService,
    private expenseCtrl: ExpenseService,
    private sharedCtrl: SharedService,
    private tokenCtrl: TokenService
  ) {
    this.sharedCtrl.addExpenseModalClosed$.subscribe((data) => {
      if (data) {
        this.getExpenseList();
      }
    });
  }

  changeYear(e: any) {
    if (e === 1) {
      this.selectedYear--;
    } else {
      if (this.selectedYear === new Date().getFullYear()) {
        return;
      } else {
        this.selectedYear++;
      }
    }
  }

  changeMonth(m: any) {
    this.selectedMonth = m - 1;
  }

  submitYearMonth(value: Boolean) {
    if (value) {
      this.submitType = true;
      this.currentMonth = this.selectedMonth;
      this.currentYear = this.selectedYear;
      this.getExpenseList();

      this.modal.dismiss();
      return;
    } else {
      this.submitType = false;
      this.selectedMonth = this.currentMonth;
      this.selectedYear = this.currentYear;
      this.getExpenseList();

      this.modal.dismiss();
    }
  }

  onWillDismiss(event: any) {
    if (!this.submitType) {
      this.selectedMonth = this.currentMonth;
      this.selectedYear = this.currentYear;
    }
    return;
  }

  async getExpenseList(): Promise<void> {
    try {
      const filters = {
        year: this.selectedYear,
        month: this.selectedMonth + 1,
      };
      // this.loaderCtrl.showLoading();
      await this.getUserSummaryData();
      const data = await this.expenseCtrl.getExpense(filters);
      this.expenseList = data;
    } catch (error) {
      console.log(error, 'Fail to fetch');
    } finally {
      this.loaderCtrl.hideLoading();
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
    this.getExpenseList();
  }
}
