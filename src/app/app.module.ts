import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { adminHomeComponent } from './Components/admin-home/admin-home.component';
import { FooterComponent } from './Components/footer/footer.component';
import { LoginComponent } from './Components/login/login.component';
import { CreatAccForEmpComponent } from './Components/creat-acc-for-emp/creat-acc-for-emp.component';
import { NotfoundComponent } from './Components/notfound/notfound.component';
import { AuthLAyoutComponent } from './Components/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './Components/blank-layout/blank-layout.component';
import { NavAuthComponent } from './Components/nav-auth/nav-auth.component';
import { NavBlankComponent } from './Components/nav-blank/nav-blank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from './Components/department/department.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { GeneralsettingComponent } from './Components/generalsetting/generalsetting.component';
import { AttendanceComponent } from './Components/attendance/attendance.component';
import { OfficialHolidayComponent } from './Components/official-holiday/official-holiday.component';
import { SalaryReportComponent } from './Components/salary-report/salary-report.component';
import { JwtInterceptor } from './Shared/jwt.interceptor';
import { AccountMangementComponent } from './Components/account-mangement/account-mangement.component';
import { RolesComponent } from './Components/roles/roles.component';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';
import { EmployeeHomeComponent } from './Components/employee-home/employee-home.component';

@NgModule({
  declarations: [
    AppComponent,
    adminHomeComponent,
    FooterComponent,
    LoginComponent,
    CreatAccForEmpComponent,
    NotfoundComponent,
    AuthLAyoutComponent,
    BlankLayoutComponent,
    NavAuthComponent,
    NavBlankComponent,
    DepartmentComponent,
    EmployeeComponent,
    GeneralsettingComponent,
    AttendanceComponent,
    OfficialHolidayComponent,
    SalaryReportComponent,
    AccountMangementComponent,
    RolesComponent,
    LandingPageComponent,
    EmployeeHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
