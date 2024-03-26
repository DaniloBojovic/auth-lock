import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userService = userService;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        address: this.formBuilder.group({
          // nested form group
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]], // Serbian postal code validation
        }),
      },
      { validator: this.MustMatch('password', 'confirmPassword') }
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  onSubmit() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.userService.register(this.registerForm.value).subscribe((res) => {
        console.log(res);
        this.router.navigate(['/login']);
      });
    }
  }
}
