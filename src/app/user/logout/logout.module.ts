import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';

@NgModule({
  declarations: [LogoutComponent],
  exports: [LogoutComponent],
  imports: [CommonModule],
})
export class LogoutModule {}
