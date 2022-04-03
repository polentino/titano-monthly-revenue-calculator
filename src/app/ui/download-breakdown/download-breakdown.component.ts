import {formatDate} from '@angular/common';
import {Component, Inject, LOCALE_ID} from '@angular/core';

@Component({
  selector: 'app-download-breakdown',
  templateUrl: './download-breakdown.component.html',
  styleUrls: ['./download-breakdown.component.scss']
})
export class DownloadBreakdownComponent {
  formats = [
    'dd MM YY',
    'dd MMM YY',
    'dd MM YYYY',
    'dd MMM YYYY',
    'MM dd YY',
    'MMM dd YY',
    'MM dd YYYY',
    'MMM dd YYYY',
    'YY MM dd',
    'YY MMM dd',
    'YYYY MM dd',
    'YYYY MMM dd'
  ];
  separators = ['/', ' ', '-', '.'];

  format = this.formats[0];
  separator = this.separators[0];

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  formatDate(format: string, separator: string) {
    return formatDate(new Date(), this.fullDateFormat(format, separator), this.locale);
  }

  fullDateFormat(format: string, separator: string) {
    return format.replace(/\s/g, separator);
  }
}
