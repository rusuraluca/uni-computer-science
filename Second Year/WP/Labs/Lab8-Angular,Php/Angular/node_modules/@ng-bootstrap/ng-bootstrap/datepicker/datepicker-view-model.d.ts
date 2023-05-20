import { NgbDate } from './ngb-date';
import { NgbDateStruct } from './ngb-date-struct';
import { DayTemplateContext } from './datepicker-day-template-context';
import { TranslationWidth } from '@angular/common';
export declare type NgbMarkDisabled = (date: NgbDateStruct, current?: {
    year: number;
    month: number;
}) => boolean;
export declare type NgbDayTemplateData = (date: NgbDateStruct, current?: {
    year: number;
    month: number;
}) => any;
export declare type DayViewModel = {
    date: NgbDate;
    context: DayTemplateContext;
    tabindex: number;
    ariaLabel: string;
    hidden: boolean;
};
export declare type WeekViewModel = {
    number: number;
    days: DayViewModel[];
    collapsed: boolean;
};
export declare type MonthViewModel = {
    firstDate: NgbDate;
    lastDate: NgbDate;
    number: number;
    year: number;
    weeks: WeekViewModel[];
    weekdays: string[];
};
export declare type DatepickerViewModel = {
    dayTemplateData: NgbDayTemplateData | null;
    disabled: boolean;
    displayMonths: number;
    firstDate: NgbDate | null;
    firstDayOfWeek: number;
    focusDate: NgbDate | null;
    focusVisible: boolean;
    lastDate: NgbDate | null;
    markDisabled: NgbMarkDisabled | null;
    maxDate: NgbDate | null;
    minDate: NgbDate | null;
    months: MonthViewModel[];
    navigation: 'select' | 'arrows' | 'none';
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    prevDisabled: boolean;
    nextDisabled: boolean;
    selectBoxes: {
        years: number[];
        months: number[];
    };
    selectedDate: NgbDate | null;
    weekdayWidth: TranslationWidth;
    weekdaysVisible: boolean;
};
export declare enum NavigationEvent {
    PREV = 0,
    NEXT = 1
}
