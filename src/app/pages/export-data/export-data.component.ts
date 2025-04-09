import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonContent,
  IonIcon,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    FormsModule,
    IonButton, // Import IonButton for the download button
    CommonModule
  ],
})
export class ExportDataComponent implements OnInit {
  modalCtrl = inject(ModalController);
  expenseCtrl = inject(ExpenseService);
  loaderCtrl = inject(LoaderService);
  toastCtrl = inject(ToastService);

  fromDate: string = '';
  toDate: string = '';
  csvData: Blob | null = null; // Store the received CSV data
  showDownloadButton: boolean = false; // Control the visibility of the download button

  ngOnInit() {
    const today = new Date();
    this.toDate = today.toISOString().split('T')[0];

    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    this.fromDate = lastWeek.toISOString().split('T')[0];
  }

  close(): any {
    return this.modalCtrl.dismiss();
  }

  onFromDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      this.fromDate = isoDate.split('T')[0];
    }
  }

  onToDateChange(event: any) {
    const isoDate = event.detail.value;
    if (isoDate) {
      this.toDate = isoDate.split('T')[0];
    }
  }

  async submitDates(): Promise<void> {
    try {
      const dateRange = {
        from: this.fromDate,
        to: this.toDate,
      };
      this.loaderCtrl.showLoading('Generating Excel');
      const data: Blob = await this.expenseCtrl.getExpenseFile(dateRange); // Await the Promise resolution
      this.loaderCtrl.hideLoading();
      this.csvData = data;
      this.showDownloadButton = true;
      this.toastCtrl.presentToast('Excel generated successfully. Click Download to save.');
    } catch (error) {
      console.error(error);
      this.loaderCtrl.hideLoading();
      this.csvData = null;
      this.showDownloadButton = false;
      this.toastCtrl.presentToast('Failed to create Excel');
    }
  }

  downloadFile(): void {
    if (this.csvData) {
      const filename = `expenses_${this.fromDate}_to_${this.toDate}.xlsx`;
      const url = window.URL.createObjectURL(this.csvData);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      this.csvData = null; // Reset the data after download
      this.showDownloadButton = false; // Hide the download button
    } else {
      this.toastCtrl.presentToast('No data to download.');
    }
  }
}