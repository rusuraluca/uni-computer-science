import { TranslationWidth } from '@angular/common';
import { NgbDateStruct } from './ngb-date-struct';
import * as i0 from "@angular/core";
export declare function NGB_DATEPICKER_18N_FACTORY(locale: any): NgbDatepickerI18nDefault;
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
export declare abstract class NgbDatepickerI18n {
    /**
     * Returns the weekday label using specified width
     *
     * @since 9.1.0
     */
    abstract getWeekdayLabel(weekday: number, width?: TranslationWidth): string;
    /**
     * Returns the short month name to display in the date picker navigation.
     *
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     */
    abstract getMonthShortName(month: number, year?: number): string;
    /**
     * Returns the full month name to display in the date picker navigation.
     *
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     */
    abstract getMonthFullName(month: number, year?: number): string;
    /**
     * Returns the text label to display above the day view.
     *
     * @since 9.1.0
     */
    getMonthLabel(date: NgbDateStruct): string;
    /**
     * Returns the value of the `aria-label` attribute for a specific date.
     *
     * @since 2.0.0
     */
    abstract getDayAriaLabel(date: NgbDateStruct): string;
    /**
     * Returns the textual representation of a day that is rendered in a day cell.
     *
     * @since 3.0.0
     */
    getDayNumerals(date: NgbDateStruct): string;
    /**
     * Returns the textual representation of a week number rendered by datepicker.
     *
     * @since 3.0.0
     */
    getWeekNumerals(weekNumber: number): string;
    /**
     * Returns the textual representation of a year that is rendered in the datepicker year select box.
     *
     * @since 3.0.0
     */
    getYearNumerals(year: number): string;
    /**
     * Returns the week label to display in the heading of the month view.
     *
     * @since 9.1.0
     */
    getWeekLabel(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerI18n, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDatepickerI18n>;
}
/**
 * A service providing default implementation for the datepicker i18n.
 * It can be used as a base implementation if necessary.
 *
 * @since 9.1.0
 */
export declare class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    private _locale;
    private _monthsShort;
    private _monthsFull;
    constructor(_locale: string);
    getWeekdayLabel(weekday: number, width?: TranslationWidth): string;
    getMonthShortName(month: number): string;
    getMonthFullName(month: number): string;
    getDayAriaLabel(date: NgbDateStruct): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerI18nDefault, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDatepickerI18nDefault>;
}
