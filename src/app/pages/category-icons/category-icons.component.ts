import { Component, inject, OnInit } from '@angular/core';
import {
  ModalController,
  IonContent,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSegmentContent,
  IonSegmentView,
} from '@ionic/angular/standalone';
import { IconService } from 'src/app/services/icon/icon.service';

@Component({
  selector: 'app-category-icons',
  templateUrl: './category-icons.component.html',
  styleUrls: ['./category-icons.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSegmentContent,
    IonSegmentView,
  ],
})
export class CategoryIconsComponent implements OnInit {
  modelCtrl = inject(ModalController);
  iconsCtrl = inject(IconService);

  categoryIcons: any = [];
  incomeIcons: any = [];

  close(): any {
    return this.modelCtrl.dismiss();
  }

  async getIcons(): Promise<void> {
    try {
      this.categoryIcons = await this.iconsCtrl.getCategoryList();
      this.incomeIcons = await this.iconsCtrl.getIncomeList();
    } catch (error) {
      console.log('Fail to get Icons');
    }
  }

  handleReorder(event: any) {
    event.detail.complete();
  }

  ngOnInit(): void {
    this.getIcons();
  }
}
