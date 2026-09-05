import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankLayoutComponent } from './Components/blank-layout/blank-layout.component';
import { AuthLAyoutComponent } from './Components/auth-layout/auth-layout.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { DepartmentComponent } from './Components/department/department.component';
import { GeneralsettingComponent } from './Components/generalsetting/generalsetting.component';
import { CreatAccForEmpComponent } from './Components/creat-acc-for-emp/creat-acc-for-emp.component';
import { OfficialHolidayComponent } from './Components/official-holiday/official-holiday.component';
import { SalaryReportComponent } from './Components/salary-report/salary-report.component';
import { AttendanceComponent } from './Components/attendance/attendance.component';
import { authGuardGuard } from './Shared/Guards/auth-guard.guard';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    canActivate: [authGuardGuard],
    component: BlankLayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'employees', component: EmployeeComponent },
      { path: 'departments', component: DepartmentComponent }, 
      { path: 'generalSetting', component: GeneralsettingComponent },
      { path: 'officialHoliday', component: OfficialHolidayComponent },
      { path: 'salaryReport', component: SalaryReportComponent },
      { path: 'createAccount', component: CreatAccForEmpComponent },
      { path: 'attendance', component: AttendanceComponent },
    ]
  },
  {
    path: '',
    component: AuthLAyoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }