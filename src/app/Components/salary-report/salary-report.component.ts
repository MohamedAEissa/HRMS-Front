import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/Shared/interface/employee';
import { SalaryReport } from 'src/app/Shared/interface/salary-report';
import { SalaryReportFiler } from 'src/app/Shared/interface/salary-report-filer';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';
import { EmployeeService } from 'src/app/Shared/Service/employee.service';
import { SalaryReportService } from 'src/app/Shared/Service/salary-report.service';

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
      error: (error) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }


  getFilterValues(): SalaryReportFiler {
    const values = this.filterForm.value;
    const filter: SalaryReportFiler = {};

    if (this.isAdmin) {
      if (values.employeeName) {
        filter.employeeName = values.employeeName;
      }
      if (values.departmentName) {
        filter.departmentName = values.departmentName;
      }
    }

    if (values.month) {
      filter.month = Number(values.month);
    }
    if (values.year) {
      filter.year = Number(values.year);
    }

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
    if (this.isAdmin) {
      this.getSalaryReport();
    } else {
      this.getSRFcurrentUser();
    }
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
        console.error('Error fetching my salary report:', error);
        this.isloading = false;
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
        console.error('Error fetching all salary reports:', error);
        this.isloading = false;
      }
    });
  }

  deleteSalaryReport(id: string): void {
    if (!this.isAdmin) return;
    
    this._SalaryReportService.deleteSalaryReport(id).subscribe({
      next: () => {
        this.refreshData();
      },
      error: (error) => {
        console.error('Error deleting salary report:', error);
      }
    });
  }

  openEditModal(report: SalaryReport): void {
    this.editMode = true;
    this.selectedReportId = report.id;
    this.slaryReportForm.patchValue({
      employeeId: report.employeeId,
      month: report.month,
      year: report.year,
    });
  }
  
  openCreateModal(): void {
    this.editMode = false;
    this.selectedReportId = '';
    this.slaryReportForm.reset();
  }

  submitForm(): void {
    if (this.slaryReportForm.invalid || !this.isAdmin) {
      return;
    }

    this.isloading = true;
    const formData = this.slaryReportForm.value;

    if (this.editMode) {
      this._SalaryReportService.updateSalaryReport(formData, this.selectedReportId).subscribe({
        next: () => {
          this.refreshData();
          this.slaryReportForm.reset();
          this.editMode = false;
          this.selectedReportId = '';
          this.isloading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating salary report:', error);
          this.isloading = false;
        }
      });
    } else {
      this._SalaryReportService.createSalaryReport(formData).subscribe({
        next: () => {
          this.refreshData();
          this.slaryReportForm.reset();
          this.isloading = false;
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating salary report:', error);
          this.isloading = false;
        }
      });
    }
  }
  
  closeModal(): void {
    const modalElement = document.getElementById('SalaryReportModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
}