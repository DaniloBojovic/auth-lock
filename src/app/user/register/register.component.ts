import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

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
          zip: [
            '',
            [
              Validators.required,
              Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$'),
            ],
          ], // US zip code validation
        }),
      },
      { validator: this.MustMatch('password', 'confirmPassword') }
    );
  }

  MustMatch(controlName: string, matchingControlName: string) {
    debugger;
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
  }
}
