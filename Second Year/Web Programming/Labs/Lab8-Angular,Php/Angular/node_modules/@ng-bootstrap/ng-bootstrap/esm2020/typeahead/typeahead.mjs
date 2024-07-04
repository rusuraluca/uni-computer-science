import { Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { PopupService } from '../util/popup';
import { ngbPositioning } from '../util/positioning';
import { isDefined, toString } from '../util/util';
import { NgbTypeaheadWindow } from './typeahead-window';
import { addPopperOffset } from '../util/positioning-util';
import * as i0 from "@angular/core";
import * as i1 from "./typeahead-config";
import * as i2 from "../util/accessibility/live";
let nextWindowId = 0;
/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
export class NgbTypeahead {
    constructor(_elementRef, viewContainerRef, _renderer, injector, config, ngZone, _live, _document, _ngZone, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._live = _live;
        this._document = _document;
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        this._subscription = null;
        this._closed$ = new Subject();
        this._inputValueBackup = null;
        this._windowRef = null;
        this._positioning = ngbPositioning();
        /**
         * The value for the `autocomplete` attribute for the `<input>` element.
         *
         * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
         *
         * @since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = 'bottom-start';
        /**
         * An event emitted right before an item is selected from the result list.
         *
         * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
         */
        this.selectItem = new EventEmitter();
        this.activeDescendant = null;
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input')
            .pipe(map($event => $event.target.value));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._zoneSubscription = ngZone.onStable.subscribe(() => { this._positioning.update(); });
    }
    ngOnInit() { this._subscribeToUserInput(); }
    ngOnChanges({ ngbTypeahead }) {
        if (ngbTypeahead && !ngbTypeahead.firstChange) {
            this._unsubscribeFromUserInput();
            this._subscribeToUserInput();
        }
    }
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    writeValue(value) {
        this._writeInputValue(this._formatItemForInput(value));
        if (this.showHint) {
            this._inputValueBackup = value;
        }
    }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * Dismisses typeahead popup window
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._resubscribeTypeahead.next(null);
            this._closePopup();
            if (this.showHint && this._inputValueBackup !== null) {
                this._writeInputValue(this._inputValueBackup);
            }
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     */
    isPopupOpen() { return this._windowRef != null; }
    handleBlur() {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    }
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.ArrowDown:
                event.preventDefault();
                this._windowRef.instance.next();
                this._showHint();
                break;
            case Key.ArrowUp:
                event.preventDefault();
                this._windowRef.instance.prev();
                this._showHint();
                break;
            case Key.Enter:
            case Key.Tab: {
                const result = this._windowRef.instance.getActive();
                if (isDefined(result)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._selectResult(result);
                }
                this._closePopup();
                break;
            }
        }
    }
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            const { windowRef } = this._popupService.open();
            this._windowRef = windowRef;
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => this.activeDescendant = activeId);
            this._windowRef.instance.popupClass = this.popupClass;
            if (this.container === 'body') {
                this._renderer.setStyle(this._windowRef.location.nativeElement, 'z-index', '1055');
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._changeDetector.markForCheck();
            // Schedule positioning on stable, to avoid several positioning updates.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._windowRef) {
                    this._positioning.createPopper({
                        hostElement: this._elementRef.nativeElement,
                        targetElement: this._windowRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: addPopperOffset([0, 2]),
                    });
                }
            });
            ngbAutoClose(this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$, [this._elementRef.nativeElement, this._windowRef.location.nativeElement]);
        }
    }
    _closePopup() {
        this._popupService.close().subscribe(() => {
            this._positioning.destroy();
            this._closed$.next();
            this._windowRef = null;
            this.activeDescendant = null;
        });
    }
    _selectResult(result) {
        let defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: () => { defaultPrevented = true; } });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    _showHint() {
        if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
            }
            else {
                this._writeInputValue(formattedVal);
            }
        }
    }
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    }
    _subscribeToUserInput() {
        const results$ = this._valueChanges.pipe(tap(value => {
            this._inputValueBackup = this.showHint ? value : null;
            this._onChange(this.editable ? value : undefined);
        }), this.ngbTypeahead ? this.ngbTypeahead : () => of([]));
        this._subscription = this._resubscribeTypeahead.pipe(switchMap(() => results$)).subscribe(results => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
                this._showHint();
            }
            // live announcer
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeahead, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i1.NgbTypeaheadConfig }, { token: i0.NgZone }, { token: i2.Live }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTypeahead.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbTypeahead, selector: "input[ngbTypeahead]", inputs: { autocomplete: "autocomplete", container: "container", editable: "editable", focusFirst: "focusFirst", inputFormatter: "inputFormatter", ngbTypeahead: "ngbTypeahead", resultFormatter: "resultFormatter", resultTemplate: "resultTemplate", showHint: "showHint", placement: "placement", popupClass: "popupClass" }, outputs: { selectItem: "selectItem" }, host: { attributes: { "autocapitalize": "off", "autocorrect": "off", "role": "combobox", "aria-multiline": "false" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)" }, properties: { "class.open": "isPopupOpen()", "autocomplete": "autocomplete", "attr.aria-autocomplete": "showHint ? \"both\" : \"list\"", "attr.aria-activedescendant": "activeDescendant", "attr.aria-owns": "isPopupOpen() ? popupId : null", "attr.aria-expanded": "isPopupOpen()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }], exportAs: ["ngbTypeahead"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeahead, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbTypeahead]',
                    exportAs: 'ngbTypeahead',
                    host: {
                        '(blur)': 'handleBlur()',
                        '[class.open]': 'isPopupOpen()',
                        '(keydown)': 'handleKeyDown($event)',
                        '[autocomplete]': 'autocomplete',
                        'autocapitalize': 'off',
                        'autocorrect': 'off',
                        'role': 'combobox',
                        'aria-multiline': 'false',
                        '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                        '[attr.aria-activedescendant]': 'activeDescendant',
                        '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                        '[attr.aria-expanded]': 'isPopupOpen()'
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i1.NgbTypeaheadConfig }, { type: i0.NgZone }, { type: i2.Live }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { autocomplete: [{
                type: Input
            }], container: [{
                type: Input
            }], editable: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], inputFormatter: [{
                type: Input
            }], ngbTypeahead: [{
                type: Input
            }], resultFormatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], showHint: [{
                type: Input
            }], placement: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectItem: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZWFoZWFkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC90eXBlYWhlYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFFVCxZQUFZLEVBQ1osVUFBVSxFQUNWLE1BQU0sRUFFTixLQUFLLEVBSUwsTUFBTSxFQU9QLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN2RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFDLGVBQWUsRUFBRSxTQUFTLEVBQWMsRUFBRSxFQUFvQixPQUFPLEVBQWUsTUFBTSxNQUFNLENBQUM7QUFDekcsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR3pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFpQixjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUdqRCxPQUFPLEVBQUMsa0JBQWtCLEVBQXdCLE1BQU0sb0JBQW9CLENBQUM7QUFDN0UsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7O0FBaUJ6RCxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFFckI7O0dBRUc7QUFvQkgsTUFBTSxPQUFPLFlBQVk7SUFtSHZCLFlBQ1ksV0FBeUMsRUFBRSxnQkFBa0MsRUFDN0UsU0FBb0IsRUFBRSxRQUFrQixFQUFFLE1BQTBCLEVBQUUsTUFB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QUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBQyxDQUFDO2lCQUNwRzs7MEJBdUhNLE1BQU07MkJBQUMsUUFBUTs4SEFuR1gsWUFBWTtzQkFBcEIsS0FBSztnQkFPRyxTQUFTO3NCQUFqQixLQUFLO2dCQUtHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBS0csVUFBVTtzQkFBbEIsS0FBSztnQkFRRyxjQUFjO3NCQUF0QixLQUFLO2dCQWFHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBU0csZUFBZTtzQkFBdkIsS0FBSztnQkFTRyxjQUFjO3NCQUF0QixLQUFLO2dCQUtHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBU0csU0FBUztzQkFBakIsS0FBSztnQkFXRyxVQUFVO3NCQUFsQixLQUFLO2dCQU9JLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50UmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgQXBwbGljYXRpb25SZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgb2YsIE9wZXJhdG9yRnVuY3Rpb24sIFN1YmplY3QsIFN1YnNjcmlwdGlvbn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtMaXZlfSBmcm9tICcuLi91dGlsL2FjY2Vzc2liaWxpdHkvbGl2ZSc7XG5pbXBvcnQge25nYkF1dG9DbG9zZX0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7UG9wdXBTZXJ2aWNlfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7UGxhY2VtZW50QXJyYXksIG5nYlBvc2l0aW9uaW5nfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7aXNEZWZpbmVkLCB0b1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuaW1wb3J0IHtOZ2JUeXBlYWhlYWRDb25maWd9IGZyb20gJy4vdHlwZWFoZWFkLWNvbmZpZyc7XG5pbXBvcnQge05nYlR5cGVhaGVhZFdpbmRvdywgUmVzdWx0VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL3R5cGVhaGVhZC13aW5kb3cnO1xuaW1wb3J0IHthZGRQb3BwZXJPZmZzZXR9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmctdXRpbCc7XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSByZXN1bHQgbGlzdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQ8VCA9IGFueT4ge1xuICAvKipcbiAgICogVGhlIGl0ZW0gZnJvbSB0aGUgcmVzdWx0IGxpc3QgYWJvdXQgdG8gYmUgc2VsZWN0ZWQuXG4gICAqL1xuICBpdGVtOiBUO1xuXG4gIC8qKlxuICAgKiBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gd2lsbCBwcmV2ZW50IGl0ZW0gc2VsZWN0aW9uIGZyb20gaGFwcGVuaW5nLlxuICAgKi9cbiAgcHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG5cbmxldCBuZXh0V2luZG93SWQgPSAwO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHByb3ZpZGluZyBhIHNpbXBsZSB3YXkgb2YgY3JlYXRpbmcgcG93ZXJmdWwgdHlwZWFoZWFkcyBmcm9tIGFueSB0ZXh0IGlucHV0LlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFtuZ2JUeXBlYWhlYWRdJyxcbiAgZXhwb3J0QXM6ICduZ2JUeXBlYWhlYWQnLFxuICBob3N0OiB7XG4gICAgJyhibHVyKSc6ICdoYW5kbGVCbHVyKCknLFxuICAgICdbY2xhc3Mub3Blbl0nOiAnaXNQb3B1cE9wZW4oKScsXG4gICAgJyhrZXlkb3duKSc6ICdoYW5kbGVLZXlEb3duKCRldmVudCknLFxuICAgICdbYXV0b2NvbXBsZXRlXSc6ICdhdXRvY29tcGxldGUnLFxuICAgICdhdXRvY2FwaXRhbGl6ZSc6ICdvZmYnLFxuICAgICdhdXRvY29ycmVjdCc6ICdvZmYnLFxuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1tdWx0aWxpbmUnOiAnZmFsc2UnLFxuICAgICdbYXR0ci5hcmlhLWF1dG9jb21wbGV0ZV0nOiAnc2hvd0hpbnQgPyBcImJvdGhcIiA6IFwibGlzdFwiJyxcbiAgICAnW2F0dHIuYXJpYS1hY3RpdmVkZXNjZW5kYW50XSc6ICdhY3RpdmVEZXNjZW5kYW50JyxcbiAgICAnW2F0dHIuYXJpYS1vd25zXSc6ICdpc1BvcHVwT3BlbigpID8gcG9wdXBJZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdpc1BvcHVwT3BlbigpJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlR5cGVhaGVhZCksIG11bHRpOiB0cnVlfV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVHlwZWFoZWFkIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX3BvcHVwU2VydmljZTogUG9wdXBTZXJ2aWNlPE5nYlR5cGVhaGVhZFdpbmRvdz47XG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9pbnB1dFZhbHVlQmFja3VwOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfdmFsdWVDaGFuZ2VzOiBPYnNlcnZhYmxlPHN0cmluZz47XG4gIHByaXZhdGUgX3Jlc3Vic2NyaWJlVHlwZWFoZWFkOiBCZWhhdmlvclN1YmplY3Q8YW55PjtcbiAgcHJpdmF0ZSBfd2luZG93UmVmOiBDb21wb25lbnRSZWY8TmdiVHlwZWFoZWFkV2luZG93PnwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcbiAgcHJpdmF0ZSBfcG9zaXRpb25pbmcgPSBuZ2JQb3NpdGlvbmluZygpO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgZm9yIHRoZSBgYXV0b2NvbXBsZXRlYCBhdHRyaWJ1dGUgZm9yIHRoZSBgPGlucHV0PmAgZWxlbWVudC5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gYFwib2ZmXCJgIHRvIGRpc2FibGUgdGhlIG5hdGl2ZSBicm93c2VyIGF1dG9jb21wbGV0ZSwgYnV0IHlvdSBjYW4gb3ZlcnJpZGUgaXQgaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAc2luY2UgMi4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9jb21wbGV0ZSA9ICdvZmYnO1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHR5cGVhaGVhZCBwb3B1cCB3aWxsIGJlIGFwcGVuZGVkIHRvLlxuICAgKlxuICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbW9kZWwgdmFsdWVzIHdpbGwgbm90IGJlIHJlc3RyaWN0ZWQgb25seSB0byBpdGVtcyBzZWxlY3RlZCBmcm9tIHRoZSBwb3B1cC5cbiAgICovXG4gIEBJbnB1dCgpIGVkaXRhYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBmaXJzdCBpdGVtIGluIHRoZSByZXN1bHQgbGlzdCB3aWxsIGFsd2F5cyBzdGF5IGZvY3VzZWQgd2hpbGUgdHlwaW5nLlxuICAgKi9cbiAgQElucHV0KCkgZm9jdXNGaXJzdDogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gaXRlbSBmcm9tIHRoZSByZXN1bHQgbGlzdCB0byBhIGBzdHJpbmdgIHRvIGRpc3BsYXkgaW4gdGhlIGA8aW5wdXQ+YCBmaWVsZC5cbiAgICpcbiAgICogSXQgaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgc2VsZWN0cyBzb21ldGhpbmcgaW4gdGhlIHBvcHVwIG9yIHRoZSBtb2RlbCB2YWx1ZSBjaGFuZ2VzLCBzbyB0aGUgaW5wdXQgbmVlZHMgdG9cbiAgICogYmUgdXBkYXRlZC5cbiAgICovXG4gIEBJbnB1dCgpIGlucHV0Rm9ybWF0dGVyOiAoaXRlbTogYW55KSA9PiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBmdW5jdGlvbiB0aGF0IGNvbnZlcnRzIGEgc3RyZWFtIG9mIHRleHQgdmFsdWVzIGZyb20gdGhlIGA8aW5wdXQ+YCBlbGVtZW50IHRvIHRoZSBzdHJlYW0gb2YgdGhlIGFycmF5IG9mIGl0ZW1zXG4gICAqIHRvIGRpc3BsYXkgaW4gdGhlIHR5cGVhaGVhZCBwb3B1cC5cbiAgICpcbiAgICogSWYgdGhlIHJlc3VsdGluZyBvYnNlcnZhYmxlIGVtaXRzIGEgbm9uLWVtcHR5IGFycmF5IC0gdGhlIHBvcHVwIHdpbGwgYmUgc2hvd24uIElmIGl0IGVtaXRzIGFuIGVtcHR5IGFycmF5IC0gdGhlXG4gICAqIHBvcHVwIHdpbGwgYmUgY2xvc2VkLlxuICAgKlxuICAgKiBTZWUgdGhlIFtiYXNpYyBleGFtcGxlXSgjL2NvbXBvbmVudHMvdHlwZWFoZWFkL2V4YW1wbGVzI2Jhc2ljKSBmb3IgbW9yZSBkZXRhaWxzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGB0aGlzYCBhcmd1bWVudCBpcyBgdW5kZWZpbmVkYCBzbyB5b3UgbmVlZCB0byBleHBsaWNpdGx5IGJpbmQgaXQgdG8gYSBkZXNpcmVkIFwidGhpc1wiIHRhcmdldC5cbiAgICovXG4gIEBJbnB1dCgpIG5nYlR5cGVhaGVhZDogT3BlcmF0b3JGdW5jdGlvbjxzdHJpbmcsIHJlYWRvbmx5IGFueVtdPnwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogVGhlIGZ1bmN0aW9uIHRoYXQgY29udmVydHMgYW4gaXRlbSBmcm9tIHRoZSByZXN1bHQgbGlzdCB0byBhIGBzdHJpbmdgIHRvIGRpc3BsYXkgaW4gdGhlIHBvcHVwLlxuICAgKlxuICAgKiBNdXN0IGJlIHByb3ZpZGVkLCBpZiB5b3VyIGBuZ2JUeXBlYWhlYWRgIHJldHVybnMgc29tZXRoaW5nIG90aGVyIHRoYW4gYE9ic2VydmFibGU8c3RyaW5nW10+YC5cbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSBmb3IgbW9yZSBjb21wbGV4IG1hcmt1cCBpbiB0aGUgcG9wdXAgeW91IHNob3VsZCB1c2UgYHJlc3VsdFRlbXBsYXRlYC5cbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdEZvcm1hdHRlcjogKGl0ZW06IGFueSkgPT4gc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdGVtcGxhdGUgdG8gb3ZlcnJpZGUgdGhlIHdheSByZXN1bHRpbmcgaXRlbXMgYXJlIGRpc3BsYXllZCBpbiB0aGUgcG9wdXAuXG4gICAqXG4gICAqIFNlZSB0aGUgW1Jlc3VsdFRlbXBsYXRlQ29udGV4dF0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9hcGkjUmVzdWx0VGVtcGxhdGVDb250ZXh0KSBmb3IgdGhlIHRlbXBsYXRlIGNvbnRleHQuXG4gICAqXG4gICAqIEFsc28gc2VlIHRoZSBbdGVtcGxhdGUgZm9yIHJlc3VsdHMgZGVtb10oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9leGFtcGxlcyN0ZW1wbGF0ZSkgZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxSZXN1bHRUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHdpbGwgc2hvdyB0aGUgaGludCBpbiB0aGUgYDxpbnB1dD5gIHdoZW4gYW4gaXRlbSBpbiB0aGUgcmVzdWx0IGxpc3QgbWF0Y2hlcy5cbiAgICovXG4gIEBJbnB1dCgpIHNob3dIaW50OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZmVycmVkIHBsYWNlbWVudCBvZiB0aGUgdHlwZWFoZWFkLCBhbW9uZyB0aGUgW3Bvc3NpYmxlIHZhbHVlc10oIy9ndWlkZXMvcG9zaXRpb25pbmcjYXBpKS5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgb3JkZXIgb2YgcHJlZmVyZW5jZSBpcyBgXCJib3R0b20tc3RhcnQgYm90dG9tLWVuZCB0b3Atc3RhcnQgdG9wLWVuZFwiYFxuICAgKlxuICAgKiBQbGVhc2Ugc2VlIHRoZSBbcG9zaXRpb25pbmcgb3ZlcnZpZXddKCMvcG9zaXRpb25pbmcpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqL1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2JvdHRvbS1zdGFydCc7XG5cbiAgLyoqXG4gICogQSBjdXN0b20gY2xhc3MgdG8gYXBwZW5kIHRvIHRoZSB0eXBlYWhlYWQgcG9wdXAgd2luZG93XG4gICpcbiAgKiBBY2NlcHRzIGEgc3RyaW5nIGNvbnRhaW5pbmcgQ1NTIGNsYXNzIHRvIGJlIGFwcGxpZWQgb24gdGhlIGBuZ2ItdHlwZWFoZWFkLXdpbmRvd2AuXG4gICpcbiAgKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgaW5zdGFuY2Utc3BlY2lmaWMgc3R5bGluZywgZXguIHlvdSBjYW4gb3ZlcnJpZGUgcG9wdXAgd2luZG93IGB6LWluZGV4YFxuICAqXG4gICogQHNpbmNlIDkuMS4wXG4gICovXG4gIEBJbnB1dCgpIHBvcHVwQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgYW4gaXRlbSBpcyBzZWxlY3RlZCBmcm9tIHRoZSByZXN1bHQgbGlzdC5cbiAgICpcbiAgICogRXZlbnQgcGF5bG9hZCBpcyBvZiB0eXBlIFtgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50YF0oIy9jb21wb25lbnRzL3R5cGVhaGVhZC9hcGkjTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50KS5cbiAgICovXG4gIEBPdXRwdXQoKSBzZWxlY3RJdGVtID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQ+KCk7XG5cbiAgYWN0aXZlRGVzY2VuZGFudDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIHBvcHVwSWQgPSBgbmdiLXR5cGVhaGVhZC0ke25leHRXaW5kb3dJZCsrfWA7XG5cbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgaW5qZWN0b3I6IEluamVjdG9yLCBjb25maWc6IE5nYlR5cGVhaGVhZENvbmZpZywgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2xpdmU6IExpdmUsXG4gICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuZWRpdGFibGUgPSBjb25maWcuZWRpdGFibGU7XG4gICAgdGhpcy5mb2N1c0ZpcnN0ID0gY29uZmlnLmZvY3VzRmlyc3Q7XG4gICAgdGhpcy5zaG93SGludCA9IGNvbmZpZy5zaG93SGludDtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG5cbiAgICB0aGlzLl92YWx1ZUNoYW5nZXMgPSBmcm9tRXZlbnQ8RXZlbnQ+KF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdpbnB1dCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKG1hcCgkZXZlbnQgPT4gKCRldmVudC50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUpKTtcblxuICAgIHRoaXMuX3Jlc3Vic2NyaWJlVHlwZWFoZWFkID0gbmV3IEJlaGF2aW9yU3ViamVjdChudWxsKTtcblxuICAgIHRoaXMuX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2U8TmdiVHlwZWFoZWFkV2luZG93PihcbiAgICAgICAgTmdiVHlwZWFoZWFkV2luZG93LCBpbmplY3Rvciwgdmlld0NvbnRhaW5lclJlZiwgX3JlbmRlcmVyLCB0aGlzLl9uZ1pvbmUsIGFwcGxpY2F0aW9uUmVmKTtcblxuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSBuZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7IH0pO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7IHRoaXMuX3N1YnNjcmliZVRvVXNlcklucHV0KCk7IH1cblxuICBuZ09uQ2hhbmdlcyh7bmdiVHlwZWFoZWFkfTogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChuZ2JUeXBlYWhlYWQgJiYgIW5nYlR5cGVhaGVhZC5maXJzdENoYW5nZSkge1xuICAgICAgdGhpcy5fdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCk7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVUb1VzZXJJbnB1dCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICB0aGlzLl91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uVG91Y2hlZCA9IGZuOyB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodmFsdWUpKTtcbiAgICBpZiAodGhpcy5zaG93SGludCkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHR5cGVhaGVhZCBwb3B1cCB3aW5kb3dcbiAgICovXG4gIGRpc21pc3NQb3B1cCgpIHtcbiAgICBpZiAodGhpcy5pc1BvcHVwT3BlbigpKSB7XG4gICAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5uZXh0KG51bGwpO1xuICAgICAgdGhpcy5fY2xvc2VQb3B1cCgpO1xuICAgICAgaWYgKHRoaXMuc2hvd0hpbnQgJiYgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5faW5wdXRWYWx1ZUJhY2t1cCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSB0eXBlYWhlYWQgcG9wdXAgd2luZG93IGlzIGRpc3BsYXllZFxuICAgKi9cbiAgaXNQb3B1cE9wZW4oKSB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIGhhbmRsZUJsdXIoKSB7XG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcbiAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgfVxuXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5fd2luZG93UmVmICEuaW5zdGFuY2UubmV4dCgpO1xuICAgICAgICB0aGlzLl9zaG93SGludCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgS2V5LkFycm93VXA6XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZiAhLmluc3RhbmNlLnByZXYoKTtcbiAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5FbnRlcjpcbiAgICAgIGNhc2UgS2V5LlRhYjoge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl93aW5kb3dSZWYgIS5pbnN0YW5jZS5nZXRBY3RpdmUoKTtcbiAgICAgICAgaWYgKGlzRGVmaW5lZChyZXN1bHQpKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29wZW5Qb3B1cCgpIHtcbiAgICBpZiAoIXRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgIGNvbnN0IHt3aW5kb3dSZWZ9ID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4oKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IHdpbmRvd1JlZjtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5pZCA9IHRoaXMucG9wdXBJZDtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5zZWxlY3RFdmVudC5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB0aGlzLl9zZWxlY3RSZXN1bHRDbG9zZVBvcHVwKHJlc3VsdCkpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFjdGl2ZUNoYW5nZUV2ZW50LnN1YnNjcmliZSgoYWN0aXZlSWQ6IHN0cmluZykgPT4gdGhpcy5hY3RpdmVEZXNjZW5kYW50ID0gYWN0aXZlSWQpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnBvcHVwQ2xhc3MgPSB0aGlzLnBvcHVwQ2xhc3M7XG5cbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsICcxMDU1Jyk7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIC8vIFNjaGVkdWxlIHBvc2l0aW9uaW5nIG9uIHN0YWJsZSwgdG8gYXZvaWQgc2V2ZXJhbCBwb3NpdGlvbmluZyB1cGRhdGVzLlxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG4gICAgICAgICAgICBob3N0RWxlbWVudDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgdGFyZ2V0RWxlbWVudDogdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICBwbGFjZW1lbnQ6IHRoaXMucGxhY2VtZW50LFxuICAgICAgICAgICAgYXBwZW5kVG9Cb2R5OiB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknLFxuICAgICAgICAgICAgdXBkYXRlUG9wcGVyT3B0aW9uczogYWRkUG9wcGVyT2Zmc2V0KFswLCAyXSksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZ2JBdXRvQ2xvc2UoXG4gICAgICAgICAgdGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgJ291dHNpZGUnLCAoKSA9PiB0aGlzLmRpc21pc3NQb3B1cCgpLCB0aGlzLl9jbG9zZWQkLFxuICAgICAgICAgIFt0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50XSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xvc2VQb3B1cCgpIHtcbiAgICB0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UoKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuICAgICAgdGhpcy5fY2xvc2VkJC5uZXh0KCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuICAgICAgdGhpcy5hY3RpdmVEZXNjZW5kYW50ID0gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NlbGVjdFJlc3VsdChyZXN1bHQ6IGFueSkge1xuICAgIGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5zZWxlY3RJdGVtLmVtaXQoe2l0ZW06IHJlc3VsdCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcbiAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5uZXh0KG51bGwpO1xuXG4gICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICB0aGlzLndyaXRlVmFsdWUocmVzdWx0KTtcbiAgICAgIHRoaXMuX29uQ2hhbmdlKHJlc3VsdCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2VsZWN0UmVzdWx0Q2xvc2VQb3B1cChyZXN1bHQ6IGFueSkge1xuICAgIHRoaXMuX3NlbGVjdFJlc3VsdChyZXN1bHQpO1xuICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3dIaW50KCkge1xuICAgIGlmICh0aGlzLnNob3dIaW50ICYmIHRoaXMuX3dpbmRvd1JlZj8uaW5zdGFuY2UuaGFzQWN0aXZlKCkgJiYgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCAhPSBudWxsKSB7XG4gICAgICBjb25zdCB1c2VySW5wdXRMb3dlckNhc2UgPSB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRWYWwgPSB0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmdldEFjdGl2ZSgpKTtcblxuICAgICAgaWYgKHVzZXJJbnB1dExvd2VyQ2FzZSA9PT0gZm9ybWF0dGVkVmFsLnN1YnN0cigwLCB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5faW5wdXRWYWx1ZUJhY2t1cCArIGZvcm1hdHRlZFZhbC5zdWJzdHIodGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgpKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50WydzZXRTZWxlY3Rpb25SYW5nZSddLmFwcGx5KFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBbdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgsIGZvcm1hdHRlZFZhbC5sZW5ndGhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dyaXRlSW5wdXRWYWx1ZShmb3JtYXR0ZWRWYWwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Zvcm1hdEl0ZW1Gb3JJbnB1dChpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBpdGVtICE9IG51bGwgJiYgdGhpcy5pbnB1dEZvcm1hdHRlciA/IHRoaXMuaW5wdXRGb3JtYXR0ZXIoaXRlbSkgOiB0b1N0cmluZyhpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dyaXRlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0b1N0cmluZyh2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Vc2VySW5wdXQoKTogdm9pZCB7XG4gICAgY29uc3QgcmVzdWx0cyQgPSB0aGlzLl92YWx1ZUNoYW5nZXMucGlwZShcbiAgICAgICAgdGFwKHZhbHVlID0+IHtcbiAgICAgICAgICB0aGlzLl9pbnB1dFZhbHVlQmFja3VwID0gdGhpcy5zaG93SGludCA/IHZhbHVlIDogbnVsbDtcbiAgICAgICAgICB0aGlzLl9vbkNoYW5nZSh0aGlzLmVkaXRhYmxlID8gdmFsdWUgOiB1bmRlZmluZWQpO1xuICAgICAgICB9KSxcbiAgICAgICAgdGhpcy5uZ2JUeXBlYWhlYWQgPyB0aGlzLm5nYlR5cGVhaGVhZCA6ICgpID0+IG9mKFtdKSk7XG5cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5waXBlKHN3aXRjaE1hcCgoKSA9PiByZXN1bHRzJCkpLnN1YnNjcmliZShyZXN1bHRzID0+IHtcbiAgICAgIGlmICghcmVzdWx0cyB8fCByZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9vcGVuUG9wdXAoKTtcblxuICAgICAgICB0aGlzLl93aW5kb3dSZWYgIS5pbnN0YW5jZS5mb2N1c0ZpcnN0ID0gdGhpcy5mb2N1c0ZpcnN0O1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYgIS5pbnN0YW5jZS5yZXN1bHRzID0gcmVzdWx0cztcbiAgICAgICAgdGhpcy5fd2luZG93UmVmICEuaW5zdGFuY2UudGVybSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmICEuaW5zdGFuY2UuZm9ybWF0dGVyID0gdGhpcy5yZXN1bHRGb3JtYXR0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVzdWx0VGVtcGxhdGUpIHtcbiAgICAgICAgICB0aGlzLl93aW5kb3dSZWYgIS5pbnN0YW5jZS5yZXN1bHRUZW1wbGF0ZSA9IHRoaXMucmVzdWx0VGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fd2luZG93UmVmICEuaW5zdGFuY2UucmVzZXRBY3RpdmUoKTtcblxuICAgICAgICAvLyBUaGUgb2JzZXJ2YWJsZSBzdHJlYW0gd2UgYXJlIHN1YnNjcmliaW5nIHRvIG1pZ2h0IGhhdmUgYXN5bmMgc3RlcHNcbiAgICAgICAgLy8gYW5kIGlmIGEgY29tcG9uZW50IGNvbnRhaW5pbmcgdHlwZWFoZWFkIGlzIHVzaW5nIHRoZSBPblB1c2ggc3RyYXRlZ3lcbiAgICAgICAgLy8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gdHVybiB3b3VsZG4ndCBiZSBpbnZva2VkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZiAhLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICB0aGlzLl9zaG93SGludCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBsaXZlIGFubm91bmNlclxuICAgICAgY29uc3QgY291bnQgPSByZXN1bHRzID8gcmVzdWx0cy5sZW5ndGggOiAwO1xuICAgICAgdGhpcy5fbGl2ZS5zYXkoY291bnQgPT09IDAgPyAnTm8gcmVzdWx0cyBhdmFpbGFibGUnIDogYCR7Y291bnR9IHJlc3VsdCR7Y291bnQgPT09IDEgPyAnJyA6ICdzJ30gYXZhaWxhYmxlYCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91bnN1YnNjcmliZUZyb21Vc2VySW5wdXQoKSB7XG4gICAgaWYgKHRoaXMuX3N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IG51bGw7XG4gIH1cbn1cbiJdfQ==