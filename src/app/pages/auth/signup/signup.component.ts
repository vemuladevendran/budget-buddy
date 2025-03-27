import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Device } from '@capacitor/device';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, ReactiveFormsModule,CommonModule],
})
export class SignupComponent {
  showPassword = false;
  signupForm!: FormGroup;
  userDetails: any;
  constructor(
    private authServe: AuthService,
    private router: Router,
    private tokenServe: TokenService,
    private loaderServe: LoaderService,
    private toastServe: ToastService,
    private fb: FormBuilder
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      default_currency: ['', [Validators.required]],
      authorization: ['app'],
    });
  }

  toggelShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  async googleSign(): Promise<void> {
    try {
      this.userDetails = await this.authServe.googleSignIn();

      const info = await Device.getInfo();
      const deviceId = await Device.getId();

      const data = {
        name: this.userDetails.name,
        email: this.userDetails.email,
        idToken: this.userDetails.authentication?.idToken,
        googleImg: this.userDetails.imageUrl,
        loggedInDevices: [
          {
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            deviceId: deviceId.identifier,
          },
        ],
      };
      this.loaderServe.showLoading();
      const res: any = await this.authServe.googleLogin(data);
      await this.tokenServe.saveToken(res?.token);
      await this.getUserSummary();
      this.router.navigate(['home']);
    } catch (error) {
      console.log(error);
      this.toastServe.presentToast('Fail to login');
    } finally {
      this.loaderServe.hideLoading();
    }
  }

  // signup

  async createAccount(): Promise<void> {
    try {
      if (!this.signupForm.valid) {
        this.toastServe.presentToast('Fail to create account');
        return
      }
      
      const info = await Device.getInfo();
      const deviceId = await Device.getId();
      const data = {
        ...this.signupForm.value,
        loggedInDevices: [
          {
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            deviceId: deviceId.identifier,
          },
        ],
      };
      
      this.loaderServe.showLoading();
      const res: any = await this.authServe.createUser(data);
      await this.tokenServe.saveToken(res?.token);
      await this.getUserSummary();
      this.router.navigate(['home']);
    } catch (error: any) {
      console.log(error);
      this.toastServe.presentToast(error?.error?.message);
    } finally {
      this.loaderServe.hideLoading();
    }
  }

  // get user summary
  async getUserSummary(): Promise<void>{
    try {
      const data = await this.authServe.getUserSummary();
      this.tokenServe.saveUserSummary(data);
    } catch (error) {
      console.log(error, 'Fail to get user summary');
    }
  }
}


