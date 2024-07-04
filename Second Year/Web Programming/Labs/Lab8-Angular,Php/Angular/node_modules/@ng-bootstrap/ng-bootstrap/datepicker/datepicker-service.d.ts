import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateStruct } from './ngb-date-struct';
import { DatepickerViewModel, NgbDayTemplateData, NgbMarkDisabled } from './datepicker-view-model';
import { Observable } from 'rxjs';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
export declare type DatepickerServiceInputs = Partial<{
    dayTemplateData: NgbDayTemplateData;
    displayMonths: number;
    disabled: boolean;
    firstDayOfWeek: number;
    focusVisible: boolean;
    markDisabled: NgbMarkDisabled;
    maxDate: NgbDate | null;
    minDate: NgbDate | null;
    navigation: 'select' | 'arrows' | 'none';
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    weekdays: TranslationWidth | boolean;
}>;
export declare class NgbDatepickerService {
    private _calendar;
    private _i18n;
    private _VALIDATORS;
    private _model$;
    private _dateSelect$;
    private _state;
    get model$(): Observable<DatepickerViewModel>;
    get dateSelect$(): Observable<NgbDate>;
    set(options: DatepickerServiceInputs): void;
    constructor(_calendar: NgbCalendar, _i18n: NgbDatepickerI18n);
    focus(date?: NgbDate | null): void;
    focusSelect(): void;
    open(date?: NgbDate | null): void;
    select(date?: NgbDate | null, options?: {
        emitEvent?: boolean;
    }): void;
    toValidDate(date?: NgbDateStruct | null, defaultValue?: NgbDate | null): NgbDate | null;
    getMonth(struct: NgbDateStruct): import("./datepicker-view-model").MonthViewModel;
    private _nextState;
    private _patchContexts;
    private _updateState;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDatepickerService>;
}
