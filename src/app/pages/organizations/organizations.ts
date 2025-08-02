import { Component, inject } from '@angular/core';
import { Organizations as OrganizationsService } from '../../store/organizations/organizations';
import { TableModule } from 'primeng/table';
import { PopulatedOrganization } from '../../schemas/organization';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngxs/store'; // Add this import
import { SetUserOrganizations } from '../../store/organizations/organizations.actions';
import { OrganizationsState } from '../../store/organizations/organizations.state';

@Component({
  selector: 'app-organizations',
  imports: [TableModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css'
})
export class Organizations {
  readonly organizationsService = inject(OrganizationsService);
  organizations: PopulatedOrganization[] = [];
  organizationsSubscription!: Subscription;
  loading: boolean = true;
  store: Store; // Add this property

  constructor(store: Store) { // Inject store via constructor
    this.store = store;
    const userId = localStorage.getItem('user_id');
    if (userId) {
      /**
       * I DID NOT want to use mergeAll here.
       * I was hoping to just use the organizations$ observable directly,
       * but I was getting a type error when trying to use it in the template
       * like: `<p-table [value]="organizations$ | async" ... >`, `Type 
       * 'Organization[] | null' is not assignable to type 'Organization[]'.`
       * and I couldn't figure out how to fix it.
       */
      const organizations$ = this.store.select(OrganizationsState.getState)
        .pipe(
          map(({ organizations }) => organizations),
        );
      this.organizationsSubscription = organizations$.subscribe((organizations) => {
        if (organizations.length > 0) {
          this.loading = false;
          this.organizations = organizations;
          }
        });
    } else {
      console.warn('No user ID found in local storage.');
    }
  }

  ngOnDestroy() {
    if (this.organizationsSubscription) {
      this.organizationsSubscription.unsubscribe();
    }
  }

}
