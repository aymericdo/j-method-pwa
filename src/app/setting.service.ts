import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Weekend } from './list-classes/weekend-dialog/weekend-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  postSettings(settings: Weekend): Observable<Weekend> {
    return this.httpClient.post<Weekend>(`${this.server}/api/settings`, settings);
  }

  getSettings(): Observable<{ settings: Weekend, isLoadingSetting: boolean }> {
    return this.httpClient.get<{ settings: Weekend, isLoadingSetting: boolean }>(`${this.server}/api/settings`);
  }

  deleteWeekEndRevisions(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/settings/we-revisions`);
  }

  fixCourses(): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.server}/api/fix-courses`);
  }
}
