import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal, ModalController } from '@ionic/angular';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Chart, registerables } from 'chart.js';
import { CategoryExpenseListComponent } from './category-expense-list/category-expense-list.component';

Chart.register(...registerables);
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [ModalController]
})
export class ReportsPage implements OnInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef | any;
  lineChart: Chart | undefined;

  @ViewChild('pieCanvas') pieCanvas: ElementRef | any;
  pieChart: Chart | undefined;

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

  expenseData: any = [];
  categoryExpenseData: any = [];
  userSummaryData: any;
  constructor(
    private loaderCtrl: LoaderService,
    private expenseCtrl: ExpenseService,
    private sharedCtrl: SharedService,
    private tokenCtrl: TokenService,
    private modalCtrl: ModalController
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
      const data = await this.expenseCtrl.getExpenseForGraph(filters);
      const categoryData = await this.expenseCtrl.getCategoryExpenseForGraph(
        filters
      );

      this.expenseData = data;
      this.categoryExpenseData = categoryData;
      await this.createLineChart(data);
      await this.createDoughnutChart(categoryData);
      this.getUserSummaryData();
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

  createLineChart(data: any) {
    const dates = data.daily_expenses.map((item: any) => {
      const date = new Date(item._id);
      return date.toLocaleString('default', {
        month: 'numeric',
        day: 'numeric',
      });
    });

    const amounts = data.daily_expenses.map((item: any) => item.totalExpense);

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: '',
            data: amounts,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
            pointBackgroundColor: '#1e88e5',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${value}`,
              color: '#4caf50',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Day of Month',
              color: '#ddd',
              font: {
                size: 14,
                weight: 'bold',
              },
            },
            ticks: {
              color: '#ff4081',
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  createDoughnutChart(data: any) {
    const labels = data.map((item: any) => item._id);
    const values = data.map((item: any) => item.totalAmount);

    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,

            borderWidth: 1,
            hoverBorderColor: 'black',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: $${context.parsed}`,
            },
          },
        },
      },
    });
  }

  // open expense list page

  async openViewExpensesList(expenses: any) {
    const modal = await this.modalCtrl.create({
      component: CategoryExpenseListComponent,
      componentProps: {
        expenses: expenses,
      },
    });
    modal.present();
  }

  ngOnInit() {
    this.getExpenseList();
  }
}
