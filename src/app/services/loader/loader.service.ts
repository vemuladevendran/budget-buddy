import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  constructor(private loadingCtrl: LoadingController) {}

  // Method to show the loader with an optional message
  async showLoading(message: string = 'Loading...') {
      const loading = await this.loadingCtrl.create({
        message: message,
      });

      loading.present();
  }

  // Method to hide the loader
  async hideLoading() {
   await this.loadingCtrl.dismiss();
}
}