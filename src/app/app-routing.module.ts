import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// استيراد الـ Layouts
import { BlankLayoutComponent } from './components/blank-layout/blank-layout.component';
import { AuthLAyoutComponent } from './components/auth-layout/auth-layout.component';

// استيراد الـ Components العامة والصفحة الرئيسية
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';

// استيراد الشاشات الرئيسية لكل دور
import { adminHomeComponent } from './components/admin-home/admin-home.component';
import { EmployeeHomeComponent } from './components/employee-home/employee-home.component';

// استيراد الشاشات الإدارية والمشتركة
import { EmployeeComponent } from './components/employee/employee.component';
import { DepartmentComponent } from './components/department/department.component';
import { GeneralsettingComponent } from './components/generalsetting/generalsetting.component';
import { OfficialHolidayComponent } from './components/official-holiday/official-holiday.component';
import { CreatAccForEmpComponent } from './components/creat-acc-for-emp/creat-acc-for-emp.component';
import { AccountMangementComponent } from './components/account-mangement/account-mangement.component';
import { RolesComponent } from './components/roles/roles.component';
import { SalaryReportComponent } from './components/salary-report/salary-report.component';
import { AttendanceComponent } from './components/attendance/attendance.component';


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