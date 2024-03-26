import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve users from API via GET', () => {
    const dummyUsers = [
      {
        username: 'user2',
        password: 'password2',
        id: 2,
        role: 'User',
        email: 'user2@example.com',
      },
      {
        username: 'admin',
        password: 'admin',
        id: 3,
        role: 'Admin',
        email: 'admin@example.com',
      },
    ];

    userService.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const requests = httpMock.match(`${userService.apiUrl}/users`);
    expect(requests.length).toEqual(2);

    requests.forEach((request) => {
      expect(request.request.method).toBe('GET');
      request.flush(dummyUsers);
    });

    // requests[0].flush(dummyUsers);
    // requests[1].flush(dummyUsers);
  });

  it('should authenticate user via POST', () => {
    const dummyUser = { username: 'user2', password: 'password2' };
    const dummyResponse = { token: '123', role: 'User' };

    userService.login(dummyUser).subscribe((res) => {
      expect(res).toEqual(dummyResponse);
      expect(localStorage.getItem('token')).toBe('123');
      expect(localStorage.getItem('role')).toBe('User');
    });

    const loginRequest = httpMock.expectOne(`${userService.apiUrl}/login`);
    expect(loginRequest.request.method).toBe('POST');
    loginRequest.flush(dummyResponse);

    const getUsersRequest = httpMock.expectOne(`${userService.apiUrl}/users`);
    expect(getUsersRequest.request.method).toBe('GET');
    getUsersRequest.flush([]);
  });

  it('should update user role', () => {
    httpMock.expectOne(`${userService.apiUrl}/users`).flush([]);

    const dummyUser = { id: 1, role: 'Admin' };

    userService.updateUserRole(dummyUser).subscribe((user: any) => {
      expect(user.role).toEqual('User');
    });

    const req = httpMock.expectOne(
      `${userService.apiUrl}/users/${dummyUser.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({ ...dummyUser, role: 'User' });
  });
});
