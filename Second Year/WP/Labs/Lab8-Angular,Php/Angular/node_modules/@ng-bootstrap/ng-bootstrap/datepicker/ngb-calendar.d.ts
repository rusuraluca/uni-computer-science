import { NgbDate } from './ngb-date';
import * as i0 from "@angular/core";
export declare function fromJSDate(jsDate: Date): NgbDate;
export declare function toJSDate(date: NgbDate): Date;
export declare type NgbPeriod = 'y' | 'm' | 'd';
export declare function NGB_DATEPICKER_CALENDAR_FACTORY(): NgbCalendarGregorian;
/**
 * A service that represents the calendar used by the datepicker.
 *
 * The default implementation uses the Gregorian calendar. You can inject it in your own
 * implementations if necessary to simplify `NgbDate` calculations.
 */
export declare abstract class NgbCalendar {
    /**
     * Returns the number of days per week.
     */
    abstract getDaysPerWeek(): number;
    /**
     * Returns an array of months per year.
     *
     * With default calendar we use ISO 8601 and return [1, 2, ..., 12];
     */
    abstract getMonths(year?: number): number[];
    /**
     * Returns the number of weeks per month.
     */
    abstract getWeeksPerMonth(): number;
    /**
     * Returns the weekday number for a given day.
     *
     * With the default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     */
    abstract getWeekday(date: NgbDate): number;
    /**
     * Adds a number of years, months or days to a given date.
     *
     * * `period` can be `y`, `m` or `d` and defaults to day.
     * * `number` defaults to 1.
     *
     * Always returns a new date.
     */
    abstract getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    /**
     * Subtracts a number of years, months or days from a given date.
     *
     * * `period` can be `y`, `m` or `d` and defaults to day.
     * * `number` defaults to 1.
     *
     * Always returns a new date.
     */
    abstract getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    /**
     * Returns the week number for a given week.
     */
    abstract getWeekNumber(week: readonly NgbDate[], firstDayOfWeek: number): number;
    /**
     * Returns the today's date.
     */
    abstract getToday(): NgbDate;
    /**
     * Checks if a date is valid in the current calendar.
     */
    abstract isValid(date?: NgbDate | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCalendar, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCalendar>;
}
export declare class NgbCalendarGregorian extends NgbCalendar {
    getDaysPerWeek(): number;
    getMonths(): number[];
    getWeeksPerMonth(): number;
    getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate;
    getWeekday(date: NgbDate): number;
    getWeekNumber(week: readonly NgbDate[], firstDayOfWeek: number): number;
    getToday(): NgbDate;
    isValid(date?: NgbDate | null): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCalendarGregorian, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCalendarGregorian>;
}
