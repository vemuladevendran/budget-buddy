import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
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

  createExpense(data: any, filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/expenses`;
    const refreshUrl = `${url}?t=${Date.now()}`; // cache-buster
    return lastValueFrom(
      this.http.post(url, data).pipe(
        switchMap(() =>
          this.http.get(refreshUrl, {
            params: { ...filters },
            headers: {
              'ngsw-bypass': 'true',
            },
          })
        )
      )
    );
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

  deleteExpense(id: string, filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/expenses/${id}`;
    const refreshUrl = `${
      this.settings.API_BASE_URL
    }/budget/expenses?t=${Date.now()}`;
    return lastValueFrom(
      this.http.delete(url).pipe(
        switchMap(() =>
          this.http.get(refreshUrl, {
            params: { ...filters },
            headers: {
              'ngsw-bypass': 'true',
            },
          })
        )
      )
    );
  }

  // get expense for graph
  getExpenseForGraph(filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/graphdata`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...filters,
        },
      })
    );
  }

  // get expense for graph
  getCategoryExpenseForGraph(filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/categorygraphdata`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...filters,
        },
      })
    );
  }

  getExpenseFile(dateRange: any) {
    const url = `${this.settings.API_BASE_URL}/files/expense-excel`;
    return lastValueFrom(
      this.http.get(url, {
        params: {
          ...dateRange,
        },
        responseType: 'blob',
      })
    );
  }
}
