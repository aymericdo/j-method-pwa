import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from './list-classes/list-classes.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  postSub(sub): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.server}/api/notifications/sub`, sub);
  }

  addNotifications(notifications: Notification[]): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.server}/api/notifications`, notifications);
  }

  getNotifications(): Observable<Notification[]> {
    return this.httpClient.get<Notification[]>(`${this.server}/api/notifications`);
  }
}
