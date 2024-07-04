import { padNumber, toInteger, isNumber } from '../util/util';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export function NGB_DATEPICKER_PARSER_FORMATTER_FACTORY() {
    return new NgbDateISOParserFormatter();
}
/**
 * An abstract service for parsing and formatting dates for the
 * [`NgbInputDatepicker`](#/components/datepicker/api#NgbInputDatepicker) directive.
 * Converts between the internal `NgbDateStruct` model presentation and a `string` that is displayed in the
 * input element.
 *
 * When user types something in the input this service attempts to parse it into a `NgbDateStruct` object.
 * And vice versa, when users selects a date in the calendar with the mouse, it must be displayed as a `string`
 * in the input.
 *
 * Default implementation uses the ISO 8601 format, but you can provide another implementation via DI
 * to use an alternative string format or a custom parsing logic.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 */
export class NgbDateParserFormatter {
}
NgbDateParserFormatter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDateParserFormatter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, providedIn: 'root', useFactory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY }]
        }] });
export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    parse(value) {
        if (value != null) {
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    }
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}
NgbDateISOParserFormatter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateISOParserFormatter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL25nYi1kYXRlLXBhcnNlci1mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTVELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRXpDLE1BQU0sVUFBVSx1Q0FBdUM7SUFDckQsT0FBTyxJQUFJLHlCQUF5QixFQUFFLENBQUM7QUFDekMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBRUgsTUFBTSxPQUFnQixzQkFBc0I7O21IQUF0QixzQkFBc0I7dUhBQXRCLHNCQUFzQixjQURuQixNQUFNLGNBQWMsdUNBQXVDOzJGQUM5RCxzQkFBc0I7a0JBRDNDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSx1Q0FBdUMsRUFBQzs7QUFvQnJGLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSxzQkFBc0I7SUFDbkUsS0FBSyxDQUFDLEtBQWE7UUFDakIsSUFBSSxLQUFLLElBQUksSUFBSSxFQUFFO1lBQ2pCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3BELE9BQU8sRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBTyxJQUFJLEVBQUUsR0FBRyxFQUFPLElBQUksRUFBQyxDQUFDO2FBQzFFO2lCQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDckYsT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQU8sSUFBSSxFQUFDLENBQUM7YUFDeEY7aUJBQU0sSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDL0csT0FBTyxFQUFDLElBQUksRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUM7YUFDdEc7U0FDRjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUEwQjtRQUMvQixPQUFPLElBQUksQ0FBQyxDQUFDO1lBQ1QsR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3RILEVBQUUsQ0FBQztJQUNULENBQUM7O3NIQW5CVSx5QkFBeUI7MEhBQXpCLHlCQUF5QjsyRkFBekIseUJBQXlCO2tCQURyQyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtwYWROdW1iZXIsIHRvSW50ZWdlciwgaXNOdW1iZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOR0JfREFURVBJQ0tFUl9QQVJTRVJfRk9STUFUVEVSX0ZBQ1RPUlkoKSB7XG4gIHJldHVybiBuZXcgTmdiRGF0ZUlTT1BhcnNlckZvcm1hdHRlcigpO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0IHNlcnZpY2UgZm9yIHBhcnNpbmcgYW5kIGZvcm1hdHRpbmcgZGF0ZXMgZm9yIHRoZVxuICogW2BOZ2JJbnB1dERhdGVwaWNrZXJgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiSW5wdXREYXRlcGlja2VyKSBkaXJlY3RpdmUuXG4gKiBDb252ZXJ0cyBiZXR3ZWVuIHRoZSBpbnRlcm5hbCBgTmdiRGF0ZVN0cnVjdGAgbW9kZWwgcHJlc2VudGF0aW9uIGFuZCBhIGBzdHJpbmdgIHRoYXQgaXMgZGlzcGxheWVkIGluIHRoZVxuICogaW5wdXQgZWxlbWVudC5cbiAqXG4gKiBXaGVuIHVzZXIgdHlwZXMgc29tZXRoaW5nIGluIHRoZSBpbnB1dCB0aGlzIHNlcnZpY2UgYXR0ZW1wdHMgdG8gcGFyc2UgaXQgaW50byBhIGBOZ2JEYXRlU3RydWN0YCBvYmplY3QuXG4gKiBBbmQgdmljZSB2ZXJzYSwgd2hlbiB1c2VycyBzZWxlY3RzIGEgZGF0ZSBpbiB0aGUgY2FsZW5kYXIgd2l0aCB0aGUgbW91c2UsIGl0IG11c3QgYmUgZGlzcGxheWVkIGFzIGEgYHN0cmluZ2BcbiAqIGluIHRoZSBpbnB1dC5cbiAqXG4gKiBEZWZhdWx0IGltcGxlbWVudGF0aW9uIHVzZXMgdGhlIElTTyA4NjAxIGZvcm1hdCwgYnV0IHlvdSBjYW4gcHJvdmlkZSBhbm90aGVyIGltcGxlbWVudGF0aW9uIHZpYSBESVxuICogdG8gdXNlIGFuIGFsdGVybmF0aXZlIHN0cmluZyBmb3JtYXQgb3IgYSBjdXN0b20gcGFyc2luZyBsb2dpYy5cbiAqXG4gKiBTZWUgdGhlIFtkYXRlIGZvcm1hdCBvdmVydmlld10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvb3ZlcnZpZXcjZGF0ZS1tb2RlbCkgZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290JywgdXNlRmFjdG9yeTogTkdCX0RBVEVQSUNLRVJfUEFSU0VSX0ZPUk1BVFRFUl9GQUNUT1JZfSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gYHN0cmluZ2AgdG8gYW4gYE5nYkRhdGVTdHJ1Y3RgLlxuICAgKlxuICAgKiBJbXBsZW1lbnRhdGlvbnMgc2hvdWxkIHRyeSB0aGVpciBiZXN0IHRvIHByb3ZpZGUgYSByZXN1bHQsIGV2ZW5cbiAgICogcGFydGlhbC4gVGhleSBtdXN0IHJldHVybiBgbnVsbGAgaWYgdGhlIHZhbHVlIGNhbid0IGJlIHBhcnNlZC5cbiAgICovXG4gIGFic3RyYWN0IHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBOZ2JEYXRlU3RydWN0IHwgbnVsbDtcblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgZ2l2ZW4gYE5nYkRhdGVTdHJ1Y3RgIHRvIGEgYHN0cmluZ2AuXG4gICAqXG4gICAqIEltcGxlbWVudGF0aW9ucyBzaG91bGQgcmV0dXJuIGFuIGVtcHR5IHN0cmluZyBpZiB0aGUgZ2l2ZW4gZGF0ZSBpcyBgbnVsbGAsXG4gICAqIGFuZCB0cnkgdGhlaXIgYmVzdCB0byBwcm92aWRlIGEgcGFydGlhbCByZXN1bHQgaWYgdGhlIGdpdmVuIGRhdGUgaXMgaW5jb21wbGV0ZSBvciBpbnZhbGlkLlxuICAgKi9cbiAgYWJzdHJhY3QgZm9ybWF0KGRhdGU6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogc3RyaW5nO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZUlTT1BhcnNlckZvcm1hdHRlciBleHRlbmRzIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIge1xuICBwYXJzZSh2YWx1ZTogc3RyaW5nKTogTmdiRGF0ZVN0cnVjdCB8IG51bGwge1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICBjb25zdCBkYXRlUGFydHMgPSB2YWx1ZS50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgIGlmIChkYXRlUGFydHMubGVuZ3RoID09PSAxICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIHt5ZWFyOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzBdKSwgbW9udGg6IDxhbnk+bnVsbCwgZGF5OiA8YW55Pm51bGx9O1xuICAgICAgfSBlbHNlIGlmIChkYXRlUGFydHMubGVuZ3RoID09PSAyICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1swXSkgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzFdKSkge1xuICAgICAgICByZXR1cm4ge3llYXI6IHRvSW50ZWdlcihkYXRlUGFydHNbMF0pLCBtb250aDogdG9JbnRlZ2VyKGRhdGVQYXJ0c1sxXSksIGRheTogPGFueT5udWxsfTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0ZVBhcnRzLmxlbmd0aCA9PT0gMyAmJiBpc051bWJlcihkYXRlUGFydHNbMF0pICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1sxXSkgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzJdKSkge1xuICAgICAgICByZXR1cm4ge3llYXI6IHRvSW50ZWdlcihkYXRlUGFydHNbMF0pLCBtb250aDogdG9JbnRlZ2VyKGRhdGVQYXJ0c1sxXSksIGRheTogdG9JbnRlZ2VyKGRhdGVQYXJ0c1syXSl9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZvcm1hdChkYXRlOiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGRhdGUgP1xuICAgICAgICBgJHtkYXRlLnllYXJ9LSR7aXNOdW1iZXIoZGF0ZS5tb250aCkgPyBwYWROdW1iZXIoZGF0ZS5tb250aCkgOiAnJ30tJHtpc051bWJlcihkYXRlLmRheSkgPyBwYWROdW1iZXIoZGF0ZS5kYXkpIDogJyd9YCA6XG4gICAgICAgICcnO1xuICB9XG59XG4iXX0=