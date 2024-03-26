import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  delay,
  distinctUntilChanged,
  finalize,
  map,
  of,
  tap,
} from 'rxjs';
import { UserService } from '../../../services/user.service';
import { StateService } from '../../../services/state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../../../dialogs/add-user-dialog/add-user-dialog.component';
import { PageEvent } from '@angular/material/paginator';

import * as _ from 'lodash';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users$!: Observable<any>;
  loading = false;
  state$ = this.stateService.state$;
  totalUsers = 100;
  pageSize = 10;
  currentPage = 0;
  currentSearchTerm = '';
  searchTerm = '';
  private searchSubject = new Subject<string>();
  sortOrder: string = 'asc';

  constructor(
    private userService: UserService,
    private stateService: StateService,
    private authService: AuthService,
    public matDialog: MatDialog
  ) {}

  ngOnInit() {
    // This  sets up a subscription to the `searchSubject` observable.
    // The `debounceTime(300)` operator ensures that events are processed at most once every 300ms.
    // The `distinctUntilChanged()` operator ensures that the `loadUsers` method is only called when the search term changes.
    // When a new value is emitted from `searchSubject` (which happens in the `onSearch` method => `this.searchSubject.next(this.currentSearchTerm)`,
    // the `loadUsers` method is called with the new search term.
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.loadUsers(1, 10, searchTerm);
      });
    this.loadUsers(1, 10);
  }

  pageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers(
      this.currentPage + 1,
      event.pageSize,
      this.currentSearchTerm
    );
  }

  // onSearch(event: Event) {
  //   debugger;
  //   event.preventDefault();
  //   this.currentSearchTerm = this.searchTerm;
  //   //this.loadUsers(1, 10, this.currentSearchTerm);
  //   this.searchSubject.next(this.currentSearchTerm);
  //   this.sortUsersBy('username', this.sortOrder);
  // }

  handleSearch(searchTerm: string) {
    debugger;
    this.currentSearchTerm = searchTerm;
    this.searchSubject.next(this.currentSearchTerm);
    this.sortUsersBy('username', this.sortOrder);
  }

  loadUsers(
    page: number,
    pageSize: number,
    searchTerm?: string,
    property?: string,
    order?: string
  ) {
    this.loading = true;
    this.userService
      .getUsers(page, pageSize, searchTerm, property, order)
      .pipe(
        delay(500),
        finalize(() => (this.loading = false)),
        tap((response: any) => {
          this.totalUsers = response.totalUsers; // Update totalUsers here
          console.log('USERS COMPONENT: ', response);
        })
      )
      .subscribe(
        (response: any) => (this.users$ = of(response.users)),
        (error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          if (error.status === 404) {
            console.error('Not Found');
          }
        }
      );
  }

  isAdmin(): any {
    return this.authService.isAdmin();
  }

  createNewUser() {
    const dialogRef = this.matDialog.open(AddUserDialogComponent, {
      width: '600px',
      height: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  updateUserRole(user: any) {
    user.role = user.role === 'Admin' ? 'User' : 'Admin';
    this.userService.updateUserRole(user).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  sortUsersBy(property: string, order: string) {
    debugger;
    //this.users$ = this.users$.pipe(map((users) => _.sortBy(users, [property])));
    this.loadUsers(
      this.currentPage + 1,
      this.pageSize,
      this.currentSearchTerm,
      property,
      order
    );
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortUsersBy('username', this.sortOrder);
  }
}
