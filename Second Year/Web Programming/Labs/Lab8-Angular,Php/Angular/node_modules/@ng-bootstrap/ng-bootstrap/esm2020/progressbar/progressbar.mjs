import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, HostBinding } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "./progressbar-config";
import * as i2 from "@angular/common";
/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
export class NgbProgressbar {
    constructor(config) {
        /**
         * The current value for the progress bar.
         *
         * Should be in the `[0, max]` range.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.textType = config.textType;
        this.type = config.type;
        this.showValue = config.showValue;
        this.height = config.height;
    }
    /**
     * The maximal value to be displayed in the progress bar.
     *
     * Should be a positive number. Will default to 100 otherwise.
     */
    set max(max) {
        this._max = !isNumber(max) || max <= 0 ? 100 : max;
    }
    get max() { return this._max; }
    getValue() { return getValueInRange(this.value, this.max); }
    getPercentValue() { return 100 * this.getValue() / this.max; }
}
NgbProgressbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbar, deps: [{ token: i1.NgbProgressbarConfig }], target: i0.ɵɵFactoryTarget.Component });
NgbProgressbar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbProgressbar, selector: "ngb-progressbar", inputs: { max: "max", animated: "animated", striped: "striped", showValue: "showValue", textType: "textType", type: "type", value: "value", height: "height" }, host: { properties: { "style.height": "this.height" }, classAttribute: "progress" }, ngImport: i0, template: `
    <div class="progress-bar{{type ? ' bg-' + type : ''}}{{textType ? ' text-' + textType : ''}}
    {{animated ? ' progress-bar-animated' : ''}}{{striped ? ' progress-bar-striped' : ''}}"
    role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
      <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getValue() / max | percent}}</span><ng-content></ng-content>
    </div>
  `, isInline: true, directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "percent": i2.PercentPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbar, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-progressbar',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'progress' },
                    template: `
    <div class="progress-bar{{type ? ' bg-' + type : ''}}{{textType ? ' text-' + textType : ''}}
    {{animated ? ' progress-bar-animated' : ''}}{{striped ? ' progress-bar-striped' : ''}}"
    role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
      <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getValue() / max | percent}}</span><ng-content></ng-content>
    </div>
  `
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbProgressbarConfig }]; }, propDecorators: { max: [{
                type: Input
            }], animated: [{
                type: Input
            }], striped: [{
                type: Input
            }], showValue: [{
                type: Input
            }], textType: [{
                type: Input
            }], type: [{
                type: Input
            }], value: [{
                type: Input
            }], height: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['style.height']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZ3Jlc3NiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hHLE9BQU8sRUFBQyxlQUFlLEVBQUUsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7O0FBR3ZEOztHQUVHO0FBZUgsTUFBTSxPQUFPLGNBQWM7SUFnRXpCLFlBQVksTUFBNEI7UUFkeEM7Ozs7V0FJRztRQUNNLFVBQUssR0FBRyxDQUFDLENBQUM7UUFVakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQzlCLENBQUM7SUFyRUQ7Ozs7T0FJRztJQUNILElBQ0ksR0FBRyxDQUFDLEdBQVc7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxHQUFHLEtBQWEsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQTZEdkMsUUFBUSxLQUFLLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU1RCxlQUFlLEtBQUssT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzsyR0E1RW5ELGNBQWM7K0ZBQWQsY0FBYyw0U0FUZjs7Ozs7OztHQU9UOzJGQUVVLGNBQWM7a0JBZDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFDO29CQUN6QixRQUFRLEVBQUU7Ozs7Ozs7R0FPVDtpQkFDRjsyR0FVSyxHQUFHO3NCQUROLEtBQUs7Z0JBWUcsUUFBUTtzQkFBaEIsS0FBSztnQkFLRyxPQUFPO3NCQUFmLEtBQUs7Z0JBS0csU0FBUztzQkFBakIsS0FBSztnQkFVRyxRQUFRO3NCQUFoQixLQUFLO2dCQVFHLElBQUk7c0JBQVosS0FBSztnQkFPRyxLQUFLO3NCQUFiLEtBQUs7Z0JBT2dDLE1BQU07c0JBQTNDLEtBQUs7O3NCQUFJLFdBQVc7dUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBIb3N0QmluZGluZ30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2dldFZhbHVlSW5SYW5nZSwgaXNOdW1iZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYlByb2dyZXNzYmFyQ29uZmlnfSBmcm9tICcuL3Byb2dyZXNzYmFyLWNvbmZpZyc7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBwcm92aWRlcyBmZWVkYmFjayBvbiB0aGUgcHJvZ3Jlc3Mgb2YgYSB3b3JrZmxvdyBvciBhbiBhY3Rpb24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1wcm9ncmVzc2JhcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBob3N0OiB7Y2xhc3M6ICdwcm9ncmVzcyd9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJ7e3R5cGUgPyAnIGJnLScgKyB0eXBlIDogJyd9fXt7dGV4dFR5cGUgPyAnIHRleHQtJyArIHRleHRUeXBlIDogJyd9fVxuICAgIHt7YW5pbWF0ZWQgPyAnIHByb2dyZXNzLWJhci1hbmltYXRlZCcgOiAnJ319e3tzdHJpcGVkID8gJyBwcm9ncmVzcy1iYXItc3RyaXBlZCcgOiAnJ319XCJcbiAgICByb2xlPVwicHJvZ3Jlc3NiYXJcIiBbc3R5bGUud2lkdGguJV09XCJnZXRQZXJjZW50VmFsdWUoKVwiXG4gICAgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJnZXRWYWx1ZSgpXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiPlxuICAgICAgPHNwYW4gKm5nSWY9XCJzaG93VmFsdWVcIiBpMThuPVwiQEBuZ2IucHJvZ3Jlc3NiYXIudmFsdWVcIj57e2dldFZhbHVlKCkgLyBtYXggfCBwZXJjZW50fX08L3NwYW4+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYlByb2dyZXNzYmFyIHtcbiAgcHJpdmF0ZSBfbWF4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbWFsIHZhbHVlIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgcHJvZ3Jlc3MgYmFyLlxuICAgKlxuICAgKiBTaG91bGQgYmUgYSBwb3NpdGl2ZSBudW1iZXIuIFdpbGwgZGVmYXVsdCB0byAxMDAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IG1heChtYXg6IG51bWJlcikge1xuICAgIHRoaXMuX21heCA9ICFpc051bWJlcihtYXgpIHx8IG1heCA8PSAwID8gMTAwIDogbWF4O1xuICB9XG5cbiAgZ2V0IG1heCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fbWF4OyB9XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIHN0cmlwZXMgb24gdGhlIHByb2dyZXNzIGJhciBhcmUgYW5pbWF0ZWQuXG4gICAqXG4gICAqIFRha2VzIGVmZmVjdCBvbmx5IGZvciBicm93c2VycyBzdXBwb3J0aW5nIENTUzMgYW5pbWF0aW9ucywgYW5kIGlmIGBzdHJpcGVkYCBpcyBgdHJ1ZWAuXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgcHJvZ3Jlc3MgYmFycyB3aWxsIGJlIGRpc3BsYXllZCBhcyBzdHJpcGVkLlxuICAgKi9cbiAgQElucHV0KCkgc3RyaXBlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgY3VycmVudCBwZXJjZW50YWdlIHdpbGwgYmUgc2hvd24gaW4gdGhlIGB4eCVgIGZvcm1hdC5cbiAgICovXG4gIEBJbnB1dCgpIHNob3dWYWx1ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogT3B0aW9uYWwgdGV4dCB2YXJpYW50IHR5cGUgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogU3VwcG9ydHMgdHlwZXMgYmFzZWQgb24gQm9vdHN0cmFwIGJhY2tncm91bmQgY29sb3IgdmFyaWFudHMsIGxpa2U6XG4gICAqICBgXCJzdWNjZXNzXCJgLCBgXCJpbmZvXCJgLCBgXCJ3YXJuaW5nXCJgLCBgXCJkYW5nZXJcImAsIGBcInByaW1hcnlcImAsIGBcInNlY29uZGFyeVwiYCwgYFwiZGFya1wiYCBhbmQgc28gb24uXG4gICAqXG4gICAqIEBzaW5jZSA1LjIuMFxuICAgKi9cbiAgQElucHV0KCkgdGV4dFR5cGU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogU3VwcG9ydHMgdHlwZXMgYmFzZWQgb24gQm9vdHN0cmFwIGJhY2tncm91bmQgY29sb3IgdmFyaWFudHMsIGxpa2U6XG4gICAqICBgXCJzdWNjZXNzXCJgLCBgXCJpbmZvXCJgLCBgXCJ3YXJuaW5nXCJgLCBgXCJkYW5nZXJcImAsIGBcInByaW1hcnlcImAsIGBcInNlY29uZGFyeVwiYCwgYFwiZGFya1wiYCBhbmQgc28gb24uXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIGZvciB0aGUgcHJvZ3Jlc3MgYmFyLlxuICAgKlxuICAgKiBTaG91bGQgYmUgaW4gdGhlIGBbMCwgbWF4XWAgcmFuZ2UuXG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZSA9IDA7XG5cbiAgLyoqXG4gICAqIFRoZSBoZWlnaHQgb2YgdGhlIHByb2dyZXNzIGJhci5cbiAgICpcbiAgICogQWNjZXB0cyBhbnkgdmFsaWQgQ1NTIGhlaWdodCB2YWx1ZXMsIGV4LiBgXCIycmVtXCJgXG4gICAqL1xuICBASW5wdXQoKSBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodCcpIGhlaWdodDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiUHJvZ3Jlc3NiYXJDb25maWcpIHtcbiAgICB0aGlzLm1heCA9IGNvbmZpZy5tYXg7XG4gICAgdGhpcy5hbmltYXRlZCA9IGNvbmZpZy5hbmltYXRlZDtcbiAgICB0aGlzLnN0cmlwZWQgPSBjb25maWcuc3RyaXBlZDtcbiAgICB0aGlzLnRleHRUeXBlID0gY29uZmlnLnRleHRUeXBlO1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuc2hvd1ZhbHVlID0gY29uZmlnLnNob3dWYWx1ZTtcbiAgICB0aGlzLmhlaWdodCA9IGNvbmZpZy5oZWlnaHQ7XG4gIH1cblxuICBnZXRWYWx1ZSgpIHsgcmV0dXJuIGdldFZhbHVlSW5SYW5nZSh0aGlzLnZhbHVlLCB0aGlzLm1heCk7IH1cblxuICBnZXRQZXJjZW50VmFsdWUoKSB7IHJldHVybiAxMDAgKiB0aGlzLmdldFZhbHVlKCkgLyB0aGlzLm1heDsgfVxufVxuIl19