import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/shared/interface/employee';
import { EmployeeService } from 'src/app/shared/service/employee.service';

@Component({
  selector: 'app-employee-home',
  templateUrl: './employee-home.component.html',
  styleUrls: ['./employee-home.component.css']
})
export class EmployeeHomeComponent implements OnInit {

 currentEmp!: Employee;
  constructor(private _EmployeeService:EmployeeService){}


  ngOnInit(): void {
    this.getMyData()
  }

  getMyData(){
    this._EmployeeService.getMyData().subscribe({
      next:(res)=>{
        this.currentEmp=res.data
  
      },
      error:(error)=>{
        console.log(error)
      }
    })
  }
}
