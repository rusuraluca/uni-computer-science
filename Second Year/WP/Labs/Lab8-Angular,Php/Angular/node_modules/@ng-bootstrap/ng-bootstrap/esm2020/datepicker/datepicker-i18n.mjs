import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { formatDate, FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
export function NGB_DATEPICKER_18N_FACTORY(locale) {
    return new NgbDatepickerI18nDefault(locale);
}
/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * weekdays and month names (as explained in the Angular i18n guide).
 *
 * It also provides a way to i18n data that depends on calendar calculations, like aria labels, day, week and year
 * numerals. For other static labels the datepicker uses the default Angular i18n.
 *
 * See the [i18n demo](#/components/datepicker/examples#i18n) and
 * [Hebrew calendar demo](#/components/datepicker/calendars#hebrew) on how to extend this class and define
 * a custom provider for i18n.
 */
export class NgbDatepickerI18n {
    /**
     * Returns the text label to display above the day view.
     *
     * @since 9.1.0
     */
    getMonthLabel(date) {
        return `${this.getMonthFullName(date.month, date.year)} ${this.getYearNumerals(date.year)}`;
    }
    /**
     * Returns the textual representation of a day that is rendered in a day cell.
     *
     * @since 3.0.0
     */
    getDayNumerals(date) { return `${date.day}`; }
    /**
     * Returns the textual representation of a week number rendered by datepicker.
     *
     * @since 3.0.0
     */
    getWeekNumerals(weekNumber) { return `${weekNumber}`; }
    /**
     * Returns the textual representation of a year that is rendered in the datepicker year select box.
     *
     * @since 3.0.0
     */
    getYearNumerals(year) { return `${year}`; }
    /**
     * Returns the week label to display in the heading of the month view.
     *
     * @since 9.1.0
     */
    getWeekLabel() { return ''; }
}
NgbDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [{ token: LOCALE_ID }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [LOCALE_ID] }]
        }] });
