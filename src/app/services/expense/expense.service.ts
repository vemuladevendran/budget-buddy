import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private router: Router
  ) {}

  // create user
  createExpense(data: any) {
    const url = `${this.settings.API_BASE_URL}/budget/expenses`;
    return lastValueFrom(this.http.post(url, data));
  }

  // get expense by year and month
  getExpense(filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/expenses`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...filters,
        },
      })
    );
  }
}
