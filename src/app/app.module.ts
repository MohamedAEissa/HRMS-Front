import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Components/home/home.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
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
    SalaryReportComponent
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
