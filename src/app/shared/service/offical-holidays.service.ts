import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OfficialHolidays } from '../interface/offical-holidays';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficialHolidaysService {

  private readonly baseUrl = `${environment.baseUrl}/official-holidays`;

  constructor(private _HttpClient: HttpClient) { }

  getOfficialHolidays(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  createOfficialHoliday(data: OfficialHolidays): Observable<any> {
    return this._HttpClient.post(this.baseUrl, data);
  }

  deleteOfficialHoliday(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }
}