import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(message: string, duration: number = 4000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom', // You can change this to 'top', 'middle', etc.
    });
    toast.present();
  }
}
