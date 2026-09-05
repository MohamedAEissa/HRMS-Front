import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/Shared/interface/employee';
import { EmployeeService } from 'src/app/Shared/Service/employee.service';
import { Department } from 'src/app/Shared/interface/department';
import { DepatrmentsService } from 'src/app/Shared/Service/depatrments.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

employeesList: Employee[] = [];
departmentsList: Department[] = [];
 errorMessage: string = ''; 
 isLoading: boolean = false;
 isEditMode: boolean = false;
 selectedEmployeeId: string = '';
  employeeForm:FormGroup = new FormGroup({
    FullName:new FormControl(null,[Validators.required,Validators.minLength(2)]),
    Email:new FormControl(null,[Validators.required,Validators.email]),
    Phone:new FormControl(null,[Validators.required,Validators.minLength(11)]),
    Salary:new FormControl(null,[Validators.required,Validators.min(0)]),
    DepartmentId:new FormControl(null,[Validators.required])
  })

constructor(private _EmployeeService: EmployeeService,private _DepartmentService: DepatrmentsService) {}

ngOnInit(): void {
  this.getEmployee();
  this.getDepartments();
}

getEmployee():void {
  this._EmployeeService.getEmployee().subscribe({
    next: (response) => {
      this.employeesList = response.data;
      // console.log(this.employeesList);
    },
    error: (error) => {
      console.error(error);
    }
  })
}
getDepartments(): void {
  this._DepartmentService.getDepartment().subscribe({
    next: (response) => {
      this.departmentsList = response.data;
      // console.log(this.departmentsList);
    },
    error: (error) => {
      console.error(error);
    }
  })
}

openAddModal(): void {
  this.isEditMode=false;
  this.selectedEmployeeId='';
  this.employeeForm.reset();
}

openEditModal(employee: Employee): void {
  this.isEditMode=true;
  this.selectedEmployeeId=employee.id;
  this.employeeForm.patchValue({
    FullName: employee.fullName,
    Email: employee.email,
    Phone: employee.phone,
    Salary: employee.salary,
    DepartmentId: employee.departmentId
  })
}

saveEmployee(): void {
  if (this.employeeForm.invalid)
    return;

  this.isLoading = true;
  if(this.isEditMode) {
    this._EmployeeService.updateEmployee(this.selectedEmployeeId, this.employeeForm.value).subscribe({
      next: () => this.HandleSuccess(),
 
      error: (error) => this.HandleError(error)
    })
  }else {
    this._EmployeeService.createEmployee(this.employeeForm.value).subscribe({
      next: () => this.HandleSuccess(),
      
      error: (error) => this.HandleError(error)
    })
  }
}

private HandleSuccess(): void {
  this.isLoading = false;
  this.employeeForm.reset();
  this.getEmployee();

  const modalElement = document.getElementById('employeeModal');
   if (modalElement) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
}

private HandleError(error: any): void {
  this.isLoading = false;
  console.error(error);
}

deleteEmployee(id: string): void {
  this._EmployeeService.deleteEmployee(id).subscribe({
    next: (response) => {
      console.log(response);
      this.getEmployee();
    },
    error: (error) => {
      console.error(error);
    }
  })
}

}
