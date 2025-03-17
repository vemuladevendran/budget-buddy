import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expenses-list',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ExpensesListComponent  implements OnInit {
 @Input() expenseList:any = [];
  constructor() { }

  ngOnInit() {}

}
