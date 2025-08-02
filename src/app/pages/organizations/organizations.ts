import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PopulatedOrganization } from '../../schemas/organization';
import { map, Subscription } from 'rxjs';
import { Store } from '@ngxs/store'; // Add this import
import { OrganizationsState } from '../../store/organizations/organizations.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizations',
  imports: [TableModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css'
})
export class Organizations {
  readonly store = inject(Store);
  organizations: PopulatedOrganization[] = [];
  organizations$ = this.store.select(OrganizationsState.getState).pipe(
    map(({ organizations }) => organizations),
  );
  organizationsSubscription!: Subscription;
  loading: boolean = true;

  constructor(private router: Router) { 
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.organizationsSubscription = this.organizations$.subscribe((organizations) => {
        if (organizations.length > 0) {
          this.loading = false;
          this.organizations = organizations;
          if (organizations.length === 1) {
            // Redirect to the single organization's page
            this.router.navigate(['/organization', organizations[0]._id]);
          }
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
