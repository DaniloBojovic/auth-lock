import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './user/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './user/login/login.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { LogoutModule } from './user/logout/logout.module';
import { AdminComponent } from './user/admin/admin.component';

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent, AdminComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LogoutModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
