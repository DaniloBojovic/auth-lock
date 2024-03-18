import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //public apiUrl = 'https://jsonplaceholder.typicode.com/users';
  public apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  getUsers() {
    //return this.http.get<any>(this.apiUrl).pipe(catchError(this.handleError));
    return this.http
      .get<any>(`${this.apiUrl}/users`)
      .pipe(catchError(this.handleError));
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
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
