import { Injectable } from '@angular/core';
import { TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
export class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekNumbers = false;
        this.weekdays = TranslationWidth.Short;
    }
}
NgbDatepickerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFjLE1BQU0sZUFBZSxDQUFDO0FBQ3RELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUlqRDs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFLRSxrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUNsQixtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUluQixlQUFVLEdBQWlDLFFBQVEsQ0FBQztRQUNwRCxnQkFBVyxHQUF1QyxTQUFTLENBQUM7UUFDNUQsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFeEIsYUFBUSxHQUErQixnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7S0FDL0Q7O2dIQWRZLG1CQUFtQjtvSEFBbkIsbUJBQW1CLGNBRFAsTUFBTTsyRkFDbEIsbUJBQW1CO2tCQUQvQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUcmFuc2xhdGlvbldpZHRofSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEYXlUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dCc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtgTmdiRGF0ZXBpY2tlcmBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlcGlja2VyKSBjb21wb25lbnQuXG4gKlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRhdGVwaWNrZXJzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyQ29uZmlnIHtcbiAgZGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG4gIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGVTdHJ1Y3QsIGN1cnJlbnQ/OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYW55O1xuICBmb290ZXJUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgZGlzcGxheU1vbnRocyA9IDE7XG4gIGZpcnN0RGF5T2ZXZWVrID0gMTtcbiAgbWFya0Rpc2FibGVkOiAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudD86IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuICBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuICBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnID0gJ3NlbGVjdCc7XG4gIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nID0gJ3Zpc2libGUnO1xuICBzaG93V2Vla051bWJlcnMgPSBmYWxzZTtcbiAgc3RhcnREYXRlOiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfTtcbiAgd2Vla2RheXM6IFRyYW5zbGF0aW9uV2lkdGggfCBib29sZWFuID0gVHJhbnNsYXRpb25XaWR0aC5TaG9ydDtcbn1cbiJdfQ==