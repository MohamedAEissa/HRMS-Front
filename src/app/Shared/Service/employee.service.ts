import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interface/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private _HttpClient:HttpClient) { }

  getEmployee():Observable<any>{
    return this._HttpClient.get(`https://localhost:7126/api/employees`)
  }

  deleteEmployee(id:string):Observable<any>{
    return this._HttpClient.delete(`https://localhost:7126/api/employees/${id}`)
  }

  createEmployee(body:Employee):Observable<any>{
    return this._HttpClient.post(`https://localhost:7126/api/employees`,body)
  }

  updateEmployee(id:string,body:Employee):Observable<any>{
    return this._HttpClient.put(`https://localhost:7126/api/employees/${id}`,body)
  }

  getMyData():Observable<any>{
    return  this._HttpClient.get(`https://localhost:7126/api/employees/me`)
  }
}
