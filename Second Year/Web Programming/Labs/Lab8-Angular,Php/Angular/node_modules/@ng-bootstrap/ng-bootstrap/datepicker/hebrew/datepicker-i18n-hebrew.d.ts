import { NgbDatepickerI18n } from '../datepicker-i18n';
import { NgbDateStruct } from '../../index';
import { TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * @since 3.2.0
 */
export declare class NgbDatepickerI18nHebrew extends NgbDatepickerI18n {
    getMonthShortName(month: number, year?: number): string;
    getMonthFullName(month: number, year?: number): string;
    getWeekdayLabel(weekday: number, width?: TranslationWidth): string;
    getDayAriaLabel(date: NgbDateStruct): string;
    getDayNumerals(date: NgbDateStruct): string;
    getWeekNumerals(weekNumber: number): string;
    getYearNumerals(year: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerI18nHebrew, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDatepickerI18nHebrew>;
}
