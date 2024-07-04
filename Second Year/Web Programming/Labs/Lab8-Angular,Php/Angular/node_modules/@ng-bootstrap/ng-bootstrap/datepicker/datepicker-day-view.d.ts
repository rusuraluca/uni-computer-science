import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import * as i0 from "@angular/core";
export declare class NgbDatepickerDayView {
    i18n: NgbDatepickerI18n;
    currentMonth: number;
    date: NgbDate;
    disabled: boolean;
    focused: boolean;
    selected: boolean;
    constructor(i18n: NgbDatepickerI18n);
    isMuted(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerDayView, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbDatepickerDayView, "[ngbDatepickerDayView]", never, { "currentMonth": "currentMonth"; "date": "date"; "disabled": "disabled"; "focused": "focused"; "selected": "selected"; }, {}, never, never>;
}
