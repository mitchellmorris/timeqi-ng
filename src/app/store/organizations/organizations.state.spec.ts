import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { OrganizationsState, OrganizationsStateModel } from './organizations.state';
import { OrganizationsAction } from './organizations.actions';

describe('Organizations store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([OrganizationsState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: OrganizationsStateModel = {
      items: ['item-1']
    };
    store.dispatch(new OrganizationsAction('item-1'));
    const actual = store.selectSnapshot(OrganizationsState.getState);
    expect(actual).toEqual(expected);
  });

});
