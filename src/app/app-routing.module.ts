import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// استيراد الـ Layouts
import { BlankLayoutComponent } from './Components/blank-layout/blank-layout.component';
import { AuthLAyoutComponent } from './Components/auth-layout/auth-layout.component';

// استيراد الـ Components العامة والصفحة الرئيسية
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { LoginComponent } from './Components/login/login.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';

// استيراد الشاشات الرئيسية لكل دور
import { adminHomeComponent } from './Components/admin-home/admin-home.component';
import { EmployeeHomeComponent } from './Components/employee-home/employee-home.component';

// استيراد الشاشات الإدارية والمشتركة
import { EmployeeComponent } from './Components/employee/employee.component';
import { DepartmentComponent } from './Components/department/department.component';
import { GeneralsettingComponent } from './Components/generalsetting/generalsetting.component';
import { OfficialHolidayComponent } from './Components/official-holiday/official-holiday.component';
import { CreatAccForEmpComponent } from './Components/creat-acc-for-emp/creat-acc-for-emp.component';
import { AccountMangementComponent } from './Components/account-mangement/account-mangement.component';
import { RolesComponent } from './Components/roles/roles.component';
import { SalaryReportComponent } from './Components/salary-report/salary-report.component';
import { AttendanceComponent } from './Components/attendance/attendance.component';


import { authGuardGuard } from './shared/guards/auth-guard.guard';
import { roleGuard } from './shared/guards/role.guard';

const routes: Routes = [
 
  { path: '', redirectTo: 'landingpage', pathMatch: 'full' },
  { path: 'landingpage', component: LandingPageComponent },


  {
    path: '',
    component: AuthLAyoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },


  {
    path: '',
    canActivate: [authGuardGuard],
    component: BlankLayoutComponent,
    children: [
    
      { 
        path: 'admin-home', 
        component: adminHomeComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },

   
      { 
        path: 'employee-home', 
        component: EmployeeHomeComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['Employee'] } 
      },

     
      { path: 'attendance', component: AttendanceComponent },
      { path: 'salaryReport', component: SalaryReportComponent },

  
      { 
        path: 'employees', 
        component: EmployeeComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },
      { 
        path: 'departments', 
        component: DepartmentComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      }, 
      { 
        path: 'generalSetting', 
        component: GeneralsettingComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },
      { 
        path: 'officialHoliday', 
        component: OfficialHolidayComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },
      { 
        path: 'createAccount', 
        component: CreatAccForEmpComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },
      { 
        path: 'accounMangement', 
        component: AccountMangementComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      },
      { 
        path: 'role', 
        component: RolesComponent, 
        canActivate: [roleGuard], 
        data: { roles: ['HR', 'Admin'] } 
      }
    ]
  },

 
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }