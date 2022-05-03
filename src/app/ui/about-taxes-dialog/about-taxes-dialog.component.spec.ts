import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {AboutTaxesDialogComponent} from './about-taxes-dialog.component';
import {WithdrawalPeriod} from "../../services/WithdrawalPeriod";

describe('AboutTaxesDialogComponent', () => {
  let component: AboutTaxesDialogComponent;
  let fixture: ComponentFixture<AboutTaxesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutTaxesDialogComponent],
      imports: [MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA, useValue: {
            symbol: "EUR",
            withdrawalPeriod: WithdrawalPeriod.DAILY
          }
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTaxesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
