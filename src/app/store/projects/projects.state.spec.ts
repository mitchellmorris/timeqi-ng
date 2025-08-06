import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { ProjectsState, ProjectsStateModel } from './projects.state';
import { ProjectsAction } from './projects.actions';

describe('Projects store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([ProjectsState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: ProjectsStateModel = {
      items: ['item-1']
    };
    store.dispatch(new ProjectsAction('item-1'));
    const actual = store.selectSnapshot(ProjectsState.getState);
    expect(actual).toEqual(expected);
  });

});
