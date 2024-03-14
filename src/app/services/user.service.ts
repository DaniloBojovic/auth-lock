import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private apiUrlToken = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  getUsers() {
    return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
  }

  login(user: { username: string; password: string }) {
    //return this.http.get<any>('assets/db.json');
    debugger;
    return this.http
      .post<any>('http://localhost:3000/login', {
        username: user.username,
        password: user.password,
      })
      .pipe(
        tap((res) => {
          debugger;
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
    //implement register logic
    return this.http.post<any>(this.apiUrlToken + '/register', user);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}
