import { Injectable } from '@angular/core';
import { isInteger } from '../../util/util';
import * as i0 from "@angular/core";
export function NGB_DATEPICKER_DATE_ADAPTER_FACTORY() {
    return new NgbDateStructAdapter();
}
/**
 * An abstract service that does the conversion between the internal datepicker `NgbDateStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding datepicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default datepicker implementation assumes we use `NgbDateStruct` as a user model.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details
 * and the [custom adapter demo](#/components/datepicker/examples#adapter) for an example.
 */
export class NgbDateAdapter {
}
NgbDateAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDateAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY }]
        }] });
export class NgbDateStructAdapter extends NgbDateAdapter {
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    fromModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    toModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
}
NgbDateStructAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateStructAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0saUJBQWlCLENBQUM7O0FBRTFDLE1BQU0sVUFBVSxtQ0FBbUM7SUFDakQsT0FBTyxJQUFJLG9CQUFvQixFQUFFLENBQUM7QUFDcEMsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBRUgsTUFBTSxPQUFnQixjQUFjOzsyR0FBZCxjQUFjOytHQUFkLGNBQWMsY0FEWCxNQUFNLGNBQWMsbUNBQW1DOzJGQUMxRCxjQUFjO2tCQURuQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsbUNBQW1DLEVBQUM7O0FBY2pGLE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxjQUE2QjtJQUNyRTs7T0FFRztJQUNILFNBQVMsQ0FBQyxJQUEwQjtRQUNsQyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRixFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUM7SUFDWCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxPQUFPLENBQUMsSUFBMEI7UUFDaEMsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkYsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7WUFDckQsSUFBSSxDQUFDO0lBQ1gsQ0FBQzs7aUhBakJVLG9CQUFvQjtxSEFBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHtpc0ludGVnZXJ9IGZyb20gJy4uLy4uL3V0aWwvdXRpbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOR0JfREFURVBJQ0tFUl9EQVRFX0FEQVBURVJfRkFDVE9SWSgpIHtcbiAgcmV0dXJuIG5ldyBOZ2JEYXRlU3RydWN0QWRhcHRlcigpO1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0IHNlcnZpY2UgdGhhdCBkb2VzIHRoZSBjb252ZXJzaW9uIGJldHdlZW4gdGhlIGludGVybmFsIGRhdGVwaWNrZXIgYE5nYkRhdGVTdHJ1Y3RgIG1vZGVsIGFuZFxuICogYW55IHByb3ZpZGVkIHVzZXIgZGF0ZSBtb2RlbCBgRGAsIGV4LiBhIHN0cmluZywgYSBuYXRpdmUgZGF0ZSwgZXRjLlxuICpcbiAqIFRoZSBhZGFwdGVyIGlzIHVzZWQgKipvbmx5KiogZm9yIGNvbnZlcnNpb24gd2hlbiBiaW5kaW5nIGRhdGVwaWNrZXIgdG8gYSBmb3JtIGNvbnRyb2wsXG4gKiBleC4gYFsobmdNb2RlbCldPVwidXNlckRhdGVNb2RlbFwiYC4gSGVyZSBgdXNlckRhdGVNb2RlbGAgY2FuIGJlIG9mIGFueSB0eXBlLlxuICpcbiAqIFRoZSBkZWZhdWx0IGRhdGVwaWNrZXIgaW1wbGVtZW50YXRpb24gYXNzdW1lcyB3ZSB1c2UgYE5nYkRhdGVTdHJ1Y3RgIGFzIGEgdXNlciBtb2RlbC5cbiAqXG4gKiBTZWUgdGhlIFtkYXRlIGZvcm1hdCBvdmVydmlld10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvb3ZlcnZpZXcjZGF0ZS1tb2RlbCkgZm9yIG1vcmUgZGV0YWlsc1xuICogYW5kIHRoZSBbY3VzdG9tIGFkYXB0ZXIgZGVtb10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvZXhhbXBsZXMjYWRhcHRlcikgZm9yIGFuIGV4YW1wbGUuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCcsIHVzZUZhY3Rvcnk6IE5HQl9EQVRFUElDS0VSX0RBVEVfQURBUFRFUl9GQUNUT1JZfSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlQWRhcHRlcjxEPiB7XG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIHVzZXItbW9kZWwgZGF0ZSBvZiB0eXBlIGBEYCB0byBhbiBgTmdiRGF0ZVN0cnVjdGAgZm9yIGludGVybmFsIHVzZS5cbiAgICovXG4gIGFic3RyYWN0IGZyb21Nb2RlbCh2YWx1ZTogRCB8IG51bGwpOiBOZ2JEYXRlU3RydWN0IHwgbnVsbDtcblxuICAvKipcbiAgICogQ29udmVydHMgYW4gaW50ZXJuYWwgYE5nYkRhdGVTdHJ1Y3RgIGRhdGUgdG8gYSB1c2VyLW1vZGVsIGRhdGUgb2YgdHlwZSBgRGAuXG4gICAqL1xuICBhYnN0cmFjdCB0b01vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogRCB8IG51bGw7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlU3RydWN0QWRhcHRlciBleHRlbmRzIE5nYkRhdGVBZGFwdGVyPE5nYkRhdGVTdHJ1Y3Q+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgTmdiRGF0ZVN0cnVjdCB2YWx1ZSBpbnRvIE5nYkRhdGVTdHJ1Y3QgdmFsdWVcbiAgICovXG4gIGZyb21Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0IHwgbnVsbCk6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsIHtcbiAgICByZXR1cm4gKGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkpID9cbiAgICAgICAge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGgsIGRheTogZGF0ZS5kYXl9IDpcbiAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIE5nYkRhdGVTdHJ1Y3QgdmFsdWUgaW50byBOZ2JEYXRlU3RydWN0IHZhbHVlXG4gICAqL1xuICB0b01vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogTmdiRGF0ZVN0cnVjdCB8IG51bGwge1xuICAgIHJldHVybiAoZGF0ZSAmJiBpc0ludGVnZXIoZGF0ZS55ZWFyKSAmJiBpc0ludGVnZXIoZGF0ZS5tb250aCkgJiYgaXNJbnRlZ2VyKGRhdGUuZGF5KSkgP1xuICAgICAgICB7eWVhcjogZGF0ZS55ZWFyLCBtb250aDogZGF0ZS5tb250aCwgZGF5OiBkYXRlLmRheX0gOlxuICAgICAgICBudWxsO1xuICB9XG59XG4iXX0=