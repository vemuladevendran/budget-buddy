import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule) },
  // { path: 'signup', loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupPageModule) },
  { path: '', loadChildren: () => import('./pages/shell/shell-routing.module').then(m => m.ShellPageRoutingModule) }, // Only import the routing module
  { path: '**', redirectTo: '', pathMatch: 'full' } // Fallback to Shell
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
