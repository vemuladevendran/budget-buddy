import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'AUTH_TOKEN';
  private summaryKey = 'SUMMARY_TOKEN';

  constructor(private storage: Storage) {
    this.init();
  }

  // Initialize the storage
  async init() {
    await this.storage.create();
  }

  async saveToken(data: any) {
    try {
      await this.storage.set(this.tokenKey, data);
    } catch (error) {
      console.log('fail to save data');
    }
  }

  async getToken(): Promise<string | null> {
    const data = await this.storage.get(this.tokenKey);
    return data;
  }

  async isTokenExist(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async removeToken() {
    await this.storage.remove(this.tokenKey);
  }

  async getTokenData(): Promise<any> {
    try {
      const token: any = await this.getToken();
      if (!token) {
        return null;
      }
      return JSON.parse(window.atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }

  async saveUserSummary(data: any) {
    try {
      await this.storage.remove(this.summaryKey);
      await this.storage.set(this.summaryKey, data);
    } catch (error) {
      console.log('Fail to save user summary');
    }
  }

  async getUserSummary(): Promise<string | null> {
    const data = await this.storage.get(this.summaryKey);
    return data;
  }

 
}
