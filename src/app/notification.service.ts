import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  addPushSubscriber(sub): Observable<boolean> {
    return this.httpClient.post<boolean>('http://localhost:3000/api/notification', sub);
  }
}
