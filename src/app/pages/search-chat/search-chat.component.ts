import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ChatService } from 'src/app/services/chat/chat.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { TokenService } from 'src/app/services/token/token.service';
import { ExpensesListComponent } from '../../common-components/expenses-list/expenses-list.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-chat',
  templateUrl: './search-chat.component.html',
  styleUrls: ['./search-chat.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    CommonModule,
    ExpensesListComponent,
    ReactiveFormsModule,
  ],
})
export class SearchChatComponent implements OnInit, AfterViewChecked {
  chatData: any = [];
  loaderCtrl = inject(LoaderService);
  chatCtrl = inject(ChatService);
  private tokenCtrl = inject(TokenService);
  userSummaryData: any;
  queryText = new FormControl('');
  @ViewChild('chatContainer') chatContainer: ElementRef | any;

  async getChatDetails(): Promise<void> {
    try {
      await this.loaderCtrl.showLoading();
      this.chatData = await this.chatCtrl.getChat();
      console.log(this.chatData, '=============');
    } catch (error) {
      console.log('fial to load');
    } finally {
      await this.loaderCtrl.hideLoading();
    }
  }

  async getUserSummaryData(): Promise<void> {
    try {
      const data = await this.tokenCtrl.getUserSummary();
      this.userSummaryData = data;
    } catch (error) {
      console.log(error, 'Fail to get user data');
    }
  }

  // query data

  async queryExpenseData(): Promise<void> {
    try {
      if (this.queryText.value === '') return;
      const data = {
        data: this.queryText.value,
      };
      const result = await this.chatCtrl.querySystem(data);
      this.chatData.push(result);
      this.queryText.setValue('');
      this.scrollToBottom();
    } catch (error) {
      console.log(error, 'Fail to query');
    } finally {
      await this.loaderCtrl.hideLoading();
    }
  }

  scrollToBottom(): void {
    try {
      // this.chatContainer.nativeElement.scrollTop =
      //   this.chatContainer.nativeElement.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  ngOnInit() {
    this.getChatDetails();
    // this.scrollToBottom();
  }

  submitQuery() {
    this.queryExpenseData();
  }

  ngAfterViewChecked() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 3000);
  }
}
