import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShellPage } from './shell.page';
import { HomePage } from '../home/home.page';

const routes: Routes = [
  { 
    path: '', 
    component: ShellPage,
    children: [
      { path: 'home', component: HomePage },
      // { path: 'expenses', loadChildren: () => import('../expenses/expenses.module').then(m => m.ExpensesPageModule) },
      // { path: 'accounts', loadChildren: () => import('../accounts/accounts.module').then(m => m.AccountsPageModule) },
      // { path: 'profile', loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule) },
      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShellPageRoutingModule {}
