import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbAlertFadingTransition } from './alert-transition';
import * as i0 from "@angular/core";
import * as i1 from "./alert-config";
import * as i2 from "@angular/common";
/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
export class NgbAlert {
    constructor(config, _renderer, _element, _zone) {
        this._renderer = _renderer;
        this._element = _element;
        this._zone = _zone;
        /**
         * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
         *
         * @since 8.0.0
         */
        this.closed = new EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
        this.animation = config.animation;
    }
    /**
     * Triggers alert closing programmatically (same as clicking on the close button (×)).
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(closed)` output
     *
     * @since 8.0.0
     */
    close() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbAlertFadingTransition, { animation: this.animation, runningTransition: 'continue' });
        transition.subscribe(() => this.closed.emit());
        return transition;
    }
    ngOnChanges(changes) {
        const typeChange = changes['type'];
        if (typeChange && !typeChange.firstChange) {
            this._renderer.removeClass(this._element.nativeElement, `alert-${typeChange.previousValue}`);
            this._renderer.addClass(this._element.nativeElement, `alert-${typeChange.currentValue}`);
        }
    }
    ngOnInit() { this._renderer.addClass(this._element.nativeElement, `alert-${this.type}`); }
}
NgbAlert.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlert, deps: [{ token: i1.NgbAlertConfig }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbAlert.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbAlert, selector: "ngb-alert", inputs: { animation: "animation", dismissible: "dismissible", type: "type" }, outputs: { closed: "closed" }, host: { attributes: { "role": "alert" }, properties: { "class.fade": "animation", "class.alert-dismissible": "dismissible" }, classAttribute: "alert show" }, exportAs: ["ngbAlert"], usesOnChanges: true, ngImport: i0, template: `
    <ng-content></ng-content>
    <button *ngIf="dismissible" type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="close()">
    </button>
    `, isInline: true, styles: ["ngb-alert{display:block}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlert, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-alert', exportAs: 'ngbAlert', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: { 'role': 'alert', 'class': 'alert show', '[class.fade]': 'animation', '[class.alert-dismissible]': 'dismissible' }, template: `
    <ng-content></ng-content>
    <button *ngIf="dismissible" type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="close()">
    </button>
    `, styles: ["ngb-alert{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgbAlertConfig }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], dismissible: [{
                type: Input
            }], type: [{
                type: Input
            }], closed: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxlcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYWxlcnQvYWxlcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFNdkIsaUJBQWlCLEVBRWxCLE1BQU0sZUFBZSxDQUFDO0FBS3ZCLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDOzs7O0FBRTVEOzs7O0dBSUc7QUFnQkgsTUFBTSxPQUFPLFFBQVE7SUFvQ25CLFlBQ0ksTUFBc0IsRUFBVSxTQUFvQixFQUFVLFFBQW9CLEVBQVUsS0FBYTtRQUF6RSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVE7UUFUN0c7Ozs7V0FJRztRQUNPLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBSzFDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUN0QyxJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxLQUFLO1FBQ0gsTUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQy9CLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsd0JBQXdCLEVBQ2pFLEVBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUNoRSxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMvQyxPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDO0lBRUQsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNuQyxJQUFJLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUU7WUFDekMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsU0FBUyxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM3RixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxTQUFTLFVBQVUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQzFGO0lBQ0gsQ0FBQztJQUVELFFBQVEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxTQUFTLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7cUdBckUvRSxRQUFRO3lGQUFSLFFBQVEseVdBUlQ7Ozs7O0tBS1A7MkZBR1EsUUFBUTtrQkFmcEIsU0FBUzsrQkFDRSxXQUFXLFlBQ1gsVUFBVSxtQkFDSCx1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRWpDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsYUFBYSxFQUFDLFlBQzNHOzs7OztLQUtQOzJLQWFNLFNBQVM7c0JBQWpCLEtBQUs7Z0JBUUcsV0FBVztzQkFBbkIsS0FBSztnQkFRRyxJQUFJO3NCQUFaLEtBQUs7Z0JBT0ksTUFBTTtzQkFBZixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge05nYkFsZXJ0Q29uZmlnfSBmcm9tICcuL2FsZXJ0LWNvbmZpZyc7XG5pbXBvcnQge25nYlJ1blRyYW5zaXRpb259IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7bmdiQWxlcnRGYWRpbmdUcmFuc2l0aW9ufSBmcm9tICcuL2FsZXJ0LXRyYW5zaXRpb24nO1xuXG4vKipcbiAqIEFsZXJ0IGlzIGEgY29tcG9uZW50IHRvIHByb3ZpZGUgY29udGV4dHVhbCBmZWVkYmFjayBtZXNzYWdlcyBmb3IgdXNlci5cbiAqXG4gKiBJdCBzdXBwb3J0cyBzZXZlcmFsIGFsZXJ0IHR5cGVzIGFuZCBjYW4gYmUgZGlzbWlzc2VkLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItYWxlcnQnLFxuICBleHBvcnRBczogJ25nYkFsZXJ0JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6XG4gICAgICB7J3JvbGUnOiAnYWxlcnQnLCAnY2xhc3MnOiAnYWxlcnQgc2hvdycsICdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJywgJ1tjbGFzcy5hbGVydC1kaXNtaXNzaWJsZV0nOiAnZGlzbWlzc2libGUnfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPGJ1dHRvbiAqbmdJZj1cImRpc21pc3NpYmxlXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuYWxlcnQuY2xvc2VcIlxuICAgICAgKGNsaWNrKT1cImNsb3NlKClcIj5cbiAgICA8L2J1dHRvbj5cbiAgICBgLFxuICBzdHlsZVVybHM6IFsnLi9hbGVydC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiQWxlcnQgaW1wbGVtZW50cyBPbkluaXQsXG4gICAgT25DaGFuZ2VzIHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgYWxlcnQgY2xvc2luZyB3aWxsIGJlIGFuaW1hdGVkLlxuICAgKlxuICAgKiBBbmltYXRpb24gaXMgdHJpZ2dlcmVkIG9ubHkgd2hlbiBjbGlja2VkIG9uIHRoZSBjbG9zZSBidXR0b24gKMOXKVxuICAgKiBvciB2aWEgdGhlIGAuY2xvc2UoKWAgZnVuY3Rpb25cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgYWxlcnQgY2FuIGJlIGRpc21pc3NlZCBieSB0aGUgdXNlci5cbiAgICpcbiAgICogVGhlIGNsb3NlIGJ1dHRvbiAow5cpIHdpbGwgYmUgZGlzcGxheWVkIGFuZCB5b3UgY2FuIGJlIG5vdGlmaWVkXG4gICAqIG9mIHRoZSBldmVudCB3aXRoIHRoZSBgKGNsb3NlKWAgb3V0cHV0LlxuICAgKi9cbiAgQElucHV0KCkgZGlzbWlzc2libGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIGFsZXJ0LlxuICAgKlxuICAgKiBCb290c3RyYXAgcHJvdmlkZXMgc3R5bGVzIGZvciB0aGUgZm9sbG93aW5nIHR5cGVzOiBgJ3N1Y2Nlc3MnYCwgYCdpbmZvJ2AsIGAnd2FybmluZydgLCBgJ2RhbmdlcidgLCBgJ3ByaW1hcnknYCxcbiAgICogYCdzZWNvbmRhcnknYCwgYCdsaWdodCdgIGFuZCBgJ2RhcmsnYC5cbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjbG9zZSBidXR0b24gaXMgY2xpY2tlZC4gSXQgaGFzIG5vIHBheWxvYWQgYW5kIG9ubHkgcmVsZXZhbnQgZm9yIGRpc21pc3NpYmxlIGFsZXJ0cy5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgY2xvc2VkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb25maWc6IE5nYkFsZXJ0Q29uZmlnLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF96b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLmRpc21pc3NpYmxlID0gY29uZmlnLmRpc21pc3NpYmxlO1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyBhbGVydCBjbG9zaW5nIHByb2dyYW1tYXRpY2FsbHkgKHNhbWUgYXMgY2xpY2tpbmcgb24gdGhlIGNsb3NlIGJ1dHRvbiAow5cpKS5cbiAgICpcbiAgICogVGhlIHJldHVybmVkIG9ic2VydmFibGUgd2lsbCBlbWl0IGFuZCBiZSBjb21wbGV0ZWQgb25jZSB0aGUgY2xvc2luZyB0cmFuc2l0aW9uIGhhcyBmaW5pc2hlZC5cbiAgICogSWYgdGhlIGFuaW1hdGlvbnMgYXJlIHR1cm5lZCBvZmYgdGhpcyBoYXBwZW5zIHN5bmNocm9ub3VzbHkuXG4gICAqXG4gICAqIEFsdGVybmF0aXZlbHkgeW91IGNvdWxkIGxpc3RlbiBvciBzdWJzY3JpYmUgdG8gdGhlIGAoY2xvc2VkKWAgb3V0cHV0XG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgY2xvc2UoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgY29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24oXG4gICAgICAgIHRoaXMuX3pvbmUsIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiQWxlcnRGYWRpbmdUcmFuc2l0aW9uLFxuICAgICAgICB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZSd9KTtcbiAgICB0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlZC5lbWl0KCkpO1xuICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHR5cGVDaGFuZ2UgPSBjaGFuZ2VzWyd0eXBlJ107XG4gICAgaWYgKHR5cGVDaGFuZ2UgJiYgIXR5cGVDaGFuZ2UuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgYGFsZXJ0LSR7dHlwZUNoYW5nZS5wcmV2aW91c1ZhbHVlfWApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgYWxlcnQtJHt0eXBlQ2hhbmdlLmN1cnJlbnRWYWx1ZX1gKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHsgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgYWxlcnQtJHt0aGlzLnR5cGV9YCk7IH1cbn1cbiJdfQ==