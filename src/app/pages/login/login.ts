import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FieldsetModule } from 'primeng/fieldset';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../providers/auth/auth';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    FieldsetModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: Auth,
    private router: Router) {
      this.authService.logout(); // Ensure user is logged out on login page load
      this.form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  login() {
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe(
          () => {
            this.router.navigateByUrl('/');
          }
        );
    }
  }
}
