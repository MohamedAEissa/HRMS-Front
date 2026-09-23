import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { Attendance } from '../../shared/interface/attendance';
import { AttendanceFilter } from '../../shared/interface/attendance-filter';
import { Employee } from '../../shared/interface/employee';
import { Department } from '../../shared/interface/department';

import { AttendanceService } from '../../shared/service/attendance.service';
import { AuthServiceService } from '../../shared/service/auth-service.service';
import { EmployeeService } from '../../shared/service/employee.service';
import { DepatrmentsService } from '../../shared/service/depatrments.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendanceData: Attendance[] = [];
  employeeData: Employee[] = [];
  departmentData: Department[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedAttendanceId: string = '';
  selectedFile: File | null = null;
  
  isAdmin: boolean = false;

  filterFormGroup: FormGroup = new FormGroup({
    employeeId: new FormControl(''),
    departmentId: new FormControl(''),
    month: new FormControl(''),
    year: new FormControl(''),
    date: new FormControl('')
  });

  attendanceFormGroup: FormGroup = new FormGroup({
    employeeId: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required]), 
    checkInTime: new FormControl(null),
    checkOutTime: new FormControl(null)
  });

  constructor(
    private _AttendanceService: AttendanceService,
    private _EmployeeService: EmployeeService,
    private _AuthServiceService: AuthServiceService,
    private _DepatrmentsService: DepatrmentsService
  ) { }

  ngOnInit(): void {
    this.checkRoleAndLoadData();
  }

  checkRoleAndLoadData(): void {
    const userRole = this._AuthServiceService.getUserRole();
    this.isAdmin = userRole === 'Admin' || userRole === 'HR';

    if (this.isAdmin) {
      this.getallAttendance();
      this.getAllEmployees();
      this.getAllDepartments();
    } else {
      this.getCurrentUserAttendance();
    }
  }

  getAllEmployees(): void {
    this._EmployeeService.getEmployee().subscribe({
      next: (res: any) => {
        this.employeeData = res?.data || res || [];
      },
      error: (err: any) => console.error('Error fetching employees:', err)
    });
  }

  getAllDepartments(): void {
    this._DepatrmentsService.getDepartment().subscribe({
      next: (res: any) => {
        this.departmentData = res?.data || res || [];
      },
      error: (err: any) => console.error('Error fetching departments:', err)
    });
  }

  getallAttendance(filter?: AttendanceFilter): void {
    this.isLoading = true;
    this._AttendanceService.getallAttendance(filter).subscribe({
      next: (res: any) => {
        this.attendanceData = res?.data || res || [];
        this.isLoading = false;
      },      
      error: (err: any) => {
        console.error('Error fetching all attendance:', err);
        this.isLoading = false;
      }
    });
  }

  getCurrentUserAttendance(filter?: AttendanceFilter): void {
    this.isLoading = true;
    this._AttendanceService.getCurrentUserAttendance(filter).subscribe({
      next: (res: any) => {
        this.attendanceData = res?.data || res || [];
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching my attendance:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    const rawValues = this.filterFormGroup.value;
    const filter: AttendanceFilter = {};

    if (this.isAdmin) {
      if (rawValues.employeeId && rawValues.employeeId.trim() !== '') {
        filter.employeeId = rawValues.employeeId;
      }
      if (rawValues.departmentId && rawValues.departmentId.trim() !== '') {
        filter.departmentId = rawValues.departmentId;
      }
    }

    if (rawValues.month) filter.month = Number(rawValues.month);
    if (rawValues.year) filter.year = Number(rawValues.year);
    if (rawValues.date) filter.date = rawValues.date;

    if (this.isAdmin) {
      this.getallAttendance(filter);
    } else {
      this.getCurrentUserAttendance(filter);
    }
  }

  resetFilter(): void {
    this.filterFormGroup.reset({
      employeeId: '',
      departmentId: '',
      month: '',
      year: '',
      date: ''
    });

    if (this.isAdmin) {
      this.getallAttendance();
    } else {
      this.getCurrentUserAttendance();
    }
  }

  openAddAttendanceModal(): void {
    this.isEditMode = false;
    this.attendanceFormGroup.reset();
  }

  openEditAttendanceModal(attendance: Attendance): void {
    this.isEditMode = true;
    this.selectedAttendanceId = attendance.id;

    const formattedCheckIn = attendance.checkInTime ? attendance.checkInTime.substring(0, 5) : null;
    const formattedCheckOut = attendance.checkOutTime ? attendance.checkOutTime.substring(0, 5) : null;
    const formattedDate = attendance.date ? attendance.date.substring(0, 10) : null;

    this.attendanceFormGroup.patchValue({
      employeeId: attendance.employeeId,
      date: formattedDate,
      checkInTime: formattedCheckIn,
      checkOutTime: formattedCheckOut
    });
  }

  calculateStatus(employeeId: string, checkInTime: string | null): number {
    if (!checkInTime || checkInTime.trim() === '') {
      return 0; // Absent
    }

    const selectedEmp = this.employeeData.find(e => e.id === employeeId);
    
    const officialCheckIn = (selectedEmp as any)?.checkInTime || '08:00:00';
    const [officialHours, officialMinutes] = officialCheckIn.split(':').map(Number);
    const [actualHours, actualMinutes] = checkInTime.split(':').map(Number);

    const actualTotalMinutes = actualHours * 60 + actualMinutes;
    const officialTotalMinutes = officialHours * 60 + officialMinutes;

    if (actualTotalMinutes <= officialTotalMinutes) {
      return 1; // Present
    } else {
      return 2; // Late
    }
  }

  recordAttendance(): void {
    if (this.attendanceFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const rawValues = this.attendanceFormGroup.value;
    const computedStatus = this.calculateStatus(rawValues.employeeId, rawValues.checkInTime);

    const payload = {
      employeeId: rawValues.employeeId,
      date: rawValues.date,
      checkInTime: rawValues.checkInTime ? `${rawValues.checkInTime}:00` : null,
      checkOutTime: rawValues.checkOutTime ? `${rawValues.checkOutTime}:00` : null,
      status: computedStatus
    };

    if (this.isEditMode) {
      this._AttendanceService.updateAttendance(this.selectedAttendanceId, payload).subscribe({
        next: () => {
          this.refreshData();
          this.isLoading = false;
          this.closeModal('RecordAttendanceModal');
          Swal.fire({
            title: 'Updated!',
            text: 'Attendance record updated successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Error Details:', err.error);
          this.isLoading = false;
          Swal.fire('Error!', 'Failed to update attendance record.', 'error');
        }
      });
    } else {
      this._AttendanceService.addAttendance(payload).subscribe({
        next: () => {
          this.refreshData();
          this.isLoading = false;
          this.closeModal('RecordAttendanceModal');
          Swal.fire({
            title: 'Added!',
            text: 'Attendance record added successfully.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Error Details:', err.error);
          this.isLoading = false;
          Swal.fire('Error!', 'Failed to record attendance.', 'error');
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadExcel(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    const formData = new FormData();
    
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this._AttendanceService.importAttendanceFromExcel(formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.selectedFile = null;
        this.closeModal('ImportExcelModal');
        this.refreshData();

        Swal.fire({
          title: 'Import Completed!',
          text: 'Attendance data imported successfully.',
          icon: 'success'
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Upload Error Details:', err);
        const errorMessage = err?.error?.message || err?.error?.detail || 'Failed to import Excel file.';
        Swal.fire('Error!', errorMessage, 'error');
      }
    });
  }

  deleteAttendance(id: string, employeeName?: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: employeeName 
        ? `You are about to delete attendance record for "${employeeName}".`
        : 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._AttendanceService.deleteAttendance(id).subscribe({
          next: () => {
            this.refreshData();
            Swal.fire({
              title: 'Deleted!',
              text: 'Attendance record has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err: any) => {
            Swal.fire('Error!', 'Failed to delete attendance record.', 'error');
          }
        });
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Absent';
      case 1: return 'Present';
      case 2: return 'Late';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-success-subtle text-success border-success-subtle'; 
      case 0: return 'bg-danger-subtle text-danger border-danger-subtle';  
      case 2: return 'bg-warning-subtle text-warning border-warning-subtle';  
      default: return 'bg-secondary-subtle text-secondary border-secondary-subtle';
    }
  }

  formatTimeDisplay(checkTime: string | null, status: number): string {
    if (checkTime && checkTime.trim() !== '') {
      const timeParts = checkTime.split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];

      if (isNaN(hours)) return checkTime;

      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = hours < 10 ? `0${hours}` : hours;

      return `${formattedHours}:${minutes} ${ampm}`;
    }

    switch (status) {
      case 0: return 'Absent';
      case 1: return 'No Time Recorded';
      case 2: return 'Late';
      default: return 'N/A';
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
  
  refreshData(): void {
    this.applyFilter();
  }
}