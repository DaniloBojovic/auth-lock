import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }
}
