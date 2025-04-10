import { Component, inject, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-avaliable-soon',
  templateUrl: './avaliable-soon.component.html',
  styleUrls: ['./avaliable-soon.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class AvaliableSoonComponent implements OnInit {
  modalCtrl = inject(ModalController);

  ngOnInit() {}

  close(): any {
    return this.modalCtrl.dismiss();
  }
}
