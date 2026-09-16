import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attendance } from 'src/app/Shared/interface/attendance';
import { AttendanceFilter } from 'src/app/Shared/interface/attendance-filter';
import { Employee } from 'src/app/Shared/interface/employee';
import { Department } from 'src/app/Shared/interface/department';
import { AttendanceService } from 'src/app/Shared/Service/attendance.service';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';
import { EmployeeService } from 'src/app/Shared/Service/employee.service';
import { DepatrmentsService } from 'src/app/Shared/Service/depatrments.service';

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
      next: (res) => {
        this.employeeData = res?.data || res || [];
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  getAllDepartments(): void {
    this._DepatrmentsService.getDepartment().subscribe({
      next: (res: any) => {
        this.departmentData = res?.data || res || [];
      },
      error: (err) => console.error('Error fetching departments:', err)
    });
  }

  getallAttendance(filter?: AttendanceFilter): void {
    this.isLoading = true;
    this._AttendanceService.getallAttendance(filter).subscribe({
      next: (res) => {
        this.attendanceData = res?.data || res || [];
        this.isLoading = false;
      },       
      error: (err) => {
        console.error('Error fetching all attendance:', err);
        this.isLoading = false;
      }
    });
  }

  getCurrentUserAttendance(filter?: AttendanceFilter): void {
    this.isLoading = true;
    this._AttendanceService.getCurrentUserAttendance(filter).subscribe({
      next: (res) => {
        this.attendanceData = res?.data || res || [];
        this.isLoading = false;
      },
      error: (err) => {
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

  calculateStatus(checkInTime: string | null): number {
    if (!checkInTime || checkInTime.trim() === '') {
      return 0; 
    }
    const [hours, minutes] = checkInTime.split(':').map(Number);
  
    if (hours < 8 || (hours === 8 && minutes === 0)) {
      return 1; 
    } else {
      return 2; 
    }
  }

  recordAttendance(): void {
    if (this.attendanceFormGroup.invalid) {
      return;
    }

    this.isLoading = true;
    const rawValues = this.attendanceFormGroup.value;
    const computedStatus = this.calculateStatus(rawValues.checkInTime);
 
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
          this.closeModal();
        },
        error: (err) => {
          console.error('Error Details:', err.error);
          this.isLoading = false;
        }
      });
    } else {
      this._AttendanceService.addAttendance(payload).subscribe({
        next: () => {
          this.refreshData();
          this.isLoading = false;
          this.closeModal();
        },
        error: (err) => {
          console.error('Error Details:', err.error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteAttendance(id: string): void {
    this._AttendanceService.deleteAttendance(id).subscribe({
      next: () => this.refreshData(),
      error: (err) => console.error('Error deleting attendance:', err)
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

  closeModal(): void {
    const modalElement = document.getElementById('RecordAttendanceModal');
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