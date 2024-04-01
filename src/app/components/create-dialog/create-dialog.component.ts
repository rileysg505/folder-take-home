import { ChangeDetectorRef, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogData } from '../../models/confirmation-dialog';
import { DataAccessService } from '../../services/data-access.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TreeNode } from '../../models/node';

@Component({
  selector: 'app-create-dialog',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-dialog.component.html',
})
export class CreateDialogComponent {
  paths: string[] = []; // Initialize paths as an empty array
  cdr = inject(ChangeDetectorRef);
  isNode: boolean = true;
  createNewForm = new FormGroup({
    parentNode: new FormControl(''),
    nodeName: new FormControl(''),
    type: new FormControl<'NODE' | 'PROPERTY'>('NODE'),
    property: new FormControl(''),
    value: new FormControl(''),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataAccessService
  ) {}

  ngOnInit() {
    this.paths = this.dataService.getAllTreePaths();
  }
  onTypeChange(event: string): void {
    if (event === 'NODE') {
      this.isNode = true;
    } else this.isNode = false;
  }
  submitNew() {
    if (!this.createNewForm.value.parentNode) return;
    this.dataService.createNode(this.createNewForm.value.parentNode, {
      name: this.isNode
        ? this.createNewForm.value.nodeName || ''
        : this.createNewForm.value.property || '',
      value: this.createNewForm.value.value || '',
      type: this.createNewForm.value.type || 'NODE',
    });
  }
}
