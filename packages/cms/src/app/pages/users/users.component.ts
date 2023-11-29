import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';
import { AddUserComponent } from './components/add-user/add-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersTableRowComponent, MainLayoutComponent, AddUserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(AddUserComponent) addUserComponent!: AddUserComponent;

  users = this.usersService.records;
  isLoading = this.usersService.isLoading;

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.usersService.get();
  }

  addUser() {
    this.addUserComponent.openModal();
  }
}
