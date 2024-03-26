import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-logout',
  template: '<button (click)="logout()">Logout</button>',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
  constructor(private userService: UserService) {}

  logout() {
    this.userService.logout();
  }
}
