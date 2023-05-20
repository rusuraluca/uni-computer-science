import { NgbCalendarGregorian, NgbPeriod } from '../ngb-calendar';
import { NgbDate } from '../ngb-date';
import * as i0 from "@angular/core";
/**
 * @since 9.1.0
 */
export declare class NgbCalendarBuddhist extends NgbCalendarGregorian {
    getToday(): NgbDate;
    getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getWeekday(date: NgbDate): number;
    getWeekNumber(week: readonly NgbDate[], firstDayOfWeek: number): number;
    isValid(date?: NgbDate | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCalendarBuddhist, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCalendarBuddhist>;
}
