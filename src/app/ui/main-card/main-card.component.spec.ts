
import {HttpClientModule} from "@angular/common/http";
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MainCardComponent} from './main-card.component';
import {PipesModule} from "../pipes/pipes.module";

describe('MainCardComponent', () => {
  let component: MainCardComponent;
  let fixture: ComponentFixture<MainCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainCardComponent],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        PipesModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
