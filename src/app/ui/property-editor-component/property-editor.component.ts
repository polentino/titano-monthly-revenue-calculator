import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA,} from "@angular/material/dialog";

@Component({
  selector: 'app-property-editor-component',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.scss']
})
export class PropertyEditorComponent {
  PropertyEditorType = PropertyEditorType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PropertyEditorData<any>) {
  }
}

export interface PropertyEditorData<T> {
  editorType: PropertyEditorType
  title: string
  label: string
  placeholder: string
  currentValue: T
  values: Array<T>
  renderer: (obj: T) => string
  validator?: (obj: T) => boolean
}

export enum PropertyEditorType {
  STRING,
  NUMBER,
  OTHER
}
