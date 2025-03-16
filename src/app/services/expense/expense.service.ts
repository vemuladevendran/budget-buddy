import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private router: Router,
  ) { }

   // create user
    createExpense(data: any) {
      const url = `${this.settings.API_BASE_URL}/budget/expense`;
      return lastValueFrom(this.http.post(url, data));
    }
}
