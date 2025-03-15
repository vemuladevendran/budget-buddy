import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  nonLoginOnlyRoutes = ['login', 'signup'];

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // console.log(route);
    const isLoggedIn = await this.authService.isLoggedIn();
    const isGoingToNonLoginPage = this.nonLoginOnlyRoutes.some(
      (r) => route.routeConfig?.path === r
    );

    if (!isLoggedIn && isGoingToNonLoginPage) {
      return true;
    }

    if (isLoggedIn && !isGoingToNonLoginPage) {
      return true;
    }

    if (isLoggedIn && isGoingToNonLoginPage) {
      this.router.navigate(['/home']);
      return false;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
