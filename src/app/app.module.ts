import {ClipboardModule} from "@angular/cdk/clipboard";
import {HttpClientModule} from "@angular/common/http";
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTableModule} from "@angular/material/table";
import {BrowserModule} from '@angular/platform-browser';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {CoinMarketCapService} from "./services/CoinMarketCapService";
import {AboutTaxesDialogComponent} from './ui/about-taxes-dialog/about-taxes-dialog.component';
import {BuyMeABeerComponent} from './ui/buy-me-a-beer/buy-me-a-beer.component';
import {MainCardComponent} from './ui/main-card/main-card.component';
import {PipesModule} from "./ui/pipes/pipes.module";

@NgModule({
  declarations: [
    AppComponent,
    MainCardComponent,
    BuyMeABeerComponent,
    AboutTaxesDialogComponent
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
    MatSelectModule,
    MatTableModule,
    FlexLayoutModule,
    MatCheckboxModule,
    PipesModule
  ],
  providers: [CoinMarketCapService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
