import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [IonicModule],
})
export class SignupComponent  {
  showPassword = false;

  userDetails: any;
  constructor(
    private authServe: AuthService,
    private router: Router,
    private tokenServe: TokenService,
    private loaderServe: LoaderService,
    private toastServe: ToastService,
  ) {}

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
      console.log(this.userDetails, data,'----------');

      // this.loaderServe.showLoading();
      // const res: any = await this.authServe.googleLogin(data);
      // this.tokenServe.saveToken(res?.token);
      // this.router.navigate(['home']);
    } catch (error) {
      console.log(error);
      this.toastServe.presentToast('Fail to login')
    }finally{
      this.loaderServe.hideLoading();
    }
  }
}
