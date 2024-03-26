import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './user-auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './user-auth/login/login.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { LogoutModule } from './user-auth/logout/logout.module';
import { AdminComponent } from './user-auth/admin/admin.component';
import { AdminFormComponent } from './user-auth/admin/admin-form/admin-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserDialogComponent } from './dialogs/add-user-dialog/add-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    AdminComponent,
    AdminFormComponent,
    AddUserDialogComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LogoutModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
