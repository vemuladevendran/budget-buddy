import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { Observable, from, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private tokenServ: TokenService,
    private auth: AuthService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.tokenServ.getToken()).pipe(
      switchMap(token => {
        if (token) {
          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          req = req.clone({ headers });
        }
        return next.handle(req);
      }),
      catchError(error => {
        if (error.status === 401) {
          this.auth.logout();
        }
        if (error.status === 403) {
          console.warn('You cannot access this resource');
        }
        return throwError(error);
      })
    );
  }
}
