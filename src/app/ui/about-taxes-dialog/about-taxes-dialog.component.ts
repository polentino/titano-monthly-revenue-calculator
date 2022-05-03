import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {WithdrawalPeriod} from '../../services/WithdrawalPeriod';

@Component({
  selector: 'app-about-taxes-dialog',
  templateUrl: './about-taxes-dialog.component.html',
  styleUrls: ['./about-taxes-dialog.component.scss']
})
export class AboutTaxesDialogComponent {
  public doNotShowAgain = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: AboutTaxesDialogComponentData) {
  }

  uppercasePeriod() {
    return WithdrawalPeriod.toStringNoun(this.data.withdrawalPeriod, true);
  }

  lowercasePeriod() {
    return WithdrawalPeriod.toStringNoun(this.data.withdrawalPeriod);
  }
}

export interface AboutTaxesDialogComponentData {
  symbol: string
  withdrawalPeriod: WithdrawalPeriod
}
