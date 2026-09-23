import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../interface/roles';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly baseUrl = `${environment.baseUrl}/roles`;

  constructor(private _HttpClient: HttpClient) { }

  getAllRoles(): Observable<any> {
    return this._HttpClient.get(this.baseUrl);
  }

  createRole(body: Roles): Observable<any> {
    return this._HttpClient.post(this.baseUrl, body);
  }

  updateRole(id: string, body: Roles): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${id}`, body);
  }

  deleteRole(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`);
  }
}