import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';

@Component({
  selector: 'app-creat-acc-for-emp',
  templateUrl: './creat-acc-for-emp.component.html',
  styleUrls: ['./creat-acc-for-emp.component.css']
})
export class CreatAccForEmpComponent {
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private _AuthService: AuthServiceService) { }

  createAcc: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, [Validators.required]),
    role: new FormControl('Employee', [Validators.required])})
  // }, { validators: this.passwordMatchValidator });

 
  // passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  //   const password = control.get('password')?.value;
  //   const confirmPassword = control.get('confirmPassword')?.value;
  //   return password && confirmPassword && password !== confirmPassword 
  //     ? { passwordMismatch: true } 
  //     : null;
  // }

  onSubmit(): void {
    if (this.createAcc.invalid) 
      return;
    

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this._AuthService.createAccount(this.createAcc.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = response.message || 'Account created successfully!';
          this.createAcc.reset({ role: 'Employee' }); 
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to create account. Please try again.';
        console.error('Error creating account:', error);
      }
    });
  }
}