import { Injectable } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private settings: SettingsService) {}

  getChat() {
    const url = `${this.settings.API_BASE_URL}/budget/chat`;
    return lastValueFrom(this.http.get(url));
  }

  querySystem(data: any) {
    const url = `${this.settings.API_BASE_URL}/budget/search`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...data,
        },
      })
    );
  }
}
