import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/interface/employee';
import { SalaryReport } from 'src/app/shared/interface/salary-report';
import { SalaryReportFiler } from 'src/app/shared/interface/salary-report-filer';
import { AuthServiceService } from 'src/app/shared/service/auth-service.service';
import { EmployeeService } from 'src/app/shared/service/employee.service';
import { SalaryReportService } from 'src/app/shared/service/salary-report.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.css']
})
export class SalaryReportComponent implements OnInit {

  salaryReports: SalaryReport[] = [];
  employeeData: Employee[] = []; 
  departmentsData: string[] = []; 
  isloading: boolean = false;
  editMode: boolean = false;
  selectedReportId: string = '';
  isAdmin: boolean = false;
  errorMessage: string = '';

  slaryReportForm: FormGroup = new FormGroup({
    employeeId: new FormControl(null, [Validators.required]),
    month: new FormControl(null, [Validators.required]),
    year: new FormControl(null, [Validators.required]),
  });

  filterForm: FormGroup = new FormGroup({
    employeeName: new FormControl(''),
    departmentName: new FormControl(''),
    month: new FormControl(null),
    year: new FormControl(null)
  });

  constructor(
    private _SalaryReportService: SalaryReportService,
    private _EmployeeService: EmployeeService,
    private _AuthServiceService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.checkRoleAndLoadData();
  }

  checkRoleAndLoadData(): void {
    const userRole = this._AuthServiceService.getUserRole();
    this.isAdmin = userRole === 'Admin' || userRole === 'HR';

    if (this.isAdmin) {
      this.getSalaryReport();
      this.getEmployeeData(); 
    } else {
      this.getSRFcurrentUser();
    }
  }

  getEmployeeData(): void {
    this._EmployeeService.getEmployee().subscribe({
      next: (response) => {
        this.employeeData = response?.data || response || [];
        const depts = this.employeeData
          .map(emp => emp.departmentName)
          .filter((dept): dept is string => !!dept);
        
        this.departmentsData = Array.from(new Set(depts));
      },
      error: (error) => console.error('Error fetching employee data:', error)
    });
  }

  getFilterValues(): SalaryReportFiler {
    const values = this.filterForm.value;
    const filter: SalaryReportFiler = {};

    if (this.isAdmin) {
      if (values.employeeName) filter.employeeName = values.employeeName;
      if (values.departmentName) filter.departmentName = values.departmentName;
    }

    if (values.month) filter.month = Number(values.month);
    if (values.year) filter.year = Number(values.year);

    return filter;
  }

  applyFilter(): void {
    const filter = this.getFilterValues();
    if (this.isAdmin) {
      this.getSalaryReport(filter);
    } else {
      this.getSRFcurrentUser(filter);
    }
  }

  resetFilter(): void {
    this.filterForm.reset({
      employeeName: '',
      departmentName: '',
      month: null,
      year: null
    });
    this.refreshData();
  }

  refreshData(): void {
    const filter = this.getFilterValues();
    if (this.isAdmin) {
      this.getSalaryReport(filter);
    } else {
      this.getSRFcurrentUser(filter);
    }
  }

  getSRFcurrentUser(filter?: SalaryReportFiler): void {
    this.isloading = true;
    this._SalaryReportService.getSRForCurrentUser(filter).subscribe({
      next: (response) => {
        this.salaryReports = response?.data || response || [];
        this.isloading = false;
      },
      error: (error) => {
        this.isloading = false;
        console.error('Error fetching my salary report:', error);
      }
    });
  }

  getSalaryReport(filter?: SalaryReportFiler): void {
    this.isloading = true;
    this._SalaryReportService.getSalaryReport(filter).subscribe({
      next: (response) => {
        this.salaryReports = response?.data || response || [];
        this.isloading = false;
      },
      error: (error) => {
        this.isloading = false;
        console.error('Error fetching all salary reports:', error);
      }
    });
  }

  openCreateModal(): void {
    this.editMode = false;
    this.selectedReportId = '';
    this.errorMessage = '';
    this.slaryReportForm.reset();
  }

  openEditModal(report: SalaryReport): void {
    this.editMode = true;
    this.selectedReportId = report.id;
    this.errorMessage = '';
    this.slaryReportForm.patchValue({
      employeeId: report.employeeId,
      month: report.month,
      year: report.year,
    });
  }

  submitForm(): void {
    if (this.slaryReportForm.invalid || !this.isAdmin) {
      this.slaryReportForm.markAllAsTouched();
      return;
    }

    this.isloading = true;
    this.errorMessage = '';
    const formData = this.slaryReportForm.value;

    if (this.editMode) {
      this._SalaryReportService.updateSalaryReport(formData, this.selectedReportId).subscribe({
        next: () => this.handleSuccess('Salary report updated successfully.'),
        error: (error) => this.handleError(error)
      });
    } else {
      this._SalaryReportService.createSalaryReport(formData).subscribe({
        next: () => this.handleSuccess('Salary report generated successfully.'),
        error: (error) => this.handleError(error)
      });
    }
  }



  deleteSalaryReport(id: string, employeeName?: string, period?: string): void {
    if (!this.isAdmin) return;

    const reportDetails = employeeName && period 
      ? `report for "${employeeName}" (${period})` 
      : 'this salary report';

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${reportDetails}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._SalaryReportService.deleteSalaryReport(id).subscribe({
          next: () => {
            this.refreshData();
            Swal.fire({
              title: 'Deleted!',
              text: 'Salary report has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            const errText = this.parseErrorMessage(error);
            Swal.fire('Error!', errText || 'Failed to delete salary report.', 'error');
          }
        });
      }
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

    return 'Failed to process salary report request.';
  }

  private handleSuccess(message: string): void {
    this.isloading = false;
    this.slaryReportForm.reset();
    this.refreshData();
    this.closeModal();

    Swal.fire({
      title: this.editMode ? 'Updated!' : 'Generated!',
      text: message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }
  
  private handleError(error: any): void {
    this.isloading = false;
    console.error('Operation failed:', error);
    this.errorMessage = this.parseErrorMessage(error);

    Swal.fire({
      title: 'Error!',
      text: this.errorMessage,
      icon: 'error',
      confirmButtonColor: '#dc3545'
    });
  }

  closeModal(): void {
    const modalElement = document.getElementById('SalaryReportModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      bootstrapModal?.hide();
    }
  }
}