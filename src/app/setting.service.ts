import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Settings } from './settings/settings.component';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  server = environment.server;

  constructor(
    private httpClient: HttpClient,
  ) { }

  postSettings(settings: Settings): Observable<Settings> {
    return this.httpClient.post<Settings>(`${this.server}/api/settings`, settings);
  }

  getSettings(): Observable<{ settings: Settings, isLoadingSetting: boolean }> {
    return this.httpClient.get<{ settings: Settings, isLoadingSetting: boolean }>(`${this.server}/api/settings`);
  }

  deleteWeekEndRevisions(): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.server}/api/settings/we-revisions`);
  }
}
