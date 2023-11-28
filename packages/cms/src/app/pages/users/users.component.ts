import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MainLayoutComponent } from '../../layouts/main-layout/main-layout.component';
import { UsersService } from '../../services/users.service';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersTableRowComponent, MainLayoutComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  users = this.usersService.records;
  isLoading = this.usersService.isLoading;

  ngOnInit() {
    this.usersService.get();
  }
}
