import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, DoCheck} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CalculatorData} from '../../services/CalculatorData';
import {BalanceRow, CalculatorService, TITANO_DATA} from '../../services/CalculatorService';
import {CoinMarketCapCurrencies} from '../../services/CoinMarketCapCurrencies';
import {CoinMarketCapService} from '../../services/CoinMarketCapService';
import {WithdrawalPeriod} from '../../services/WithdrawalPeriod';
import {AboutTaxesDialogComponent} from '../about-taxes-dialog/about-taxes-dialog.component';
import {AdvancedSettingsComponent} from '../advanced-settings/advanced-settings.component';
import {BuyMeABeerComponent} from '../buy-me-a-beer/buy-me-a-beer.component';
import '../../utils/utils'

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  providers: [CalculatorService, CoinMarketCapService, {provide: Window, useValue: window}],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MainCardComponent implements DoCheck {
  private previousModel = CalculatorData.clone(TITANO_DATA);
  model = CalculatorData.clone(TITANO_DATA);
  withdrawalPeriods = WithdrawalPeriod.values;
  WithdrawalPeriod = WithdrawalPeriod; // damn TS DI
  titanoSettingsInUse = true;
  doNotShowAgain = false;

  set taxesCalculationEnabled(value: boolean) {
    this.model.countryTaxesCalculationEnabled = value;
    if (value && !this.doNotShowAgain) {
      const ref = this.dialog.open(AboutTaxesDialogComponent, {
        disableClose: true,
        data: {
          symbol: this.currency.symbol,
          withdrawalPeriod: this.model.withdrawalPeriod
        }
      });

      ref.afterClosed().subscribe(doNotShowAgain => {
        this.doNotShowAgain = doNotShowAgain;
      });
    }
  }

  dateFormat = 'dd MMMM YYYY';
  shortDateFormat = 'dd MMM YY';
  expandedElement: BalanceRow | undefined;
  currencies = CoinMarketCapCurrencies.CURRENCIES;
  currency = this.currencies[9];

  displayedColumns: string[] = ['from', 'initialAmount', 'to', 'finalAmount', 'value'];
  mobileColumns: string[] = ['to', 'finalAmount', 'value'];
  dataSource: BalanceRow[] = [];
  newExpandedElement: BalanceRow | null | undefined;

  constructor(
    private calculatorService: CalculatorService,
    private cmcService: CoinMarketCapService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar, private window: Window
  ) {
    this.fetchQuote();
    this.dataSource = this.oneYearBalance();
  }

  ngDoCheck(): void {
    if (
      this.model.withdrawalPeriod != this.previousModel.withdrawalPeriod ||
      this.model.desiredPeriodicAmountToWithdraw != this.previousModel.desiredPeriodicAmountToWithdraw ||
      this.model.slippageFeesPct != this.previousModel.slippageFeesPct ||
      this.model.initialCryptoCapital != this.previousModel.initialCryptoCapital ||
      this.model.cryptoPrice != this.previousModel.cryptoPrice ||
      this.model.countryTaxes != this.previousModel.countryTaxes ||
      this.model.countryTaxesCalculationEnabled != this.previousModel.countryTaxesCalculationEnabled ||
      this.model.advanced.compoundMinutes != this.previousModel.advanced.compoundMinutes ||
      this.model.advanced.name != this.previousModel.advanced.name ||
      this.model.advanced.periodAPY != this.previousModel.advanced.periodAPY ||
      this.model.advanced.contractSellFeesPct != this.previousModel.advanced.contractSellFeesPct
    ) {
      this.previousModel = CalculatorData.clone(this.model);
      this.dataSource = this.oneYearBalance();
    }
  }

  fetchQuote() {
    if (!this.titanoSettingsInUse) {
      console.error('CoinMarketCap quote retrieval is disabled for custom tokens');
      return;
    }
    const c = this.currency;
    this.cmcService.getQuote(c)
      .subscribe(data => {
          // todo ensure we catch errors!
          const price = Object.values(data.data.points).pop().v[0];
          this.model.cryptoPrice = price;
        },
        error => {
          console.error(error);
          this.snackBar.open('Couldn\'t fetch TITANO quote; please insert it manually', 'Ok', {duration: 5000});
        });
  }

  periodicTitanoWithdrawal() {
    return this.amountBeforeFeesAndTaxes();
  }

  amountBeforeFeesAndTaxes() {
    return this.calculatorService.amountBeforeFeesAndTaxes(this.model);
  }

  daysNeeded() {
    return this.calculatorService.daysNeeded(this.model);
  }

  firstWithdrawalDate() {
    return (new Date()).plusDays(this.daysNeeded());
  }

  oneYearBalance() {
    return this.calculatorService.oneYearBalance(this.model);
  }

  estimatedOneYearProfit() {
    return this.calculatorService.estimatedOneYearProfit(this.model);
  }

  openHowItWorksDialog() {
    this.window.open('https://github.com/polentino/titano-monthly-revenue-calculator/blob/master/THE_MATH_BEHIND.md', '_blank');
  }

  openBuyMeABeerDialog() {
    this.dialog.open(BuyMeABeerComponent);
  }

  openAdvancedSettings() {
    const dialogModel = {...this.model.advanced};
    const ref = this.dialog.open(AdvancedSettingsComponent, {
      disableClose: true,
      data: dialogModel
    });

    ref.afterClosed().subscribe(newSettings => {
      if (newSettings === undefined || (
        // screw it, why `newSettings == TITANO_DATA.advanced` doesn't work
        newSettings.name == TITANO_DATA.advanced.name &&
        newSettings.compoundMinutes == TITANO_DATA.advanced.compoundMinutes &&
        newSettings.periodAPY == TITANO_DATA.advanced.periodAPY &&
        newSettings.contractSellFeesPct == TITANO_DATA.advanced.contractSellFeesPct
      )) {
        this.titanoSettingsInUse = true;
        this.model.advanced = {...TITANO_DATA.advanced};
      } else {
        this.titanoSettingsInUse = false;
        this.model.advanced = newSettings;
      }
      // schedule a new estimation
      this.dataSource = this.oneYearBalance();
    });
  }
}
