import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OfficialHolidays } from '../interface/offical-holidays';

@Injectable({
  providedIn: 'root'
})
export class OfficialHolidaysService {

  constructor(private _HttpClient:HttpClient) { }

  getOfficialHolidays():Observable<any>{
    return this._HttpClient.get("https://localhost:7126/api/official-holidays");
  }

  createOfficialHoliday(data:OfficialHolidays):Observable<any>{
    return this._HttpClient.post("https://localhost:7126/api/official-holidays",data);
  }

  deleteOfficialHoliday(id:string):Observable<any>{
    return this._HttpClient.delete(`https://localhost:7126/api/official-holidays/api/official-holidays/${id}`);
  }
}
