import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WithdrawalPeriod} from '../../services/WithdrawalPeriod';

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

  uppercasePeriod() {
    return WithdrawalPeriod.toStringAdjective(this.data.withdrawalPeriod, true);
  }

  lowercasePeriod() {
    return WithdrawalPeriod.toStringAdjective(this.data.withdrawalPeriod);
  }
}

export interface AboutTaxesDialogComponentData {
  symbol: string
  withdrawalPeriod: WithdrawalPeriod
}
