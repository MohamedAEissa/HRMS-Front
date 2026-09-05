import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralSetting } from '../interface/general-setting';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingService {

  constructor(private _HttpClient: HttpClient) { }

  getGeneralSetting():Observable<any> {
    return this._HttpClient.get('https://localhost:7126/api/general-settings');
  }

  updateGeneralSetting(data:GeneralSetting):Observable<any> {
    return this._HttpClient.put('https://localhost:7126/api/general-settings', data);
  }
}
