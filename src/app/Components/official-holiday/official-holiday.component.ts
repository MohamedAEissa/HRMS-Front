import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OfficialHolidays } from 'src/app/shared/interface/offical-holidays';
import { OfficialHolidaysService } from 'src/app/shared/service/offical-holidays.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-official-holiday',
  templateUrl: './official-holiday.component.html',
  styleUrls: ['./official-holiday.component.css']
})
export class OfficialHolidayComponent implements OnInit {
  holidaysList: OfficialHolidays[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  addHolidayForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    date: new FormControl(null, [Validators.required])
  });

  constructor(private _OfficialHolidaysService: OfficialHolidaysService) { }

  ngOnInit(): void {
    this.getOfficialHolidays();
  }

  getOfficialHolidays(): void {
    this._OfficialHolidaysService.getOfficialHolidays().subscribe({
      next: (res) => {
        this.holidaysList = res?.data || res || [];
      },
      error: (err) => {
        console.error('Error fetching official holidays:', err);
      }
    });
  }

  openAddModal(): void {
    this.errorMessage = '';
    this.addHolidayForm.reset();
  }

  addHoliday(): void {
    if (this.addHolidayForm.invalid) {
      this.addHolidayForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this._OfficialHolidaysService.createOfficialHoliday(this.addHolidayForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.addHolidayForm.reset();
        this.getOfficialHolidays();
        this.closeModal();

        Swal.fire({
          title: 'Added!',
          text: 'Official holiday has been added successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error adding official holiday:', err);
        this.errorMessage = this.parseErrorMessage(err);

        Swal.fire({
          title: 'Error!',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  deleteHoliday(id: string, holidayName?: string, holidayDate?: any): void {
    const formattedDate = holidayDate ? new Date(holidayDate).toLocaleDateString() : '';
    const holidayDetails = holidayName 
      ? `"${holidayName}"${formattedDate ? ' on ' + formattedDate : ''}` 
      : 'this official holiday';

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${holidayDetails}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this._OfficialHolidaysService.deleteOfficialHoliday(id).subscribe({
          next: () => {
            this.getOfficialHolidays();
            Swal.fire({
              title: 'Deleted!',
              text: 'Official holiday has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (err) => {
            const errText = this.parseErrorMessage(err);
            Swal.fire('Error!', errText || 'Failed to delete official holiday.', 'error');
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

    return 'Failed to process official holiday request.';
  }

  closeModal(): void {
    const modalEl = document.getElementById('addHolidayModal');
    if (modalEl) {
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalEl);
      modalInstance?.hide();
    }
  }
}