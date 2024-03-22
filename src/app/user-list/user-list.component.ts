import { Component, OnInit } from '@angular/core';
import {
  Observable,
  Subject,
  debounceTime,
  delay,
  distinctUntilChanged,
  finalize,
  of,
  tap,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { StateService } from '../services/state.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../dialogs/add-user-dialog/add-user-dialog.component';
import { PageEvent } from '@angular/material/paginator';

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
  currentSearchTerm = '';
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor(
    private userService: UserService,
    private stateService: StateService,
    private authService: AuthService,
    public matDialog: MatDialog,
  ) {}

  ngOnInit() {
    debugger;
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
    debugger;
    this.loadUsers(event.pageIndex + 1, event.pageSize, this.currentSearchTerm);
  }

  onSearch(event: Event) {
    debugger;
    event.preventDefault();
    this.currentSearchTerm = this.searchTerm;
    //this.loadUsers(1, 10, this.currentSearchTerm);
    this.searchSubject.next(this.currentSearchTerm);
  }

  loadUsers(page: number, pageSize: number, searchTerm?: string) {
    this.loading = true;
    this.userService
      .getUsers(page, pageSize, searchTerm)
      .pipe(
        delay(1000),
        finalize(() => (this.loading = false)),
        tap((users) => console.log('USERS COMPONENT: ', users)),
      )
      .subscribe(
        (users) => (this.users$ = of(users)),
        (error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          if (error.status === 404) {
            console.error('Not Found');
          }
        },
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
      debugger;
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
      },
    );
  }
}
