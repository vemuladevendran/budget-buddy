import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellPage } from './shell.page';
import { HomePage } from '../home/home.page';
import { ProfilePage } from '../profile/profile.page';
import { SearchChatComponent } from '../search-chat/search-chat.component';

const routes: Routes = [
  {
    path: '',
    component: ShellPage,
    children: [
      { path: 'home', component: HomePage },
      { path: 'chat', component: SearchChatComponent },
      { path: 'profile', component: ProfilePage },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellPageRoutingModule {}
