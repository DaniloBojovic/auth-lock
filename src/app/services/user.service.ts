import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //public apiUrl = 'https://jsonplaceholder.typicode.com/users';
  public apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<any[]>([]);
  users$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.getUsers().subscribe();
  }

  // getUsers(page: number = 1, pageSize: number = 10): Observable<any[]> {
  //   //return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  //   return this.http
  //     .get<any[]>(`${this.apiUrl}/users?page=${page}&pageSize=${pageSize}`)
  //     .pipe(
  //       tap((users) => console.log('USERS SERVICE: ', users)),
  //       catchError(this.handleError),
  //     );
  // }

  getUsers(
    page: number = 1,
    pageSize: number = 10,
    searchTerm: string = '',
    property: string = '',
    order: string = 'asc'
  ): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.apiUrl}/users?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}&property=${property}&sort=${order}`
      )
      .pipe(
        tap((users) => console.log('USERS Service: ', users)),
        tap((users) => this.userSubject.next(users)),
        catchError(this.handleError)
      );
  }

  login(user: { username: string; password: string }) {
    //return this.http.get<any>('assets/db.json');
    return this.http
      .post<any>(`${this.apiUrl}/login`, {
        username: user.username,
        password: user.password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  register(user: any) {
    //return this.http.post<any>(this.apiUrl + '/register', user);
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap((newUser) => {
        const users = this.userSubject.value;
        // this.userSubject.next([...users, newUser]);
        this.userSubject.next(
          Array.isArray(users) ? [...users, newUser] : [newUser]
        );
      })
    );
  }

  updateUserRole(user: any) {
    return this.http.put(`${this.apiUrl}/users/${user.id}`, user);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
