import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralSetting } from '../interface/general-setting';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingService {

  private readonly baseUrl = `${environment.baseUrl}/general-settings`;

  constructor(private _HttpClient: HttpClient) { }

  getGeneralSetting(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  updateGeneralSetting(data: GeneralSetting): Observable<any> {
    return this._HttpClient.put(this.baseUrl, data);
  }
}