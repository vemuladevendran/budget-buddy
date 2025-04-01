import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, isPlatform } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { TokenService } from '../token/token.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userDetails: any;

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private router: Router,
    private token: TokenService,
    private platform: Platform
  ) {
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }

    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });
  }

  async googleSignIn() {
    this.userDetails = await GoogleAuth.signIn();
    return await this.userDetails;
  }

  // create user

  googleLogin(data: any) {
    const url = `${this.settings.API_BASE_URL}/user/google-login`;
    return lastValueFrom(this.http.post(url, data));
  }

  login(data: any) {
    const url = `${this.settings.API_BASE_URL}/user/login`;
    return lastValueFrom(this.http.post(url, data));
  }

  createUser(data: any) {
    const url = `${this.settings.API_BASE_URL}/user/create`;
    return lastValueFrom(this.http.post(url, data));
  }

  // get user summary
  getUserSummary(){
    const url =`${this.settings.API_BASE_URL}/user/userSummary`;
    return lastValueFrom(this.http.get(url));
  }

  isLoggedIn() {
    return this.token.isTokenExist();
  }

  logout() {
    this.token.removeToken();
    this.router.navigate(['/login']);
  }

  getUsersList(filters: any) {
    const url = `${this.settings.API_BASE_URL}/user/search`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...filters,
        },
      })
    );
  }
}
