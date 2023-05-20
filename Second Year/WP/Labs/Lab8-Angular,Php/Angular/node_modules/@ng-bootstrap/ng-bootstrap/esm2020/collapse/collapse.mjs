import { Directive, EventEmitter, Input, Output, } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import * as i0 from "@angular/core";
import * as i1 from "./collapse-config";
/**
 * A directive to provide a simple way of hiding and showing elements on the page.
 */
export class NgbCollapse {
    constructor(_element, config, _zone) {
        this._element = _element;
        this._zone = _zone;
        /**
         * If `true`, will collapse the element or show it otherwise.
         */
        this.collapsed = false;
        this.ngbCollapseChange = new EventEmitter();
        /**
         * An event emitted when the collapse element is shown, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapse element is hidden, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
    }
    ngOnInit() { this._runTransition(this.collapsed, false); }
    ngOnChanges({ collapsed }) {
        if (!collapsed.firstChange) {
            this._runTransitionWithEvents(this.collapsed, this.animation);
        }
    }
    /**
     * Triggers collapsing programmatically.
     *
     * If there is a collapsing transition running already, it will be reversed.
     * If the animations are turned off this happens synchronously.
     *
     * @since 8.0.0
     */
    toggle(open = this.collapsed) {
        this.collapsed = !open;
        this.ngbCollapseChange.next(this.collapsed);
        this._runTransitionWithEvents(this.collapsed, this.animation);
    }
    _runTransition(collapsed, animation) {
        return ngbRunTransition(this._zone, this._element.nativeElement, ngbCollapsingTransition, { animation, runningTransition: 'stop', context: { direction: collapsed ? 'hide' : 'show' } });
    }
    _runTransitionWithEvents(collapsed, animation) {
        this._runTransition(collapsed, animation).subscribe(() => {
            if (collapsed) {
                this.hidden.emit();
            }
            else {
                this.shown.emit();
            }
        });
    }
}
NgbCollapse.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapse, deps: [{ token: i0.ElementRef }, { token: i1.NgbCollapseConfig }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
NgbCollapse.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbCollapse, selector: "[ngbCollapse]", inputs: { animation: "animation", collapsed: ["ngbCollapse", "collapsed"] }, outputs: { ngbCollapseChange: "ngbCollapseChange", shown: "shown", hidden: "hidden" }, exportAs: ["ngbCollapse"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapse, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbCollapse]', exportAs: 'ngbCollapse' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.NgbCollapseConfig }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], collapsed: [{
                type: Input,
                args: ['ngbCollapse']
            }], ngbCollapseChange: [{
                type: Output
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGFwc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGFwc2UvY29sbGFwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQzs7O0FBR2pGOztHQUVHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUFpQ3RCLFlBQW9CLFFBQW9CLEVBQUUsTUFBeUIsRUFBVSxLQUFhO1FBQXRFLGFBQVEsR0FBUixRQUFRLENBQVk7UUFBcUMsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQXRCMUY7O1dBRUc7UUFDbUIsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUU5QixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBRTFEOzs7O1dBSUc7UUFDTyxVQUFLLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUUzQzs7OztXQUlHO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFJMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxRQUFRLEtBQUssSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxRCxXQUFXLENBQUMsRUFBQyxTQUFTLEVBQWdCO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQzFCLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMvRDtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE9BQWdCLElBQUksQ0FBQyxTQUFTO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTyxjQUFjLENBQUMsU0FBa0IsRUFBRSxTQUFrQjtRQUMzRCxPQUFPLGdCQUFnQixDQUNuQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLHVCQUF1QixFQUNoRSxFQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDakcsQ0FBQztJQUVPLHdCQUF3QixDQUFDLFNBQWtCLEVBQUUsU0FBa0I7UUFDckUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUN2RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDbkI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O3dHQXpFVSxXQUFXOzRGQUFYLFdBQVc7MkZBQVgsV0FBVztrQkFEdkIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBQztzSkFVcEQsU0FBUztzQkFBakIsS0FBSztnQkFLZ0IsU0FBUztzQkFBOUIsS0FBSzt1QkFBQyxhQUFhO2dCQUVWLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFPRyxLQUFLO3NCQUFkLE1BQU07Z0JBT0csTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge25nYkNvbGxhcHNpbmdUcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiQ29sbGFwc2VUcmFuc2l0aW9uJztcbmltcG9ydCB7TmdiQ29sbGFwc2VDb25maWd9IGZyb20gJy4vY29sbGFwc2UtY29uZmlnJztcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwcm92aWRlIGEgc2ltcGxlIHdheSBvZiBoaWRpbmcgYW5kIHNob3dpbmcgZWxlbWVudHMgb24gdGhlIHBhZ2UuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYkNvbGxhcHNlXScsIGV4cG9ydEFzOiAnbmdiQ29sbGFwc2UnfSlcbmV4cG9ydCBjbGFzcyBOZ2JDb2xsYXBzZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgY29sbGFwc2Ugd2lsbCBiZSBhbmltYXRlZC5cbiAgICpcbiAgICogQW5pbWF0aW9uIGlzIHRyaWdnZXJlZCBvbmx5IHdoZW4gY2xpY2tlZCBvbiB0cmlnZ2VyaW5nIGVsZW1lbnRcbiAgICogb3IgdmlhIHRoZSBgLnRvZ2dsZSgpYCBmdW5jdGlvblxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpIGFuaW1hdGlvbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB3aWxsIGNvbGxhcHNlIHRoZSBlbGVtZW50IG9yIHNob3cgaXQgb3RoZXJ3aXNlLlxuICAgKi9cbiAgQElucHV0KCduZ2JDb2xsYXBzZScpIGNvbGxhcHNlZCA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBuZ2JDb2xsYXBzZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzZSBlbGVtZW50IGlzIHNob3duLCBhZnRlciB0aGUgdHJhbnNpdGlvbi4gSXQgaGFzIG5vIHBheWxvYWQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGNvbGxhcHNlIGVsZW1lbnQgaXMgaGlkZGVuLCBhZnRlciB0aGUgdHJhbnNpdGlvbi4gSXQgaGFzIG5vIHBheWxvYWQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIGNvbmZpZzogTmdiQ29sbGFwc2VDb25maWcsIHByaXZhdGUgX3pvbmU6IE5nWm9uZSkge1xuICAgIHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcbiAgfVxuXG4gIG5nT25Jbml0KCkgeyB0aGlzLl9ydW5UcmFuc2l0aW9uKHRoaXMuY29sbGFwc2VkLCBmYWxzZSk7IH1cblxuICBuZ09uQ2hhbmdlcyh7Y29sbGFwc2VkfTogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghY29sbGFwc2VkLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLl9ydW5UcmFuc2l0aW9uV2l0aEV2ZW50cyh0aGlzLmNvbGxhcHNlZCwgdGhpcy5hbmltYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyBjb2xsYXBzaW5nIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqXG4gICAqIElmIHRoZXJlIGlzIGEgY29sbGFwc2luZyB0cmFuc2l0aW9uIHJ1bm5pbmcgYWxyZWFkeSwgaXQgd2lsbCBiZSByZXZlcnNlZC5cbiAgICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgdG9nZ2xlKG9wZW46IGJvb2xlYW4gPSB0aGlzLmNvbGxhcHNlZCkge1xuICAgIHRoaXMuY29sbGFwc2VkID0gIW9wZW47XG4gICAgdGhpcy5uZ2JDb2xsYXBzZUNoYW5nZS5uZXh0KHRoaXMuY29sbGFwc2VkKTtcbiAgICB0aGlzLl9ydW5UcmFuc2l0aW9uV2l0aEV2ZW50cyh0aGlzLmNvbGxhcHNlZCwgdGhpcy5hbmltYXRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVHJhbnNpdGlvbihjb2xsYXBzZWQ6IGJvb2xlYW4sIGFuaW1hdGlvbjogYm9vbGVhbikge1xuICAgIHJldHVybiBuZ2JSdW5UcmFuc2l0aW9uKFxuICAgICAgICB0aGlzLl96b25lLCB0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIG5nYkNvbGxhcHNpbmdUcmFuc2l0aW9uLFxuICAgICAgICB7YW5pbWF0aW9uLCBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLCBjb250ZXh0OiB7ZGlyZWN0aW9uOiBjb2xsYXBzZWQgPyAnaGlkZScgOiAnc2hvdyd9fSk7XG4gIH1cblxuICBwcml2YXRlIF9ydW5UcmFuc2l0aW9uV2l0aEV2ZW50cyhjb2xsYXBzZWQ6IGJvb2xlYW4sIGFuaW1hdGlvbjogYm9vbGVhbikge1xuICAgIHRoaXMuX3J1blRyYW5zaXRpb24oY29sbGFwc2VkLCBhbmltYXRpb24pLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAoY29sbGFwc2VkKSB7XG4gICAgICAgIHRoaXMuaGlkZGVuLmVtaXQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2hvd24uZW1pdCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=