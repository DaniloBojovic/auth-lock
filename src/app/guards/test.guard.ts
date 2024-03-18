import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TestGuard implements CanLoad {
  canLoad(route: Route, segments: UrlSegment[]): boolean {
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
