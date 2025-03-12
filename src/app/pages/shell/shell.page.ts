import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.page.html',
  styleUrls: ['./shell.page.scss'],
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ShellPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
