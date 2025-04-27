import { CommonModule } from '@angular/common';
import { inject, Input, OnInit, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  AlertController, // Import AlertController for error messages
} from '@ionic/angular/standalone';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-calculate-keyboard',
  templateUrl: './calculate-keyboard.component.html',
  styleUrls: ['./calculate-keyboard.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
  ],
})
export class CalculateKeyboardComponent implements OnInit {
  @Input() expenseData: any;
  @Input() isUpdate = false;

  noteInput: string = '';
  totalAmount: number = 0; // Stores the final calculated amount.
  currentInput: string = ''; // Stores the current input string for calculations.
  isCalculated: boolean = true; // Flag to indicate if a calculation has been performed (initially true for tick display).
  calculationResult: string = ''; // Displays the current input or result of calculation.
  operator: string = ''; // Stores the current operator (+, -, X, ÷).
  numbers: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0]; // Array of numbers and decimal point for the keypad.
  operators: string[] = ['+', '-', 'X', '÷']; // Array of operators for the keypad.
  dateopen = false; // Flag to control the display of the date picker modal.
  paymentType = new FormControl('Online');
  description = new FormControl('');
  today: any = new Date().toISOString;
  selectedDate: any = new Date().toISOString; // Stores the selected date (initially today's date).
  tokenCtrl = inject(TokenService); // Injects the TokenService for user data.
  userSummaryData: any; // Stores user summary data from TokenService.
  @Output() expenseTotalData = new EventEmitter<any>(); // Emits the expense data.
  @ViewChild('descriptionInput') descriptionInput!: ElementRef; // Reference to the description input element.
  isDescriptionInputIsFocus: Boolean = false; // Flag to track if the description input is focused.

  constructor(private alertController: AlertController) {} // Inject AlertController for error messages.

  addToInput(number: number | string) {
    if (this.isCalculated) {
      this.currentInput = ''; // Clear input if a calculation was just done.
      this.isCalculated = false; // Set to false to show equal sign after first number.
    }
    this.currentInput += number; // Append the number to the current input.
    this.calculationResult = this.currentInput; // Update the displayed calculation result.
  }

  addOperator(operator: string) {
    if (this.currentInput) {
      this.operator = operator; // Store the selected operator.
      this.currentInput += operator; // Append the operator to the current input.
      this.calculationResult = this.currentInput; // Update the displayed calculation result.
      this.isCalculated = false; // Change to equal sign when operator is added.
    }
  }

  clearInput() {
    this.currentInput = ''; // Clear the current input.
    this.isCalculated = true; // Change back to tick when cleared.
    this.calculationResult = ''; // Clear the displayed result.
    this.totalAmount = 0; // Reset the total amount.
  }

  calculateResult() {
    if (this.currentInput) {
      const expression = this.currentInput
        .replace(/X/g, '*') // Replace 'X' with '*' for evaluation.
        .replace(/÷/g, '/'); // Replace '÷' with '/' for evaluation.
      try {
        this.totalAmount = eval(expression); // Evaluate the expression.
        this.isCalculated = true; // Change to tick after calculation.
        this.calculationResult = this.totalAmount.toString(); // Display the result.
        this.currentInput = ''; // Clear the input for the next calculation.
      } catch (error) {
        this.totalAmount = 0; // Reset total amount on error.
        this.calculationResult = 'Error'; // Display error message.
        this.isCalculated = false; // Keep equal sign on error.
      }
    }
  }

  getCurrentDate() {
    return new Date().toISOString; // Get today's date in YYYY-MM-DD format.
  }

  onDateChange(event: any) {
    this.selectedDate = new Date(event.target.value); // Update selected date from date picker.
  }

  async submit() {
    if (this.totalAmount === 0) {
      const alert = await this.alertController.create({
        // Create an alert message.
        header: 'Error',
        message: 'Please enter an amount.',
        buttons: ['OK'],
      });
      await alert.present(); // Display the alert.
      return; // Stop submission if amount is zero.
    }

    const data = {
      // Create the expense data object.
      amount: this.totalAmount,
      description: this.description.value,
      expense_date: this.selectedDate,
      payment_type: this.paymentType.value,
    };
    this.expenseTotalData.emit(data); // Emit the expense data.
  }

  setDescriptionInputFocus(value: Boolean) {
    this.isDescriptionInputIsFocus = value; // Update focus state of description input.
  }

  closeKeypad() {
    this.descriptionInput.nativeElement.blur(); // Remove focus from description input, closing keypad.
  }

  async getUserSummaryData(): Promise<void> {
    try {
      const data = await this.tokenCtrl.getUserSummary(); // Get user summary data.
      this.userSummaryData = data; // Store the data.
    } catch (error) {
      console.log(error, 'Fail to get user data'); // Log error if fetching data fails.
    }
  }

  setEditData() {
    if (this.isUpdate) {
      
      console.log(this.expenseData, '======check====', this.isUpdate);

      this.description.setValue(this.expenseData?.description);
      this.paymentType.setValue(this.expenseData?.payment_type);
      this.selectedDate = this.expenseData?.expense_date;
      this.totalAmount = this.expenseData?.amount;
    }
  }

  ngOnInit(): void {
    this.getUserSummaryData(); // Fetch user summary data on component initialization.
    this.setEditData();
  }
}
