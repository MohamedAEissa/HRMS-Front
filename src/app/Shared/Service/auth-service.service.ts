import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateAccount } from '../interface/create-account';
import { Account } from '../interface/account';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private  _HttpClient:HttpClient,private _Router:Router) { }

  setLogin(userData:object):Observable<any>{
    return this._HttpClient.post('https://localhost:7126/api/auth/login',userData)
  }

  createAccount(userData: CreateAccount):Observable<any>{
    return this._HttpClient.post('https://localhost:7126/api/auth/create-account',userData)
  }

    logOut():void{
    localStorage.removeItem('eToken');
    this._Router.navigate(['/login'])
  }

  getAllAccounts():Observable<any>{
    return this._HttpClient.get(`https://localhost:7126/api/auth/accounts`)
  }

  deleteAccount(id:string):Observable<any>{
    return this._HttpClient.delete(`https://localhost:7126/api/auth/accounts/${id}`)
  }

  editAccount(id:string,data:Account):Observable<any>{
    return this._HttpClient.put(` https://localhost:7126/api/auth/accounts/${id}`,data)
  }

getUserRole(): string | null {
  const token = localStorage.getItem('eToken');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    
   
    const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] 
              || decoded['role'] 
              || decoded['Role'];

    return role || null;
  } catch (error) {
    return null;
  }
}

}




