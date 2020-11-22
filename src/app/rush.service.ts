import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rush } from './list-classes/list-classes.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: `root`
})
export class RushService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  addRush(rush: Rush): Observable<Rush> {
    return this.httpClient.post<Rush>(`${this.server}/api/rush`, rush);
  }

  getRush(): Observable<Rush> {
    return this.httpClient.get<Rush>(`${this.server}/api/rush`);
  }

  deleteRush(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/rush`);
  }
}
