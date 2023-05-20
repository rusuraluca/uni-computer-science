import { Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngbAutoClose } from '../util/autoclose';
import { ngbFocusTrap } from '../util/focus-trap';
import { ngbPositioning } from '../util/positioning';
import { NgbDatepicker } from './datepicker';
import { NgbDate } from './ngb-date';
import { NgbInputDatepickerConfig } from './datepicker-input-config';
import { NgbDatepickerConfig } from './datepicker-config';
import { isString } from '../util/util';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
import * as i1 from "./ngb-date-parser-formatter";
import * as i2 from "./ngb-calendar";
import * as i3 from "./adapters/ngb-date-adapter";
import * as i4 from "./datepicker-input-config";
/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
export class NgbInputDatepicker {
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _ngZone, _calendar, _dateAdapter, _document, _changeDetector, config) {
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._changeDetector = _changeDetector;
        this._cRef = null;
        this._disabled = false;
        this._elWithFocus = null;
        this._model = null;
        this._positioning = ngbPositioning();
        this._destroyCloseHandlers$ = new Subject();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * Event emitted right after the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired after closing datepicker window.
         *
         * @since 4.2.0
         */
        this.closed = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        ['autoClose', 'container', 'positionTarget', 'placement'].forEach(input => this[input] = config[input]);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => this._positioning.update());
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    registerOnValidatorChange(fn) { this._validatorChange = fn; }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    validate(c) {
        const { value } = c;
        if (value != null) {
            const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
            if (!ngbDate) {
                return { 'ngbDate': { invalid: value } };
            }
            if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
                return { 'ngbDate': { minDate: { minDate: this.minDate, actual: value } } };
            }
            if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
                return { 'ngbDate': { maxDate: { maxDate: this.maxDate, actual: value } } };
            }
        }
        return null;
    }
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    manualDateChange(value, updateView = false) {
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    isOpen() { return !!this._cRef; }
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open() {
        if (!this.isOpen()) {
            this._cRef = this._vcRef.createComponent(NgbDatepicker);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this._onTouched();
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            this._elWithFocus = this._document.activeElement;
            ngbFocusTrap(this._ngZone, this._cRef.location.nativeElement, this.closed, true);
            setTimeout(() => this._cRef?.instance.focus());
            let hostElement;
            if (isString(this.positionTarget)) {
                hostElement = this._document.querySelector(this.positionTarget);
            }
            else if (this.positionTarget instanceof HTMLElement) {
                hostElement = this.positionTarget;
            }
            else {
                hostElement = this._elRef.nativeElement;
            }
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._cRef) {
                    this._positioning.createPopper({
                        hostElement,
                        targetElement: this._cRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: addPopperOffset([0, 2])
                    });
                }
            });
            if (this.positionTarget && !hostElement) {
                throw new Error('ngbDatepicker could not find element declared in [positionTarget] to position against.');
            }
            this._setCloseHandlers();
        }
    }
    /**
     * Closes the datepicker popup.
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._destroyCloseHandlers$.next();
            this.closed.emit();
            this._changeDetector.markForCheck();
            // restore focus
            let elementToFocus = this._elWithFocus;
            if (isString(this.restoreFocus)) {
                elementToFocus = this._document.querySelector(this.restoreFocus);
            }
            else if (this.restoreFocus !== undefined) {
                elementToFocus = this.restoreFocus;
            }
            // in IE document.activeElement can contain an object without 'focus()' sometimes
            if (elementToFocus && elementToFocus['focus']) {
                elementToFocus.focus();
            }
            else {
                this._document.body.focus();
            }
            this._positioning.destroy();
        }
    }
    /**
     * Toggles the datepicker popup.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    onBlur() { this._onTouched(); }
    onFocus() { this._elWithFocus = this._elRef.nativeElement; }
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
            if (this.isOpen()) {
                if (changes['minDate']) {
                    this._cRef.instance.minDate = this.minDate;
                }
                if (changes['maxDate']) {
                    this._cRef.instance.maxDate = this.maxDate;
                }
                this._cRef.instance.ngOnChanges(changes);
            }
        }
        if (changes['datepickerClass']) {
            const { currentValue, previousValue } = changes['datepickerClass'];
            this._applyPopupClass(currentValue, previousValue);
        }
        if (changes['autoClose'] && this.isOpen()) {
            this._setCloseHandlers();
        }
    }
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }
    _applyDatepickerInputs(datepickerInstance) {
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekNumbers', 'weekdays']
            .forEach((optionName) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }
    _applyPopupClass(newClass, oldClass) {
        const popupEl = this._cRef?.location.nativeElement;
        if (popupEl) {
            if (newClass) {
                this._renderer.addClass(popupEl, newClass);
            }
            if (oldClass) {
                this._renderer.removeClass(popupEl, oldClass);
            }
        }
    }
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.addClass(nativeElement, 'show');
        if (this.container === 'body') {
            this._renderer.addClass(nativeElement, 'ngb-dp-body');
        }
        this._applyPopupClass(this.datepickerClass);
    }
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe(navigateEvent => this.navigate.emit(navigateEvent));
        datepickerInstance.dateSelect.subscribe(date => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    _writeModelValue(model) {
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    _fromDateStruct(date) {
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next();
        ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this._destroyCloseHandlers$, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
}
NgbInputDatepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepicker, deps: [{ token: i1.NgbDateParserFormatter }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i2.NgbCalendar }, { token: i3.NgbDateAdapter }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i4.NgbInputDatepickerConfig }], target: i0.ɵɵFactoryTarget.Directive });
NgbInputDatepicker.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbInputDatepicker, selector: "input[ngbDatepicker]", inputs: { autoClose: "autoClose", datepickerClass: "datepickerClass", dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", minDate: "minDate", maxDate: "maxDate", navigation: "navigation", outsideDays: "outsideDays", placement: "placement", restoreFocus: "restoreFocus", showWeekNumbers: "showWeekNumbers", startDate: "startDate", container: "container", positionTarget: "positionTarget", weekdays: "weekdays", disabled: "disabled" }, outputs: { dateSelect: "dateSelect", navigate: "navigate", closed: "closed" }, host: { listeners: { "input": "manualDateChange($event.target.value)", "change": "manualDateChange($event.target.value, true)", "focus": "onFocus()", "blur": "onBlur()" }, properties: { "disabled": "disabled" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig }
    ], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepicker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbDatepicker]',
                    exportAs: 'ngbDatepicker',
                    host: {
                        '(input)': 'manualDateChange($event.target.value)',
                        '(change)': 'manualDateChange($event.target.value, true)',
                        '(focus)': 'onFocus()',
                        '(blur)': 'onBlur()',
                        '[disabled]': 'disabled'
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig }
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbDateParserFormatter }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i2.NgbCalendar }, { type: i3.NgbDateAdapter }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i4.NgbInputDatepickerConfig }]; }, propDecorators: { autoClose: [{
                type: Input
            }], datepickerClass: [{
                type: Input
            }], dayTemplate: [{
                type: Input
            }], dayTemplateData: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], markDisabled: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], placement: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], container: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], dateSelect: [{
                type: Output
            }], navigate: [{
                type: Output
            }], closed: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUtQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQW1CLE1BQU0saUJBQWlCLENBQUM7QUFDM0QsT0FBTyxFQUdMLGFBQWEsRUFDYixpQkFBaUIsRUFHbEIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDL0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBaUIsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFHbkUsT0FBTyxFQUFDLGFBQWEsRUFBNkIsTUFBTSxjQUFjLENBQUM7QUFHdkUsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUduQyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNwQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7O0FBRXpEOzs7O0dBSUc7QUFpQkgsTUFBTSxPQUFPLGtCQUFrQjtJQTBON0IsWUFDWSxnQkFBd0MsRUFBVSxNQUFvQyxFQUN0RixNQUF3QixFQUFVLFNBQW9CLEVB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QVdHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBU0csU0FBUztzQkFBakIsS0FBSztnQkFVRyxZQUFZO3NCQUFwQixLQUFLO2dCQUtHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBVUcsU0FBUztzQkFBakIsS0FBSztnQkFPRyxTQUFTO3NCQUFqQixLQUFLO2dCQVNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBV0csUUFBUTtzQkFBaEIsS0FBSztnQkFTSSxVQUFVO3NCQUFuQixNQUFNO2dCQU9HLFFBQVE7c0JBQWpCLE1BQU07Z0JBT0csTUFBTTtzQkFBZixNQUFNO2dCQUdILFFBQVE7c0JBRFgsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnRSZWYsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5ULCBUcmFuc2xhdGlvbldpZHRofSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWJzdHJhY3RDb250cm9sLFxuICBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTkdfVkFMSURBVE9SUyxcbiAgTkdfVkFMVUVfQUNDRVNTT1IsXG4gIFZhbGlkYXRpb25FcnJvcnMsXG4gIFZhbGlkYXRvclxufSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7bmdiQXV0b0Nsb3NlfSBmcm9tICcuLi91dGlsL2F1dG9jbG9zZSc7XG5pbXBvcnQge25nYkZvY3VzVHJhcH0gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7UGxhY2VtZW50QXJyYXksIG5nYlBvc2l0aW9uaW5nfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuaW1wb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnR9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7TmdiSW5wdXREYXRlcGlja2VyQ29uZmlnfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQtY29uZmlnJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckNvbmZpZ30gZnJvbSAnLi9kYXRlcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge2lzU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHthZGRQb3BwZXJPZmZzZXR9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmctdXRpbCc7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhbGxvd3MgdG8gc3RpY2sgYSBkYXRlcGlja2VyIHBvcHVwIHRvIGFuIGlucHV0IGZpZWxkLlxuICpcbiAqIE1hbmFnZXMgaW50ZXJhY3Rpb24gd2l0aCB0aGUgaW5wdXQgZmllbGQgaXRzZWxmLCBkb2VzIHZhbHVlIGZvcm1hdHRpbmcgYW5kIHByb3ZpZGVzIGZvcm1zIGludGVncmF0aW9uLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFtuZ2JEYXRlcGlja2VyXScsXG4gIGV4cG9ydEFzOiAnbmdiRGF0ZXBpY2tlcicsXG4gIGhvc3Q6IHtcbiAgICAnKGlucHV0KSc6ICdtYW51YWxEYXRlQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKScsXG4gICAgJyhmb2N1cyknOiAnb25Gb2N1cygpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLCBtdWx0aTogdHJ1ZX0sXG4gICAge3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksIG11bHRpOiB0cnVlfSxcbiAgICB7cHJvdmlkZTogTmdiRGF0ZXBpY2tlckNvbmZpZywgdXNlRXhpc3Rpbmc6IE5nYklucHV0RGF0ZXBpY2tlckNvbmZpZ31cbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdiSW5wdXREYXRlcGlja2VyIGltcGxlbWVudHMgT25DaGFuZ2VzLFxuICAgIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9hdXRvQ2xvc2U6IGJvb2xlYW4gfCBzdHJpbmc7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbmF2aWdhdGlvbjogc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3V0c2lkZURheXM6IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3dlZWtkYXlzOiBib29sZWFuIHwgbnVtYmVyO1xuXG4gIHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPnwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2VsV2l0aEZvY3VzOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9tb2RlbDogTmdiRGF0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlOiBzdHJpbmc7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcbiAgcHJpdmF0ZSBfcG9zaXRpb25pbmcgPSBuZ2JQb3NpdGlvbmluZygpO1xuICBwcml2YXRlIF9kZXN0cm95Q2xvc2VIYW5kbGVycyQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgY2xvc2VkIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgZGF0ZSBzZWxlY3Rpb24gLyBvdXRzaWRlIGNsaWNrIG9yIG5vdC5cbiAgICpcbiAgICogKiBgdHJ1ZWAgLSB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbiBib3RoIGRhdGUgc2VsZWN0aW9uIGFuZCBvdXRzaWRlIGNsaWNrLlxuICAgKiAqIGBmYWxzZWAgLSB0aGUgcG9wdXAgY2FuIG9ubHkgYmUgY2xvc2VkIG1hbnVhbGx5IHZpYSBgY2xvc2UoKWAgb3IgYHRvZ2dsZSgpYCBtZXRob2RzLlxuICAgKiAqIGBcImluc2lkZVwiYCAtIHRoZSBwb3B1cCB3aWxsIGNsb3NlIG9uIGRhdGUgc2VsZWN0aW9uLCBidXQgbm90IG91dHNpZGUgY2xpY2tzLlxuICAgKiAqIGBcIm91dHNpZGVcImAgLSB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbmx5IG9uIHRoZSBvdXRzaWRlIGNsaWNrIGFuZCBub3Qgb24gZGF0ZSBzZWxlY3Rpb24vaW5zaWRlIGNsaWNrcy5cbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgY2xhc3MgYXBwbGllZCB0byB0aGUgZGF0ZXBpY2tlciBwb3B1cCBlbGVtZW50LlxuICAgKlxuICAgKiBAc2luY2UgOS4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGRhdGVwaWNrZXJDbGFzczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVmZXJlbmNlIHRvIGEgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5LlxuICAgKlxuICAgKiBBbGxvd3MgdG8gY29tcGxldGVseSBvdmVycmlkZSB0aGUgd2F5IGEgZGF5ICdjZWxsJyBpbiB0aGUgY2FsZW5kYXIgaXMgZGlzcGxheWVkLlxuICAgKlxuICAgKiBTZWUgW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSBmb3IgdGhlIGRhdGEgeW91IGdldCBpbnNpZGUuXG4gICAqL1xuICBASW5wdXQoKSBkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0PjtcblxuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRvIHBhc3MgYW55IGFyYml0cmFyeSBkYXRhIHRvIHRoZSB0ZW1wbGF0ZSBjZWxsIHZpYSB0aGVcbiAgICogW2BEYXlUZW1wbGF0ZUNvbnRleHRgXSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9hcGkjRGF5VGVtcGxhdGVDb250ZXh0KSdzIGBkYXRhYCBwYXJhbWV0ZXIuXG4gICAqXG4gICAqIGBjdXJyZW50YCBpcyB0aGUgbW9udGggdGhhdCBpcyBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyLlxuICAgKlxuICAgKiBAc2luY2UgMy4zLjBcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlRGF0YTogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ/OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIG1vbnRocyB0byBkaXNwbGF5LlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vbnRoczogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrLlxuICAgKlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnd2Vla2RheScgaXMgMT1Nb24gLi4uIDc9U3VuLlxuICAgKi9cbiAgQElucHV0KCkgZmlyc3REYXlPZldlZWs6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIHJlZmVyZW5jZSB0byB0aGUgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF0ZXBpY2tlciBmb290ZXIuXG4gICAqXG4gICAqIEBzaW5jZSAzLjMuMFxuICAgKi9cbiAgQElucHV0KCkgZm9vdGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0byBtYXJrIHNvbWUgZGF0ZXMgYXMgZGlzYWJsZWQuXG4gICAqXG4gICAqIEl0IGlzIGNhbGxlZCBmb3IgZWFjaCBuZXcgZGF0ZSB3aGVuIG5hdmlnYXRpbmcgdG8gYSBkaWZmZXJlbnQgbW9udGguXG4gICAqXG4gICAqIGBjdXJyZW50YCBpcyB0aGUgbW9udGggdGhhdCBpcyBjdXJyZW50bHkgZGlzcGxheWVkIGJ5IHRoZSBkYXRlcGlja2VyLlxuICAgKi9cbiAgQElucHV0KCkgbWFya0Rpc2FibGVkOiAoZGF0ZTogTmdiRGF0ZSwgY3VycmVudD86IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZWFybGllc3QgZGF0ZSB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgb3Igc2VsZWN0ZWQuIEFsc28gdXNlZCBmb3IgZm9ybSB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiBJZiBub3QgcHJvdmlkZWQsICd5ZWFyJyBzZWxlY3QgYm94IHdpbGwgZGlzcGxheSAxMCB5ZWFycyBiZWZvcmUgdGhlIGN1cnJlbnQgbW9udGguXG4gICAqL1xuICBASW5wdXQoKSBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBUaGUgbGF0ZXN0IGRhdGUgdGhhdCBjYW4gYmUgZGlzcGxheWVkIG9yIHNlbGVjdGVkLiBBbHNvIHVzZWQgZm9yIGZvcm0gdmFsaWRhdGlvbi5cbiAgICpcbiAgICogSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYWZ0ZXIgdGhlIGN1cnJlbnQgbW9udGguXG4gICAqL1xuICBASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBOYXZpZ2F0aW9uIHR5cGUuXG4gICAqXG4gICAqICogYFwic2VsZWN0XCJgIC0gc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgbmF2aWdhdGlvbiBhcnJvd3NcbiAgICogKiBgXCJhcnJvd3NcImAgLSBvbmx5IG5hdmlnYXRpb24gYXJyb3dzXG4gICAqICogYFwibm9uZVwiYCAtIG5vIG5hdmlnYXRpb24gdmlzaWJsZSBhdCBhbGxcbiAgICovXG4gIEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cbiAgLyoqXG4gICAqIFRoZSB3YXkgb2YgZGlzcGxheWluZyBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIHRoZSBjdXJyZW50IG1vbnRoLlxuICAgKlxuICAgKiAqIGBcInZpc2libGVcImAgLSBkYXlzIGFyZSB2aXNpYmxlXG4gICAqICogYFwiaGlkZGVuXCJgIC0gZGF5cyBhcmUgaGlkZGVuLCB3aGl0ZSBzcGFjZSBwcmVzZXJ2ZWRcbiAgICogKiBgXCJjb2xsYXBzZWRcImAgLSBkYXlzIGFyZSBjb2xsYXBzZWQsIHNvIHRoZSBkYXRlcGlja2VyIGhlaWdodCBtaWdodCBjaGFuZ2UgYmV0d2VlbiBtb250aHNcbiAgICpcbiAgICogRm9yIHRoZSAyKyBtb250aHMgdmlldywgZGF5cyBpbiBiZXR3ZWVuIG1vbnRocyBhcmUgbmV2ZXIgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJztcblxuICAvKipcbiAgICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIGRhdGVwaWNrZXIgcG9wdXAsIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImJvdHRvbS1zdGFydCBib3R0b20tZW5kIHRvcC1zdGFydCB0b3AtZW5kXCJgXG4gICAqXG4gICAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2hlbiBjbG9zaW5nIGRhdGVwaWNrZXIgd2lsbCBmb2N1cyBlbGVtZW50IHRoYXQgd2FzIGZvY3VzZWQgYmVmb3JlIGRhdGVwaWNrZXIgd2FzIG9wZW5lZC5cbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgcHJvdmlkZSBhIHNlbGVjdG9yIG9yIGFuIGBIVE1MRWxlbWVudGAgdG8gZm9jdXMuIElmIHRoZSBlbGVtZW50IGRvZXNuJ3QgZXhpc3Qgb3IgaW52YWxpZCxcbiAgICogd2UnbGwgZmFsbGJhY2sgdG8gZm9jdXMgZG9jdW1lbnQgYm9keS5cbiAgICpcbiAgICogQHNpbmNlIDUuMi4wXG4gICAqL1xuICBASW5wdXQoKSByZXN0b3JlRm9jdXM6IHRydWUgfCBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB3ZWVrIG51bWJlcnMgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBkYXRlIHRvIG9wZW4gY2FsZW5kYXIgd2l0aC5cbiAgICpcbiAgICogV2l0aCB0aGUgZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgaXMgcHJvdmlkZWQsIGNhbGVuZGFyIHdpbGwgb3BlbiB3aXRoIGN1cnJlbnQgbW9udGguXG4gICAqXG4gICAqIFlvdSBjb3VsZCB1c2UgYG5hdmlnYXRlVG8oZGF0ZSlgIG1ldGhvZCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZToge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlciwgZGF5PzogbnVtYmVyfTtcblxuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICpcbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgYFwiYm9keVwiYC5cbiAgICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNzcyBzZWxlY3RvciBvciBodG1sIGVsZW1lbnQgc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgcG9zaXRpb25lZCBhZ2FpbnN0LlxuICAgKlxuICAgKiBCeSBkZWZhdWx0IHRoZSBpbnB1dCBpcyB1c2VkIGFzIGEgdGFyZ2V0LlxuICAgKlxuICAgKiBAc2luY2UgNC4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHBvc2l0aW9uVGFyZ2V0OiBzdHJpbmcgfCBIVE1MRWxlbWVudDtcblxuICAvKipcbiAgICogVGhlIHdheSB3ZWVrZGF5cyBzaG91bGQgYmUgZGlzcGxheWVkLlxuICAgKlxuICAgKiAqIGB0cnVlYCAtIHdlZWtkYXlzIGFyZSBkaXNwbGF5ZWQgdXNpbmcgZGVmYXVsdCB3aWR0aFxuICAgKiAqIGBmYWxzZWAgLSB3ZWVrZGF5cyBhcmUgbm90IGRpc3BsYXllZFxuICAgKiAqIGBUcmFuc2xhdGlvbldpZHRoYCAtIHdlZWtkYXlzIGFyZSBkaXNwbGF5ZWQgdXNpbmcgc3BlY2lmaWVkIHdpZHRoXG4gICAqXG4gICAqIEBzaW5jZSA5LjEuMFxuICAgKi9cbiAgQElucHV0KCkgd2Vla2RheXM6IFRyYW5zbGF0aW9uV2lkdGggfCBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdXNlciBzZWxlY3RzIGEgZGF0ZSB1c2luZyBrZXlib2FyZCBvciBtb3VzZS5cbiAgICpcbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIGN1cnJlbnRseSBzZWxlY3RlZCBgTmdiRGF0ZWAuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMVxuICAgKi9cbiAgQE91dHB1dCgpIGRhdGVTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIG5hdmlnYXRpb24gaGFwcGVucyBhbmQgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG4gICAqXG4gICAqIFNlZSBbYE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50YF0oIy9jb21wb25lbnRzL2RhdGVwaWNrZXIvYXBpI05nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50KSBmb3IgdGhlIHBheWxvYWQgaW5mby5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIGFmdGVyIGNsb3NpbmcgZGF0ZXBpY2tlciB3aW5kb3cuXG4gICAqXG4gICAqIEBzaW5jZSA0LjIuMFxuICAgKi9cbiAgQE91dHB1dCgpIGNsb3NlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgKHZhbHVlICYmIHZhbHVlICE9PSAnZmFsc2UnKTtcblxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl9jUmVmICEuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLl9kaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9ICgpID0+IHt9O1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9wYXJzZXJGb3JtYXR0ZXI6IE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBwcml2YXRlIF9kYXRlQWRhcHRlcjogTmdiRGF0ZUFkYXB0ZXI8YW55PixcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIGNvbmZpZzogTmdiSW5wdXREYXRlcGlja2VyQ29uZmlnKSB7XG4gICAgWydhdXRvQ2xvc2UnLCAnY29udGFpbmVyJywgJ3Bvc2l0aW9uVGFyZ2V0JywgJ3BsYWNlbWVudCddLmZvckVhY2goaW5wdXQgPT4gdGhpc1tpbnB1dF0gPSBjb25maWdbaW5wdXRdKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCkpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fdmFsaWRhdG9yQ2hhbmdlID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHsgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gICAgY29uc3Qge3ZhbHVlfSA9IGM7XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgY29uc3QgbmdiRGF0ZSA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuXG4gICAgICBpZiAoIW5nYkRhdGUpIHtcbiAgICAgICAgcmV0dXJuIHsnbmdiRGF0ZSc6IHtpbnZhbGlkOiB2YWx1ZX19O1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5taW5EYXRlICYmIG5nYkRhdGUuYmVmb3JlKE5nYkRhdGUuZnJvbSh0aGlzLm1pbkRhdGUpKSkge1xuICAgICAgICByZXR1cm4geyduZ2JEYXRlJzoge21pbkRhdGU6IHttaW5EYXRlOiB0aGlzLm1pbkRhdGUsIGFjdHVhbDogdmFsdWV9fX07XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgbmdiRGF0ZS5hZnRlcihOZ2JEYXRlLmZyb20odGhpcy5tYXhEYXRlKSkpIHtcbiAgICAgICAgcmV0dXJuIHsnbmdiRGF0ZSc6IHttYXhEYXRlOiB7bWF4RGF0ZTogdGhpcy5tYXhEYXRlLCBhY3R1YWw6IHZhbHVlfX19O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX21vZGVsID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG4gICAgdGhpcy5fd3JpdGVNb2RlbFZhbHVlKHRoaXMuX21vZGVsKTtcbiAgfVxuXG4gIG1hbnVhbERhdGVDaGFuZ2UodmFsdWU6IHN0cmluZywgdXBkYXRlVmlldyA9IGZhbHNlKSB7XG4gICAgY29uc3QgaW5wdXRWYWx1ZUNoYW5nZWQgPSB2YWx1ZSAhPT0gdGhpcy5faW5wdXRWYWx1ZTtcbiAgICBpZiAoaW5wdXRWYWx1ZUNoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2lucHV0VmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX21vZGVsID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fcGFyc2VyRm9ybWF0dGVyLnBhcnNlKHZhbHVlKSk7XG4gICAgfVxuICAgIGlmIChpbnB1dFZhbHVlQ2hhbmdlZCB8fCAhdXBkYXRlVmlldykge1xuICAgICAgdGhpcy5fb25DaGFuZ2UodGhpcy5fbW9kZWwgPyB0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKHRoaXMuX21vZGVsKSA6ICh2YWx1ZSA9PT0gJycgPyBudWxsIDogdmFsdWUpKTtcbiAgICB9XG4gICAgaWYgKHVwZGF0ZVZpZXcgJiYgdGhpcy5fbW9kZWwpIHtcbiAgICAgIHRoaXMuX3dyaXRlTW9kZWxWYWx1ZSh0aGlzLl9tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgaXNPcGVuKCkgeyByZXR1cm4gISF0aGlzLl9jUmVmOyB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuICAgKlxuICAgKiBJZiB0aGUgcmVsYXRlZCBmb3JtIGNvbnRyb2wgY29udGFpbnMgYSB2YWxpZCBkYXRlLCB0aGUgY29ycmVzcG9uZGluZyBtb250aCB3aWxsIGJlIG9wZW5lZC5cbiAgICovXG4gIG9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl9jUmVmID0gdGhpcy5fdmNSZWYuY3JlYXRlQ29tcG9uZW50KE5nYkRhdGVwaWNrZXIpO1xuXG4gICAgICB0aGlzLl9hcHBseVBvcHVwU3R5bGluZyh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5fYXBwbHlEYXRlcGlja2VySW5wdXRzKHRoaXMuX2NSZWYuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlRm9yRGF0ZXBpY2tlck91dHB1dHModGhpcy5fY1JlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLm5nT25Jbml0KCk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLndyaXRlVmFsdWUodGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkpO1xuXG4gICAgICAvLyBkYXRlIHNlbGVjdGlvbiBldmVudCBoYW5kbGluZ1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5yZWdpc3Rlck9uQ2hhbmdlKChzZWxlY3RlZERhdGUpID0+IHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX2NSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLnNldERpc2FibGVkU3RhdGUodGhpcy5kaXNhYmxlZCk7XG5cbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGZvY3VzIGhhbmRsaW5nXG4gICAgICB0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBuZ2JGb2N1c1RyYXAodGhpcy5fbmdab25lLCB0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2xvc2VkLCB0cnVlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5fY1JlZj8uaW5zdGFuY2UuZm9jdXMoKSk7XG5cbiAgICAgIGxldCBob3N0RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gICAgICBpZiAoaXNTdHJpbmcodGhpcy5wb3NpdGlvblRhcmdldCkpIHtcbiAgICAgICAgaG9zdEVsZW1lbnQgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucG9zaXRpb25UYXJnZXQpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnBvc2l0aW9uVGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgaG9zdEVsZW1lbnQgPSB0aGlzLnBvc2l0aW9uVGFyZ2V0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaG9zdEVsZW1lbnQgPSB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5fY1JlZikge1xuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG4gICAgICAgICAgICBob3N0RWxlbWVudCxcbiAgICAgICAgICAgIHRhcmdldEVsZW1lbnQ6IHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgIHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICBhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG4gICAgICAgICAgICB1cGRhdGVQb3BwZXJPcHRpb25zOiBhZGRQb3BwZXJPZmZzZXQoWzAsIDJdKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMucG9zaXRpb25UYXJnZXQgJiYgIWhvc3RFbGVtZW50KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbmdiRGF0ZXBpY2tlciBjb3VsZCBub3QgZmluZCBlbGVtZW50IGRlY2xhcmVkIGluIFtwb3NpdGlvblRhcmdldF0gdG8gcG9zaXRpb24gYWdhaW5zdC4nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fc2V0Q2xvc2VIYW5kbGVycygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGRhdGVwaWNrZXIgcG9wdXAuXG4gICAqL1xuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fdmNSZWYucmVtb3ZlKHRoaXMuX3ZjUmVmLmluZGV4T2YodGhpcy5fY1JlZiAhLmhvc3RWaWV3KSk7XG4gICAgICB0aGlzLl9jUmVmID0gbnVsbDtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG4gICAgICB0aGlzLmNsb3NlZC5lbWl0KCk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcblxuICAgICAgLy8gcmVzdG9yZSBmb2N1c1xuICAgICAgbGV0IGVsZW1lbnRUb0ZvY3VzOiBIVE1MRWxlbWVudCB8IG51bGwgPSB0aGlzLl9lbFdpdGhGb2N1cztcbiAgICAgIGlmIChpc1N0cmluZyh0aGlzLnJlc3RvcmVGb2N1cykpIHtcbiAgICAgICAgZWxlbWVudFRvRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMucmVzdG9yZUZvY3VzKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXN0b3JlRm9jdXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBlbGVtZW50VG9Gb2N1cyA9IHRoaXMucmVzdG9yZUZvY3VzIGFzIEhUTUxFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICAvLyBpbiBJRSBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBjb250YWluIGFuIG9iamVjdCB3aXRob3V0ICdmb2N1cygpJyBzb21ldGltZXNcbiAgICAgIGlmIChlbGVtZW50VG9Gb2N1cyAmJiBlbGVtZW50VG9Gb2N1c1snZm9jdXMnXSkge1xuICAgICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wb3NpdGlvbmluZy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGRhdGVwaWNrZXIgcG9wdXAuXG4gICAqL1xuICB0b2dnbGUoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgcHJvdmlkZWQgZGF0ZS5cbiAgICpcbiAgICogV2l0aCB0aGUgZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQgY2FsZW5kYXIgd2lsbCBvcGVuIGN1cnJlbnQgbW9udGguXG4gICAqXG4gICAqIFVzZSB0aGUgYFtzdGFydERhdGVdYCBpbnB1dCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAgICovXG4gIG5hdmlnYXRlVG8oZGF0ZT86IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheT86IG51bWJlcn0pIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZiAhLmluc3RhbmNlLm5hdmlnYXRlVG8oZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgb25CbHVyKCkgeyB0aGlzLl9vblRvdWNoZWQoKTsgfVxuXG4gIG9uRm9jdXMoKSB7IHRoaXMuX2VsV2l0aEZvY3VzID0gdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudDsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1snbWluRGF0ZSddIHx8IGNoYW5nZXNbJ21heERhdGUnXSkge1xuICAgICAgdGhpcy5fdmFsaWRhdG9yQ2hhbmdlKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICAgIGlmIChjaGFuZ2VzWydtaW5EYXRlJ10pIHtcbiAgICAgICAgICB0aGlzLl9jUmVmICEuaW5zdGFuY2UubWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2hhbmdlc1snbWF4RGF0ZSddKSB7XG4gICAgICAgICAgdGhpcy5fY1JlZiAhLmluc3RhbmNlLm1heERhdGUgPSB0aGlzLm1heERhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY1JlZiAhLmluc3RhbmNlLm5nT25DaGFuZ2VzKGNoYW5nZXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydkYXRlcGlja2VyQ2xhc3MnXSkge1xuICAgICAgY29uc3Qge2N1cnJlbnRWYWx1ZSwgcHJldmlvdXNWYWx1ZX0gPSBjaGFuZ2VzWydkYXRlcGlja2VyQ2xhc3MnXTtcbiAgICAgIHRoaXMuX2FwcGx5UG9wdXBDbGFzcyhjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydhdXRvQ2xvc2UnXSAmJiB0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5RGF0ZXBpY2tlcklucHV0cyhkYXRlcGlja2VySW5zdGFuY2U6IE5nYkRhdGVwaWNrZXIpOiB2b2lkIHtcbiAgICBbJ2RheVRlbXBsYXRlJywgJ2RheVRlbXBsYXRlRGF0YScsICdkaXNwbGF5TW9udGhzJywgJ2ZpcnN0RGF5T2ZXZWVrJywgJ2Zvb3RlclRlbXBsYXRlJywgJ21hcmtEaXNhYmxlZCcsICdtaW5EYXRlJyxcbiAgICAgJ21heERhdGUnLCAnbmF2aWdhdGlvbicsICdvdXRzaWRlRGF5cycsICdzaG93TmF2aWdhdGlvbicsICdzaG93V2Vla051bWJlcnMnLCAnd2Vla2RheXMnXVxuICAgICAgICAuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXNbb3B0aW9uTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF0ZXBpY2tlckluc3RhbmNlW29wdGlvbk5hbWVdID0gdGhpc1tvcHRpb25OYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIGRhdGVwaWNrZXJJbnN0YW5jZS5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZSB8fCB0aGlzLl9tb2RlbDtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5UG9wdXBDbGFzcyhuZXdDbGFzczogc3RyaW5nLCBvbGRDbGFzcz86IHN0cmluZykge1xuICAgIGNvbnN0IHBvcHVwRWwgPSB0aGlzLl9jUmVmID8ubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICBpZiAocG9wdXBFbCkge1xuICAgICAgaWYgKG5ld0NsYXNzKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHBvcHVwRWwsIG5ld0NsYXNzKTtcbiAgICAgIH1cbiAgICAgIGlmIChvbGRDbGFzcykge1xuICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyhwb3B1cEVsLCBvbGRDbGFzcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQb3B1cFN0eWxpbmcobmF0aXZlRWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbGVtZW50LCAnc2hvdycpO1xuXG4gICAgaWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKG5hdGl2ZUVsZW1lbnQsICduZ2ItZHAtYm9keScpO1xuICAgIH1cblxuICAgIHRoaXMuX2FwcGx5UG9wdXBDbGFzcyh0aGlzLmRhdGVwaWNrZXJDbGFzcyk7XG4gIH1cblxuICBwcml2YXRlIF9zdWJzY3JpYmVGb3JEYXRlcGlja2VyT3V0cHV0cyhkYXRlcGlja2VySW5zdGFuY2U6IE5nYkRhdGVwaWNrZXIpIHtcbiAgICBkYXRlcGlja2VySW5zdGFuY2UubmF2aWdhdGUuc3Vic2NyaWJlKG5hdmlnYXRlRXZlbnQgPT4gdGhpcy5uYXZpZ2F0ZS5lbWl0KG5hdmlnYXRlRXZlbnQpKTtcbiAgICBkYXRlcGlja2VySW5zdGFuY2UuZGF0ZVNlbGVjdC5zdWJzY3JpYmUoZGF0ZSA9PiB7XG4gICAgICB0aGlzLmRhdGVTZWxlY3QuZW1pdChkYXRlKTtcbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSB8fCB0aGlzLmF1dG9DbG9zZSA9PT0gJ2luc2lkZScpIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd3JpdGVNb2RlbFZhbHVlKG1vZGVsOiBOZ2JEYXRlIHwgbnVsbCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fcGFyc2VyRm9ybWF0dGVyLmZvcm1hdChtb2RlbCk7XG4gICAgdGhpcy5faW5wdXRWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZiAhLmluc3RhbmNlLndyaXRlVmFsdWUodGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbChtb2RlbCkpO1xuICAgICAgdGhpcy5fb25Ub3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZnJvbURhdGVTdHJ1Y3QoZGF0ZTogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiBOZ2JEYXRlIHwgbnVsbCB7XG4gICAgY29uc3QgbmdiRGF0ZSA9IGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3NldENsb3NlSGFuZGxlcnMoKSB7XG4gICAgdGhpcy5fZGVzdHJveUNsb3NlSGFuZGxlcnMkLm5leHQoKTtcbiAgICBuZ2JBdXRvQ2xvc2UoXG4gICAgICAgIHRoaXMuX25nWm9uZSwgdGhpcy5fZG9jdW1lbnQsIHRoaXMuYXV0b0Nsb3NlLCAoKSA9PiB0aGlzLmNsb3NlKCksIHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJCwgW10sXG4gICAgICAgIFt0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jUmVmICEubG9jYXRpb24ubmF0aXZlRWxlbWVudF0pO1xuICB9XG59XG4iXX0=