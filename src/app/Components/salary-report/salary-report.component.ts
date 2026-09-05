import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/Shared/interface/employee';
import { SalaryReport } from 'src/app/Shared/interface/salary-report';
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
  isloading: boolean = false;
  editMode: boolean = false;
  selectedReportId: string  = '';

  slaryReportForm: FormGroup = new FormGroup({
    employeeId: new FormControl(null,[Validators.required]),
    month: new FormControl(null,[Validators.required]),
    year: new FormControl(null,[Validators.required]),
  });
  constructor(private _SalaryReportService: SalaryReportService,private _EmployeeService: EmployeeService) { }


  ngOnInit(): void {
    this.getSalaryReport();
    this.getEmployeeData(); 
  }

  getSalaryReport() {
    this._SalaryReportService.getSalaryReport().subscribe({
      next: (response) => {
        this.salaryReports = response.data;
      },
      error: (error) => {
        console.error('Error fetching salary report:', error);
      }
    });
  }
  getEmployeeData() {
    this._EmployeeService.getEmployee().subscribe({
      next: (response) => {
        this.employeeData = response.data;
      },
      error: (error) => {
        console.error('Error fetching employee data:', error);
      }
    });
  }

  deleteSalaryReport(id: string) {
   
      this._SalaryReportService.deleteSalaryReport(id).subscribe({
        next: () => {
         this.getSalaryReport();
        },
        error: (error) => {
          console.error('Error deleting salary report:', error);
        }
      });
  }

  openEditModal(report: SalaryReport) {
    this.editMode = true;
    this.selectedReportId = report.id;
    this.slaryReportForm.patchValue({
      employeeId: report.employeeId,
      month: report.month,
      year: report.year,
    });
  }
  
  openCreateModal() {
    this.editMode = false;
    this.selectedReportId = '';
    this.slaryReportForm.reset();
  }

  submitForm() {
    if (this.slaryReportForm.invalid) {
      return;
    }

    const formData = this.slaryReportForm.value;

    if (this.editMode) {
      this._SalaryReportService.updateSalaryReport(formData, this.selectedReportId).subscribe({
        next: () => {
          this.getSalaryReport();
          this.slaryReportForm.reset();
          this.editMode = false;
          this.selectedReportId = '';
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating salary report:', error);
        }
      });
    } else {
      this._SalaryReportService.createSalaryReport(formData).subscribe({
        next: () => {
          this.getSalaryReport();
          this.slaryReportForm.reset();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating salary report:', error);
        }
      });
    }
  }
  
  closeModal() {
    const modalElement = document.getElementById('SalaryReportModal');
  if (modalElement) {
    const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }
  }
}
