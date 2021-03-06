import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BuyMeABeerComponent} from './buy-me-a-beer.component';

describe('BuyMeABeerComponent', () => {
  let component: BuyMeABeerComponent;
  let fixture: ComponentFixture<BuyMeABeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyMeABeerComponent],
      imports: [MatSnackBarModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyMeABeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
