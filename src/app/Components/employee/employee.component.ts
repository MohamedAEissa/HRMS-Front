import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Employee } from 'src/app/shared/interface/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { Department } from 'src/app/shared/interface/department';
import { DepatrmentsService } from 'src/app/shared/service/depatrments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employeesList: Employee[] = [];
  departmentsList: Department[] = [];
  errorMessage: string = ''; 
  isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedEmployeeId: string = '';

  employeeForm: FormGroup = new FormGroup({
    fullName: new FormControl(null, [
      Validators.required, 
      Validators.minLength(2), 
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z\sأ-يء-ئ]+$/)
    ]),
    nationalId: new FormControl(null, [
      Validators.required, 
      Validators.pattern(/^(2|3)[0-9]{13}$/)
    ]),
    address: new FormControl(null, [
      Validators.required, 
      Validators.minLength(5)
    ]),
    email: new FormControl(null, [
      Validators.required, 
      Validators.email
    ]),
    phone: new FormControl(null, [
      Validators.required, 
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    nationality: new FormControl(null, [
      Validators.required
    ]),
    gender: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(Male|Female)$/)
    ]),
    birthDate: new FormControl(null, [
      Validators.required,
      this.birthDateValidator
    ]),
    salary: new FormControl(null, [
      Validators.required, 
      Validators.min(1), 
      Validators.max(999999)
    ]),
    contractDate: new FormControl(null, [
      Validators.required,
      this.contractDateValidator
    ]),
    checkInTime: new FormControl(null, [
      Validators.required
    ]),
    checkOutTime: new FormControl(null, [
      Validators.required
    ]),
    departmentId: new FormControl(null, [
      Validators.required
    ])
  }, { validators: this.checkTimeValidator });

  constructor(
    private _EmployeeService: EmployeeService,
    private _DepartmentService: DepatrmentsService
  ) {}

  ngOnInit(): void {
    this.getEmployee();
    this.getDepartments();
  }

  // --- Custom Validators (Static / Arrow functions to avoid context issues) ---
  birthDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) return { underAge: true };
    if (age > 70) return { overAge: true };
    return null;
  }

  contractDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const contractDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (contractDate > today) {
      return { futureContract: true };
    }
    return null;
  }

  checkTimeValidator(group: AbstractControl): ValidationErrors | null {
    const checkIn = group.get('checkInTime')?.value;
    const checkOut = group.get('checkOutTime')?.value;
    
    if (checkIn && checkOut && checkOut <= checkIn) {
      group.get('checkOutTime')?.setErrors({ invalidTimeRange: true });
      return { invalidTimeRange: true };
    }
    
    const checkOutControl = group.get('checkOutTime');
    if (checkOutControl?.hasError('invalidTimeRange')) {
      const errors = { ...checkOutControl.errors };
      delete errors['invalidTimeRange'];
      checkOutControl.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }

  getEmployee(): void {
    this._EmployeeService.getEmployee().subscribe({
      next: (response) => {
        this.employeesList = response.data || response;
        console.log(this.employeesList)
      },
      error: (error) => console.error('Error fetching employees:', error)
    });
  }

  getDepartments(): void {
    this._DepartmentService.getDepartment().subscribe({
      next: (response) => {
        this.departmentsList = response.data || response;
      },
      error: (error) => console.error('Error fetching departments:', error)
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedEmployeeId = '';
    this.errorMessage = '';
    this.employeeForm.reset();
  }

  openEditModal(employee: Employee): void {
    this.isEditMode = true;
    this.selectedEmployeeId = employee.id;
    this.errorMessage = '';
    
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      nationalId: employee.nationalId,
      address: employee.address,
      email: employee.email,
      phone: employee.phone,
      nationality: employee.nationality,
      gender: employee.gender,
      birthDate: employee.birthDate ? employee.birthDate.split('T')[0] : null,
      salary: employee.salary,
      contractDate: employee.contractDate ? employee.contractDate.split('T')[0] : null,
      checkInTime: employee.checkInTime,
      checkOutTime: employee.checkOutTime,
      departmentId: employee.departmentId
    });
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      const updateBody = {
        id: this.selectedEmployeeId,
        ...this.employeeForm.value
      };

      this._EmployeeService.updateEmployee(this.selectedEmployeeId, updateBody).subscribe({
        next: () => this.handleSuccess('Employee updated successfully.'),
        error: (error) => this.handleError(error)
      });
    } else {
      this._EmployeeService.createEmployee(this.employeeForm.value).subscribe({
        next: () => this.handleSuccess('Employee created successfully.'),
        error: (error) => this.handleError(error)
      });
    }
  }

  private handleSuccess(message: string): void {
    this.isLoading = false;
    this.employeeForm.reset();
    this.getEmployee();
    this.closeModal();

    Swal.fire({
      title: this.isEditMode ? 'Updated!' : 'Created!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private parseErrorMessage(error: any): string {
    if (!error) return 'An error occurred during operation.';
    const errObj = error.error || error;

    if (typeof errObj === 'string') return errObj;
    if (typeof errObj?.message === 'string') return errObj.message;

    if (Array.isArray(errObj)) {
      return errObj.map((e: any) => e.description || e.message || JSON.stringify(e)).join(' | ');
    }

    if (errObj?.errors && typeof errObj.errors === 'object') {
      const messages: string[] = [];
      for (const key of Object.keys(errObj.errors)) {
        const val = errObj.errors[key];
        if (Array.isArray(val)) messages.push(...val);
        else if (typeof val === 'string') messages.push(val);
      }
      if (messages.length > 0) return messages.join(' | ');
    }

    return 'Failed to process employee request.';
  }

  private handleError(error: any): void {
    this.isLoading = false;
    console.error('Operation failed:', error);
    this.errorMessage = this.parseErrorMessage(error);

    Swal.fire({
      title: 'Error!',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    });
  }

  deleteEmployee(id: string, fullName?: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: fullName 
        ? `You are about to delete employee "${fullName}".`
        : 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._EmployeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.employeesList = this.employeesList.filter((emp) => emp.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'Employee record has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            const errText = this.parseErrorMessage(error);
            Swal.fire('Error!', errText || 'Failed to delete employee.', 'error');
          }
        });
      }
    });
  }

  private closeModal(): void {
    const modalElement = document.getElementById('employeeModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }
}