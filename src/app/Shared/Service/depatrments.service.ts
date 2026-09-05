import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../interface/department';

@Injectable({
  providedIn: 'root'
})
export class DepatrmentsService {

  constructor(private _HttpClient:HttpClient) { }

  getDepartment():Observable<any>{
   return this._HttpClient.get(`https://localhost:7126/api/departments`);
  }

  deleteDepartment(id:string):Observable<any>{
    return this._HttpClient.delete(`https://localhost:7126/api/departments/${id}`)
  }

  createDepartment(body:Department):Observable<any>{
    return this._HttpClient.post(`https://localhost:7126/api/departments`,body)
  }

  updateDepartment(id:string,body:any):Observable<any>{
    return this._HttpClient.put(`https://localhost:7126/api/departments/${id}`,body)
  }
}
