import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { UserType } from '../../types/users.types';
import { UsersTableRowComponent } from './components/users-table-row/users-table-row.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, UsersTableRowComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  constructor(private usersService: UsersService) {}

  users$!: Observable<UserType[]>;

  async ngOnInit() {
    this.users$ = this.usersService.get().pipe(map(result => result.records));
  }
}
