import {NgModule} from '@angular/core';
import {NumberFormatPipe} from './number.format.pipe';
import {ScaleNumberPipe} from './scale.number.pipe';

@NgModule({
  declarations: [NumberFormatPipe, ScaleNumberPipe],
  exports: [NumberFormatPipe, ScaleNumberPipe]
})
export class PipesModule {
}
