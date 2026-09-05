import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Attendance } from 'src/app/Shared/interface/attendance';
import { Employee } from 'src/app/Shared/interface/employee';
import { AttendanceService } from 'src/app/Shared/Service/attendance.service';
import { EmployeeService } from 'src/app/Shared/Service/employee.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {
  attendanceData: Attendance[] = [];
  employeeData: Employee[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedAttendanceId: string  = '';
  constructor(private _AttendanceService: AttendanceService,private _EmployeeService:EmployeeService )  { }

  attendanceFormGroup:FormGroup = new FormGroup({
    employeeId: new FormControl(null,[Validators.required]),
    date: new FormControl(null,[Validators.required]),
    checkInTime: new FormControl(null),
    checkOutTime: new FormControl(null),
    status: new FormControl(null,[Validators.required])
  });

  ngOnInit(): void {
    this.getallAttendance();
    this.getAllEmployees();
  }

  openAddAttendanceModal() {
    this.isEditMode = false;
    this.attendanceFormGroup.reset();
  }

  openEditAttendanceModal(attendance: Attendance) {
  this.isEditMode = true;
  this.selectedAttendanceId = attendance.id;

  
  const formattedCheckIn = attendance.checkInTime ? attendance.checkInTime.substring(0, 5) : null; //"16:00:00" form db
  const formattedCheckOut = attendance.checkOutTime ? attendance.checkOutTime.substring(0, 5) : null; //"16:00:00" form db
  const formattedDate = attendance.date ? attendance.date.substring(0, 10) : null; //"2026-09-04T00:00:00" 

  this.attendanceFormGroup.patchValue({
    employeeId: attendance.employeeId,
    date: formattedDate,
    checkInTime: formattedCheckIn,
    checkOutTime: formattedCheckOut,
    status: attendance.status
  });
}
  recordAttendance() {
  if (this.attendanceFormGroup.invalid) {
    return;
  }

  this.isLoading = true;

  const rawValues = this.attendanceFormGroup.value;

  
  const payload = {
    employeeId: rawValues.employeeId,
    date: rawValues.date,
    checkInTime: rawValues.checkInTime ? `${rawValues.checkInTime}:00` : null,
    checkOutTime: rawValues.checkOutTime ? `${rawValues.checkOutTime}:00` : null,
    status: Number(rawValues.status) 
  };

  if (this.isEditMode) {
    this._AttendanceService.updateAttendance(this.selectedAttendanceId, payload).subscribe({
      next: (res) => {
        this.getallAttendance();
        this.isLoading = false;
        this.closeModal();
        
      },
      error: (err) => {
        console.log('Error Details:', err.error); // للتحقق من تفاصيل خطأ الـ Validation
        this.isLoading = false;
      }
    });
  } else {
    this._AttendanceService.addAttendance(payload).subscribe({
      next: (res) => {
        this.getallAttendance();
        this.isLoading = false;
        this.closeModal();
        
      },
      error: (err) => {
        console.log('Error Details:', err.error); // للتحقق من تفاصيل خطأ الـ Validation
        this.isLoading = false;
      }
    });
  }
}

  

  getAllEmployees() {
    this._EmployeeService.getEmployee().subscribe({
      next: (res) => {
        console.log(res);
        this.employeeData = res.data;
        console.log(this.employeeData);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getallAttendance() {
    this.isLoading = true;
    this._AttendanceService.getallAttendance().subscribe({
      next: (res) => {
        console.log(res);
        this.attendanceData = res.data;
        console.log(this.attendanceData);
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  deleteAttendance(id: string) {
    this._AttendanceService.deleteAttendance(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getallAttendance();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  calculateOvertime(checkOut: string | null): string {
    if (!checkOut) return '0 hrs';

    const [hours, minutes] = checkOut.split(':').map(Number);
    const checkOutInMinutes = hours * 60 + minutes;
    const workEndInMinutes = 16 * 60; 

    if (checkOutInMinutes > workEndInMinutes) {
      const diffMinutes = checkOutInMinutes - workEndInMinutes;
      const hrs = (diffMinutes / 60).toFixed(1);
      return `+${hrs} hrs`;
    }
    return '0 hrs';
  }

  calculateDeduction(checkIn: string | null, checkOut: string | null): string {
  let totalDeductionMinutes = 0;

  const workStartInMinutes = 8 * 60;  
  const workEndInMinutes = 16 * 60;   


  if (checkIn) {
    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const checkInInMinutes = inHours * 60 + inMinutes;

    if (checkInInMinutes > workStartInMinutes) {
      totalDeductionMinutes += (checkInInMinutes - workStartInMinutes);
    }
  }


  if (checkOut) {
    const [outHours, outMinutes] = checkOut.split(':').map(Number);
    const checkOutInMinutes = outHours * 60 + outMinutes;

    if (checkOutInMinutes < workEndInMinutes) {
      totalDeductionMinutes += (workEndInMinutes - checkOutInMinutes);
    }
  }

 
  if (totalDeductionMinutes > 0) {
    const hrs = (totalDeductionMinutes / 60).toFixed(1);
    return `${hrs} hrs`;
  }

  return '0 hrs';
}

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Absent';
      case 1: return 'Present';
      case 2: return 'Late';
      case 3: return 'Weekly Off';
      case 4: return 'Official Holiday';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
  switch (status) {
    case 1: return 'bg-success-subtle text-success border-success-subtle'; 
    case 0: return 'bg-danger-subtle text-danger border-danger-subtle';  
    case 2: return 'bg-warning-subtle text-warning border-warning-subtle'; 
    case 3: return 'bg-info-subtle text-info border-info-subtle';          
    case 4: return 'bg-primary-subtle text-primary border-primary-subtle';  
    default: return 'bg-secondary-subtle text-secondary border-secondary-subtle';
  }
}

  formatTimeDisplay(checkTime: string | null, status: number): string {
  // 1. في حالة وجود وقت مدخل
  if (checkTime && checkTime.trim() !== '') {
    const timeParts = checkTime.split(':');
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];

    if (isNaN(hours)) return checkTime;

    // تحديد AM أو PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // تحويل الساعات لنظام 12
    hours = hours % 12;
    hours = hours ? hours : 12; // الساعة 00 تتحول لـ 12

    // إضافة 0 جهة الشمال لو الساعة أقل من 10
    const formattedHours = hours < 10 ? `0${hours}` : hours;

    return `${formattedHours}:${minutes} ${ampm}`;
  }

  // 2. في حالة عدم وجود وقت بناءً على الـ Status
  switch (status) {
    case 0:
      return 'Absent';
    case 1:
      return 'No Time Recorded';
    case 2:
      return 'Late';
    case 3:
      return 'Weekly Off';
    case 4:
      return 'Official Holiday';
    default:
      return 'N/A';
  }
}


closeModal() {
  const modalElement = document.getElementById('RecordAttendanceModal');
  if (modalElement) {
    const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }
}
}
