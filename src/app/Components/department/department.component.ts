import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/Shared/interface/department';
import { DepatrmentsService } from 'src/app/Shared/Service/depatrments.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit {
  departmentsList: Department[] = [];
  errorMessage: string = ''; 
  isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedDepartmentId: string = '';

  departmentForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(2)])
  });

  constructor(private _DepatrmentsService: DepatrmentsService) {}

  ngOnInit(): void {
    this.getAllDepartments();
  }

  getAllDepartments(): void {
    this._DepatrmentsService.getDepartment().subscribe({
      next: (response) => {
        if (response.success) {
          this.departmentsList = response.data;
        }
      }
    });
  }

  // to open add
  openAddModal(): void {
    this.isEditMode = false;
    this.selectedDepartmentId = '';
    this.departmentForm.reset();
  }

  // to open edit
  openEditModal(department: Department): void {
    this.isEditMode = true;
    this.selectedDepartmentId = department.id;
    this.departmentForm.patchValue({
      name: department.name
    });
  }

  saveDepartment(): void {
    if (this.departmentForm.invalid) 
      return;
    
    this.isLoading = true;

    if (this.isEditMode) {
      
      const updateBody = {
        id: this.selectedDepartmentId,
        ...this.departmentForm.value
      };

      this._DepatrmentsService.updateDepartment(this.selectedDepartmentId, updateBody).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    } else {
      this._DepatrmentsService.createDepartment(this.departmentForm.value).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => this.handleError(err)
      });
    }
  }
  cancelEdit() {
  this.isEditMode = false;
  this.departmentForm.reset();
}

  private handleSuccess(): void {
    this.isLoading = false;
    this.getAllDepartments();
    this.departmentForm.reset();
    
    // إغلاق المودال 
    const modalElement = document.getElementById('departmentModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }

  private handleError(err: any): void {
    this.isLoading = false;
    console.error('Operation failed:', err);
  }

  removeItem(id: string): void {
    this._DepatrmentsService.deleteDepartment(id).subscribe({
      next: (response) => {
        this.departmentsList = this.departmentsList.filter((item) => item.id !== id);
      },
      error: (err) => {
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Cannot delete this department because active users/employees are assigned to it.';
        }
      }
    });
  }
}