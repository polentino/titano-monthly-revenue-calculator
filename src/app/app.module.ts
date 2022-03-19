import {ClipboardModule} from "@angular/cdk/clipboard";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {BrowserModule} from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {CoinMarketCapService} from "./services/CoinMarketCapService";
import {BuyMeABeerComponent} from './ui/buy-me-a-beer/buy-me-a-beer.component';
import {HowItWorksComponent} from './ui/how-it-works/how-it-works.component';
import {MainCardComponent} from './ui/main-card/main-card.component';
import {NumberFormatPipe} from "./ui/pipes/number-format-pipe";

@NgModule({
  declarations: [
    AppComponent,
    MainCardComponent,
    NumberFormatPipe,
    HowItWorksComponent,
    BuyMeABeerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    ClipboardModule,
    MatChipsModule,
    MatSelectModule
  ],
  providers: [CoinMarketCapService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
