import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [UserListComponent],
  exports: [UserListComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class UserListModule {}
