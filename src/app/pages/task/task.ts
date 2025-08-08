import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-task',
  imports: [
    RouterModule,
    Dialog,
    ButtonModule,
  ],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  readonly route = inject(ActivatedRoute);
  openedTaskId = this.route.snapshot.paramMap.get('taskId');
  isTaskOpen: boolean = true;
  constructor(private router: Router) {}
  closeTask() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
