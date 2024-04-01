import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';
import { DialogData as ConfirmDialogData } from '../models/confirmation-dialog';
import { CreateDialogComponent } from '../components/create-dialog/create-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}
  // Default data for the dialog
  defaultData: ConfirmDialogData = {
    title: 'Confirmation',
    message: 'Are you sure?',
    actionCaption: 'OK',
    cancelCaption: 'Cancel',
    isDestructive: false,
  };
  confirmDialog(data?: ConfirmDialogData) {
    this.dialog.open(ConfirmationDialogComponent, {
      data: data ?? this.defaultData,
    });
  }
  createDialog() {
    this.dialog.open(CreateDialogComponent);
  }
}
