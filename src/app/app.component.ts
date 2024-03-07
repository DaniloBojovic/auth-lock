import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'auth-lock';

  constructor(protected router: Router, private location: Location) {}

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'Admin';
  }

  goBack() {
    this.location.back();
  }
}
