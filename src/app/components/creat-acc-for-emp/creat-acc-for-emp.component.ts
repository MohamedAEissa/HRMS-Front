import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/interface/employee';
import { Roles } from 'src/app/shared/interface/roles';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { RolesService } from 'src/app/shared/service/roles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creat-acc-for-emp',
  templateUrl: './creat-acc-for-emp.component.html',
  styleUrls: ['./creat-acc-for-emp.component.css']
})
export class CreatAccForEmpComponent implements OnInit {

  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  roleList: Roles[] = [];
  empList: Employee[] = [];

  createAcc: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, [Validators.required]),
    role: new FormControl(null, [Validators.required])
  });

  constructor(
    private _AuthService: AuthServiceService,
    private _RolesService: RolesService,
    private _EmployeeService: EmployeeService
  ) { }

  ngOnInit(): void {
    this.getAllRoles();
    this.getAvailableEmployees();
  }

  getAvailableEmployees(): void {
    this._AuthService.getAllAccounts().subscribe({
      next: (accountsRes) => {
        const existingEmails = new Set(
          (accountsRes.data || accountsRes).map((acc: any) => acc.email?.toLowerCase())
        );

        this._EmployeeService.getEmployee().subscribe({
          next: (empRes) => {
            const allEmployees: Employee[] = empRes.data || empRes;
            this.empList = allEmployees.filter(
              (emp) => !existingEmails.has(emp.email?.toLowerCase())
            );
          },
          error: (err) => console.error('Error fetching employees:', err)
        });
      },
      error: (err) => console.error('Error fetching accounts:', err)
    });
  }

  getAllRoles(): void {
    this._RolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roleList = res.data || res;
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  // دالة مخصصة لتحليل وفك أخطاء الـ Backend وتحويلها لنص واضح
  private parseErrorMessage(error: any): string {
    if (!error) return 'Failed to create account.';

    const errObj = error.error || error;

    // 1. إذا كانت الرسالة نصية مباشرة
    if (typeof errObj === 'string') {
      return errObj;
    }

    // 2. إذا كانت تحتوي على message كـ string
    if (typeof errObj?.message === 'string') {
      return errObj.message;
    }

    // 3. إذا كانت مصفوفة أخطاء (مثل Identity Errors: [{code: "", description: ""}])
    if (Array.isArray(errObj)) {
      return errObj.map((e: any) => e.description || e.message || JSON.stringify(e)).join(' | ');
    }

    // 4. إذا كانت أخطاء ModelState / Validation (مثل error.errors = { Password: ["Min length 6", "Requires non-alphanumeric"] })
    if (errObj?.errors && typeof errObj.errors === 'object') {
      const messages: string[] = [];
      for (const key of Object.keys(errObj.errors)) {
        const val = errObj.errors[key];
        if (Array.isArray(val)) {
          messages.push(...val);
        } else if (typeof val === 'string') {
          messages.push(val);
        }
      }
      if (messages.length > 0) {
        return messages.join(' | ');
      }
    }

   
    if (Array.isArray(errObj?.errors)) {
      return errObj.errors.map((e: any) => e.description || e.message || e).join(' | ');
    }

    return 'An unexpected error occurred while creating the account.';
  }

  onSubmit(): void {
    if (this.createAcc.invalid) {
      this.createAcc.markAllAsTouched();
      return;
    }

   
    if (this.createAcc.value.password !== this.createAcc.value.confirmPassword) {
      this.errorMessage = 'Password and Confirm Password do not match.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this._AuthService.createAccount(this.createAcc.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success || response) {
          this.successMessage = response.message || 'Account created successfully!';
          this.createAcc.reset();
          this.getAvailableEmployees();

          Swal.fire({
            title: 'Created!',
            text: 'Account created successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Full Error Response:', error);

        // استخراج تفاصيل الخطأ بدقة
        this.errorMessage = this.parseErrorMessage(error);

        Swal.fire({
          title: 'Error!',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }
}