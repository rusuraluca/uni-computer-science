import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginService } from '../services/login.service';
import { first, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService: LoginService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let token: string | null = this.loginService.latest_user();
    if(token != null) {
      request = request.clone({setHeaders: {'Authorization': 'Bearer ' + token}});
    }
    return next.handle(request).pipe(
      catchError(err => {
        if(err instanceof HttpErrorResponse) {
          if(err.status == HttpStatusCode.Unauthorized) {
            this.router.navigate(["/login"]);
          }
        }
        return throwError(() => err);
      })
    )
  }
}
