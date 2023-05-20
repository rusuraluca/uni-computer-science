import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbTypeahead`](#/components/typeahead/api#NgbTypeahead) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
export class NgbTypeaheadConfig {
    constructor() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
        this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
    }
}
NgbTypeaheadConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTypeaheadConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90eXBlYWhlYWQvdHlwZWFoZWFkLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUd6Qzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFEL0I7UUFHRSxhQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixjQUFTLEdBQW1CLENBQUMsY0FBYyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDcEY7OytHQU5ZLGtCQUFrQjttSEFBbEIsa0JBQWtCLGNBRE4sTUFBTTsyRkFDbEIsa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtgTmdiVHlwZWFoZWFkYF0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9hcGkjTmdiVHlwZWFoZWFkKSBjb21wb25lbnQuXG4gKlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHR5cGVhaGVhZHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZENvbmZpZyB7XG4gIGNvbnRhaW5lcjtcbiAgZWRpdGFibGUgPSB0cnVlO1xuICBmb2N1c0ZpcnN0ID0gdHJ1ZTtcbiAgc2hvd0hpbnQgPSBmYWxzZTtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9IFsnYm90dG9tLXN0YXJ0JywgJ2JvdHRvbS1lbmQnLCAndG9wLXN0YXJ0JywgJ3RvcC1lbmQnXTtcbn1cbiJdfQ==