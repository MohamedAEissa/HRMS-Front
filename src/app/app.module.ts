import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { adminHomeComponent } from './components/admin-home/admin-home.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { CreatAccForEmpComponent } from './components/creat-acc-for-emp/creat-acc-for-emp.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthLAyoutComponent } from './components/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './components/blank-layout/blank-layout.component';
import { NavAuthComponent } from './components/nav-auth/nav-auth.component';
import { NavBlankComponent } from './components/nav-blank/nav-blank.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentComponent } from './components/department/department.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { GeneralsettingComponent } from './components/generalsetting/generalsetting.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { OfficialHolidayComponent } from './components/official-holiday/official-holiday.component';
import { SalaryReportComponent } from './components/salary-report/salary-report.component';
import { JwtInterceptor } from './shared/jwt.interceptor';
import { AccountMangementComponent } from './components/account-mangement/account-mangement.component';
import { RolesComponent } from './components/roles/roles.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { EmployeeHomeComponent } from './components/employee-home/employee-home.component';

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
