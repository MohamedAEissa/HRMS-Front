import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/Shared/interface/account';
import { Roles } from 'src/app/Shared/interface/roles';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';
import { RolesService } from 'src/app/Shared/Service/roles.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-mangement',
  templateUrl: './account-mangement.component.html',
  styleUrls: ['./account-mangement.component.css']
})
export class AccountMangementComponent implements OnInit {

  accountList: Account[] = [];
  roleList: Roles[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  selectedAccountId: string = '';

  accountFormGroup: FormGroup = new FormGroup({
    fullName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    roleName: new FormControl(null, [Validators.required]),
    isActive: new FormControl(true, [Validators.required])
  });

  constructor(
    private _AuthServiceService: AuthServiceService,
    private _RolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.getallAccounts();
    this.getAllRole();
  }

  getAllRole(): void {
    this._RolesService.getAllRoles().subscribe({
      next: (res) => {
        this.roleList = res.data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

  getallAccounts(): void {
    this._AuthServiceService.getAllAccounts().subscribe({
      next: (res) => {
        this.accountList = res.data;
      },
      error: (err) => {
        console.log(err.message);
      }
    });
  }

 
  deleteAccount(id: string, fullName: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete the account for "${fullName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-4'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this._AuthServiceService.deleteAccount(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Account has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.getallAccounts();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete account. Please try again.',
              icon: 'error'
            });
            console.error(err);
          }
        });
      }
    });
  }

  openEditMode(account: Account): void {
    this.isEditMode = true;
    this.selectedAccountId = account.id;
    this.accountFormGroup.patchValue({
      fullName: account.fullName,
      email: account.email,
      roleName: account.roleName,
      isActive: account.isActive
    });
  }

  EditAccount(): void {
    if (this.accountFormGroup.invalid) return;
    
    this.isLoading = true;
    if (this.isEditMode) {
      this._AuthServiceService.editAccount(this.selectedAccountId, this.accountFormGroup.value).subscribe({
        next: () => this.HandleSuccess(),
        error: (error) => this.HandleError(error)
      });
    }
  }

  private HandleSuccess(): void {
    this.isLoading = false;
    this.accountFormGroup.reset();
    this.getallAccounts();

    const modalElement = document.getElementById('editAccountModal');
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modalElement);
      bootstrapModal?.hide();
    }

    Swal.fire({
      title: 'Updated!',
      text: 'Account details updated successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  }

  private HandleError(error: any): void {
    this.isLoading = false;
    console.error(error);
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong while updating.',
      icon: 'error'
    });
  }
}