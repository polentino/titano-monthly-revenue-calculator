import {ClipboardModule} from '@angular/cdk/clipboard';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CookieService} from 'ngx-cookie-service';
import {AppComponent} from './app.component';
import {CalculatorService} from './services/calculator.service';
import {CoinMarketCapService} from './services/CoinMarketCapService';
import {EstimatorService} from './services/estimator.service';
import {AboutTaxesDialogComponent} from './ui/about-taxes-dialog/about-taxes-dialog.component';
import {AdvancedSettingsComponent} from './ui/advanced-settings/advanced-settings.component';
import {BuyMeABeerComponent} from './ui/buy-me-a-beer/buy-me-a-beer.component';
import {DownloadBreakdownComponent} from './ui/download-breakdown/download-breakdown.component';
import {MainCardComponent} from './ui/main-card/main-card.component';
import {PipesModule} from './ui/pipes/pipes.module';
import {PropertyEditorComponent} from './ui/property-editor-component/property-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    MainCardComponent,
    BuyMeABeerComponent,
    AboutTaxesDialogComponent,
    AdvancedSettingsComponent,
    DownloadBreakdownComponent,
    PropertyEditorComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ClipboardModule,
    MatChipsModule,
    MatSelectModule,
    MatTableModule,
    FlexLayoutModule,
    MatCheckboxModule,
    PipesModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  providers: [
    EstimatorService,
    CalculatorService,
    CoinMarketCapService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
