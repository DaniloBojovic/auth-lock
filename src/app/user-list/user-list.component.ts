import { Component, OnInit } from '@angular/core';
import {
  Observable,
  catchError,
  delay,
  finalize,
  of,
  tap,
  throwError,
} from 'rxjs';
import { UserService } from '../services/user.service';
import { StateService } from '../services/state.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users$!: Observable<any>;
  loading = false;
  state$ = this.stateService.state$;

  constructor(
    private userService: UserService,
    private stateService: StateService
  ) {}

  ngOnInit() {
    debugger;
    this.loading = true;
    this.userService
      .getUsers()
      .pipe(
        delay(2000),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (users) => (this.users$ = of(users)),
        (error: HttpErrorResponse) => {
          console.error('An error occurred:', error);
          if (error.status === 404) {
            console.error('Not Found');
          }
        }
      );
    // this.users$ = this.userService.getUsers().pipe(
    //   delay(2000),
    //   finalize(() => (this.loading = false))
    // );
    // this.users$.subscribe((users) => {
    //   console.log(users);
    // });
  }
}
