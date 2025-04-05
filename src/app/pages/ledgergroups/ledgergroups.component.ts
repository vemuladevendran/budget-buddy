import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ledgergroups',
  templateUrl: './ledgergroups.component.html',
  styleUrls: ['./ledgergroups.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon],
})
export class LedgergroupsComponent implements OnInit {
  modelCtrl = inject(ModalController);

  close(): any {
    return this.modelCtrl.dismiss();
  }

  ngOnInit() {}
}
