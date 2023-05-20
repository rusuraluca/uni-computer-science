import { Injectable } from '@angular/core';
import { NgbDatepickerConfig } from './datepicker-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbDatepickerInput`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepicker inputs used in the application.
 *
 * @since 5.2.0
 */
export class NgbInputDatepickerConfig extends NgbDatepickerConfig {
    constructor() {
        super(...arguments);
        this.autoClose = true;
        this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
        this.restoreFocus = true;
    }
}
NgbInputDatepickerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbInputDatepickerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9kYXRlcGlja2VyLWlucHV0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDOztBQUd4RDs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLHdCQUF5QixTQUFRLG1CQUFtQjtJQURqRTs7UUFFRSxjQUFTLEdBQW1DLElBQUksQ0FBQztRQUdqRCxjQUFTLEdBQW1CLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkYsaUJBQVksR0FBZ0MsSUFBSSxDQUFDO0tBQ2xEOztxSEFOWSx3QkFBd0I7eUhBQXhCLHdCQUF3QixjQURaLE1BQU07MkZBQ2xCLHdCQUF3QjtrQkFEcEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYkRhdGVwaWNrZXJDb25maWd9IGZyb20gJy4vZGF0ZXBpY2tlci1jb25maWcnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8qKlxuICogQSBjb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBbYE5nYkRhdGVwaWNrZXJJbnB1dGBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JEYXRlcGlja2VyKSBjb21wb25lbnQuXG4gKlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRhdGVwaWNrZXIgaW5wdXRzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JJbnB1dERhdGVwaWNrZXJDb25maWcgZXh0ZW5kcyBOZ2JEYXRlcGlja2VyQ29uZmlnIHtcbiAgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ2luc2lkZScgfCAnb3V0c2lkZScgPSB0cnVlO1xuICBjb250YWluZXI6IG51bGwgfCAnYm9keSc7XG4gIHBvc2l0aW9uVGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9IFsnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnLCAndG9wLXN0YXJ0JywgJ3RvcC1lbmQnXTtcbiAgcmVzdG9yZUZvY3VzOiB0cnVlIHwgSFRNTEVsZW1lbnQgfCBzdHJpbmcgPSB0cnVlO1xufVxuIl19