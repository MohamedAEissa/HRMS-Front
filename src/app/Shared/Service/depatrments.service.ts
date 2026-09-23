import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../interface/department';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepatrmentsService {

  private readonly baseUrl = `${environment.baseUrl}/departments`;

  constructor(private _HttpClient: HttpClient) { }

  getDepartment(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  deleteDepartment(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }

  createDepartment(body: Department): Observable<any> {
    return this._HttpClient.post(this.baseUrl, body);
  }

  updateDepartment(id: string, body: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, body);
  }
}