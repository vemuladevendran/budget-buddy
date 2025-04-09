import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonContent,
  IonIcon,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExpenseService } from 'src/app/services/expense/expense.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

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
    CommonModule,
  ],
})
export class ExportDataComponent implements OnInit {
  modalCtrl = inject(ModalController);
  expenseCtrl = inject(ExpenseService);
  loaderCtrl = inject(LoaderService);
  toastCtrl = inject(ToastService);

  fromDate: string = '';
  toDate: string = '';
  csvData: Blob | null = null;
  showDownloadButton: boolean = false;

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
      const data: Blob = await this.expenseCtrl.getExpenseFile(dateRange);
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

  async downloadFile(): Promise<void> {
    if (!this.csvData) {
      this.toastCtrl.presentToast('No data to download.');
      return;
    }

    const filename = `expenses_${this.fromDate}_to_${this.toDate}.xlsx`;

    if (Capacitor.isNativePlatform()) {
      // Save using Capacitor Filesystem
      try {
        const buffer = await this.csvData.arrayBuffer();
        const base64Data = this.arrayBufferToBase64(buffer);

        await Filesystem.writeFile({
          path: filename,
          data: base64Data,
          directory: Directory.Documents,
        });

        this.toastCtrl.presentToast('✅ Excel file saved to Documents folder.');
        this.close();
      } catch (err) {
        console.error('File save error:', err);
        this.toastCtrl.presentToast('❌ Failed to save Excel file.');
      }
    } else {
      // Download in Web
      const url = window.URL.createObjectURL(this.csvData);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      this.toastCtrl.presentToast('✅ Excel file downloaded.');
      this.close();
    }

    this.csvData = null;
    this.showDownloadButton = false;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return window.btoa(binary);
  }
}
