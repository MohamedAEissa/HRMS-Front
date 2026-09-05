import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CreateAccount } from '../interface/create-account';

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
}
