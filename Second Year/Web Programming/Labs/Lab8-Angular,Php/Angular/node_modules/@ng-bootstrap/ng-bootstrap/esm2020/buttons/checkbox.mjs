/* eslint-disable */
import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
import * as i1 from "./label";
/**
 * Allows to easily create Bootstrap-style checkbox buttons.
 *
 * Integrates with forms, so the value of a checked button is bound to the underlying form control
 * either in a reactive or template-driven way.
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
export class NgbCheckBox {
    constructor(_label, _cd) {
        this._label = _label;
        this._cd = _cd;
        /**
         * If `true`, the checkbox button will be disabled
         */
        this.disabled = false;
        /**
         * The form control value when the checkbox is checked.
         */
        this.valueChecked = true;
        /**
         * The form control value when the checkbox is unchecked.
         */
        this.valueUnChecked = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    set focused(isFocused) {
        this._label.focused = isFocused;
        if (!isFocused) {
            this.onTouched();
        }
    }
    onInputChange($event) {
        const modelToPropagate = $event.target.checked ? this.valueChecked : this.valueUnChecked;
        this.onChange(modelToPropagate);
        this.onTouched();
        this.writeValue(modelToPropagate);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._label.disabled = isDisabled;
    }
    writeValue(value) {
        this.checked = value === this.valueChecked;
        this._label.active = this.checked;
        // label won't be updated, if it is inside the OnPush component when [ngModel] changes
        this._cd.markForCheck();
    }
}
NgbCheckBox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCheckBox, deps: [{ token: i1.NgbButtonLabel }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbCheckBox.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbCheckBox, selector: "[ngbButton][type=checkbox]", inputs: { disabled: "disabled", valueChecked: "valueChecked", valueUnChecked: "valueUnChecked" }, host: { listeners: { "change": "onInputChange($event)", "focus": "focused = true", "blur": "focused = false" }, properties: { "checked": "checked", "disabled": "disabled" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbCheckBox), multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCheckBox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbButton][type=checkbox]',
                    host: {
                        '[checked]': 'checked',
                        '[disabled]': 'disabled',
                        '(change)': 'onInputChange($event)',
                        '(focus)': 'focused = true',
                        '(blur)': 'focused = false'
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbCheckBox), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbButtonLabel }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], valueChecked: [{
                type: Input
            }], valueUnChecked: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYnV0dG9ucy9jaGVja2JveC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsT0FBTyxFQUFvQixTQUFTLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7OztBQUl2RTs7Ozs7OztHQU9HO0FBWUgsTUFBTSxPQUFPLFdBQVc7SUE4QnRCLFlBQW9CLE1BQXNCLEVBQVUsR0FBc0I7UUFBdEQsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFBVSxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQXpCMUU7O1dBRUc7UUFDTSxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTFCOztXQUVHO1FBQ00saUJBQVksR0FBRyxJQUFJLENBQUM7UUFFN0I7O1dBRUc7UUFDTSxtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUVoQyxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUMxQixjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBU3dELENBQUM7SUFQOUUsSUFBSSxPQUFPLENBQUMsU0FBa0I7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBSUQsYUFBYSxDQUFDLE1BQU07UUFDbEIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUN6RixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsRUFBdUIsSUFBVSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkUsaUJBQWlCLENBQUMsRUFBYSxJQUFVLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUvRCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDcEMsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFLO1FBQ2QsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQztRQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBRWxDLHNGQUFzRjtRQUN0RixJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzFCLENBQUM7O3dHQXREVSxXQUFXOzRGQUFYLFdBQVcsdVVBRlgsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQzsyRkFFdkYsV0FBVztrQkFYdkIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxJQUFJLEVBQUU7d0JBQ0osV0FBVyxFQUFFLFNBQVM7d0JBQ3RCLFlBQVksRUFBRSxVQUFVO3dCQUN4QixVQUFVLEVBQUUsdUJBQXVCO3dCQUNuQyxTQUFTLEVBQUUsZ0JBQWdCO3dCQUMzQixRQUFRLEVBQUUsaUJBQWlCO3FCQUM1QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7aUJBQ25HO3FJQVNVLFFBQVE7c0JBQWhCLEtBQUs7Z0JBS0csWUFBWTtzQkFBcEIsS0FBSztnQkFLRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHtOZ2JCdXR0b25MYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5cbi8qKlxuICogQWxsb3dzIHRvIGVhc2lseSBjcmVhdGUgQm9vdHN0cmFwLXN0eWxlIGNoZWNrYm94IGJ1dHRvbnMuXG4gKlxuICogSW50ZWdyYXRlcyB3aXRoIGZvcm1zLCBzbyB0aGUgdmFsdWUgb2YgYSBjaGVja2VkIGJ1dHRvbiBpcyBib3VuZCB0byB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xcbiAqIGVpdGhlciBpbiBhIHJlYWN0aXZlIG9yIHRlbXBsYXRlLWRyaXZlbiB3YXkuXG4gKlxuICogQGRlcHJlY2F0ZWQgMTIuMC4wIFBsZWFzZSB1c2UgbmF0aXZlIEFuZ3VsYXIgY29kZSBpbnN0ZWFkXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JCdXR0b25dW3R5cGU9Y2hlY2tib3hdJyxcbiAgaG9zdDoge1xuICAgICdbY2hlY2tlZF0nOiAnY2hlY2tlZCcsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICcoY2hhbmdlKSc6ICdvbklucHV0Q2hhbmdlKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ2ZvY3VzZWQgPSB0cnVlJyxcbiAgICAnKGJsdXIpJzogJ2ZvY3VzZWQgPSBmYWxzZSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLCB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JDaGVja0JveCksIG11bHRpOiB0cnVlfV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiQ2hlY2tCb3ggaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogYm9vbGVhbiB8ICcnO1xuXG4gIGNoZWNrZWQ7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGNoZWNrYm94IGJ1dHRvbiB3aWxsIGJlIGRpc2FibGVkXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbHVlIHdoZW4gdGhlIGNoZWNrYm94IGlzIGNoZWNrZWQuXG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZUNoZWNrZWQgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgZm9ybSBjb250cm9sIHZhbHVlIHdoZW4gdGhlIGNoZWNrYm94IGlzIHVuY2hlY2tlZC5cbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlVW5DaGVja2VkID0gZmFsc2U7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgc2V0IGZvY3VzZWQoaXNGb2N1c2VkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbGFiZWwuZm9jdXNlZCA9IGlzRm9jdXNlZDtcbiAgICBpZiAoIWlzRm9jdXNlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9sYWJlbDogTmdiQnV0dG9uTGFiZWwsIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICBvbklucHV0Q2hhbmdlKCRldmVudCkge1xuICAgIGNvbnN0IG1vZGVsVG9Qcm9wYWdhdGUgPSAkZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyB0aGlzLnZhbHVlQ2hlY2tlZCA6IHRoaXMudmFsdWVVbkNoZWNrZWQ7XG4gICAgdGhpcy5vbkNoYW5nZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIHRoaXMud3JpdGVWYWx1ZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fbGFiZWwuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuY2hlY2tlZCA9IHZhbHVlID09PSB0aGlzLnZhbHVlQ2hlY2tlZDtcbiAgICB0aGlzLl9sYWJlbC5hY3RpdmUgPSB0aGlzLmNoZWNrZWQ7XG5cbiAgICAvLyBsYWJlbCB3b24ndCBiZSB1cGRhdGVkLCBpZiBpdCBpcyBpbnNpZGUgdGhlIE9uUHVzaCBjb21wb25lbnQgd2hlbiBbbmdNb2RlbF0gY2hhbmdlc1xuICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICB9XG59XG4iXX0=