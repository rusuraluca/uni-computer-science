import { Injectable } from '@angular/core';
import { NgbDateNativeAdapter } from './ngb-date-native-adapter';
import * as i0 from "@angular/core";
/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
export class NgbDateNativeUTCAdapter extends NgbDateNativeAdapter {
    _fromNativeDate(date) {
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
    }
    _toNativeDate(date) {
        const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        // avoid 30 -> 1930 conversion
        jsDate.setUTCFullYear(date.year);
        return jsDate;
    }
}
NgbDateNativeUTCAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateNativeUTCAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtbmF0aXZlLXV0Yy1hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvYWRhcHRlcnMvbmdiLWRhdGUtbmF0aXZlLXV0Yy1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7O0FBRS9EOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sdUJBQXdCLFNBQVEsb0JBQW9CO0lBQ3JELGVBQWUsQ0FBQyxJQUFVO1FBQ2xDLE9BQU8sRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUMsQ0FBQztJQUM5RixDQUFDO0lBRVMsYUFBYSxDQUFDLElBQW1CO1FBQ3pDLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RSw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzs7b0hBVlUsdUJBQXVCO3dIQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4uL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge05nYkRhdGVOYXRpdmVBZGFwdGVyfSBmcm9tICcuL25nYi1kYXRlLW5hdGl2ZS1hZGFwdGVyJztcblxuLyoqXG4gKiBTYW1lIGFzIFtgTmdiRGF0ZU5hdGl2ZUFkYXB0ZXJgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjTmdiRGF0ZU5hdGl2ZUFkYXB0ZXIpLCBidXQgd2l0aCBVVEMgZGF0ZXMuXG4gKlxuICogQHNpbmNlIDMuMi4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlTmF0aXZlVVRDQWRhcHRlciBleHRlbmRzIE5nYkRhdGVOYXRpdmVBZGFwdGVyIHtcbiAgcHJvdGVjdGVkIF9mcm9tTmF0aXZlRGF0ZShkYXRlOiBEYXRlKTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgcmV0dXJuIHt5ZWFyOiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCksIG1vbnRoOiBkYXRlLmdldFVUQ01vbnRoKCkgKyAxLCBkYXk6IGRhdGUuZ2V0VVRDRGF0ZSgpfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdG9OYXRpdmVEYXRlKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBEYXRlIHtcbiAgICBjb25zdCBqc0RhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQyhkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSkpO1xuICAgIC8vIGF2b2lkIDMwIC0+IDE5MzAgY29udmVyc2lvblxuICAgIGpzRGF0ZS5zZXRVVENGdWxsWWVhcihkYXRlLnllYXIpO1xuICAgIHJldHVybiBqc0RhdGU7XG4gIH1cbn1cbiJdfQ==