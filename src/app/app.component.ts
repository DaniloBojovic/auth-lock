import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'auth-lock';

  constructor(
    protected router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  isAdmin(): boolean {
    // return localStorage.getItem('role') === 'Admin';
    return this.authService.isAdmin();
  }

  goBack() {
    this.location.back();
  }
}
