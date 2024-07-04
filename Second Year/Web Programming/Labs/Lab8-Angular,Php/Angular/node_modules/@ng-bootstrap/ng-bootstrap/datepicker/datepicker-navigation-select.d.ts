import { EventEmitter, AfterViewChecked, ElementRef, Renderer2 } from '@angular/core';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import * as i0 from "@angular/core";
export declare class NgbDatepickerNavigationSelect implements AfterViewChecked {
    i18n: NgbDatepickerI18n;
    private _renderer;
    date: NgbDate;
    disabled: boolean;
    months: number[];
    years: number[];
    select: EventEmitter<NgbDate>;
    monthSelect: ElementRef;
    yearSelect: ElementRef;
    private _month;
    private _year;
    constructor(i18n: NgbDatepickerI18n, _renderer: Renderer2);
    changeMonth(month: string): void;
    changeYear(year: string): void;
    ngAfterViewChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerNavigationSelect, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbDatepickerNavigationSelect, "ngb-datepicker-navigation-select", never, { "date": "date"; "disabled": "disabled"; "months": "months"; "years": "years"; }, { "select": "select"; }, never, never>;
}
