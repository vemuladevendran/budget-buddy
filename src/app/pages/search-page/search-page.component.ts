import { Component, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  standalone: true,
  imports: [IonContent]
})
export class SearchPageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
