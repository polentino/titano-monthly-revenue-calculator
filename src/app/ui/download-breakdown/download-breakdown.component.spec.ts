import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DownloadBreakdownComponent} from './download-breakdown.component';

describe('DownloadBreakdownComponent', () => {
  let component: DownloadBreakdownComponent;
  let fixture: ComponentFixture<DownloadBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadBreakdownComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
