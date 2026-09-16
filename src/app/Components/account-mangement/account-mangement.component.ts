import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/Shared/interface/account';
import { Roles } from 'src/app/Shared/interface/roles';
import { AuthServiceService } from 'src/app/Shared/Service/auth-service.service';
import { RolesService } from 'src/app/Shared/Service/roles.service';

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
    roleName: new FormControl(null, [Validators.required]), // تعديل من role إلى roleName
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

  deleteAccount(id: string): void {
    this._AuthServiceService.deleteAccount(id).subscribe({
      next: (res) => {
        console.log(res);
        this.getallAccounts();
      },
      error: (err) => {
        console.log(err);
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

    const modalElement = document.getElementById('editAccountModal'); // تعديل الـ ID لـ editAccountModal
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