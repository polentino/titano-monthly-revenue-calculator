import {Component} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-buy-me-a-beer',
  templateUrl: './buy-me-a-beer.component.html',
  styleUrls: ['./buy-me-a-beer.component.scss']
})
export class BuyMeABeerComponent {

  constructor(private snackBar: MatSnackBar) {
  }

  getAddress() {
    return "0x26b9ee3E56E11D740347738825e5e8c6940cF1aA";
  }

  sayThankYou() {
    this.snackBar.open("Address copied, thank you!", "Close", {duration: 5000});
  }
}
