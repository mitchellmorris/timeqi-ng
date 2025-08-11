import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { TimeOffState, TimeOffStateModel } from './time-off.state';
import { TimeOffAction } from './time-off.actions';

describe('TimeOff store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([TimeOffState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: TimeOffStateModel = {
      items: ['item-1']
    };
    store.dispatch(new TimeOffAction('item-1'));
    const actual = store.selectSnapshot(TimeOffState.getState);
    expect(actual).toEqual(expected);
  });

});
