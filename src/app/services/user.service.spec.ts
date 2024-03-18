import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserService', () => {
  let userService: UserService;
  let httpMock: HttpTestingController;
  let httpClientSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve users from API via GET', () => {
    const dummyUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Doe' },
    ];

    userService.getUsers().subscribe((users) => {
      expect(users.length).toBe(2);
      expect(users).toEqual(dummyUsers);
    });

    const request = httpMock.expectOne(`${userService.apiUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyUsers);
  });

  xit('should handle error when API call fails', () => {
    const errorMessage = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    userService.getUsers().subscribe(
      () => fail('should have failed with 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toContain('test 404 error');
      }
    );

    const request = httpMock.expectOne(`${userService.apiUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush('test 404 error', { status: 404, statusText: 'Not Found' });
  });
});
