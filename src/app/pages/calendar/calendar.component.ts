import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent, IonIcon, IonModal } from '@ionic/angular/standalone';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [IonModal, IonIcon, IonContent, CommonModule],
})
export class CalendarComponent implements OnInit {
  modelCtrl = inject(ModalController);
  private loaderCtrl = inject(LoaderService);
  private expenseCtrl = inject(ExpenseService);
  private tokenCtrl = inject(TokenService);
  userSummaryData:any;
  
  today: string = new Date().toISOString().slice(0, 10);
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth();
  submitType: boolean = false;

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
  calendarDays: any[] = [];
  incomeExpenseMap: any;

  ngOnInit(): void {
    this.getExpenseList();
  }

  close(): any {
    return this.modelCtrl.dismiss();
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

  submitYearMonth(value: boolean) {
    if (value) {
      this.submitType = true;
      this.currentMonth = this.selectedMonth;
      this.currentYear = this.selectedYear;
    } else {
      this.submitType = false;
      this.selectedMonth = this.currentMonth;
      this.selectedYear = this.currentYear;
    }
    this.getExpenseList();
    this.modal.dismiss();
  }

  async getExpenseList(): Promise<void> {
    try {
      const filters = {
        year: this.selectedYear,
        month: this.selectedMonth + 1,
      };
      this.loaderCtrl.showLoading();
      const data = await this.expenseCtrl.getExpenseForGraph(filters);
      this.incomeExpenseMap = data;
      this.generateCalendar(this.selectedYear, this.selectedMonth + 1);
    } catch (error) {
      console.log(error, 'Fail to fetch');
      this.loaderCtrl.hideLoading();
    } finally {
      this.loaderCtrl.hideLoading();
    }
  }

  onWillDismiss(event: any) {
    if (!this.submitType) {
      this.selectedMonth = this.currentMonth;
      this.selectedYear = this.currentYear;
    }
  }

  generateCalendar(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const daysInMonth = end.getDate();
    const startDay = start.getDay();

    this.calendarDays = [];

    for (let i = 0; i < startDay; i++) {
      this.calendarDays.push(null);
    }

    for (let date = 1; date <= daysInMonth; date++) {
      const fullDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
      const foundData = this.incomeExpenseMap?.daily_data?.find((item: any) => item.date === fullDate);
      this.calendarDays.push({
        date: date,
        expense: foundData?.expense || 0,
        income: foundData?.income || 0,
      });
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


 
}