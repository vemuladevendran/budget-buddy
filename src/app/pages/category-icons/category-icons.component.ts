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
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
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
    DragDropModule,
  ],
})
export class CategoryIconsComponent implements OnInit {
  modalCtrl = inject(ModalController);
  iconsCtrl = inject(IconService);

  categoryIcons: any = [];
  incomeIcons: any = [];

  close(): any {
    return this.modalCtrl.dismiss();
  }

  async getIcons(): Promise<void> {
    try {
      const data = await this.iconsCtrl.getIconsList();
      this.categoryIcons = data?.categoryIcons;
      this.incomeIcons = data?.incomeIcons;
    } catch (error) {
      console.log('Fail to get Icons');
    }
  }

  async reorderCategoryIcon(event: CdkDragDrop<any[]>): Promise<void> {
    moveItemInArray(
      this.categoryIcons,
      event.previousIndex,
      event.currentIndex
    );
    try {
      await this.iconsCtrl.updateIconsOrder({
        categoryIcons: this.categoryIcons,
        incomeIcons: this.incomeIcons,
      });
    } catch (error) {
      console.log('Fail to update');
    }
  }

  async reorderIncomeIcon(event: CdkDragDrop<any[]>): Promise<void> {
    moveItemInArray(this.incomeIcons, event.previousIndex, event.currentIndex);
    try {
      await this.iconsCtrl.updateIconsOrder({
        categoryIcons: this.categoryIcons,
        incomeIcons: this.incomeIcons,
      });
    } catch (error) {
      console.log('Fail to update');
    }
  }

  async resetOrder(): Promise<void> {
    try {
      await this.iconsCtrl.resetIcons();
      this.getIcons()
    } catch (error) {
      console.log('Fail to reset order');
    }
  }

  ngOnInit(): void {
    this.getIcons();
  }
}
