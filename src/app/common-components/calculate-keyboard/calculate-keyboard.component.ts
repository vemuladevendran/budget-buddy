import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonContent,IonDatetime, IonDatetimeButton, IonModal } from '@ionic/angular/standalone';

@Component({
  selector: 'app-calculate-keyboard',
  templateUrl: './calculate-keyboard.component.html',
  styleUrls: ['./calculate-keyboard.component.scss'],
  imports: [CommonModule, IonContent, ReactiveFormsModule,IonDatetime, IonDatetimeButton, IonModal],
})
export class CalculateKeyboardComponent {
  noteInput: string = ''; // This holds the note input
  totalAmount: number = 0; // This will be displayed when no operation is done
  currentInput: string = ''; // Holds the current input for calculations
  isCalculated: boolean = false; // Flag to check if calculation is completed
  calculationResult: string = ''; // The result of the ongoing calculation
  operator: string = ''; // Current operator (+, -, X, ÷)
  numbers: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0]; // Number pad
  operators: string[] = ['+', '-', 'X', '÷']; // Operations

  paymentType = new FormControl('Card')
  description = new FormControl('');
  today: string = new Date().toISOString().slice(0, 10);
  selectedDate: any = new Date();
  @Output() expenseTotalData = new EventEmitter<any>();

  // Method to add numbers to the current input for calculations
  addToInput(number: number | string) {
    if (this.isCalculated) {
      this.currentInput = ''; // Reset input after calculation
      this.isCalculated = false;
    }
    this.currentInput += number;
    this.calculationResult = this.currentInput; // Show the calculation in progress
  }

  // Method to add operators to the input
  addOperator(operator: string) {
    if (this.currentInput && !this.isCalculated) {
      this.currentInput += operator;
      this.calculationResult = this.currentInput; // Show updated input with operator
    }
  }

  // Method to clear the current input
  clearInput() {
    this.currentInput = '';
    this.isCalculated = false;
    this.calculationResult = '';
    this.totalAmount = 0;
  }

  // Method to calculate the result
  calculateResult() {
    if (this.currentInput) {
      // Replace operators with actual symbols for evaluation
      const expression = this.currentInput
        .replace(/X/g, '*')
        .replace(/÷/g, '/');
      try {
        // Evaluate the expression
        this.totalAmount = eval(expression);
        this.isCalculated = true; // Change = to ✔️ once calculation is done
        this.calculationResult = this.totalAmount.toString(); // Display the result
        this.currentInput = ''; // Reset input after calculation
      } catch (error) {
        this.totalAmount = 0;
        this.calculationResult = 'Error';
        this.isCalculated = false;
      }
    }
  }

  // on date change
  onDateChange(event: any) {
    this.selectedDate = new Date(event.target.value);
  }

  // Method to log the totalAmount when the tick icon is clicked
  submit() {
    const data = {
      amount: this.totalAmount,
      description: this.description.value,
      expense_date: this.selectedDate,
      payment_type: this.paymentType.value,
    };
    this.expenseTotalData.emit(data);
  }
}
