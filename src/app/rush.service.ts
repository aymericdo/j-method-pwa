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

  addRush(startDate: string, endDate: string, isDayRevision: boolean, maxCoursesNumber: number): Observable<boolean> {
    return this.httpClient.post<boolean>(`${this.server}/api/rush`, { startDate, endDate, isDayRevision, maxCoursesNumber });
  }

  getRush(): Observable<{ rush: Rush, isLoadingRush: boolean }> {
    return this.httpClient.get<{ rush: Rush, isLoadingRush: boolean }>(`${this.server}/api/rush`);
  }

  deleteRush(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/rush`);
  }
}
