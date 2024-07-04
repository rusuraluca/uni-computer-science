import { NgbDate } from '../ngb-date';
import { NgbCalendar, NgbPeriod } from '../ngb-calendar';
import * as i0 from "@angular/core";
/**
 * @since 3.2.0
 */
export declare class NgbCalendarHebrew extends NgbCalendar {
    getDaysPerWeek(): number;
    getMonths(year?: number): number[];
    getWeeksPerMonth(): number;
    isValid(date?: NgbDate | null): boolean;
    getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getWeekday(date: NgbDate): number;
    getWeekNumber(week: readonly NgbDate[], firstDayOfWeek: number): number;
    getToday(): NgbDate;
    /**
     * @since 3.4.0
     */
    toGregorian(date: NgbDate): NgbDate;
    /**
     * @since 3.4.0
     */
    fromGregorian(date: NgbDate): NgbDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCalendarHebrew, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCalendarHebrew>;
}
