import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../interface/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private _HttpClient:HttpClient) { }

  getAllRoles():Observable<any>{
    return this._HttpClient.get(`https://localhost:7126/api/roles`)
  }

  createRole(body:Roles):Observable<any>{
    return this._HttpClient.post(`https://localhost:7126/api/roles`,body)
  }

  updateRole(id:string,body:Roles):Observable<any>{
    return this._HttpClient.put(`https://localhost:7126/api/roles/${id}`,body)
  }

  deleteRole(id:string):Observable<any>{
    return this._HttpClient.delete(`https://localhost:7126/api/roles/${id}`)
  }
}
