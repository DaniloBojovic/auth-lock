import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { catchError, of, take } from 'rxjs';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/models/login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.userService
      .login(this.loginForm.value)
      .pipe(
        take(1),
        catchError((err) => {
          console.error('Login failed:', err);
          return of(null);
        })
      )
      .subscribe((res: LoginResponse | null) => {
        debugger;
        if (res && res.token) {
          // Store the token temporarily
          localStorage.setItem('tempToken', res.token);

          // Prompt the user to enter the 2FA code
          const code = Number(window.prompt('Please enter your 2FA code'));

          // Verify the 2FA code
          if (code === res.code) {
            // If the code is correct, store the token permanently
            localStorage.setItem('token', res.token);
            localStorage.setItem('role', res.role);
            this.router.navigate(['/user-list']);
          } else {
            // If the code is incorrect, clear the temporary token and show an error message
            localStorage.removeItem('tempToken');
            alert('Invalid 2FA code');
          }
        }
      });
  }
}
