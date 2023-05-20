import { Injectable } from '@angular/core';
import { isInteger } from '../util/util';
import * as i0 from "@angular/core";
export function NGB_DATEPICKER_TIME_ADAPTER_FACTORY() {
    return new NgbTimeStructAdapter();
}
/**
 * An abstract service that does the conversion between the internal timepicker `NgbTimeStruct` model and
 * any provided user time model `T`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding timepicker to a form control,
 * ex. `[(ngModel)]="userTimeModel"`. Here `userTimeModel` can be of any type.
 *
 * The default timepicker implementation assumes we use `NgbTimeStruct` as a user model.
 *
 * See the [custom time adapter demo](#/components/timepicker/examples#adapter) for an example.
 *
 * @since 2.2.0
 */
export class NgbTimeAdapter {
}
NgbTimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, providedIn: 'root', useFactory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY }]
        }] });
export class NgbTimeStructAdapter extends NgbTimeAdapter {
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    fromModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    toModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
}
NgbTimeStructAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbTimeStructAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLXRpbWUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aW1lcGlja2VyL25nYi10aW1lLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDOztBQUV2QyxNQUFNLFVBQVUsbUNBQW1DO0lBQ2pELE9BQU8sSUFBSSxvQkFBb0IsRUFBRSxDQUFDO0FBQ3BDLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFFSCxNQUFNLE9BQWdCLGNBQWM7OzJHQUFkLGNBQWM7K0dBQWQsY0FBYyxjQURYLE1BQU0sY0FBYyxtQ0FBbUM7MkZBQzFELGNBQWM7a0JBRG5DLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxtQ0FBbUMsRUFBQzs7QUFjakYsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGNBQTZCO0lBQ3JFOztPQUVHO0lBQ0gsU0FBUyxDQUFDLElBQTBCO1FBQ2xDLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ2xHLElBQUksQ0FBQztJQUNYLENBQUM7SUFFRDs7T0FFRztJQUNILE9BQU8sQ0FBQyxJQUEwQjtRQUNoQyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQU0sSUFBSSxFQUFDLENBQUMsQ0FBQztZQUNsRyxJQUFJLENBQUM7SUFDWCxDQUFDOztpSEFqQlUsb0JBQW9CO3FIQUFwQixvQkFBb0I7MkZBQXBCLG9CQUFvQjtrQkFEaEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYlRpbWVTdHJ1Y3R9IGZyb20gJy4vbmdiLXRpbWUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gTkdCX0RBVEVQSUNLRVJfVElNRV9BREFQVEVSX0ZBQ1RPUlkoKSB7XG4gIHJldHVybiBuZXcgTmdiVGltZVN0cnVjdEFkYXB0ZXIoKTtcbn1cblxuLyoqXG4gKiBBbiBhYnN0cmFjdCBzZXJ2aWNlIHRoYXQgZG9lcyB0aGUgY29udmVyc2lvbiBiZXR3ZWVuIHRoZSBpbnRlcm5hbCB0aW1lcGlja2VyIGBOZ2JUaW1lU3RydWN0YCBtb2RlbCBhbmRcbiAqIGFueSBwcm92aWRlZCB1c2VyIHRpbWUgbW9kZWwgYFRgLCBleC4gYSBzdHJpbmcsIGEgbmF0aXZlIGRhdGUsIGV0Yy5cbiAqXG4gKiBUaGUgYWRhcHRlciBpcyB1c2VkICoqb25seSoqIGZvciBjb252ZXJzaW9uIHdoZW4gYmluZGluZyB0aW1lcGlja2VyIHRvIGEgZm9ybSBjb250cm9sLFxuICogZXguIGBbKG5nTW9kZWwpXT1cInVzZXJUaW1lTW9kZWxcImAuIEhlcmUgYHVzZXJUaW1lTW9kZWxgIGNhbiBiZSBvZiBhbnkgdHlwZS5cbiAqXG4gKiBUaGUgZGVmYXVsdCB0aW1lcGlja2VyIGltcGxlbWVudGF0aW9uIGFzc3VtZXMgd2UgdXNlIGBOZ2JUaW1lU3RydWN0YCBhcyBhIHVzZXIgbW9kZWwuXG4gKlxuICogU2VlIHRoZSBbY3VzdG9tIHRpbWUgYWRhcHRlciBkZW1vXSgjL2NvbXBvbmVudHMvdGltZXBpY2tlci9leGFtcGxlcyNhZGFwdGVyKSBmb3IgYW4gZXhhbXBsZS5cbiAqXG4gKiBAc2luY2UgMi4yLjBcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290JywgdXNlRmFjdG9yeTogTkdCX0RBVEVQSUNLRVJfVElNRV9BREFQVEVSX0ZBQ1RPUll9KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYlRpbWVBZGFwdGVyPFQ+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgdXNlci1tb2RlbCB0aW1lIG9mIHR5cGUgYFRgIHRvIGFuIGBOZ2JUaW1lU3RydWN0YCBmb3IgaW50ZXJuYWwgdXNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZnJvbU1vZGVsKHZhbHVlOiBUIHwgbnVsbCk6IE5nYlRpbWVTdHJ1Y3QgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhbiBpbnRlcm5hbCBgTmdiVGltZVN0cnVjdGAgdGltZSB0byBhIHVzZXItbW9kZWwgdGltZSBvZiB0eXBlIGBUYC5cbiAgICovXG4gIGFic3RyYWN0IHRvTW9kZWwodGltZTogTmdiVGltZVN0cnVjdCB8IG51bGwpOiBUIHwgbnVsbDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYlRpbWVTdHJ1Y3RBZGFwdGVyIGV4dGVuZHMgTmdiVGltZUFkYXB0ZXI8TmdiVGltZVN0cnVjdD4ge1xuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JUaW1lU3RydWN0IHZhbHVlIGludG8gTmdiVGltZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgZnJvbU1vZGVsKHRpbWU6IE5nYlRpbWVTdHJ1Y3QgfCBudWxsKTogTmdiVGltZVN0cnVjdCB8IG51bGwge1xuICAgIHJldHVybiAodGltZSAmJiBpc0ludGVnZXIodGltZS5ob3VyKSAmJiBpc0ludGVnZXIodGltZS5taW51dGUpKSA/XG4gICAgICAgIHtob3VyOiB0aW1lLmhvdXIsIG1pbnV0ZTogdGltZS5taW51dGUsIHNlY29uZDogaXNJbnRlZ2VyKHRpbWUuc2Vjb25kKSA/IHRpbWUuc2Vjb25kIDogPGFueT5udWxsfSA6XG4gICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JUaW1lU3RydWN0IHZhbHVlIGludG8gTmdiVGltZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgdG9Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0IHwgbnVsbCk6IE5nYlRpbWVTdHJ1Y3QgfCBudWxsIHtcbiAgICByZXR1cm4gKHRpbWUgJiYgaXNJbnRlZ2VyKHRpbWUuaG91cikgJiYgaXNJbnRlZ2VyKHRpbWUubWludXRlKSkgP1xuICAgICAgICB7aG91cjogdGltZS5ob3VyLCBtaW51dGU6IHRpbWUubWludXRlLCBzZWNvbmQ6IGlzSW50ZWdlcih0aW1lLnNlY29uZCkgPyB0aW1lLnNlY29uZCA6IDxhbnk+bnVsbH0gOlxuICAgICAgICBudWxsO1xuICB9XG59XG4iXX0=