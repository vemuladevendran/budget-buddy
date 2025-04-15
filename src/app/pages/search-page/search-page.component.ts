import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconService } from 'src/app/services/icon/icon.service';
import { TokenService } from 'src/app/services/token/token.service';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    FormsModule,
    CommonModule,
    IonItem,
    IonAccordion,
    IonAccordionGroup,
    IonLabel,
    ReactiveFormsModule,
  ],
})
export class SearchPageComponent implements OnInit {
  showFilters = false;
  categoryList: any[] = [];
  userSummary: any;
  searchQuery = new FormControl();
  selectedGroup:any = [];
  selectedCategory:any = [];
  searchResults: any[] = [];


  private categoryCrtl = inject(IconService);
  private tokenCtrl = inject(TokenService);
  private loaderCtrl = inject(LoaderService)

  toggelFilters() {
    this.showFilters = !this.showFilters;
  }

  async getCategoryList(): Promise<void> {
    try {
      const data = await this.categoryCrtl.getIconsList();
      this.categoryList = data?.categoryIcons;
    } catch (error) {
      console.log(error);
    }
  }

  // get user summary details
  async getUserSummary(): Promise<void> {
    try {
      this.userSummary = await this.tokenCtrl.getUserSummary();
    } catch (error) {
      console.log(error);
    }
  }


  selectCategory(category: string) {
    const index = this.selectedCategory.indexOf(category);
    if (index > -1) {
      this.selectedCategory.splice(index, 1);
    } else {
      this.selectedCategory.push(category);
    }
  }

  selectGroup(group: string) {
    const index = this.selectedGroup.indexOf(group);
    if (index > -1) {
      this.selectedGroup.splice(index, 1);
    } else {
      this.selectedGroup.push(group);
    }
  }



  async search(): Promise<void>{
    try {
      const data = {
        searchText : this.searchQuery.value,
        expense_type: this.selectedCategory,
        group_name: this.selectedGroup,
      }
      console.log(data)
    } catch (error) {
      console.log(error);
      await this.loaderCtrl.hideLoading()
    }finally{
      await this.loaderCtrl.hideLoading()
    }
  }


  ngOnInit() {
    this.getCategoryList();
    this.getUserSummary();
  }
}
