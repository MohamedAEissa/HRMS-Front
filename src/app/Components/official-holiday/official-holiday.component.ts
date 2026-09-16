import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OfficialHolidays } from 'src/app/Shared/interface/offical-holidays';
import { OfficialHolidaysService } from 'src/app/Shared/Service/offical-holidays.service';

@Component({
  selector: 'app-official-holiday',
  templateUrl: './official-holiday.component.html',
  styleUrls: ['./official-holiday.component.css']
})
export class OfficialHolidayComponent implements OnInit {
  holidaysList:OfficialHolidays[] = [];
  isLoading:boolean = false;
  addHolidayForm:FormGroup=new FormGroup({
    name:new FormControl(null,[Validators.required]),
    date:new FormControl(null,[Validators.required])
  });

constructor(private _OfficialHolidaysService: OfficialHolidaysService) { }
  ngOnInit(): void {
    this.getOfficialHolidays();
  }

  getOfficialHolidays(){
    this._OfficialHolidaysService.getOfficialHolidays().subscribe({
      next:(res)=>{
        this.holidaysList = res.data;
       
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  deleteHoliday(id:string){
    this._OfficialHolidaysService.deleteOfficialHoliday(id).subscribe({
      next:(res)=>{
        
        this.getOfficialHolidays();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  addHoliday(){
    if(this.addHolidayForm.valid){
      this.isLoading = true;
      this._OfficialHolidaysService.createOfficialHoliday(this.addHolidayForm.value).subscribe({
        next:(res)=>{
          this.getOfficialHolidays();
          this.isLoading = false;

          this.addHolidayForm.reset();
          const modalEl = document.getElementById('addHolidayModal');
          if (modalEl) {
          const modalInstance = (window as any).bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
        }
        },
        error:(err)=>{
          this.isLoading = false;
          console.log(err);
        }
      })
    }
  }
}
