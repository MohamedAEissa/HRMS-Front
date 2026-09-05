import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from '../interface/attendance';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private _HttpClient: HttpClient) { }


  getallAttendance() :Observable<any>{
    return this._HttpClient.get("https://localhost:7126/api/attendances");
  }

  addAttendance(data: any ) :Observable<any>{
    return this._HttpClient.post("https://localhost:7126/api/attendances", data);
  }

  updateAttendance(id: string, data: any):Observable<any>{
    return this._HttpClient.put(`https://localhost:7126/api/attendances/${id}`, data);
  }

  deleteAttendance(id: string):Observable<any> {
    return this._HttpClient.delete(`https://localhost:7126/api/attendances/${id}`);
  }

}
