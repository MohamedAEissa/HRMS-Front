import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';

@Component({
  selector: 'app-nav-blank',
  templateUrl: './nav-blank.component.html',
  styleUrls: ['./nav-blank.component.css']
})
export class NavBlankComponent {

  constructor(private _AuthService: AuthServiceService) {}


  isAdminOrHR(): boolean {
    const role = this._AuthService.getUserRole();
    return role === 'Admin' || role === 'HR';
  }

  isEmployee(): boolean {
    const role = this._AuthService.getUserRole();
    return role === 'Employee';
  }

  // 3. تسجيل الخروج
  logOutUser(): void {
    this._AuthService.logOut();
  }

}