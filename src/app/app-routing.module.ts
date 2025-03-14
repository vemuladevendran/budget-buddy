import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'signup', loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupPageModule) },
  { path: '', loadChildren: () => import('./pages/shell/shell-routing.module').then(m => m.ShellPageRoutingModule) }, // Only import the routing module
  { path: '**', redirectTo: '', pathMatch: 'full' }
// Fallback to Shell
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
