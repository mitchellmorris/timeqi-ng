import { Component, inject } from '@angular/core';
import { Organizations as OrganizationsService } from '../../store/organizations/organizations';
import { TableModule } from 'primeng/table';
import { Organization } from '../organization/organization';
import { mergeAll, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-organizations',
  imports: [TableModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css'
})
export class Organizations {
  readonly organizationsService = inject(OrganizationsService);
  organizations$: Observable<Organization[]> = this.organizationsService.organizations$;
  organizations: Organization[] = [];
  organizationsSubscription!: Subscription;
  loading: boolean = true;

  constructor() {
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
      this.organizationsSubscription = of(
        this.organizations$, 
        this.organizationsService.populateOrganizations(userId)
      ).pipe(
        mergeAll(),
      ).subscribe({
          next: (organizations) => {
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
