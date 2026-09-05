import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';

@Component({
  selector: 'app-nav-blank',
  templateUrl: './nav-blank.component.html',
  styleUrls: ['./nav-blank.component.css']
})
export class NavBlankComponent {
constructor(private _AuthService:AuthServiceService){}
   logOutUser():void{
      this._AuthService.logOut();
  }
}
