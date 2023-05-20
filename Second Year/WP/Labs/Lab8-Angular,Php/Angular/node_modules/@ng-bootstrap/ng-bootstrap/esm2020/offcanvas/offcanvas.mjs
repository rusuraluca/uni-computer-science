import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./offcanvas-stack";
import * as i2 from "./offcanvas-config";
/**
 * A service for opening an offcanvas.
 *
 * Creating an offcanvas is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 *
 * @since 12.1.0
 */
export class NgbOffcanvas {
    constructor(_moduleCFR, _injector, _offcanvasStack, _config) {
        this._moduleCFR = _moduleCFR;
        this._injector = _injector;
        this._offcanvasStack = _offcanvasStack;
        this._config = _config;
    }
    /**
     * Opens a new offcanvas panel with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveOffcanvas` class. You can then
     * use `NgbActiveOffcanvas` methods to close / dismiss offcanvas from "inside" of your component.
     *
     * Also see the [`NgbOffcanvasOptions`](#/components/offcanvas/api#NgbOffcanvasOptions) for the list of supported
     * options.
     */
    open(content, options = {}) {
        const combinedOptions = { ...this._config, animation: this._config.animation, ...options };
        return this._offcanvasStack.open(this._moduleCFR, this._injector, content, combinedOptions);
    }
    /**
     * Returns an observable that holds the active offcanvas instance.
     */
    get activeInstance() { return this._offcanvasStack.activeInstance; }
    /**
     * Dismisses the currently displayed offcanvas with the supplied reason.
     */
    dismiss(reason) { this._offcanvasStack.dismiss(reason); }
    /**
     * Indicates if there is currently an open offcanvas in the application.
     */
    hasOpenOffcanvas() { return this._offcanvasStack.hasOpenOffcanvas(); }
}
NgbOffcanvas.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.Injector }, { token: i1.NgbOffcanvasStack }, { token: i2.NgbOffcanvasConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvas.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.Injector }, { type: i1.NgbOffcanvasStack }, { type: i2.NgbOffcanvasConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUEyQixVQUFVLEVBQVcsTUFBTSxlQUFlLENBQUM7Ozs7QUFLN0U7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxZQUFZO0lBQ3ZCLFlBQ1ksVUFBb0MsRUFBVSxTQUFtQixFQUNqRSxlQUFrQyxFQUFVLE9BQTJCO1FBRHZFLGVBQVUsR0FBVixVQUFVLENBQTBCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNqRSxvQkFBZSxHQUFmLGVBQWUsQ0FBbUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFvQjtJQUFHLENBQUM7SUFFdkY7Ozs7Ozs7OztPQVNHO0lBQ0gsSUFBSSxDQUFDLE9BQVksRUFBRSxVQUErQixFQUFFO1FBQ2xELE1BQU0sZUFBZSxHQUFHLEVBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLE9BQU8sRUFBQyxDQUFDO1FBQ3pGLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLGNBQWMsS0FBSyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUVwRTs7T0FFRztJQUNILE9BQU8sQ0FBQyxNQUFZLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9EOztPQUVHO0lBQ0gsZ0JBQWdCLEtBQWMsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDOzt5R0FqQ3BFLFlBQVk7NkdBQVosWUFBWSxjQURBLE1BQU07MkZBQ2xCLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEluamVjdGFibGUsIEluamVjdG9yfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiT2ZmY2FudmFzQ29uZmlnLCBOZ2JPZmZjYW52YXNPcHRpb25zfSBmcm9tICcuL29mZmNhbnZhcy1jb25maWcnO1xuaW1wb3J0IHtOZ2JPZmZjYW52YXNSZWZ9IGZyb20gJy4vb2ZmY2FudmFzLXJlZic7XG5pbXBvcnQge05nYk9mZmNhbnZhc1N0YWNrfSBmcm9tICcuL29mZmNhbnZhcy1zdGFjayc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIGZvciBvcGVuaW5nIGFuIG9mZmNhbnZhcy5cbiAqXG4gKiBDcmVhdGluZyBhbiBvZmZjYW52YXMgaXMgc3RyYWlnaHRmb3J3YXJkOiBjcmVhdGUgYSBjb21wb25lbnQgb3IgYSB0ZW1wbGF0ZSBhbmQgcGFzcyBpdCBhcyBhbiBhcmd1bWVudCB0b1xuICogdGhlIGAub3BlbigpYCBtZXRob2QuXG4gKlxuICogQHNpbmNlIDEyLjEuMFxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JPZmZjYW52YXMge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX21vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsXG4gICAgICBwcml2YXRlIF9vZmZjYW52YXNTdGFjazogTmdiT2ZmY2FudmFzU3RhY2ssIHByaXZhdGUgX2NvbmZpZzogTmdiT2ZmY2FudmFzQ29uZmlnKSB7fVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG5ldyBvZmZjYW52YXMgcGFuZWwgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbnRlbnQgYW5kIHN1cHBsaWVkIG9wdGlvbnMuXG4gICAqXG4gICAqIENvbnRlbnQgY2FuIGJlIHByb3ZpZGVkIGFzIGEgYFRlbXBsYXRlUmVmYCBvciBhIGNvbXBvbmVudCB0eXBlLiBJZiB5b3UgcGFzcyBhIGNvbXBvbmVudCB0eXBlIGFzIGNvbnRlbnQsXG4gICAqIHRoZW4gaW5zdGFuY2VzIG9mIHRob3NlIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgdGhlIGBOZ2JBY3RpdmVPZmZjYW52YXNgIGNsYXNzLiBZb3UgY2FuIHRoZW5cbiAgICogdXNlIGBOZ2JBY3RpdmVPZmZjYW52YXNgIG1ldGhvZHMgdG8gY2xvc2UgLyBkaXNtaXNzIG9mZmNhbnZhcyBmcm9tIFwiaW5zaWRlXCIgb2YgeW91ciBjb21wb25lbnQuXG4gICAqXG4gICAqIEFsc28gc2VlIHRoZSBbYE5nYk9mZmNhbnZhc09wdGlvbnNgXSgjL2NvbXBvbmVudHMvb2ZmY2FudmFzL2FwaSNOZ2JPZmZjYW52YXNPcHRpb25zKSBmb3IgdGhlIGxpc3Qgb2Ygc3VwcG9ydGVkXG4gICAqIG9wdGlvbnMuXG4gICAqL1xuICBvcGVuKGNvbnRlbnQ6IGFueSwgb3B0aW9uczogTmdiT2ZmY2FudmFzT3B0aW9ucyA9IHt9KTogTmdiT2ZmY2FudmFzUmVmIHtcbiAgICBjb25zdCBjb21iaW5lZE9wdGlvbnMgPSB7Li4udGhpcy5fY29uZmlnLCBhbmltYXRpb246IHRoaXMuX2NvbmZpZy5hbmltYXRpb24sIC4uLm9wdGlvbnN9O1xuICAgIHJldHVybiB0aGlzLl9vZmZjYW52YXNTdGFjay5vcGVuKHRoaXMuX21vZHVsZUNGUiwgdGhpcy5faW5qZWN0b3IsIGNvbnRlbnQsIGNvbWJpbmVkT3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYnNlcnZhYmxlIHRoYXQgaG9sZHMgdGhlIGFjdGl2ZSBvZmZjYW52YXMgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgYWN0aXZlSW5zdGFuY2UoKSB7IHJldHVybiB0aGlzLl9vZmZjYW52YXNTdGFjay5hY3RpdmVJbnN0YW5jZTsgfVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIGN1cnJlbnRseSBkaXNwbGF5ZWQgb2ZmY2FudmFzIHdpdGggdGhlIHN1cHBsaWVkIHJlYXNvbi5cbiAgICovXG4gIGRpc21pc3MocmVhc29uPzogYW55KSB7IHRoaXMuX29mZmNhbnZhc1N0YWNrLmRpc21pc3MocmVhc29uKTsgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlcmUgaXMgY3VycmVudGx5IGFuIG9wZW4gb2ZmY2FudmFzIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIGhhc09wZW5PZmZjYW52YXMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9vZmZjYW52YXNTdGFjay5oYXNPcGVuT2ZmY2FudmFzKCk7IH1cbn1cbiJdfQ==