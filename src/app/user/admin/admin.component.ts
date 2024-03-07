import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `<h1>Admin Mode On</h1>`,
  styles: [],
})
export class AdminComponent implements OnInit {
  ngOnInit(): void {
    debugger;
    console.log('AdminComponent');
  }
}
