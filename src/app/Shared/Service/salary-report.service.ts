import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaryReport } from '../interface/salary-report';

@Injectable({
  providedIn: 'root'
})
export class SalaryReportService {

  constructor(private _HttpClient: HttpClient) { }


  getSalaryReport(): Observable<any> {
    return this._HttpClient.get<any>(`https://localhost:7126/api/salary-reports`);
  }

  createSalaryReport(salaryReport: SalaryReport): Observable<any> {
    return this._HttpClient.post<any>(`https://localhost:7126/api/salary-reports`, salaryReport);
  }

  updateSalaryReport(salaryReport: SalaryReport ,id: string): Observable<any> {
    return this._HttpClient.put<any>(`https://localhost:7126/api/salary-reports/${id}`, salaryReport);
  }

  deleteSalaryReport(id: string): Observable<void> {
    return this._HttpClient.delete<void>(`https://localhost:7126/api/salary-reports/${id}`);
  }
}
