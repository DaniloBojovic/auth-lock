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
      questions: this.formBuilder.array([]),
    });
  }

  get questions() {
    return this.dynamicForm.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(
      this.formBuilder.group({
        question: ['', Validators.required],
        answer: ['', Validators.required],
      })
    );
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  onSubmit() {
    console.log(this.dynamicForm.value);
  }
}
