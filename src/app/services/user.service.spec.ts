import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserService } from './user.service';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', fakeAsync(() => {
    const userService = TestBed.inject(UserService);
    const mockUsers = [{ name: 'John' }, { name: 'Jane' }];
    spyOn(userService, 'getUsers').and.returnValue(of(mockUsers));

    let users: any;
    userService.getUsers().subscribe((value) => {
      users = value;
    });

    tick();

    expect(users).toEqual(mockUsers);
  }));
});
