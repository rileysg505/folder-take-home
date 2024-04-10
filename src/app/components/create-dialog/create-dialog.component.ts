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

  // check if the user selected to create a new node
  isNode: boolean = true;

  // used for the form
  createNewForm = new FormGroup({
    parentNode: new FormControl(''),
    nodeName: new FormControl(''),
    type: new FormControl<'NODE' | 'PROPERTY'>('NODE'),
    property: new FormControl(''),
    value: new FormControl(''),
  });

  // used to inject the mat dialog data token
  constructor(private dataService: DataAccessService) {}

  // On init, get the tree paths, this will allow it to be easier for the user to choose where they want to input new data
  // Ex. ['Root','Root/Rocket1']
  ngOnInit() {
    this.paths = this.dataService.getAllTreePaths();
  }

  // Listen to the select component and change the variables based on it
  onTypeChange(event: string): void {
    if (event === 'NODE') {
      this.isNode = true;
    } else this.isNode = false;
  }

  // Handle submitting a new node/property
  submitNew() {
    // Only submit if new parent is defined
    if (!this.createNewForm.value.parentNode) return;

    // Call the create node with data gathered from the form
    this.dataService.createNode(this.createNewForm.value.parentNode, {
      name: this.isNode
        ? this.createNewForm.value.nodeName || ''
        : this.createNewForm.value.property || '',
      value: this.createNewForm.value.value || '',
      type: this.createNewForm.value.type || 'NODE',
    });
  }
}
