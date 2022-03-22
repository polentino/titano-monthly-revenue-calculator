import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-about-taxes-dialog',
  templateUrl: './about-taxes-dialog.component.html',
  styleUrls: ['./about-taxes-dialog.component.scss']
})
export class AboutTaxesDialogComponent {
  public doNotShowAgain = false;
  constructor(
    public dialogRef: MatDialogRef<AboutTaxesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AboutTaxesDialogComponentData) {
  }

  closeDialog() {
    this.dialogRef.close({})
  }
}

export interface AboutTaxesDialogComponentData {
  symbol: string
  monthlyWithdrawal: boolean
}
