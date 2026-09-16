import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Roles } from 'src/app/Shared/interface/roles';
import { RolesService } from 'src/app/Shared/Service/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roleList : Roles[]=[];
 isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedRoleId: string  = '';

  roleFormGroup :FormGroup=new FormGroup({
    roleName:new FormControl(null ,[Validators.required]),
    description:new FormControl(null ,[Validators.required])

  })
constructor(private _RolesService:RolesService){}

  ngOnInit(): void {
    this.getAllRoles()
  }

 getAllRoles(){
  this._RolesService.getAllRoles().subscribe({
    next:(res)=>{
      this.roleList=res.data
     
    },
    error:(err)=>{
      console.log(err)
    }
  })
 }

 deleteRole(id:string){
  this._RolesService.deleteRole(id).subscribe({
    next:(res)=>{
     console.log(res)
     this.getAllRoles()
    },
    error:(err)=>{
      console.log(err)
    }
  })
 }


 openEditMode(role:Roles){
  this.isEditMode=true;
  this.selectedRoleId=role.id;
  this.roleFormGroup.patchValue({
    roleName : role.roleName,
    description:role.description,
    createdAt:role.createdAt
  })
}

 openAddModal(): void {
  this.isEditMode=false;
  this.selectedRoleId='';
  this.roleFormGroup.reset();
}


saveRole(){
  if(this.roleFormGroup.invalid) return;

  this.isLoading=true;
  if(this.isEditMode){
    this._RolesService.updateRole(this.selectedRoleId,this.roleFormGroup.value).subscribe({
      next: ()=> this.HandleSuccess(),
      error:(err)=> this.HandleError(err)
    })
  }else{
      this._RolesService.createRole(this.roleFormGroup.value).subscribe({
       next: ()=> this.HandleSuccess(),
      error:(err)=> this.HandleError(err)
      })
  }
}




private HandleSuccess(): void {
  this.isLoading = false;
  this.roleFormGroup.reset();
  this.getAllRoles();

  const modalElement = document.getElementById('addRoleModal');
   if (modalElement) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      bootstrapModal?.hide();
    }
}

private HandleError(error: any): void {
  this.isLoading = false;
  console.error(error);
}
}
