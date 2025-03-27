import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { AddExpensesComponent } from '../add-expenses/add-expenses.component';
import { SharedService } from 'src/app/services/shared/shared.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.page.html',
  styleUrls: ['./shell.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule],
  providers: [ModalController],
})
export class ShellPage implements OnInit {
  private modalCtrl = inject(ModalController);
  private sharedCtrl = inject(SharedService)
  constructor() {}

  async openAddExpensesPage() {
    const modal = await this.modalCtrl.create({
      component: AddExpensesComponent,
    });
    modal.present();

    const result = await modal.onWillDismiss();

    if(result?.data?.expenseCreated){
        this.sharedCtrl.notifyAddExpenseModalClosed(result?.data)
    }

    
  }

  ngOnInit() {}
}
