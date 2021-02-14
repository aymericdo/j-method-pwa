import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  postSignIn(code: string): Observable<string> {
    return this.httpClient.post<string>(`${this.server}/api/sign-in`, { code });
  }

  refreshToken(): Observable<string> {
    return this.httpClient.get<string>(`${this.server}/api/refresh-token`);
  }

  getLogin(): Observable<string> {
    return this.httpClient.get<string>(`${this.server}/api/login`);
  }
}
