import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { TokenService } from 'src/app/services/token/token.service';
import { Device } from '@capacitor/device';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, ReactiveFormsModule],
})
export class LoginComponent {
  showPassword = false;
  userDetails: any;
  loginForm: FormGroup | any;

  constructor(
    private authServe: AuthService,
    private router: Router,
    private tokenServe: TokenService,
    private loaderServe: LoaderService,
    private toastServe: ToastService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  toggelShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // google sign option

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

  // get user summary
  async getUserSummary(): Promise<void> {
    try {
      const data = await this.authServe.getUserSummary();
      this.tokenServe.saveUserSummary(data);
    } catch (error) {
      console.log(error, 'Fail to get user summary');
    }
  }

  async onSubmit(): Promise<void> {
    try {
      const info = await Device.getInfo();
      const deviceId = await Device.getId();

      this.loaderServe.showLoading();
      const data = {
        ...this.loginForm?.value,
        loggedInDevices: [
          {
            platform: info.platform,
            operatingSystem: info.operatingSystem,
            deviceId: deviceId.identifier,
          },
        ],
      };
      const result: any = await this.authServe.login(data);
      await this.tokenServe.saveToken(result?.token);
      await this.getUserSummary();
      this.router.navigate(['home']);
    } catch (error) {
      console.log(error);
      this.toastServe.presentToast('Fail to login');
    } finally {
      this.loaderServe.hideLoading();
    }
  }
}
