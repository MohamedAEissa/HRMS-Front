import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralSetting } from 'src/app/Shared/interface/general-setting';
import { GeneralSettingService } from 'src/app/Shared/Service/general-setting.service';

@Component({
  selector: 'app-generalsetting',
  templateUrl: './generalsetting.component.html',
  styleUrls: ['./generalsetting.component.css']
})
export class GeneralsettingComponent implements OnInit {

  generalSettingData: GeneralSetting | null = null;
  isLoading: boolean = false;

  daysOfWeek: string[] = [
    'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  settingsForm: FormGroup = new FormGroup({
    overtimeHourRate: new FormControl(null, [Validators.required]),
    deductionHourRate: new FormControl(null, [Validators.required]),
    weeklyDaysOff: new FormControl(null, [Validators.required]) 
  });

  constructor(private _GeneralSettingService: GeneralSettingService) { }

  ngOnInit(): void {
    this.getGeneralSetting();
  }

  getGeneralSetting(): void {
    this._GeneralSettingService.getGeneralSetting().subscribe({
      next: (res) => {
        if (res.data) {
          this.generalSettingData = res.data;
        }
      },
      error: (err) => console.log(err)
    });
  }

  openEditModal(): void {
    if (!this.generalSettingData) return;

    this.settingsForm.patchValue({
      overtimeHourRate: this.generalSettingData.overtimeHourRate,
      deductionHourRate: this.generalSettingData.deductionHourRate,
      weeklyDaysOff: this.generalSettingData.weeklyDaysOff
    });
  }

  updateGeneralSetting(): void {
    if (this.settingsForm.invalid) return;

    this.isLoading = true;
    this._GeneralSettingService.updateGeneralSetting(this.settingsForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.getGeneralSetting();

        const modalEl = document.getElementById('settingModal');
        if (modalEl) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      }
    });
  }

}