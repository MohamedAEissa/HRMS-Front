import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from '../interface/attendance';
import { AttendanceFilter } from '../interface/attendance-filter';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private readonly baseUrl = 'https://localhost:7126/api/attendances';

  constructor(private _HttpClient: HttpClient) { }


  private buildParams(filter?: AttendanceFilter): HttpParams {
    let params = new HttpParams();

    if (filter) {
      if (filter.employeeId) params = params.set('EmployeeId', filter.employeeId);
      if (filter.employeeName) params = params.set('EmployeeName', filter.employeeName);
      if (filter.departmentId) params = params.set('DepartmentId', filter.departmentId);
      if (filter.departmentName) params = params.set('DepartmentName', filter.departmentName);
      if (filter.month) params = params.set('Month', filter.month.toString());
      if (filter.year) params = params.set('Year', filter.year.toString());
      if (filter.date) params = params.set('Date', filter.date);
      if (filter.fromDate) params = params.set('FromDate', filter.fromDate);
      if (filter.toDate) params = params.set('ToDate', filter.toDate);
    }

    return params;
  }

  getallAttendance(filter?: AttendanceFilter): Observable<any> {
    const params = this.buildParams(filter);
    return this._HttpClient.get(this.baseUrl, { params });
  }

  getCurrentUserAttendance(filter?: AttendanceFilter): Observable<any> {
    const params = this.buildParams(filter);
    return this._HttpClient.get(`${this.baseUrl}/me`, { params });
  }

  addAttendance(data: any): Observable<any> {
    return this._HttpClient.post(this.baseUrl, data);
  }

  updateAttendance(id: string, data: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, data);
  }

  deleteAttendance(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }
}