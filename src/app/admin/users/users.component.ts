import { Component, OnInit } from '@angular/core';
import {IUpdateUser, IUser, IUserSearch} from "../../shared/models/user";
import {AdminService} from "../admin.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: IUser[] = [];
  totalCount = 0;

  searchParams: IUserSearch = {
    page: 1,
    size: 10,
    order: 'asc',
    sortBy: 'username',
    firstName: '',
    lastName: '',
    username: ''
  };

  displayedColumns: string[] = [
    'username',
    'firstName',
    'lastName',
    'email',
    'phoneNumber',
    'active',
    'actions'
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers(this.searchParams).subscribe({
      next: res => {
        this.users = res.items;
        this.totalCount = res.totalCount;
      },
      error: err => console.error('Failed to load users', err)
    });
  }

  onSearch() {
    this.searchParams.page = 1;
    this.loadUsers();
  }

  onPageChanged(newPage: number) {
    this.searchParams.page = newPage;
    this.loadUsers();
  }

  toggleBanUser(user: IUser) {
    const updatedUser: IUpdateUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      email: user.email,
      description: user.description,
      socialMediaLink: user.socialMediaLink,
      phoneNumber: user.phoneNumber,
      address: user.address,
      city: user.city,
      country: user.country,

      active: !user.active
    };

    this.adminService.updateUser(user.id, updatedUser).subscribe({
      next: () => this.loadUsers(),
      error: err => console.error('Failed to update user', err)
    });
  }

  deleteUser(id: number) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    this.adminService.deleteUser(id).subscribe({
      next: () => this.users = this.users.filter(u => u.id !== id),
      error: err => console.error('Failed to delete user', err)
    });
  }
}
