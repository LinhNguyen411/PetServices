import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'vietnamCurrency',
  standalone: true,
})
export class VietnamCurrencyPipe implements PipeTransform {
  transform(
    value?: number,
    currencyCode: string = 'VND',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    digitsInfo: string = '4.0',
    locale: string = 'fr'
  ): string | null {
    if (value) {
      return formatCurrency(
        value,
        locale,
        getCurrencySymbol(currencyCode, 'wide'),
        currencyCode,
        digitsInfo
      );
    } else {
      return '0đ';
    }
  }
}
