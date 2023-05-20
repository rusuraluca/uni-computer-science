import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { TranslationWidth } from '@angular/common';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDatepickerService } from './datepicker-service';
import { DatepickerViewModel, DayViewModel, MonthViewModel, NavigationEvent } from './datepicker-view-model';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbDatepickerConfig } from './datepicker-config';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDateStruct } from './ngb-date-struct';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbDatepickerKeyboardService } from './datepicker-keyboard-service';
import * as i0 from "@angular/core";
/**
 * An event emitted right before the navigation happens and the month displayed by the datepicker changes.
 */
export interface NgbDatepickerNavigateEvent {
    /**
     * The currently displayed month.
     */
    current: {
        year: number;
        month: number;
    } | null;
    /**
     * The month we're navigating to.
     */
    next: {
        year: number;
        month: number;
    };
    /**
     * Calling this function will prevent navigation from happening.
     *
     * @since 4.1.0
     */
    preventDefault: () => void;
}
/**
 * An interface that represents the readonly public state of the datepicker.
 *
 * Accessible via the `datepicker.state` getter
 *
 * @since 5.2.0
 */
export interface NgbDatepickerState {
    /**
     * The earliest date that can be displayed or selected
     */
    readonly minDate: NgbDate | null;
    /**
     * The latest date that can be displayed or selected
     */
    readonly maxDate: NgbDate | null;
    /**
     * The first visible date of currently displayed months
     */
    readonly firstDate: NgbDate;
    /**
     * The last visible date of currently displayed months
     */
    readonly lastDate: NgbDate;
    /**
     * The date currently focused by the datepicker
     */
    readonly focusedDate: NgbDate;
    /**
     * First dates of months currently displayed by the datepicker
     *
     * @since 5.3.0
     */
    readonly months: NgbDate[];
}
/**
 * A directive that marks the content template that customizes the way datepicker months are displayed
 *
 * @since 5.3.0
 */
