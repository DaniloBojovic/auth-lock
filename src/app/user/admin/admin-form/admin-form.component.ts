import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent {
  dynamicForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.dynamicForm = this.formBuilder.group({
      applicantName: ['', Validators.required],
      jobs: this.formBuilder.array([]),
      skills: this.formBuilder.array([]),
    });
  }

  get jobs() {
    return this.dynamicForm.get('jobs') as FormArray;
  }

  get skills() {
    return this.dynamicForm.get('skills') as FormArray;
  }

  addJob() {
    this.jobs.push(
      this.formBuilder.group({
        jobTitle: ['', Validators.required],
        company: ['', Validators.required],
        yearsOfExperience: ['', Validators.required],
      })
    );
  }

  addSkill() {
    this.skills.push(this.formBuilder.control('', Validators.required));
  }

  removeJob(index: number) {
    this.jobs.removeAt(index);
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
  }
}
