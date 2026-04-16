import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../Material.Module';
import { ProfileServices } from '../../../Services/profile-services';
import { MatDialog, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, MatDialogContent, MatDialogActions],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;

  userId: number = 0;
  user: any = null;
  errorMessage = '';
  successMessage = '';

  editUserData = {
    userFullName: '',
    phoneNumber: ''
  };

  constructor(
    private profileService: ProfileServices,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId') || 0);
    this.loadUser();
  }

  loadUser(): void {
    this.profileService.getUserById(this.userId).subscribe({
      next: (res) => {
        console.log('GET USER RESPONSE:', res);
        this.user = res.data ?? res;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error?.message || 'Failed to load user';
      }
    });
  }

  openEditDialog(): void {
    this.editUserData = {
      userFullName: this.user?.userFullName || '',
      phoneNumber: this.user?.phoneNumber || ''
    };

    this.dialog.open(this.editDialog, {
      width: '400px'
    });
  }

  updateUser(): void {
    this.profileService.updateById(this.userId, this.editUserData).subscribe({
      next: (res) => {
        console.log('UPDATE RESPONSE:', res);
        this.successMessage = res.message || 'Profile updated successfully';
        this.errorMessage = '';
        this.dialog.closeAll();
        this.loadUser();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = err.error?.message || 'Update failed';
      }
    });
  }

  deleteUser(): void {
    const confirmDelete = confirm('Are you sure you want to delete your profile?');

    if (confirmDelete) {
      this.profileService.deleteById(this.userId).subscribe({
        next: (res) => {
          console.log('DELETE RESPONSE:', res);
          this.successMessage = res.message || 'Profile deleted successfully';
          this.errorMessage = '';
          localStorage.clear();
          window.location.href = '/login';
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error?.message || 'Delete failed';
        }
      });
    }
  }
}