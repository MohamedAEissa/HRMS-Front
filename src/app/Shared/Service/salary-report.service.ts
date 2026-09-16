import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaryReport } from '../interface/salary-report';
import { SalaryReportFiler } from '../interface/salary-report-filer';

@Injectable({
  providedIn: 'root'
})
export class SalaryReportService {

  constructor(private _HttpClient: HttpClient) { }

  private buildParams(filter?:SalaryReportFiler):HttpParams{
    let params=new HttpParams();

    if(filter){
      if (filter.employeeId) params = params.set('EmployeeId', filter.employeeId);
      if (filter.employeeName) params = params.set('EmployeeName', filter.employeeName);
      if (filter.departmentId) params = params.set('DepartmentId', filter.departmentId);
      if (filter.departmentName) params = params.set('DepartmentName', filter.departmentName);
      if (filter.month) params = params.set('Month', filter.month.toString());
      if (filter.year) params = params.set('Year', filter.year.toString());
    }
    return params;
  }

  getSalaryReport(filter?:SalaryReportFiler): Observable<any> {
   const params=this.buildParams(filter);
    return this._HttpClient.get<any>(`https://localhost:7126/api/salary-reports`,{params});
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

  getSRForCurrentUser(filter?:SalaryReportFiler):Observable<any>{
    const params = this.buildParams(filter);
    return this._HttpClient.get(`https://localhost:7126/api/salary-reports/me`,{params})
  }
  
}
