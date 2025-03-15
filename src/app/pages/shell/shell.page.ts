import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { AddExpensesComponent } from '../add-expenses/add-expenses.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.page.html',
  styleUrls: ['./shell.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
  providers: [ModalController],
})
export class ShellPage implements OnInit {
  private modalCtrl = inject(ModalController);
  constructor() {}

  async openAddExpensesPage() {
    const modal = await this.modalCtrl.create({
      component: AddExpensesComponent,
    });
    modal.present();
  }

  ngOnInit() {}
}
