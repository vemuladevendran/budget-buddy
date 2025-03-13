import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

// Define the auth guard as a function
export const authGuard: CanMatchFn = async (route, segments) => {
  const auth = inject(AuthService) // If not injected, you'll have to instantiate it manually
  const router = new Router();    // Same for Router, you might use DI if in a service

  // Non-login only routes
  const nonLoginOnlyRoutes = ['login'];

  // Check if the user is logged in
  const isLoggedIn = await auth.isLoggedIn();
  // Check if the route is in the list of non-login-only routes
  const isGoingToNonLoginPage = nonLoginOnlyRoutes.some(r => route.path === r);

  // Allow navigation if:
  // - Not logged in and navigating to a non-login route (e.g., login page)
  // - Logged in and not trying to navigate to a non-login route
  if (!isLoggedIn && isGoingToNonLoginPage) {
    return true;
  }

  if (isLoggedIn && !isGoingToNonLoginPage) {
    return true;
  }

  // Redirect if logged in but trying to go to a non-login page (like login)
  if (isLoggedIn && isGoingToNonLoginPage) {
    router.navigate(['/home']);
    return false;
  }

  // Otherwise, redirect to login page
  router.navigate(['/login']);
  return false;
};
