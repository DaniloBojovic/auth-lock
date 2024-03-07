import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private _state = new BehaviorSubject<any>({}); // initial state

  get state$() {
    return this._state.asObservable();
  }

  updateState(newState: any) {
    this._state.next(newState);
  }
}
