import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TestGuard implements CanLoad {
  canLoad(): boolean {
    // Add your logic here to decide if the module can be loaded
    console.log('TestGuard#canLoad called');
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated');
      return false;
    }
    return true;
  }
}
