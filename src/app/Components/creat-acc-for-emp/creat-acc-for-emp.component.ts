import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/Shared/interface/employee';
import { Roles } from 'src/app/Shared/interface/roles';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';
import { EmployeeService } from 'src/app/Shared/Service/employee.service';
import { RolesService } from 'src/app/Shared/Service/roles.service';

@Component({
  selector: 'app-creat-acc-for-emp',
  templateUrl: './creat-acc-for-emp.component.html',
  styleUrls: ['./creat-acc-for-emp.component.css']
})
export class CreatAccForEmpComponent implements OnInit {

  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

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

  onSubmit(): void {
    if (this.createAcc.invalid) {
      this.createAcc.markAllAsTouched();
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
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating account:', error);
        this.errorMessage = error.error?.message || error.error || 'Failed to create account.';
      }
    });
  }
}