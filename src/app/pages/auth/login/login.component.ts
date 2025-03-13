import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class LoginComponent implements OnInit {
  showPassword = false;

  constructor() {}

  toggelShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {}
}
