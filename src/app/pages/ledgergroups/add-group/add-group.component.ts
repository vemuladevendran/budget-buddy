import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  ModalController,
  IonIcon,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, ReactiveFormsModule],
})
export class AddGroupComponent implements OnInit {
  selectedImage = { name: 'general', path: 'general.svg' };
  groupIcons = [
    { name: 'general', path: 'general.svg' },
    { name: 'airplane', path: 'airplane.svg' },
    { name: 'avatar', path: 'avatar.svg' },
    { name: 'camera', path: 'camera.svg' },
    { name: 'document', path: 'document.svg' },
    { name: 'electric', path: 'electric.svg' },
    { name: 'graph', path: 'graph.svg' },
  ];

  groupName = new FormControl('');

  modalCtrl = inject(ModalController);
  loaderCtrl = inject(LoaderService);
  toastCtrl = inject(ToastService);
  tokenCtrl = inject(TokenService);
  private authCtrl = inject(AuthService);

  close(status: Boolean): any {
    return this.modalCtrl.dismiss({
      status: status,
    });
  }
  selectImage(g: any) {
    this.selectedImage = g;
  }

  async createGroup(): Promise<void> {
    try {
      if (this.groupName.value === '') {
        this.toastCtrl.presentToast("Group name can't be empty");
        return;
      }
      const data = {
        groupName: this.groupName.value,
        image: this.selectedImage.name,
      };
      await this.loaderCtrl.showLoading();
      await this.authCtrl.createLedger(data);
      await this.getUserSummary();
      this.close(true);
    } catch (error) {
      console.log(error, 'Fail to create');
    } finally {
      await this.loaderCtrl.hideLoading();
    }
  }

  // get user summary
  async getUserSummary(): Promise<void> {
    try {
      const data = await this.authCtrl.getUserSummary();
      await this.tokenCtrl.saveUserSummary(data);
    } catch (error) {
      console.log(error, 'Fail to get user summary');
    }
  }

  ngOnInit() {}
}
