import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss'],
})
export class AddUserDialogComponent implements OnInit {
  addUserForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {}

  ngOnInit() {
    this.addUserForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        address: this.formBuilder.group({
          street: ['', Validators.required],
          city: ['', Validators.required],
          state: ['', Validators.required],
          zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
        }),
        // Add your additional fields here
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
    debugger;
    if (this.addUserForm.valid) {
      this.userService.register(this.addUserForm.value).subscribe((res) => {
        console.log(res);
        this.dialogRef.close();
      });
    }
  }
}
