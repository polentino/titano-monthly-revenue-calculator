import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTaxesDialogComponent } from './about-taxes-dialog.component';

describe('AboutTaxesDialogComponent', () => {
  let component: AboutTaxesDialogComponent;
  let fixture: ComponentFixture<AboutTaxesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutTaxesDialogComponent ]
    })
    .compileComponents();
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
