import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list.component';
import { AuthGuard } from '../../../guards/auth.guard';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { UserSearchComponent } from '../user-search/user-search.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { SortButtonComponent } from '../../shared/sort-button/sort-button.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

const routes: Routes = [
  { path: '', component: UserListComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [
    UserListComponent,
    UserSearchComponent,
    PaginatorComponent,
    SortButtonComponent,
    LoadingSpinnerComponent,
  ],
  exports: [UserListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatPaginatorModule,
    FormsModule,
  ],
})
export class UserListModule {}
