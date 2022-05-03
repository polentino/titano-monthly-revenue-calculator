import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PropertyEditorComponent, PropertyEditorType} from './property-editor.component';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

describe('PropertyEditorComponentComponent', () => {
  let component: PropertyEditorComponent;
  let fixture: ComponentFixture<PropertyEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PropertyEditorComponent],
      providers: [
        {provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Edit Amount To Withdraw',
            editorType: PropertyEditorType.NUMBER,
            currentValue: 123,
            values: [],
            renderer: (o: number) => o
          }},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
