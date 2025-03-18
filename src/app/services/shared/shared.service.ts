import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private addExpensesModalClosedSource = new Subject<any>();

  addExpenseModalClosed$ = this.addExpensesModalClosedSource.asObservable();

  notifyAddExpenseModalClosed(data: any) {
    this.addExpensesModalClosedSource.next(data);
  }
}
