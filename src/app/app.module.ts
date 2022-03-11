import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainCardComponent} from './ui/main-card/main-card.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {NumberFormatPipe} from "./ui/pipes/number-format-pipe";
import {HowItWorksComponent} from './ui/how-it-works/how-it-works.component';
import {MatDialogModule} from "@angular/material/dialog";
import {BuyMeABeerComponent} from './ui/buy-me-a-beer/buy-me-a-beer.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {ClipboardModule} from "@angular/cdk/clipboard";

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
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
