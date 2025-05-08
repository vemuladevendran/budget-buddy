import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensekey = 'EXPENSE_KEY';

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private router: Router,
    private storage: Storage
  ) {
    this.init();
  }

  // Initialize the storage
  async init() {
    await this.storage.create();
  }

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
  async getExpense(filters: any) {
    const url = `${this.settings.API_BASE_URL}/budget/expenses`;
    const data = lastValueFrom(
      this.http.get(url, {
        params: {
          ...filters,
        },
      })
    );
    await this.storeLocalFirst(data);
    return data;
  }


    // search expense by filters
    async searchExpense(filters: any) {
      const url = `${this.settings.API_BASE_URL}/budget/search-expense`;
      const data = lastValueFrom(
        this.http.get(url, {
          params: {
            ...filters,
          },
        })
      );
      return data;
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

  // update expense
  updateExpense(id: string, data: any){
    const url = `${this.settings.API_BASE_URL}/budget/expenses/${id}`;
    return lastValueFrom(this.http.put(url, data));
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

  // storing data in local storage for quick response
  async storeLocalFirst(data: any) {
    try {
      await this.storage.set(this.expensekey, data);
    } catch (error) {
      console.log('fail to save data');
    }
  }

  async getLocalStorageFirst() {
    try {
      const data = await this.storage.get(this.expensekey);
      const result = data ? data : [];
      return result;
    } catch (error) {
      console.log('Fail to load');
    }
  }


  // predict expense
  predictExpense() {
    const url = `${this.settings.API_BASE_URL}/budget/predict`;
    return lastValueFrom(
      this.http.get(url)
    );
  }}
