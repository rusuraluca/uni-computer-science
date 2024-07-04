import { Attribute, Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation, } from '@angular/core';
import { take } from 'rxjs/operators';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbToastFadeInTransition, ngbToastFadeOutTransition } from './toast-transition';
import * as i0 from "@angular/core";
import * as i1 from "./toast-config";
import * as i2 from "@angular/common";
/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
export class NgbToastHeader {
}
NgbToastHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbToastHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbToastHeader, selector: "[ngbToastHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastHeader, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbToastHeader]' }]
        }] });
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
export class NgbToast {
    constructor(ariaLive, config, _zone, _element) {
        this.ariaLive = ariaLive;
        this._zone = _zone;
        this._element = _element;
        /**
         * A template like `<ng-template ngbToastHeader></ng-template>` can be
         * used in the projected content to allow markup usage.
         */
        this.contentHeaderTpl = null;
        /**
         * An event fired after the animation triggered by calling `.show()` method has finished.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event fired after the animation triggered by calling `.hide()` method has finished.
         *
         * It can only occur in 2 different scenarios:
         * - `autohide` timeout fires
         * - user clicks on a closing cross
         *
         * Additionally this output is purely informative. The toast won't be removed from DOM automatically, it's up
         * to the user to take care of that.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        if (this.ariaLive == null) {
            this.ariaLive = config.ariaLive;
        }
        this.delay = config.delay;
        this.autohide = config.autohide;
        this.animation = config.animation;
    }
    ngAfterContentInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this._init();
            this.show();
        });
    }
    ngOnChanges(changes) {
        if ('autohide' in changes) {
            this._clearTimeout();
            this._init();
        }
    }
    /**
     * Triggers toast closing programmatically.
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(hidden)` output
     *
     * @since 8.0.0
     */
    hide() {
        this._clearTimeout();
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeOutTransition, { animation: this.animation, runningTransition: 'stop' });
        transition.subscribe(() => { this.hidden.emit(); });
        return transition;
    }
    /**
     * Triggers toast opening programmatically.
     *
     * The returned observable will emit and be completed once the opening transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(shown)` output
     *
     * @since 8.0.0
     */
    show() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeInTransition, {
            animation: this.animation,
            runningTransition: 'continue',
        });
        transition.subscribe(() => { this.shown.emit(); });
        return transition;
    }
    _init() {
        if (this.autohide && !this._timeoutID) {
            this._timeoutID = setTimeout(() => this.hide(), this.delay);
        }
    }
    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
}
NgbToast.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToast, deps: [{ token: 'aria-live', attribute: true }, { token: i1.NgbToastConfig }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgbToast.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbToast, selector: "ngb-toast", inputs: { animation: "animation", delay: "delay", autohide: "autohide", header: "header" }, outputs: { shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "alert", "aria-atomic": "true" }, properties: { "attr.aria-live": "ariaLive", "class.fade": "animation" }, classAttribute: "toast" }, queries: [{ propertyName: "contentHeaderTpl", first: true, predicate: NgbToastHeader, descendants: true, read: TemplateRef, static: true }], exportAs: ["ngbToast"], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #headerTpl>
      <strong class="me-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToast, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-toast', exportAs: 'ngbToast', encapsulation: ViewEncapsulation.None, host: {
                        'role': 'alert',
                        '[attr.aria-live]': 'ariaLive',
                        'aria-atomic': 'true',
                        'class': 'toast',
                        '[class.fade]': 'animation',
                    }, template: `
    <ng-template #headerTpl>
      <strong class="me-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }, { type: i1.NgbToastConfig }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, propDecorators: { animation: [{
                type: Input
            }], delay: [{
                type: Input
            }], autohide: [{
                type: Input
            }], header: [{
                type: Input
            }], contentHeaderTpl: [{
                type: ContentChild,
                args: [NgbToastHeader, { read: TemplateRef, static: true }]
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdG9hc3QvdG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEdBR2xCLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUdwQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztBQUd2Rjs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxjQUFjOzsyR0FBZCxjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFEMUIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQzs7QUFJekM7Ozs7O0dBS0c7QUE2QkgsTUFBTSxPQUFPLFFBQVE7SUEwRG5CLFlBQ21DLFFBQWdCLEVBQUUsTUFBc0IsRUFBVSxLQUFhLEVBQ3RGLFFBQW9CO1FBREcsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFrQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ3RGLGFBQVEsR0FBUixRQUFRLENBQVk7UUE3QmhDOzs7V0FHRztRQUM4RCxxQkFBZ0IsR0FBMkIsSUFBSSxDQUFDO1FBRWpIOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUUzQzs7Ozs7Ozs7Ozs7V0FXRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBSzFDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDcEMsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUM5RCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDYixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxVQUFVLElBQUksT0FBTyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDZDtJQUNILENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxJQUFJO1FBQ0YsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUMvQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLHlCQUF5QixFQUNsRSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDNUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEQsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVEOzs7Ozs7Ozs7T0FTRztJQUNILElBQUk7UUFDRixNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLHdCQUF3QixFQUFFO1lBQ3JHLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixpQkFBaUIsRUFBRSxVQUFVO1NBQzlCLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxLQUFLO1FBQ1gsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdEO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7U0FDeEI7SUFDSCxDQUFDOztxR0FwSVUsUUFBUSxrQkEyREosV0FBVzt5RkEzRGYsUUFBUSw4WUFtQ0wsY0FBYywyQkFBUyxXQUFXLHdGQXBEdEM7Ozs7Ozs7Ozs7Ozs7O0dBY1Q7MkZBR1UsUUFBUTtrQkE1QnBCLFNBQVM7K0JBQ0UsV0FBVyxZQUNYLFVBQVUsaUJBQ0wsaUJBQWlCLENBQUMsSUFBSSxRQUMvQjt3QkFDSixNQUFNLEVBQUUsT0FBTzt3QkFDZixrQkFBa0IsRUFBRSxVQUFVO3dCQUM5QixhQUFhLEVBQUUsTUFBTTt3QkFDckIsT0FBTyxFQUFFLE9BQU87d0JBQ2hCLGNBQWMsRUFBRSxXQUFXO3FCQUM1QixZQUNTOzs7Ozs7Ozs7Ozs7OztHQWNUOzswQkE4REksU0FBUzsyQkFBQyxXQUFXO3VIQWxEakIsU0FBUztzQkFBakIsS0FBSztnQkFRRyxLQUFLO3NCQUFiLEtBQUs7Z0JBTUcsUUFBUTtzQkFBaEIsS0FBSztnQkFNRyxNQUFNO3NCQUFkLEtBQUs7Z0JBTTJELGdCQUFnQjtzQkFBaEYsWUFBWTt1QkFBQyxjQUFjLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBT3JELEtBQUs7c0JBQWQsTUFBTTtnQkFjRyxNQUFNO3NCQUFmLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkLFxuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ2JUb2FzdENvbmZpZ30gZnJvbSAnLi90b2FzdC1jb25maWcnO1xuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge25nYlRvYXN0RmFkZUluVHJhbnNpdGlvbiwgbmdiVG9hc3RGYWRlT3V0VHJhbnNpdGlvbn0gZnJvbSAnLi90b2FzdC10cmFuc2l0aW9uJztcblxuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGFsbG93cyB0aGUgdXNhZ2Ugb2YgSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlc1xuICogaW5zaWRlIG9mIHRoZSB0b2FzdCdzIGhlYWRlci5cbiAqXG4gKiBAc2luY2UgNS4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiVG9hc3RIZWFkZXJdJ30pXG5leHBvcnQgY2xhc3MgTmdiVG9hc3RIZWFkZXIge1xufVxuXG4vKipcbiAqIFRvYXN0cyBwcm92aWRlIGZlZWRiYWNrIG1lc3NhZ2VzIGFzIG5vdGlmaWNhdGlvbnMgdG8gdGhlIHVzZXIuXG4gKiBHb2FsIGlzIHRvIG1pbWljIHRoZSBwdXNoIG5vdGlmaWNhdGlvbnMgYXZhaWxhYmxlIGJvdGggb24gbW9iaWxlIGFuZCBkZXNrdG9wIG9wZXJhdGluZyBzeXN0ZW1zLlxuICpcbiAqIEBzaW5jZSA1LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdG9hc3QnLFxuICBleHBvcnRBczogJ25nYlRvYXN0JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2FsZXJ0JyxcbiAgICAnW2F0dHIuYXJpYS1saXZlXSc6ICdhcmlhTGl2ZScsXG4gICAgJ2FyaWEtYXRvbWljJzogJ3RydWUnLFxuICAgICdjbGFzcyc6ICd0b2FzdCcsXG4gICAgJ1tjbGFzcy5mYWRlXSc6ICdhbmltYXRpb24nLFxuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjaGVhZGVyVHBsPlxuICAgICAgPHN0cm9uZyBjbGFzcz1cIm1lLWF1dG9cIj57e2hlYWRlcn19PC9zdHJvbmc+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwiY29udGVudEhlYWRlclRwbCB8fCBoZWFkZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0b2FzdC1oZWFkZXJcIj5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRlbnRIZWFkZXJUcGwgfHwgaGVhZGVyVHBsXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4tY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50b2FzdC5jbG9zZS1hcmlhXCIgKGNsaWNrKT1cImhpZGUoKVwiPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdiBjbGFzcz1cInRvYXN0LWJvZHlcIj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmxzOiBbJy4vdG9hc3Quc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIE5nYlRvYXN0IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkNoYW5nZXMge1xuICAvKipcbiAgICogSWYgYHRydWVgLCB0b2FzdCBvcGVuaW5nIGFuZCBjbG9zaW5nIHdpbGwgYmUgYW5pbWF0ZWQuXG4gICAqXG4gICAqIEFuaW1hdGlvbiBpcyB0cmlnZ2VyZWQgb25seSB3aGVuIHRoZSBgLmhpZGUoKWAgb3IgYC5zaG93KClgIGZ1bmN0aW9ucyBhcmUgY2FsbGVkXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIHByaXZhdGUgX3RpbWVvdXRJRDtcblxuICAvKipcbiAgICogRGVsYXkgYWZ0ZXIgd2hpY2ggdGhlIHRvYXN0IHdpbGwgaGlkZSAobXMpLlxuICAgKiBkZWZhdWx0OiBgNTAwYCAobXMpIChpbmhlcml0ZWQgZnJvbSBOZ2JUb2FzdENvbmZpZylcbiAgICovXG4gIEBJbnB1dCgpIGRlbGF5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEF1dG8gaGlkZSB0aGUgdG9hc3QgYWZ0ZXIgYSBkZWxheSBpbiBtcy5cbiAgICogZGVmYXVsdDogYHRydWVgIChpbmhlcml0ZWQgZnJvbSBOZ2JUb2FzdENvbmZpZylcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9oaWRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUZXh0IHRvIGJlIHVzZWQgYXMgdG9hc3QncyBoZWFkZXIuXG4gICAqIElnbm9yZWQgaWYgYSBDb250ZW50Q2hpbGQgdGVtcGxhdGUgaXMgc3BlY2lmaWVkIGF0IHRoZSBzYW1lIHRpbWUuXG4gICAqL1xuICBASW5wdXQoKSBoZWFkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogQSB0ZW1wbGF0ZSBsaWtlIGA8bmctdGVtcGxhdGUgbmdiVG9hc3RIZWFkZXI+PC9uZy10ZW1wbGF0ZT5gIGNhbiBiZVxuICAgKiB1c2VkIGluIHRoZSBwcm9qZWN0ZWQgY29udGVudCB0byBhbGxvdyBtYXJrdXAgdXNhZ2UuXG4gICAqL1xuICBAQ29udGVudENoaWxkKE5nYlRvYXN0SGVhZGVyLCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pIGNvbnRlbnRIZWFkZXJUcGw6IFRlbXBsYXRlUmVmPGFueT58IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCBhZnRlciB0aGUgYW5pbWF0aW9uIHRyaWdnZXJlZCBieSBjYWxsaW5nIGAuc2hvdygpYCBtZXRob2QgaGFzIGZpbmlzaGVkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgYWZ0ZXIgdGhlIGFuaW1hdGlvbiB0cmlnZ2VyZWQgYnkgY2FsbGluZyBgLmhpZGUoKWAgbWV0aG9kIGhhcyBmaW5pc2hlZC5cbiAgICpcbiAgICogSXQgY2FuIG9ubHkgb2NjdXIgaW4gMiBkaWZmZXJlbnQgc2NlbmFyaW9zOlxuICAgKiAtIGBhdXRvaGlkZWAgdGltZW91dCBmaXJlc1xuICAgKiAtIHVzZXIgY2xpY2tzIG9uIGEgY2xvc2luZyBjcm9zc1xuICAgKlxuICAgKiBBZGRpdGlvbmFsbHkgdGhpcyBvdXRwdXQgaXMgcHVyZWx5IGluZm9ybWF0aXZlLiBUaGUgdG9hc3Qgd29uJ3QgYmUgcmVtb3ZlZCBmcm9tIERPTSBhdXRvbWF0aWNhbGx5LCBpdCdzIHVwXG4gICAqIHRvIHRoZSB1c2VyIHRvIHRha2UgY2FyZSBvZiB0aGF0LlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAQXR0cmlidXRlKCdhcmlhLWxpdmUnKSBwdWJsaWMgYXJpYUxpdmU6IHN0cmluZywgY29uZmlnOiBOZ2JUb2FzdENvbmZpZywgcHJpdmF0ZSBfem9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZikge1xuICAgIGlmICh0aGlzLmFyaWFMaXZlID09IG51bGwpIHtcbiAgICAgIHRoaXMuYXJpYUxpdmUgPSBjb25maWcuYXJpYUxpdmU7XG4gICAgfVxuICAgIHRoaXMuZGVsYXkgPSBjb25maWcuZGVsYXk7XG4gICAgdGhpcy5hdXRvaGlkZSA9IGNvbmZpZy5hdXRvaGlkZTtcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fem9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9pbml0KCk7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoJ2F1dG9oaWRlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jbGVhclRpbWVvdXQoKTtcbiAgICAgIHRoaXMuX2luaXQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgdG9hc3QgY2xvc2luZyBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW5kIGJlIGNvbXBsZXRlZCBvbmNlIHRoZSBjbG9zaW5nIHRyYW5zaXRpb24gaGFzIGZpbmlzaGVkLlxuICAgKiBJZiB0aGUgYW5pbWF0aW9ucyBhcmUgdHVybmVkIG9mZiB0aGlzIGhhcHBlbnMgc3luY2hyb25vdXNseS5cbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgbGlzdGVuIG9yIHN1YnNjcmliZSB0byB0aGUgYChoaWRkZW4pYCBvdXRwdXRcbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBoaWRlKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIHRoaXMuX2NsZWFyVGltZW91dCgpO1xuICAgIGNvbnN0IHRyYW5zaXRpb24gPSBuZ2JSdW5UcmFuc2l0aW9uKFxuICAgICAgICB0aGlzLl96b25lLCB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5nYlRvYXN0RmFkZU91dFRyYW5zaXRpb24sXG4gICAgICAgIHthbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnfSk7XG4gICAgdHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4geyB0aGlzLmhpZGRlbi5lbWl0KCk7IH0pO1xuICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJzIHRvYXN0IG9wZW5pbmcgcHJvZ3JhbW1hdGljYWxseS5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIG9ic2VydmFibGUgd2lsbCBlbWl0IGFuZCBiZSBjb21wbGV0ZWQgb25jZSB0aGUgb3BlbmluZyB0cmFuc2l0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHkgeW91IGNvdWxkIGxpc3RlbiBvciBzdWJzY3JpYmUgdG8gdGhlIGAoc2hvd24pYCBvdXRwdXRcbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBzaG93KCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIGNvbnN0IHRyYW5zaXRpb24gPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiVG9hc3RGYWRlSW5UcmFuc2l0aW9uLCB7XG4gICAgICBhbmltYXRpb246IHRoaXMuYW5pbWF0aW9uLFxuICAgICAgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZScsXG4gICAgfSk7XG4gICAgdHJhbnNpdGlvbi5zdWJzY3JpYmUoKCkgPT4geyB0aGlzLnNob3duLmVtaXQoKTsgfSk7XG4gICAgcmV0dXJuIHRyYW5zaXRpb247XG4gIH1cblxuICBwcml2YXRlIF9pbml0KCkge1xuICAgIGlmICh0aGlzLmF1dG9oaWRlICYmICF0aGlzLl90aW1lb3V0SUQpIHtcbiAgICAgIHRoaXMuX3RpbWVvdXRJRCA9IHNldFRpbWVvdXQoKCkgPT4gdGhpcy5oaWRlKCksIHRoaXMuZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFyVGltZW91dCgpIHtcbiAgICBpZiAodGhpcy5fdGltZW91dElEKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZW91dElEKTtcbiAgICAgIHRoaXMuX3RpbWVvdXRJRCA9IG51bGw7XG4gICAgfVxuICB9XG59XG4iXX0=