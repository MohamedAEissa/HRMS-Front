import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralSetting } from 'src/app/Shared/interface/general-setting';
import { GeneralSettingService } from 'src/app/Shared/Service/general-setting.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generalsetting',
  templateUrl: './generalsetting.component.html',
  styleUrls: ['./generalsetting.component.css']
})
export class GeneralsettingComponent implements OnInit {

  generalSettingData: GeneralSetting | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  daysOfWeek: string[] = [
    'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  settingsForm: FormGroup = new FormGroup({
    overtimeHourRate: new FormControl(null, [Validators.required, Validators.min(0)]),
    deductionHourRate: new FormControl(null, [Validators.required, Validators.min(0)]),
    weeklyDaysOff: new FormControl(null, [Validators.required]) 
  });

  constructor(private _GeneralSettingService: GeneralSettingService) { }

  ngOnInit(): void {
    this.getGeneralSetting();
  }

  getGeneralSetting(): void {
    this._GeneralSettingService.getGeneralSetting().subscribe({
      next: (res) => {
        this.generalSettingData = res?.data || res || null;
      },
      error: (err) => {
        console.error('Error fetching general settings:', err);
      }
    });
  }

  openEditModal(): void {
    this.errorMessage = '';
    if (!this.generalSettingData) return;

    this.settingsForm.patchValue({
      overtimeHourRate: this.generalSettingData.overtimeHourRate,
      deductionHourRate: this.generalSettingData.deductionHourRate,
      weeklyDaysOff: this.generalSettingData.weeklyDaysOff
    });
  }

  updateGeneralSetting(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this._GeneralSettingService.updateGeneralSetting(this.settingsForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.getGeneralSetting();
        this.closeModal();

        Swal.fire({
          title: 'Updated!',
          text: 'General settings updated successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error updating general settings:', err);
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

    return 'Failed to update general settings.';
  }

  closeModal(): void {
    const modalEl = document.getElementById('settingModal');
    if (modalEl) {
      const modalInstance = (window as any).bootstrap?.Modal?.getInstance(modalEl);
      modalInstance?.hide();
    }
  }
}