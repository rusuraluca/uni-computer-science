import { EventEmitter } from '@angular/core';
import { NavigationEvent, MonthViewModel } from './datepicker-view-model';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import * as i0 from "@angular/core";
export declare class NgbDatepickerNavigation {
    i18n: NgbDatepickerI18n;
    navigation: typeof NavigationEvent;
    date: NgbDate;
    disabled: boolean;
    months: MonthViewModel[];
    showSelect: boolean;
    prevDisabled: boolean;
    nextDisabled: boolean;
    selectBoxes: {
        years: number[];
        months: number[];
    };
    navigate: EventEmitter<NavigationEvent>;
    select: EventEmitter<NgbDate>;
    constructor(i18n: NgbDatepickerI18n);
    onClickPrev(event: MouseEvent): void;
    onClickNext(event: MouseEvent): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerNavigation, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbDatepickerNavigation, "ngb-datepicker-navigation", never, { "date": "date"; "disabled": "disabled"; "months": "months"; "showSelect": "showSelect"; "prevDisabled": "prevDisabled"; "nextDisabled": "nextDisabled"; "selectBoxes": "selectBoxes"; }, { "navigate": "navigate"; "select": "select"; }, never, never>;
}
