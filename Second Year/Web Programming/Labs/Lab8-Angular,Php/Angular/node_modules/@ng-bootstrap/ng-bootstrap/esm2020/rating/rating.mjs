import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, forwardRef, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { getValueInRange } from '../util/util';
import { Key } from '../util/key';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "./rating-config";
import * as i2 from "@angular/common";
/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
export class NgbRating {
    constructor(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event emitted when the user is hovering over a given rating.
         *
         * Event payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event emitted when the user stops hovering over a given rating.
         *
         * Event payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event emitted when the rating is changed.
         *
         * Event payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    ariaValueText() { return `${this.nextRate} out of ${this.max}`; }
    isInteractive() { return !this.readonly && !this.disabled; }
    enter(value) {
        if (this.isInteractive()) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    handleBlur() { this.onTouched(); }
    handleClick(value) {
        if (this.isInteractive()) {
            this.update(this.resettable && this.rate === value ? 0 : value);
        }
    }
    handleKeyDown(event) {
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.ArrowDown:
            case Key.ArrowLeft:
                this.update(this.rate - 1);
                break;
            case Key.ArrowUp:
            case Key.ArrowRight:
                this.update(this.rate + 1);
                break;
            case Key.Home:
                this.update(0);
                break;
            case Key.End:
                this.update(this.max);
                break;
            default:
                return;
        }
        // note 'return' in default case
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
        if (changes['max']) {
            this._updateMax();
        }
    }
    ngOnInit() {
        this._setupContexts();
        this._updateState(this.rate);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    update(value, internalChange = true) {
        const newRate = getValueInRange(value, this.max, 0);
        if (this.isInteractive() && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => context.fill = Math.round(getValueInRange(nextValue - index, 1, 0) * 100));
    }
    _updateMax() {
        if (this.max > 0) {
            this._setupContexts();
            this.update(this.rate);
        }
    }
    _setupContexts() { this.contexts = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k })); }
}
NgbRating.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRating, deps: [{ token: i1.NgbRatingConfig }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
NgbRating.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbRating, selector: "ngb-rating", inputs: { max: "max", rate: "rate", readonly: "readonly", resettable: "resettable", starTemplate: "starTemplate" }, outputs: { hover: "hover", leave: "leave", rateChange: "rateChange" }, host: { attributes: { "role": "slider", "aria-valuemin": "0" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)", "mouseleave": "reset()" }, properties: { "tabindex": "disabled ? -1 : 0", "attr.aria-valuemax": "max", "attr.aria-valuenow": "nextRate", "attr.aria-valuetext": "ariaValueText()", "attr.aria-disabled": "readonly ? true : null" }, classAttribute: "d-inline-flex" }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }], queries: [{ propertyName: "starTemplateFromContent", first: true, predicate: TemplateRef, descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="isInteractive() ? 'pointer' : 'default'">
        <ng-template [ngTemplateOutlet]="starTemplate || starTemplateFromContent || t" [ngTemplateOutletContext]="contexts[index]">
        </ng-template>
      </span>
    </ng-template>
  `, isInline: true, directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRating, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-rating',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'd-inline-flex',
                        '[tabindex]': 'disabled ? -1 : 0',
                        'role': 'slider',
                        'aria-valuemin': '0',
                        '[attr.aria-valuemax]': 'max',
                        '[attr.aria-valuenow]': 'nextRate',
                        '[attr.aria-valuetext]': 'ariaValueText()',
                        '[attr.aria-disabled]': 'readonly ? true : null',
                        '(blur)': 'handleBlur()',
                        '(keydown)': 'handleKeyDown($event)',
                        '(mouseleave)': 'reset()'
                    },
                    template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="isInteractive() ? 'pointer' : 'default'">
        <ng-template [ngTemplateOutlet]="starTemplate || starTemplateFromContent || t" [ngTemplateOutletContext]="contexts[index]">
        </ng-template>
      </span>
    </ng-template>
  `,
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbRatingConfig }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { max: [{
                type: Input
            }], rate: [{
                type: Input
            }], readonly: [{
                type: Input
            }], resettable: [{
                type: Input
            }], starTemplate: [{
                type: Input
            }], starTemplateFromContent: [{
                type: ContentChild,
                args: [TemplateRef, { static: false }]
            }], hover: [{
                type: Output
            }], leave: [{
                type: Output
            }], rateChange: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3JhdGluZy9yYXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUdMLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDN0MsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNoQyxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7Ozs7QUFpQnZFOztHQUVHO0FBOEJILE1BQU0sT0FBTyxTQUFTO0lBMkRwQixZQUFZLE1BQXVCLEVBQVUsa0JBQXFDO1FBQXJDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUF6RGxGLGFBQVEsR0FBMEIsRUFBRSxDQUFDO1FBQ3JDLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFnQ2pCOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUU3Qzs7OztXQUlHO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFFN0M7Ozs7V0FJRztRQUNPLGVBQVUsR0FBRyxJQUFJLFlBQVksQ0FBUyxJQUFJLENBQUMsQ0FBQztRQUV0RCxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUMxQixjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBR25CLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDbEMsQ0FBQztJQUVELGFBQWEsS0FBSyxPQUFPLEdB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LENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztpQkFDakc7c0lBV1UsR0FBRztzQkFBWCxLQUFLO2dCQUtHLElBQUk7c0JBQVosS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQUtHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBT0csWUFBWTtzQkFBcEIsS0FBSztnQkFDc0MsdUJBQXVCO3NCQUFsRSxZQUFZO3VCQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBT2hDLEtBQUs7c0JBQWQsTUFBTTtnQkFPRyxLQUFLO3NCQUFkLE1BQU07Z0JBT0csVUFBVTtzQkFBbkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiUmF0aW5nQ29uZmlnfSBmcm9tICcuL3JhdGluZy1jb25maWcnO1xuaW1wb3J0IHtnZXRWYWx1ZUluUmFuZ2V9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLyoqXG4gKiBUaGUgY29udGV4dCBmb3IgdGhlIGN1c3RvbSBzdGFyIGRpc3BsYXkgdGVtcGxhdGUgZGVmaW5lZCBpbiB0aGUgYHN0YXJUZW1wbGF0ZWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhclRlbXBsYXRlQ29udGV4dCB7XG4gIC8qKlxuICAgKiBUaGUgc3RhciBmaWxsIHBlcmNlbnRhZ2UsIGFuIGludGVnZXIgaW4gdGhlIGBbMCwgMTAwXWAgcmFuZ2UuXG4gICAqL1xuICBmaWxsOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEluZGV4IG9mIHRoZSBzdGFyLCBzdGFydHMgd2l0aCBgMGAuXG4gICAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgaGVscHMgdmlzdWFsaXNpbmcgYW5kIGludGVyYWN0aW5nIHdpdGggYSBzdGFyIHJhdGluZyBiYXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1yYXRpbmcnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdkLWlubGluZS1mbGV4JyxcbiAgICAnW3RhYmluZGV4XSc6ICdkaXNhYmxlZCA/IC0xIDogMCcsXG4gICAgJ3JvbGUnOiAnc2xpZGVyJyxcbiAgICAnYXJpYS12YWx1ZW1pbic6ICcwJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW1heF0nOiAnbWF4JyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZW5vd10nOiAnbmV4dFJhdGUnLFxuICAgICdbYXR0ci5hcmlhLXZhbHVldGV4dF0nOiAnYXJpYVZhbHVlVGV4dCgpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAncmVhZG9ubHkgPyB0cnVlIDogbnVsbCcsXG4gICAgJyhibHVyKSc6ICdoYW5kbGVCbHVyKCknLFxuICAgICcoa2V5ZG93biknOiAnaGFuZGxlS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ3Jlc2V0KCknXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICN0IGxldC1maWxsPVwiZmlsbFwiPnt7IGZpbGwgPT09IDEwMCA/ICcmIzk3MzM7JyA6ICcmIzk3MzQ7JyB9fTwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cImNvbnRleHRzXCIgbGV0LWluZGV4PVwiaW5kZXhcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCI+KHt7IGluZGV4IDwgbmV4dFJhdGUgPyAnKicgOiAnICcgfX0pPC9zcGFuPlxuICAgICAgPHNwYW4gKG1vdXNlZW50ZXIpPVwiZW50ZXIoaW5kZXggKyAxKVwiIChjbGljayk9XCJoYW5kbGVDbGljayhpbmRleCArIDEpXCIgW3N0eWxlLmN1cnNvcl09XCJpc0ludGVyYWN0aXZlKCkgPyAncG9pbnRlcicgOiAnZGVmYXVsdCdcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInN0YXJUZW1wbGF0ZSB8fCBzdGFyVGVtcGxhdGVGcm9tQ29udGVudCB8fCB0XCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImNvbnRleHRzW2luZGV4XVwiPlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiUmF0aW5nKSwgbXVsdGk6IHRydWV9XVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JSYXRpbmcgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIGNvbnRleHRzOiBTdGFyVGVtcGxhdGVDb250ZXh0W10gPSBbXTtcbiAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgbmV4dFJhdGU6IG51bWJlcjtcblxuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW1hbCByYXRpbmcgdGhhdCBjYW4gYmUgZ2l2ZW4uXG4gICAqL1xuICBASW5wdXQoKSBtYXg6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgcmF0aW5nLiBDb3VsZCBiZSBhIGRlY2ltYWwgdmFsdWUgbGlrZSBgMy43NWAuXG4gICAqL1xuICBASW5wdXQoKSByYXRlOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIHJhdGluZyBjYW4ndCBiZSBjaGFuZ2VkLlxuICAgKi9cbiAgQElucHV0KCkgcmVhZG9ubHk6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIHJhdGluZyBjYW4gYmUgcmVzZXQgdG8gYDBgIGJ5IG1vdXNlIGNsaWNraW5nIGN1cnJlbnRseSBzZXQgcmF0aW5nLlxuICAgKi9cbiAgQElucHV0KCkgcmVzZXR0YWJsZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHRlbXBsYXRlIHRvIG92ZXJyaWRlIHRoZSB3YXkgZWFjaCBzdGFyIGlzIGRpc3BsYXllZC5cbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSBwdXQgYW4gYDxuZy10ZW1wbGF0ZT5gIGFzIHRoZSBvbmx5IGNoaWxkIG9mIHlvdXIgYDxuZ2ItcmF0aW5nPmAgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgc3RhclRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxTdGFyVGVtcGxhdGVDb250ZXh0PjtcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogZmFsc2V9KSBzdGFyVGVtcGxhdGVGcm9tQ29udGVudDogVGVtcGxhdGVSZWY8U3RhclRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdXNlciBpcyBob3ZlcmluZyBvdmVyIGEgZ2l2ZW4gcmF0aW5nLlxuICAgKlxuICAgKiBFdmVudCBwYXlsb2FkIGVxdWFscyB0byB0aGUgcmF0aW5nIGJlaW5nIGhvdmVyZWQgb3Zlci5cbiAgICovXG4gIEBPdXRwdXQoKSBob3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHVzZXIgc3RvcHMgaG92ZXJpbmcgb3ZlciBhIGdpdmVuIHJhdGluZy5cbiAgICpcbiAgICogRXZlbnQgcGF5bG9hZCBlcXVhbHMgdG8gdGhlIHJhdGluZyBvZiB0aGUgbGFzdCBpdGVtIGJlaW5nIGhvdmVyZWQgb3Zlci5cbiAgICovXG4gIEBPdXRwdXQoKSBsZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHJhdGluZyBpcyBjaGFuZ2VkLlxuICAgKlxuICAgKiBFdmVudCBwYXlsb2FkIGVxdWFscyB0byB0aGUgbmV3bHkgc2VsZWN0ZWQgcmF0aW5nLlxuICAgKi9cbiAgQE91dHB1dCgpIHJhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4odHJ1ZSk7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JSYXRpbmdDb25maWcsIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMubWF4ID0gY29uZmlnLm1heDtcbiAgICB0aGlzLnJlYWRvbmx5ID0gY29uZmlnLnJlYWRvbmx5O1xuICB9XG5cbiAgYXJpYVZhbHVlVGV4dCgpIHsgcmV0dXJuIGAke3RoaXMubmV4dFJhdGV9IG91dCBvZiAke3RoaXMubWF4fWA7IH1cblxuICBpc0ludGVyYWN0aXZlKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMucmVhZG9ubHkgJiYgIXRoaXMuZGlzYWJsZWQ7IH1cblxuICBlbnRlcih2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNJbnRlcmFjdGl2ZSgpKSB7XG4gICAgICB0aGlzLl91cGRhdGVTdGF0ZSh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuaG92ZXIuZW1pdCh2YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVCbHVyKCkgeyB0aGlzLm9uVG91Y2hlZCgpOyB9XG5cbiAgaGFuZGxlQ2xpY2sodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmlzSW50ZXJhY3RpdmUoKSkge1xuICAgICAgdGhpcy51cGRhdGUodGhpcy5yZXNldHRhYmxlICYmIHRoaXMucmF0ZSA9PT0gdmFsdWUgPyAwIDogdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24gKi9cbiAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICBjYXNlIEtleS5BcnJvd0xlZnQ6XG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSAtIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgS2V5LkFycm93VXA6XG4gICAgICBjYXNlIEtleS5BcnJvd1JpZ2h0OlxuICAgICAgICB0aGlzLnVwZGF0ZSh0aGlzLnJhdGUgKyAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICB0aGlzLnVwZGF0ZSgwKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgIHRoaXMudXBkYXRlKHRoaXMubWF4KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gbm90ZSAncmV0dXJuJyBpbiBkZWZhdWx0IGNhc2VcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydyYXRlJ10pIHtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydtYXgnXSkge1xuICAgICAgdGhpcy5fdXBkYXRlTWF4KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0dXBDb250ZXh0cygpO1xuICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMubGVhdmUuZW1pdCh0aGlzLm5leHRSYXRlKTtcbiAgICB0aGlzLl91cGRhdGVTdGF0ZSh0aGlzLnJhdGUpO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKSB7IHRoaXMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkOyB9XG5cbiAgdXBkYXRlKHZhbHVlOiBudW1iZXIsIGludGVybmFsQ2hhbmdlID0gdHJ1ZSk6IHZvaWQge1xuICAgIGNvbnN0IG5ld1JhdGUgPSBnZXRWYWx1ZUluUmFuZ2UodmFsdWUsIHRoaXMubWF4LCAwKTtcbiAgICBpZiAodGhpcy5pc0ludGVyYWN0aXZlKCkgJiYgdGhpcy5yYXRlICE9PSBuZXdSYXRlKSB7XG4gICAgICB0aGlzLnJhdGUgPSBuZXdSYXRlO1xuICAgICAgdGhpcy5yYXRlQ2hhbmdlLmVtaXQodGhpcy5yYXRlKTtcbiAgICB9XG4gICAgaWYgKGludGVybmFsQ2hhbmdlKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMucmF0ZSk7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgICB0aGlzLl91cGRhdGVTdGF0ZSh0aGlzLnJhdGUpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMudXBkYXRlKHZhbHVlLCBmYWxzZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVTdGF0ZShuZXh0VmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMubmV4dFJhdGUgPSBuZXh0VmFsdWU7XG4gICAgdGhpcy5jb250ZXh0cy5mb3JFYWNoKFxuICAgICAgICAoY29udGV4dCwgaW5kZXgpID0+IGNvbnRleHQuZmlsbCA9IE1hdGgucm91bmQoZ2V0VmFsdWVJblJhbmdlKG5leHRWYWx1ZSAtIGluZGV4LCAxLCAwKSAqIDEwMCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlTWF4KCkge1xuICAgIGlmICh0aGlzLm1heCA+IDApIHtcbiAgICAgIHRoaXMuX3NldHVwQ29udGV4dHMoKTtcbiAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0dXBDb250ZXh0cygpIHsgdGhpcy5jb250ZXh0cyA9IEFycmF5LmZyb20oe2xlbmd0aDogdGhpcy5tYXh9LCAodiwgaykgPT4gKHtmaWxsOiAwLCBpbmRleDoga30pKTsgfVxufVxuIl19