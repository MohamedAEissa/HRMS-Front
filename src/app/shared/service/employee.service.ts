import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interface/employee';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly baseUrl = `${environment.baseUrl}/employees`;

  constructor(private _HttpClient: HttpClient) { }

  getEmployee(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  deleteEmployee(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }

  createEmployee(body: Employee): Observable<any> {
    return this._HttpClient.post(this.baseUrl, body);
  }

  updateEmployee(id: string, body: Employee): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, body);
  }

  getMyData(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}/me`);
  }
}