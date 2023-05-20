import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * A configuration service for the [NgbCarousel](#/components/carousel/api#NgbCarousel) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all carousels used in the application.
 */
export class NgbCarouselConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
        this.pauseOnHover = true;
        this.pauseOnFocus = true;
        this.showNavigationArrows = true;
        this.showNavigationIndicators = true;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbCarouselConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, deps: [{ token: i1.NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbCarouselConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.NgbConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwtY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2Nhcm91c2VsL2Nhcm91c2VsLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7QUFHekM7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8saUJBQWlCO0lBVzVCLFlBQW9CLFVBQXFCO1FBQXJCLGVBQVUsR0FBVixVQUFVLENBQVc7UUFWekMsYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixTQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ1osYUFBUSxHQUFHLElBQUksQ0FBQztRQUNoQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDNUIsNkJBQXdCLEdBQUcsSUFBSSxDQUFDO0lBSVksQ0FBQztJQUU3QyxJQUFJLFNBQVMsS0FBYyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2xILElBQUksU0FBUyxDQUFDLFNBQWtCLElBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs4R0FkdkQsaUJBQWlCO2tIQUFqQixpQkFBaUIsY0FETCxNQUFNOzJGQUNsQixpQkFBaUI7a0JBRDdCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiQ29uZmlnfSBmcm9tICcuLi9uZ2ItY29uZmlnJztcblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtOZ2JDYXJvdXNlbF0oIy9jb21wb25lbnRzL2Nhcm91c2VsL2FwaSNOZ2JDYXJvdXNlbCkgY29tcG9uZW50LlxuICpcbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgaXRzIHByb3BlcnRpZXNcbiAqIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCBjYXJvdXNlbHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYkNhcm91c2VsQ29uZmlnIHtcbiAgaW50ZXJ2YWwgPSA1MDAwO1xuICB3cmFwID0gdHJ1ZTtcbiAga2V5Ym9hcmQgPSB0cnVlO1xuICBwYXVzZU9uSG92ZXIgPSB0cnVlO1xuICBwYXVzZU9uRm9jdXMgPSB0cnVlO1xuICBzaG93TmF2aWdhdGlvbkFycm93cyA9IHRydWU7XG4gIHNob3dOYXZpZ2F0aW9uSW5kaWNhdG9ycyA9IHRydWU7XG5cbiAgcHJpdmF0ZSBfYW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX25nYkNvbmZpZzogTmdiQ29uZmlnKSB7fVxuXG4gIGdldCBhbmltYXRpb24oKTogYm9vbGVhbiB7IHJldHVybiAodGhpcy5fYW5pbWF0aW9uID09PSB1bmRlZmluZWQpID8gdGhpcy5fbmdiQ29uZmlnLmFuaW1hdGlvbiA6IHRoaXMuX2FuaW1hdGlvbjsgfVxuICBzZXQgYW5pbWF0aW9uKGFuaW1hdGlvbjogYm9vbGVhbikgeyB0aGlzLl9hbmltYXRpb24gPSBhbmltYXRpb247IH1cbn1cbiJdfQ==