/**
 * A service providing default implementation for the datepicker i18n.
 * It can be used as a base implementation if necessary.
 *
 * @since 9.1.0
 */
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    constructor(_locale) {
        super();
        this._locale = _locale;
        this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
        this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
    }
    getWeekdayLabel(weekday, width) {
        const weekdaysStartingOnSunday = getLocaleDayNames(this._locale, FormStyle.Standalone, width === undefined ? TranslationWidth.Short : width);
        const weekdays = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);
        return weekdays[weekday - 1] || '';
    }
    getMonthShortName(month) { return this._monthsShort[month - 1] || ''; }
    getMonthFullName(month) { return this._monthsFull[month - 1] || ''; }
    getDayAriaLabel(date) {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this._locale);
    }
}
NgbDatepickerI18nDefault.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerI18nDefault.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pMThuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pMThuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1RCxPQUFPLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQUdoSCxNQUFNLFVBQVUsMEJBQTBCLENBQUMsTUFBTTtJQUMvQyxPQUFPLElBQUksd0JBQXdCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsQ0FBQztBQUVEOzs7Ozs7Ozs7Ozs7R0FZRztBQUVILE1BQU0sT0FBZ0IsaUJBQWlCO0lBc0JyQzs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLElBQW1CO1FBQy9CLE9BQU8sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUM5RixDQUFDO0lBU0Q7Ozs7T0FJRztJQUNILGNBQWMsQ0FBQyxJQUFtQixJQUFZLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXJFOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsVUFBa0IsSUFBWSxPQUFPLEdBQUcsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXZFOzs7O09BSUc7SUFDSCxlQUFlLENBQUMsSUFBWSxJQUFZLE9BQU8sR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFM0Q7Ozs7T0FJRztJQUNILFlBQVksS0FBYSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7OzhHQWhFakIsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FEZCxNQUFNLGNBQWMsMEJBQTBCLGtCQUFTLFNBQVM7MkZBQ25FLGlCQUFpQjtrQkFEdEMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLDBCQUEwQixFQUFFLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFDOztBQW9FM0Y7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsaUJBQWlCO0lBSTdELFlBQXVDLE9BQWU7UUFDcEQsS0FBSyxFQUFFLENBQUM7UUFENkIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUdwRCxJQUFJLENBQUMsWUFBWSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0YsQ0FBQztJQUVELGVBQWUsQ0FBQyxPQUFlLEVBQUUsS0FBd0I7UUFDdkQsTUFBTSx3QkFBd0IsR0FDMUIsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEgsTUFBTSxRQUFRLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6RyxPQUFPLFFBQVEsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxLQUFhLElBQVksT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXZGLGdCQUFnQixDQUFDLEtBQWEsSUFBWSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFckYsZUFBZSxDQUFDLElBQW1CO1FBQ2pDLE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdELE9BQU8sVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3RELENBQUM7O3FIQXpCVSx3QkFBd0Isa0JBSWYsU0FBUzt5SEFKbEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBRHBDLFVBQVU7OzBCQUtJLE1BQU07MkJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBMT0NBTEVfSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtmb3JtYXREYXRlLCBGb3JtU3R5bGUsIGdldExvY2FsZURheU5hbWVzLCBnZXRMb2NhbGVNb250aE5hbWVzLCBUcmFuc2xhdGlvbldpZHRofSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBOR0JfREFURVBJQ0tFUl8xOE5fRkFDVE9SWShsb2NhbGUpIHtcbiAgcmV0dXJuIG5ldyBOZ2JEYXRlcGlja2VySTE4bkRlZmF1bHQobG9jYWxlKTtcbn1cblxuLyoqXG4gKiBBIHNlcnZpY2Ugc3VwcGx5aW5nIGkxOG4gZGF0YSB0byB0aGUgZGF0ZXBpY2tlciBjb21wb25lbnQuXG4gKlxuICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBzZXJ2aWNlIHVzZXMgdGhlIEFuZ3VsYXIgbG9jYWxlIGFuZCByZWdpc3RlcmVkIGxvY2FsZSBkYXRhIGZvclxuICogd2Vla2RheXMgYW5kIG1vbnRoIG5hbWVzIChhcyBleHBsYWluZWQgaW4gdGhlIEFuZ3VsYXIgaTE4biBndWlkZSkuXG4gKlxuICogSXQgYWxzbyBwcm92aWRlcyBhIHdheSB0byBpMThuIGRhdGEgdGhhdCBkZXBlbmRzIG9uIGNhbGVuZGFyIGNhbGN1bGF0aW9ucywgbGlrZSBhcmlhIGxhYmVscywgZGF5LCB3ZWVrIGFuZCB5ZWFyXG4gKiBudW1lcmFscy4gRm9yIG90aGVyIHN0YXRpYyBsYWJlbHMgdGhlIGRhdGVwaWNrZXIgdXNlcyB0aGUgZGVmYXVsdCBBbmd1bGFyIGkxOG4uXG4gKlxuICogU2VlIHRoZSBbaTE4biBkZW1vXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9leGFtcGxlcyNpMThuKSBhbmRcbiAqIFtIZWJyZXcgY2FsZW5kYXIgZGVtb10oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvY2FsZW5kYXJzI2hlYnJldykgb24gaG93IHRvIGV4dGVuZCB0aGlzIGNsYXNzIGFuZCBkZWZpbmVcbiAqIGEgY3VzdG9tIHByb3ZpZGVyIGZvciBpMThuLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnLCB1c2VGYWN0b3J5OiBOR0JfREFURVBJQ0tFUl8xOE5fRkFDVE9SWSwgZGVwczogW0xPQ0FMRV9JRF19KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYkRhdGVwaWNrZXJJMThuIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHdlZWtkYXkgbGFiZWwgdXNpbmcgc3BlY2lmaWVkIHdpZHRoXG4gICAqXG4gICAqIEBzaW5jZSA5LjEuMFxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0V2Vla2RheUxhYmVsKHdlZWtkYXk6IG51bWJlciwgd2lkdGg/OiBUcmFuc2xhdGlvbldpZHRoKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaG9ydCBtb250aCBuYW1lIHRvIGRpc3BsYXkgaW4gdGhlIGRhdGUgcGlja2VyIG5hdmlnYXRpb24uXG4gICAqXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIsIHllYXI/OiBudW1iZXIpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bGwgbW9udGggbmFtZSB0byBkaXNwbGF5IGluIHRoZSBkYXRlIHBpY2tlciBuYXZpZ2F0aW9uLlxuICAgKlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRNb250aEZ1bGxOYW1lKG1vbnRoOiBudW1iZXIsIHllYXI/OiBudW1iZXIpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHQgbGFiZWwgdG8gZGlzcGxheSBhYm92ZSB0aGUgZGF5IHZpZXcuXG4gICAqXG4gICAqIEBzaW5jZSA5LjEuMFxuICAgKi9cbiAgZ2V0TW9udGhMYWJlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gYCR7dGhpcy5nZXRNb250aEZ1bGxOYW1lKGRhdGUubW9udGgsIGRhdGUueWVhcil9ICR7dGhpcy5nZXRZZWFyTnVtZXJhbHMoZGF0ZS55ZWFyKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSBgYXJpYS1sYWJlbGAgYXR0cmlidXRlIGZvciBhIHNwZWNpZmljIGRhdGUuXG4gICAqXG4gICAqIEBzaW5jZSAyLjAuMFxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRleHR1YWwgcmVwcmVzZW50YXRpb24gb2YgYSBkYXkgdGhhdCBpcyByZW5kZXJlZCBpbiBhIGRheSBjZWxsLlxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIGdldERheU51bWVyYWxzKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcgeyByZXR1cm4gYCR7ZGF0ZS5kYXl9YDsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgd2VlayBudW1iZXIgcmVuZGVyZWQgYnkgZGF0ZXBpY2tlci5cbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBnZXRXZWVrTnVtZXJhbHMod2Vla051bWJlcjogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIGAke3dlZWtOdW1iZXJ9YDsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgeWVhciB0aGF0IGlzIHJlbmRlcmVkIGluIHRoZSBkYXRlcGlja2VyIHllYXIgc2VsZWN0IGJveC5cbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBnZXRZZWFyTnVtZXJhbHMoeWVhcjogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIGAke3llYXJ9YDsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB3ZWVrIGxhYmVsIHRvIGRpc3BsYXkgaW4gdGhlIGhlYWRpbmcgb2YgdGhlIG1vbnRoIHZpZXcuXG4gICAqXG4gICAqIEBzaW5jZSA5LjEuMFxuICAgKi9cbiAgZ2V0V2Vla0xhYmVsKCk6IHN0cmluZyB7IHJldHVybiAnJzsgfVxufVxuXG4vKipcbiAqIEEgc2VydmljZSBwcm92aWRpbmcgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBmb3IgdGhlIGRhdGVwaWNrZXIgaTE4bi5cbiAqIEl0IGNhbiBiZSB1c2VkIGFzIGEgYmFzZSBpbXBsZW1lbnRhdGlvbiBpZiBuZWNlc3NhcnkuXG4gKlxuICogQHNpbmNlIDkuMS4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VySTE4bkRlZmF1bHQgZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIHByaXZhdGUgX21vbnRoc1Nob3J0OiByZWFkb25seSBzdHJpbmdbXTtcbiAgcHJpdmF0ZSBfbW9udGhzRnVsbDogcmVhZG9ubHkgc3RyaW5nW107XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgX2xvY2FsZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX21vbnRoc1Nob3J0ID0gZ2V0TG9jYWxlTW9udGhOYW1lcyhfbG9jYWxlLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZCk7XG4gICAgdGhpcy5fbW9udGhzRnVsbCA9IGdldExvY2FsZU1vbnRoTmFtZXMoX2xvY2FsZSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSk7XG4gIH1cblxuICBnZXRXZWVrZGF5TGFiZWwod2Vla2RheTogbnVtYmVyLCB3aWR0aD86IFRyYW5zbGF0aW9uV2lkdGgpOiBzdHJpbmcge1xuICAgIGNvbnN0IHdlZWtkYXlzU3RhcnRpbmdPblN1bmRheSA9XG4gICAgICAgIGdldExvY2FsZURheU5hbWVzKHRoaXMuX2xvY2FsZSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIHdpZHRoID09PSB1bmRlZmluZWQgPyBUcmFuc2xhdGlvbldpZHRoLlNob3J0IDogd2lkdGgpO1xuICAgIGNvbnN0IHdlZWtkYXlzID0gd2Vla2RheXNTdGFydGluZ09uU3VuZGF5Lm1hcCgoZGF5LCBpbmRleCkgPT4gd2Vla2RheXNTdGFydGluZ09uU3VuZGF5WyhpbmRleCArIDEpICUgN10pO1xuICAgIHJldHVybiB3ZWVrZGF5c1t3ZWVrZGF5IC0gMV0gfHwgJyc7XG4gIH1cblxuICBnZXRNb250aFNob3J0TmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W21vbnRoIC0gMV0gfHwgJyc7IH1cblxuICBnZXRNb250aEZ1bGxOYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbW9udGhzRnVsbFttb250aCAtIDFdIHx8ICcnOyB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIGNvbnN0IGpzRGF0ZSA9IG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5KTtcbiAgICByZXR1cm4gZm9ybWF0RGF0ZShqc0RhdGUsICdmdWxsRGF0ZScsIHRoaXMuX2xvY2FsZSk7XG4gIH1cbn1cbiJdfQ==