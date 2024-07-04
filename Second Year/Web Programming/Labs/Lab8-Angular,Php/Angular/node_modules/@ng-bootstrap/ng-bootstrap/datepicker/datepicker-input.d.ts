import { ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, Renderer2, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { TranslationWidth } from '@angular/common';
import { AbstractControl, ControlValueAccessor, ValidationErrors, Validator } from '@angular/forms';
import { PlacementArray } from '../util/positioning';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepickerNavigateEvent } from './datepicker';
import { DayTemplateContext } from './datepicker-day-template-context';
import { NgbCalendar } from './ngb-calendar';
import { NgbDate } from './ngb-date';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
import { NgbDateStruct } from './ngb-date-struct';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import * as i0 from "@angular/core";
/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
export declare class NgbInputDatepicker implements OnChanges, OnDestroy, ControlValueAccessor, Validator {
    private _parserFormatter;
    private _elRef;
    private _vcRef;
    private _renderer;
    private _ngZone;
    private _calendar;
    private _dateAdapter;
    private _document;
    private _changeDetector;
    static ngAcceptInputType_autoClose: boolean | string;
    static ngAcceptInputType_disabled: boolean | '';
    static ngAcceptInputType_navigation: string;
    static ngAcceptInputType_outsideDays: string;
    static ngAcceptInputType_weekdays: boolean | number;
    private _cRef;
    private _disabled;
    private _elWithFocus;
    private _model;
    private _inputValue;
    private _zoneSubscription;
    private _positioning;
    private _destroyCloseHandlers$;
    /**
     * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
     *
     * * `true` - the popup will close on both date selection and outside click.
     * * `false` - the popup can only be closed manually via `close()` or `toggle()` methods.
     * * `"inside"` - the popup will close on date selection, but not outside clicks.
     * * `"outside"` - the popup will close only on the outside click and not on date selection/inside clicks.
     *
     * @since 3.0.0
     */
    autoClose: boolean | 'inside' | 'outside';
    /**
     * An optional class applied to the datepicker popup element.
     *
     * @since 9.1.0
     */
    datepickerClass: string;
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
     * The earliest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years before the current month.
     */
    minDate: NgbDateStruct;
    /**
     * The latest date that can be displayed or selected. Also used for form validation.
     *
     * If not provided, 'year' select box will display 10 years after the current month.
     */
    maxDate: NgbDateStruct;
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
     * The preferred placement of the datepicker popup, among the [possible values](#/guides/positioning#api).
     *
     * The default order of preference is `"bottom-start bottom-end top-start top-end"`
     *
     * Please see the [positioning overview](#/positioning) for more details.
     */
    placement: PlacementArray;
    /**
     * If `true`, when closing datepicker will focus element that was focused before datepicker was opened.
     *
     * Alternatively you could provide a selector or an `HTMLElement` to focus. If the element doesn't exist or invalid,
     * we'll fallback to focus document body.
     *
     * @since 5.2.0
     */
    restoreFocus: true | string | HTMLElement;
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
     * A selector specifying the element the datepicker popup should be appended to.
     *
     * Currently only supports `"body"`.
     */
    container: string;
    /**
     * A css selector or html element specifying the element the datepicker popup should be positioned against.
     *
     * By default the input is used as a target.
     *
     * @since 4.2.0
     */
    positionTarget: string | HTMLElement;
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
     * An event emitted when user selects a date using keyboard or mouse.
     *
     * The payload of the event is currently selected `NgbDate`.
     *
     * @since 1.1.1
     */
    dateSelect: EventEmitter<NgbDate>;
    /**
     * Event emitted right after the navigation happens and displayed month changes.
     *
     * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
     */
    navigate: EventEmitter<NgbDatepickerNavigateEvent>;
    /**
     * An event fired after closing datepicker window.
     *
     * @since 4.2.0
     */
    closed: EventEmitter<void>;
    get disabled(): any;
    set disabled(value: any);
    private _onChange;
    private _onTouched;
    private _validatorChange;
    constructor(_parserFormatter: NgbDateParserFormatter, _elRef: ElementRef<HTMLInputElement>, _vcRef: ViewContainerRef, _renderer: Renderer2, _ngZone: NgZone, _calendar: NgbCalendar, _dateAdapter: NgbDateAdapter<any>, _document: any, _changeDetector: ChangeDetectorRef, config: NgbInputDatepickerConfig);
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    registerOnValidatorChange(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    validate(c: AbstractControl): ValidationErrors | null;
    writeValue(value: any): void;
    manualDateChange(value: string, updateView?: boolean): void;
    isOpen(): boolean;
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open(): void;
    /**
     * Closes the datepicker popup.
     */
    close(): void;
    /**
     * Toggles the datepicker popup.
     */
    toggle(): void;
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
    onBlur(): void;
    onFocus(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private _applyDatepickerInputs;
    private _applyPopupClass;
    private _applyPopupStyling;
    private _subscribeForDatepickerOutputs;
    private _writeModelValue;
    private _fromDateStruct;
    private _setCloseHandlers;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbInputDatepicker, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbInputDatepicker, "input[ngbDatepicker]", ["ngbDatepicker"], { "autoClose": "autoClose"; "datepickerClass": "datepickerClass"; "dayTemplate": "dayTemplate"; "dayTemplateData": "dayTemplateData"; "displayMonths": "displayMonths"; "firstDayOfWeek": "firstDayOfWeek"; "footerTemplate": "footerTemplate"; "markDisabled": "markDisabled"; "minDate": "minDate"; "maxDate": "maxDate"; "navigation": "navigation"; "outsideDays": "outsideDays"; "placement": "placement"; "restoreFocus": "restoreFocus"; "showWeekNumbers": "showWeekNumbers"; "startDate": "startDate"; "container": "container"; "positionTarget": "positionTarget"; "weekdays": "weekdays"; "disabled": "disabled"; }, { "dateSelect": "dateSelect"; "navigate": "navigate"; "closed": "closed"; }, never>;
}
