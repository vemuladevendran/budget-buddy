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
    IonButton,
    FormsModule,
  ],
})
export class ExportDataComponent implements OnInit {
  modalCtrl = inject(ModalController);

  fromDate: string = '';
  toDate: string = '';

  ngOnInit() {
    const today = new Date();
    this.toDate = today.toISOString();
  
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    this.fromDate = lastWeek.toISOString();
  }
  

  close(): any {
    return this.modalCtrl.dismiss();
  }

  // Remove time from datetime change
  onFromDateChange(event: any) {
    const isoDate = event.detail.value;
    this.fromDate = isoDate;
  }

  onToDateChange(event: any) {
    const isoDate = event.detail.value;
    this.toDate = isoDate;
  }

  submitDates() {
    console.log("From Date:", this.fromDate);
    console.log("To Date:", this.toDate);
  }
}
