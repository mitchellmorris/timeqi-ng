import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { TasksState, TasksStateModel } from './tasks.state';
import { TasksAction } from './tasks.actions';

describe('Tasks store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([TasksState])]
      
    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: TasksStateModel = {
      items: ['item-1']
    };
    store.dispatch(new TasksAction('item-1'));
    const actual = store.selectSnapshot(TasksState.getState);
    expect(actual).toEqual(expected);
  });

});
