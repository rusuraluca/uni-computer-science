import { Component, Directive, Input, Output, EventEmitter, ChangeDetectionStrategy, Inject, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./tooltip-config";
let nextId = 0;
export class NgbTooltipWindow {
}
NgbTooltipWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbTooltipWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbTooltipWindow, selector: "ngb-tooltip-window", inputs: { animation: "animation", id: "id", tooltipClass: "tooltipClass" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"tooltip\" + (tooltipClass ? \" \" + tooltipClass : \"\")", "class.fade": "animation", "id": "id" } }, ngImport: i0, template: `<div class="tooltip-arrow" data-popper-arrow></div><div class="tooltip-inner"><ng-content></ng-content></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-tooltip-window',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
                        '[class.fade]': 'animation',
                        'role': 'tooltip',
                        '[id]': 'id'
                    },
                    template: `<div class="tooltip-arrow" data-popper-arrow></div><div class="tooltip-inner"><ng-content></ng-content></div>`
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], id: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
export class NgbTooltip {
    constructor(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, _document, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        this._changeDetector = _changeDetector;
        /**
         * An event emitted when the tooltip opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the tooltip closing animation has finished. Contains no payload.
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
        this._windowRef = null;
        this._positioning = ngbPositioning();
        this.animation = config.animation;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this.tooltipClass = config.tooltipClass;
        this.openDelay = config.openDelay;
        this.closeDelay = config.closeDelay;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positioning.update(); });
    }
    /**
     * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
     *
     * If the content if falsy, the tooltip won't open.
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    get ngbTooltip() { return this._ngbTooltip; }
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            const { windowRef, transition$ } = this._popupService.open(this._ngbTooltip, context, this.animation);
            this._windowRef = windowRef;
            this._windowRef.instance.animation = this.animation;
            this._windowRef.instance.tooltipClass = this.tooltipClass;
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening tooltip from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because tooltip won't work inside the OnPush component.
            // Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the tooltip from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Schedule positioning on stable, to avoid several positioning updates.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                this._positioning.createPopper({
                    hostElement: this._elementRef.nativeElement,
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    appendToBody: this.container === 'body',
                    baseClass: 'bs-tooltip',
                });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [this._windowRef.location.nativeElement]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    close() {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close(this.animation).subscribe(() => {
                this._windowRef = null;
                this._positioning.destroy();
                this.hidden.emit();
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen() { return this._windowRef != null; }
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    }
    ngOnChanges({ tooltipClass }) {
        if (tooltipClass && this.isOpen()) {
            this._windowRef.instance.tooltipClass = tooltipClass.currentValue;
        }
    }
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
}
NgbTooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltip, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: i1.NgbTooltipConfig }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbTooltip, selector: "[ngbTooltip]", inputs: { animation: "animation", autoClose: "autoClose", placement: "placement", triggers: "triggers", container: "container", disableTooltip: "disableTooltip", tooltipClass: "tooltipClass", openDelay: "openDelay", closeDelay: "closeDelay", ngbTooltip: "ngbTooltip" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbTooltip"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltip, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: i1.NgbTooltipConfig }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], placement: [{
                type: Input
            }], triggers: [{
                type: Input
            }], container: [{
                type: Input
            }], disableTooltip: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], ngbTooltip: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osdUJBQXVCLEVBR3ZCLE1BQU0sRUFRTixpQkFBaUIsRUFLbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsY0FBYyxFQUFpQixNQUFNLHFCQUFxQixDQUFDO0FBQ25FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJM0MsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7QUFFcEMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBY2YsTUFBTSxPQUFPLGdCQUFnQjs7NkdBQWhCLGdCQUFnQjtpR0FBaEIsZ0JBQWdCLGlUQUZqQiwrR0FBK0c7MkZBRTlHLGdCQUFnQjtrQkFaNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7b0JBQ3JDLElBQUksRUFBRTt3QkFDSixTQUFTLEVBQUUsc0RBQXNEO3dCQUNqRSxjQUFjLEVBQUUsV0FBVzt3QkFDM0IsTUFBTSxFQUFFLFNBQVM7d0JBQ2pCLE1BQU0sRUFBRSxJQUFJO3FCQUNiO29CQUNELFFBQVEsRUFBRSwrR0FBK0c7aUJBQzFIOzhCQUVVLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csRUFBRTtzQkFBVixL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QkFTRyxTQUFTO3NCQUFqQixLQUFLO2dCQVFHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBT0csU0FBUztzQkFBakIsS0FBSztnQkFPRyxjQUFjO3NCQUF0QixLQUFLO2dCQU9HLFlBQVk7c0JBQXBCLEtBQUs7Z0JBT0csU0FBUztzQkFBakIsS0FBSztnQkFPRyxVQUFVO3NCQUFsQixLQUFLO2dCQUtJLEtBQUs7c0JBQWQsTUFBTTtnQkFLRyxNQUFNO3NCQUFmLE1BQU07Z0JBb0NILFVBQVU7c0JBRGIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBOZ1pvbmUsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQXBwbGljYXRpb25SZWYsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7bGlzdGVuVG9UcmlnZ2Vyc30gZnJvbSAnLi4vdXRpbC90cmlnZ2Vycyc7XG5pbXBvcnQge25nYkF1dG9DbG9zZX0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHtuZ2JQb3NpdGlvbmluZywgUGxhY2VtZW50QXJyYXl9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHtQb3B1cFNlcnZpY2V9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuXG5pbXBvcnQge05nYlRvb2x0aXBDb25maWd9IGZyb20gJy4vdG9vbHRpcC1jb25maWcnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdG9vbHRpcC13aW5kb3cnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzogJ1widG9vbHRpcFwiICsgKHRvb2x0aXBDbGFzcyA/IFwiIFwiICsgdG9vbHRpcENsYXNzIDogXCJcIiknLFxuICAgICdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcbiAgICAncm9sZSc6ICd0b29sdGlwJyxcbiAgICAnW2lkXSc6ICdpZCdcbiAgfSxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwidG9vbHRpcC1hcnJvd1wiIGRhdGEtcG9wcGVyLWFycm93PjwvZGl2PjxkaXYgY2xhc3M9XCJ0b29sdGlwLWlubmVyXCI+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvZGl2PmBcbn0pXG5leHBvcnQgY2xhc3MgTmdiVG9vbHRpcFdpbmRvdyB7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgaWQ6IHN0cmluZztcbiAgQElucHV0KCkgdG9vbHRpcENsYXNzOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCBhbmQgZXh0ZW5zaWJsZSBkaXJlY3RpdmUgZm9yIGZhbmN5IHRvb2x0aXAgY3JlYXRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlRvb2x0aXBdJywgZXhwb3J0QXM6ICduZ2JUb29sdGlwJ30pXG5leHBvcnQgY2xhc3MgTmdiVG9vbHRpcCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0Nsb3NlOiBib29sZWFuIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRvb2x0aXAgb3BlbmluZyBhbmQgY2xvc2luZyB3aWxsIGJlIGFuaW1hdGVkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGNsb3NlZCBvbiBgRXNjYXBlYCBrZXkgYW5kIGluc2lkZS9vdXRzaWRlIGNsaWNrczpcbiAgICpcbiAgICogKiBgdHJ1ZWAgLSBjbG9zZXMgb24gYm90aCBvdXRzaWRlIGFuZCBpbnNpZGUgY2xpY2tzIGFzIHdlbGwgYXMgYEVzY2FwZWAgcHJlc3Nlc1xuICAgKiAqIGBmYWxzZWAgLSBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogKiBgXCJpbnNpZGVcImAgLSBjbG9zZXMgb24gaW5zaWRlIGNsaWNrcyBhcyB3ZWxsIGFzIEVzY2FwZSBwcmVzc2VzXG4gICAqICogYFwib3V0c2lkZVwiYCAtIGNsb3NlcyBvbiBvdXRzaWRlIGNsaWNrcyAoc29tZXRpbWVzIGFsc28gYWNoaWV2YWJsZSB0aHJvdWdoIHRyaWdnZXJzKVxuICAgKiBhcyB3ZWxsIGFzIGBFc2NhcGVgIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcblxuICAvKipcbiAgICogVGhlIHByZWZlcnJlZCBwbGFjZW1lbnQgb2YgdGhlIHRvb2x0aXAsIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImF1dG9cImAuXG4gICAqXG4gICAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBldmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogU3VwcG9ydHMgYSBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBldmVudCBuYW1lcy5cbiAgICogRm9yIG1vcmUgZGV0YWlscyBzZWUgdGhlIFt0cmlnZ2VycyBkZW1vXSgjL2NvbXBvbmVudHMvdG9vbHRpcC9leGFtcGxlcyN0cmlnZ2VycykuXG4gICAqL1xuICBASW5wdXQoKSB0cmlnZ2Vyczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgKlxuICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBgXCJib2R5XCJgLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdG9vbHRpcCBpcyBkaXNhYmxlZCBhbmQgd29uJ3QgYmUgZGlzcGxheWVkLlxuICAgKlxuICAgKiBAc2luY2UgMS4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVUb29sdGlwOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSB0b29sdGlwIHdpbmRvdyBlbGVtZW50LlxuICAgKlxuICAgKiBAc2luY2UgMy4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHRvb2x0aXBDbGFzczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgb3BlbmluZyBkZWxheSBpbiBtcy4gV29ya3Mgb25seSBmb3IgXCJub24tbWFudWFsXCIgb3BlbmluZyB0cmlnZ2VycyBkZWZpbmVkIGJ5IHRoZSBgdHJpZ2dlcnNgIGlucHV0LlxuICAgKlxuICAgKiBAc2luY2UgNC4xLjBcbiAgICovXG4gIEBJbnB1dCgpIG9wZW5EZWxheTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgY2xvc2luZyBkZWxheSBpbiBtcy4gV29ya3Mgb25seSBmb3IgXCJub24tbWFudWFsXCIgb3BlbmluZyB0cmlnZ2VycyBkZWZpbmVkIGJ5IHRoZSBgdHJpZ2dlcnNgIGlucHV0LlxuICAgKlxuICAgKiBAc2luY2UgNC4xLjBcbiAgICovXG4gIEBJbnB1dCgpIGNsb3NlRGVsYXk6IG51bWJlcjtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0b29sdGlwIG9wZW5pbmcgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gQ29udGFpbnMgbm8gcGF5bG9hZC5cbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSB0b29sdGlwIGNsb3NpbmcgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZC4gQ29udGFpbnMgbm8gcGF5bG9hZC5cbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfbmdiVG9vbHRpcDogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PnwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBfbmdiVG9vbHRpcFdpbmRvd0lkID0gYG5nYi10b29sdGlwLSR7bmV4dElkKyt9YDtcbiAgcHJpdmF0ZSBfcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2U8TmdiVG9vbHRpcFdpbmRvdz47XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlRvb2x0aXBXaW5kb3c+fCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfdW5yZWdpc3Rlckxpc3RlbmVyc0ZuO1xuICBwcml2YXRlIF9wb3NpdGlvbmluZyA9IG5nYlBvc2l0aW9uaW5nKCk7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBpbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBjb25maWc6IE5nYlRvb2x0aXBDb25maWcsIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSwgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmKSB7XG4gICAgdGhpcy5hbmltYXRpb24gPSBjb25maWcuYW5pbWF0aW9uO1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy50cmlnZ2VycyA9IGNvbmZpZy50cmlnZ2VycztcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG4gICAgdGhpcy5kaXNhYmxlVG9vbHRpcCA9IGNvbmZpZy5kaXNhYmxlVG9vbHRpcDtcbiAgICB0aGlzLnRvb2x0aXBDbGFzcyA9IGNvbmZpZy50b29sdGlwQ2xhc3M7XG4gICAgdGhpcy5vcGVuRGVsYXkgPSBjb25maWcub3BlbkRlbGF5O1xuICAgIHRoaXMuY2xvc2VEZWxheSA9IGNvbmZpZy5jbG9zZURlbGF5O1xuICAgIHRoaXMuX3BvcHVwU2VydmljZSA9IG5ldyBQb3B1cFNlcnZpY2U8TmdiVG9vbHRpcFdpbmRvdz4oXG4gICAgICAgIE5nYlRvb2x0aXBXaW5kb3csIGluamVjdG9yLCB2aWV3Q29udGFpbmVyUmVmLCBfcmVuZGVyZXIsIHRoaXMuX25nWm9uZSwgYXBwbGljYXRpb25SZWYpO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcgY29udGVudCBvciBhIGBUZW1wbGF0ZVJlZmAgZm9yIHRoZSBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRlbnQgaWYgZmFsc3ksIHRoZSB0b29sdGlwIHdvbid0IG9wZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbmdiVG9vbHRpcCh2YWx1ZTogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55PnwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuX25nYlRvb2x0aXAgPSB2YWx1ZTtcbiAgICBpZiAoIXZhbHVlICYmIHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuZ2JUb29sdGlwKCkgeyByZXR1cm4gdGhpcy5fbmdiVG9vbHRpcDsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgdG9vbHRpcC5cbiAgICpcbiAgICogVGhpcyBpcyBjb25zaWRlcmVkIHRvIGJlIGEgXCJtYW51YWxcIiB0cmlnZ2VyaW5nLlxuICAgKiBUaGUgYGNvbnRleHRgIGlzIGFuIG9wdGlvbmFsIHZhbHVlIHRvIGJlIGluamVjdGVkIGludG8gdGhlIHRvb2x0aXAgdGVtcGxhdGUgd2hlbiBpdCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgb3Blbihjb250ZXh0PzogYW55KSB7XG4gICAgaWYgKCF0aGlzLl93aW5kb3dSZWYgJiYgdGhpcy5fbmdiVG9vbHRpcCAmJiAhdGhpcy5kaXNhYmxlVG9vbHRpcCkge1xuICAgICAgY29uc3Qge3dpbmRvd1JlZiwgdHJhbnNpdGlvbiR9ID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4odGhpcy5fbmdiVG9vbHRpcCwgY29udGV4dCwgdGhpcy5hbmltYXRpb24pO1xuICAgICAgdGhpcy5fd2luZG93UmVmID0gd2luZG93UmVmO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFuaW1hdGlvbiA9IHRoaXMuYW5pbWF0aW9uO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnRvb2x0aXBDbGFzcyA9IHRoaXMudG9vbHRpcENsYXNzO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmlkID0gdGhpcy5fbmdiVG9vbHRpcFdpbmRvd0lkO1xuXG4gICAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScsIHRoaXMuX25nYlRvb2x0aXBXaW5kb3dJZCk7XG5cbiAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgIHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gV2UgbmVlZCB0byBkZXRlY3QgY2hhbmdlcywgYmVjYXVzZSB3ZSBkb24ndCBrbm93IHdoZXJlIC5vcGVuKCkgbWlnaHQgYmUgY2FsbGVkIGZyb20uXG4gICAgICAvLyBFeC4gb3BlbmluZyB0b29sdGlwIGZyb20gb25lIG9mIGxpZmVjeWNsZSBob29rcyB0aGF0IHJ1biBhZnRlciB0aGUgQ0RcbiAgICAgIC8vIChzYXkgZnJvbSBuZ0FmdGVyVmlld0luaXQpIHdpbGwgcmVzdWx0IGluICdFeHByZXNzaW9uSGFzQ2hhbmdlZCcgZXhjZXB0aW9uXG4gICAgICB0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAvLyBXZSBuZWVkIHRvIG1hcmsgZm9yIGNoZWNrLCBiZWNhdXNlIHRvb2x0aXAgd29uJ3Qgd29yayBpbnNpZGUgdGhlIE9uUHVzaCBjb21wb25lbnQuXG4gICAgICAvLyBFeC4gd2hlbiB3ZSB1c2UgZXhwcmVzc2lvbiBsaWtlIGB7eyB0b29sdGlwLmlzT3BlbigpIDogJ29wZW5lZCcgOiAnY2xvc2VkJyB9fWBcbiAgICAgIC8vIGluc2lkZSB0aGUgdGVtcGxhdGUgb2YgYW4gT25QdXNoIGNvbXBvbmVudCBhbmQgd2UgY2hhbmdlIHRoZSB0b29sdGlwIGZyb21cbiAgICAgIC8vIG9wZW4gLT4gY2xvc2VkLCB0aGUgZXhwcmVzc2lvbiBpbiBxdWVzdGlvbiB3b24ndCBiZSB1cGRhdGVkIHVubGVzcyB3ZSBleHBsaWNpdGx5XG4gICAgICAvLyBtYXJrIHRoZSBwYXJlbnQgY29tcG9uZW50IHRvIGJlIGNoZWNrZWQuXG4gICAgICB0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgIC8vIFNjaGVkdWxlIHBvc2l0aW9uaW5nIG9uIHN0YWJsZSwgdG8gYXZvaWQgc2V2ZXJhbCBwb3NpdGlvbmluZyB1cGRhdGVzLlxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25pbmcuY3JlYXRlUG9wcGVyKHtcbiAgICAgICAgICBob3N0RWxlbWVudDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgIHRhcmdldEVsZW1lbnQ6IHRoaXMuX3dpbmRvd1JlZiAhLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgcGxhY2VtZW50OiB0aGlzLnBsYWNlbWVudCxcbiAgICAgICAgICBhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG4gICAgICAgICAgYmFzZUNsYXNzOiAnYnMtdG9vbHRpcCcsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIG5nYkF1dG9DbG9zZShcbiAgICAgICAgICB0aGlzLl9uZ1pvbmUsIHRoaXMuX2RvY3VtZW50LCB0aGlzLmF1dG9DbG9zZSwgKCkgPT4gdGhpcy5jbG9zZSgpLCB0aGlzLmhpZGRlbixcbiAgICAgICAgICBbdGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdKTtcblxuICAgICAgdHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHRoaXMuc2hvd24uZW1pdCgpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSB0b29sdGlwLlxuICAgKlxuICAgKiBUaGlzIGlzIGNvbnNpZGVyZWQgdG8gYmUgYSBcIm1hbnVhbFwiIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICB0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UodGhpcy5hbmltYXRpb24pLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IG51bGw7XG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5oaWRkZW4uZW1pdCgpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSB0b29sdGlwLlxuICAgKlxuICAgKiBUaGlzIGlzIGNvbnNpZGVyZWQgdG8gYmUgYSBcIm1hbnVhbFwiIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG4gICAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAsIGlmIHRoZSBwb3BvdmVyIGlzIGN1cnJlbnRseSBzaG93bi5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3dpbmRvd1JlZiAhPSBudWxsOyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuID0gbGlzdGVuVG9UcmlnZ2VycyhcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy50cmlnZ2VycywgdGhpcy5pc09wZW4uYmluZCh0aGlzKSwgdGhpcy5vcGVuLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMuY2xvc2UuYmluZCh0aGlzKSwgK3RoaXMub3BlbkRlbGF5LCArdGhpcy5jbG9zZURlbGF5KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKHt0b29sdGlwQ2xhc3N9OiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKHRvb2x0aXBDbGFzcyAmJiB0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgIS5pbnN0YW5jZS50b29sdGlwQ2xhc3MgPSB0b29sdGlwQ2xhc3MuY3VycmVudFZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBhcyBpdCBtaWdodCBoYXBwZW4gdGhhdCBuZ09uRGVzdHJveSBpcyBjYWxsZWQgYmVmb3JlIG5nT25Jbml0XG4gICAgLy8gdW5kZXIgY2VydGFpbiBjb25kaXRpb25zLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2lzc3Vlcy8yMTk5XG4gICAgaWYgKHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbikge1xuICAgICAgdGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuKCk7XG4gICAgfVxuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19