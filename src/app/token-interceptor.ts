import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import * as moment from 'moment';
import { catchError } from 'rxjs/internal/operators/catchError';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { switchMap, filter, take, map } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.fillHeader(request)

    return next.handle(request)
      .pipe(
        catchError((err) => {
          if (err.status === 403) {
            if (err.error.name === "TokenExpiredError") {
              if (!this.refreshTokenInProgress) {
                this.refreshTokenInProgress = true;
                this.refreshTokenSubject.next(null);
                return this.loginService.refreshToken()
                  .pipe(switchMap((accessToken: string) => {
                    localStorage.setItem('token', accessToken);
                    this.refreshTokenInProgress = false;
                    this.refreshTokenSubject.next(accessToken);
                    return next.handle(this.fillHeader(request));
                  }));
              } else {
                return this.refreshTokenSubject.pipe(
                  filter(result => result !== null),
                  take(1),
                  switchMap((res) => {
                    return next.handle(this.fillHeader(request))
                  }),
                )
              }
            } else if (err.error.name === 'TokenRevokedError') {
              localStorage.removeItem('token')
              this.router.navigateByUrl('/login')
            } else {
              throw throwError(err)
            }
          }

          throw throwError(err)
        }),
      );
  }

  private fillHeader(request) {
    const token = localStorage.getItem('token');

    const header = {
      now: moment().format(),
    }

    if (token) {
      header['token'] = token;
    }

    return request.clone({
      setHeaders: header
    });
  }
}