export declare class NgbDatepickerContent {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbDatepickerContent, "ng-template[ngbDatepickerContent]", never, {}, {}, never>;
}
/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
export declare class NgbDatepicker implements AfterViewInit, OnDestroy, OnChanges, OnInit, ControlValueAccessor {
    private _service;
    private _calendar;
    i18n: NgbDatepickerI18n;
    private _elementRef;
    private _ngbDateAdapter;
    private _ngZone;
    static ngAcceptInputType_autoClose: boolean | string;
    static ngAcceptInputType_navigation: string;
    static ngAcceptInputType_outsideDays: string;
    static ngAcceptInputType_weekdays: boolean | number;
    model: DatepickerViewModel;
    private _defaultDayTemplate;
    private _contentEl;
    contentTemplate: NgbDatepickerContent;
    private _controlValue;
    private _destroyed$;
    private _publicState;
    /**
     * The reference to a custom template for the day.
     *
     * Allows to completely override the way a day 'cell' in the calendar is displayed.
     *
     * See [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext) for the data you get inside.
     */
    dayTemplate: TemplateRef<DayTemplateContext>;
    /**
     * The callback to pass any arbitrary data to the template cell via the
     * [`DayTemplateContext`](#/components/datepicker/api#DayTemplateContext)'s `data` parameter.
     *
     * `current` is the month that is currently displayed by the datepicker.
     *
     * @since 3.3.0
     */
    dayTemplateData: (date: NgbDate, current?: {
        year: number;
        month: number;
    }) => any;
    /**
     * The number of months to display.
     */
    displayMonths: number;
    /**
     * The first day of the week.
     *
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
     */
    firstDayOfWeek: number;
    /**
     * The reference to the custom template for the datepicker footer.
     *
     * @since 3.3.0
     */
    footerTemplate: TemplateRef<any>;
    /**
     * The callback to mark some dates as disabled.
     *
     * It is called for each new date when navigating to a different month.
     *
     * `current` is the month that is currently displayed by the datepicker.
     */
    markDisabled: (date: NgbDate, current?: {
        year: number;
        month: number;
    }) => boolean;
    /**
     * The latest date that can be displayed or selected.
     *
     * If not provided, 'year' select box will display 10 years after the current month.
     */
    maxDate: NgbDateStruct;
    /**
     * The earliest date that can be displayed or selected.
     *
     * If not provided, 'year' select box will display 10 years before the current month.
     */
    minDate: NgbDateStruct;
    /**
     * Navigation type.
     *
     * * `"select"` - select boxes for month and navigation arrows
     * * `"arrows"` - only navigation arrows
     * * `"none"` - no navigation visible at all
     */
    navigation: 'select' | 'arrows' | 'none';
    /**
     * The way of displaying days that don't belong to the current month.
     *
     * * `"visible"` - days are visible
     * * `"hidden"` - days are hidden, white space preserved
     * * `"collapsed"` - days are collapsed, so the datepicker height might change between months
     *
     * For the 2+ months view, days in between months are never shown.
     */
    outsideDays: 'visible' | 'collapsed' | 'hidden';
    /**
     * If `true`, week numbers will be displayed.
     */
    showWeekNumbers: boolean;
    /**
     * The date to open calendar with.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date is provided, calendar will open with current month.
     *
     * You could use `navigateTo(date)` method as an alternative.
     */
    startDate: {
        year: number;
        month: number;
        day?: number;
    };
    /**
     * The way weekdays should be displayed.
     *
     * * `true` - weekdays are displayed using default width
     * * `false` - weekdays are not displayed
     * * `TranslationWidth` - weekdays are displayed using specified width
     *
     * @since 9.1.0
     */
    weekdays: TranslationWidth | boolean;
    /**
     * An event emitted right before the navigation happens and displayed month changes.
     *
     * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
     */
    navigate: EventEmitter<NgbDatepickerNavigateEvent>;
    /**
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `NgbDate`.
     *
     * @since 5.2.0
     */
    dateSelect: EventEmitter<NgbDate>;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_service: NgbDatepickerService, _calendar: NgbCalendar, i18n: NgbDatepickerI18n, config: NgbDatepickerConfig, cd: ChangeDetectorRef, _elementRef: ElementRef<HTMLElement>, _ngbDateAdapter: NgbDateAdapter<any>, _ngZone: NgZone);
    /**
     *  Returns the readonly public state of the datepicker
     *
     * @since 5.2.0
     */
    get state(): NgbDatepickerState;
    /**
     *  Returns the calendar service used in the specific datepicker instance.
     *
     *  @since 5.3.0
     */
    get calendar(): NgbCalendar;
    /**
     *  Focuses on given date.
     */
    focusDate(date?: NgbDateStruct | null): void;
    /**
     *  Selects focused date.
     */
    focusSelect(): void;
    focus(): void;
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date?: {
        year: number;
        month: number;
        day?: number;
    }): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    onDateSelect(date: NgbDate): void;
    onNavigateDateSelect(date: NgbDate): void;
    onNavigateEvent(event: NavigationEvent): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(disabled: boolean): void;
    writeValue(value: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepicker, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbDatepicker, "ngb-datepicker", ["ngbDatepicker"], { "dayTemplate": "dayTemplate"; "dayTemplateData": "dayTemplateData"; "displayMonths": "displayMonths"; "firstDayOfWeek": "firstDayOfWeek"; "footerTemplate": "footerTemplate"; "markDisabled": "markDisabled"; "maxDate": "maxDate"; "minDate": "minDate"; "navigation": "navigation"; "outsideDays": "outsideDays"; "showWeekNumbers": "showWeekNumbers"; "startDate": "startDate"; "weekdays": "weekdays"; }, { "navigate": "navigate"; "dateSelect": "dateSelect"; }, ["contentTemplate"], never>;
}
/**
 * A component that renders one month including all the days, weekdays and week numbers. Can be used inside
 * the `<ng-template ngbDatepickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/datepicker/examples#custommonth)
 *
 * @since 5.3.0
 */
export declare class NgbDatepickerMonth {
    i18n: NgbDatepickerI18n;
    datepicker: NgbDatepicker;
    private _keyboardService;
    private _service;
    /**
     * The first date of month to be rendered.
     *
     * This month must one of the months present in the
     * [datepicker state](#/components/datepicker/api#NgbDatepickerState).
     */
    set month(month: NgbDateStruct);
    viewModel: MonthViewModel;
    constructor(i18n: NgbDatepickerI18n, datepicker: NgbDatepicker, _keyboardService: NgbDatepickerKeyboardService, _service: NgbDatepickerService);
    onKeyDown(event: KeyboardEvent): void;
    doSelect(day: DayViewModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDatepickerMonth, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbDatepickerMonth, "ngb-datepicker-month", never, { "month": "month"; }, {}, never, never>;
}
