import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/Shared/interface/department';
import { DepatrmentsService } from 'src/app/Shared/Service/depatrments.service';
import Swal from 'sweetalert2';

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
        if (response.success || response) {
          this.departmentsList = response.data || response;
        }
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedDepartmentId = '';
    this.errorMessage = '';
    this.departmentForm.reset();
  }

  openEditModal(department: Department): void {
    this.isEditMode = true;
    this.selectedDepartmentId = department.id;
    this.errorMessage = '';
    this.departmentForm.patchValue({
      name: department.name
    });
  }

  saveDepartment(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode) {
      const updateBody = {
        id: this.selectedDepartmentId,
        ...this.departmentForm.value
      };

      this._DepatrmentsService.updateDepartment(this.selectedDepartmentId, updateBody).subscribe({
        next: () => {
          this.handleSuccess('Department updated successfully.');
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this._DepatrmentsService.createDepartment(this.departmentForm.value).subscribe({
        next: () => {
          this.handleSuccess('Department added successfully.');
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.departmentForm.reset();
  }

  private handleSuccess(message: string): void {
    this.isLoading = false;
    this.getAllDepartments();
    this.departmentForm.reset();

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

    return 'Failed to process department request.';
  }

  private handleError(err: any): void {
    this.isLoading = false;
    console.error('Operation failed:', err);
    this.errorMessage = this.parseErrorMessage(err);

    Swal.fire({
      title: 'Error!',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    });
  }

  removeItem(id: string, departmentName?: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: departmentName 
        ? `You are about to delete department "${departmentName}".`
        : 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._DepatrmentsService.deleteDepartment(id).subscribe({
          next: () => {
            this.departmentsList = this.departmentsList.filter((item) => item.id !== id);
            Swal.fire({
              title: 'Deleted!',
              text: 'Department has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            const errText = this.parseErrorMessage(err);
            Swal.fire('Error!', errText || 'Failed to delete department.', 'error');
          }
        });
      }
    });
  }

  private closeModal(): void {
    const modalElement = document.getElementById('departmentModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }
}