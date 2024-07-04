import { TemplateRef } from '@angular/core';
import { TranslationWidth } from '@angular/common';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDateStruct } from './ngb-date-struct';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
export declare class NgbDatepickerConfig {
    dayTemplate: TemplateRef<DayTemplateContext>;
    dayTemplateData: (date: NgbDateStruct, current?: {
        year: number;
        month: number;
    }) => any;
    footerTemplate: TemplateRef<any>;
    displayMonths: number;
    firstDayOfWeek: number;
    markDisabled: (date: NgbDateStruct, current?: {
        year: number;
        month: number;
    }) => boolean;
    minDate: NgbDateStruct;
    maxDate: NgbDateStruct;
    navigation: 'select' | 'arrows' | 'none';
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    showWeekNumbers: boolean;
    startDate: {
        year: number;
        month: number;
    };
    weekdays: TranslationWidth | boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDatepickerConfig>;
}
