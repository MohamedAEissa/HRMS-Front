import { AuthServiceService } from '../../shared/service/auth-service.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private _AuthServiceService: AuthServiceService, private _Router: Router) {}

  isLoading: boolean = false;
  msgError: string = '';
  token: string = '';

  // متغيرات الـ Toast Notification
  showToast: boolean = false;
  toastMessage: string = '';

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  handelFormLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this._AuthServiceService.setLogin(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.success == true) {
            this.isLoading = false;
            this.token = response.data.accessToken;

            localStorage.setItem('eToken', this.token);

            const userRole = this._AuthServiceService.getUserRole();

            if (userRole === 'Admin' || userRole === 'HR') {
              this._Router.navigate(['/admin-home']);
            } else if (userRole === 'Employee') {
              this._Router.navigate(['/employee-home']);
            } else {
              this._Router.navigate(['/landingpage']);
            }
          }
        },
        error: (err) => {
          this.isLoading = false;

          if (err.error?.message) {
            this.msgError = err.error.message;
          } else if (typeof err.error === 'string') {
            this.msgError = err.error;
          } else {
            this.msgError = 'Email or password is incorrect.';
          }
        }
      });
    }
  }

 
  copyToClipboard(text: string, label: string, event: MouseEvent): void {
    navigator.clipboard.writeText(text).then(() => {
      const button = event.currentTarget as HTMLElement;
      const icon = button.querySelector('i');

      // 1. إضافة تأثير الضغط وتغيير شكل الأيقونة لصح
      button.classList.add('copied-active');
      if (icon) {
        icon.className = 'fa-solid fa-check text-success fs-6';
      }

    
      this.toastMessage = label;
      this.showToast = true;

  
      setTimeout(() => {
        button.classList.remove('copied-active');
        if (icon) {
          icon.className = 'fa-regular fa-copy';
        }
        this.showToast = false;
      }, 1800);

    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
}