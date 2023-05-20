import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * Configuration service for the NgbToast component. You can inject this service, typically in your root component,
 * and customize the values of its properties in order to provide default values for all the toasts used in the
 * application.
 *
 * @since 5.0.0
 */
export class NgbToastConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.autohide = true;
        this.delay = 5000;
        this.ariaLive = 'polite';
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbToastConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, deps: [{ token: i1.NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbToastConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.NgbConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3RvYXN0L3RvYXN0LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7QUE4QnpDOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyxjQUFjO0lBT3pCLFlBQW9CLFVBQXFCO1FBQXJCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFOekMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsYUFBUSxHQUF1QixRQUFRLENBQUM7SUFJSSxDQUFDO0lBRTdDLElBQUksU0FBUyxLQUFjLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDbEgsSUFBSSxTQUFTLENBQUMsU0FBa0IsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7OzJHQVZ2RCxjQUFjOytHQUFkLGNBQWMsY0FERixNQUFNOzJGQUNsQixjQUFjO2tCQUQxQixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkNvbmZpZ30gZnJvbSAnLi4vbmdiLWNvbmZpZyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIHVzZWQgdG8gdHlwZSBhbGwgdG9hc3QgY29uZmlnIG9wdGlvbnMuIFNlZSBgTmdiVG9hc3RDb25maWdgLlxuICpcbiAqIEBzaW5jZSA1LjAuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlRvYXN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTcGVjaWZ5IGlmIHRoZSB0b2FzdCBjb21wb25lbnQgc2hvdWxkIGVtaXQgdGhlIGBoaWRlKClgIG91dHB1dFxuICAgKiBhZnRlciBhIGNlcnRhaW4gYGRlbGF5YCBpbiBtcy5cbiAgICovXG4gIGF1dG9oaWRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGVsYXkgaW4gbXMgYWZ0ZXIgd2hpY2ggdGhlIGBoaWRlKClgIG91dHB1dCBzaG91bGQgYmUgZW1pdHRlZC5cbiAgICovXG4gIGRlbGF5PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIGFyaWEtbGl2ZSBhdHRyaWJ1dGUgdG8gYmUgdXNlZC5cbiAgICpcbiAgICogQ291bGQgYmUgb25lIG9mIHRoZXNlIDIgdmFsdWVzIChhcyBzdHJpbmcpOlxuICAgKiAtIGBwb2xpdGVgIChkZWZhdWx0KVxuICAgKiAtIGBhbGVydGBcbiAgICovXG4gIGFyaWFMaXZlPzogJ3BvbGl0ZScgfCAnYWxlcnQnO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYlRvYXN0IGNvbXBvbmVudC4gWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCxcbiAqIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpbiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHRvYXN0cyB1c2VkIGluIHRoZVxuICogYXBwbGljYXRpb24uXG4gKlxuICogQHNpbmNlIDUuMC4wXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlRvYXN0Q29uZmlnIGltcGxlbWVudHMgTmdiVG9hc3RPcHRpb25zIHtcbiAgYXV0b2hpZGUgPSB0cnVlO1xuICBkZWxheSA9IDUwMDA7XG4gIGFyaWFMaXZlOiAncG9saXRlJyB8ICdhbGVydCcgPSAncG9saXRlJztcblxuICBwcml2YXRlIF9hbmltYXRpb246IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfbmdiQ29uZmlnOiBOZ2JDb25maWcpIHt9XG5cbiAgZ2V0IGFuaW1hdGlvbigpOiBib29sZWFuIHsgcmV0dXJuICh0aGlzLl9hbmltYXRpb24gPT09IHVuZGVmaW5lZCkgPyB0aGlzLl9uZ2JDb25maWcuYW5pbWF0aW9uIDogdGhpcy5fYW5pbWF0aW9uOyB9XG4gIHNldCBhbmltYXRpb24oYW5pbWF0aW9uOiBib29sZWFuKSB7IHRoaXMuX2FuaW1hdGlvbiA9IGFuaW1hdGlvbjsgfVxufVxuIl19