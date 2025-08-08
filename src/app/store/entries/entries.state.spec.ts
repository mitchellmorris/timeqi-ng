import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { EntriesState, EntriesStateModel } from './entries.state';
import { EntriesAction } from './entries.actions';

describe('Entries store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([EntriesState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: EntriesStateModel = {
      items: ['item-1']
    };
    store.dispatch(new EntriesAction('item-1'));
    const actual = store.selectSnapshot(EntriesState.getState);
    expect(actual).toEqual(expected);
  });

});
