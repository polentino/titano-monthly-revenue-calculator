import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdvancedCalculatorData} from '../../services/AdvancedCalculatorData';
import {TITANO_DATA} from "../../services/estimator.service";

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent {
  model: AdvancedCalculatorData;
  private titanoAdvancedData = JSON.stringify(TITANO_DATA.advanced);

  constructor(
    public dialogRef: MatDialogRef<AdvancedSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdvancedCalculatorData) {
    this.model = data;
  }

  revertText() {
    return (JSON.stringify(this.model) === this.titanoAdvancedData) ? 'BACK' : 'REVERT'
  }
}
