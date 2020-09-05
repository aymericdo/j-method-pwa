import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable()
export class EmailInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const email = localStorage.getItem('email');

    request = request.clone({
      setHeaders: {
        email,
        now: moment().format(),
      }
    });
    return next.handle(request);
  }
}
