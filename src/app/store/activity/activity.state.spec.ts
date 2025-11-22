import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { ActivityState, ActivityStateModel } from './activity.state';
import { ActivityAction } from './activity.actions';

describe('Activity store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([ActivityState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: ActivityStateModel = {
      items: ['item-1']
    };
    store.dispatch(new ActivityAction('item-1'));
    const actual = store.selectSnapshot(ActivityState.getState);
    expect(actual).toEqual(expected);
  });

});
