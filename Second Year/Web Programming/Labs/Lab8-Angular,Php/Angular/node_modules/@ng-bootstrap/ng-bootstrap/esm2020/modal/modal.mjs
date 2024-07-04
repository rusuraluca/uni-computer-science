import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./modal-stack";
import * as i2 from "./modal-config";
/**
 * A service for opening modal windows.
 *
 * Creating a modal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
export class NgbModal {
    constructor(_moduleCFR, _injector, _modalStack, _config) {
        this._moduleCFR = _moduleCFR;
        this._injector = _injector;
        this._modalStack = _modalStack;
        this._config = _config;
    }
    /**
     * Opens a new modal window with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveModal` class. You can then
     * use `NgbActiveModal` methods to close / dismiss modals from "inside" of your component.
     *
     * Also see the [`NgbModalOptions`](#/components/modal/api#NgbModalOptions) for the list of supported options.
     */
    open(content, options = {}) {
        const combinedOptions = { ...this._config, animation: this._config.animation, ...options };
        return this._modalStack.open(this._moduleCFR, this._injector, content, combinedOptions);
    }
    /**
     * Returns an observable that holds the active modal instances.
     */
    get activeInstances() { return this._modalStack.activeInstances; }
    /**
     * Dismisses all currently displayed modal windows with the supplied reason.
     *
     * @since 3.1.0
     */
    dismissAll(reason) { this._modalStack.dismissAll(reason); }
    /**
     * Indicates if there are currently any open modal windows in the application.
     *
     * @since 3.3.0
     */
    hasOpenModals() { return this._modalStack.hasOpenModals(); }
}
NgbModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.Injector }, { token: i1.NgbModalStack }, { token: i2.NgbModalConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModal.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.Injector }, { type: i1.NgbModalStack }, { type: i2.NgbModalConfig }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFVBQVUsRUFBcUMsTUFBTSxlQUFlLENBQUM7Ozs7QUFNN0U7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sUUFBUTtJQUNuQixZQUNZLFVBQW9DLEVBQVUsU0FBbUIsRUFBVSxXQUEwQixFQUNyRyxPQUF1QjtRQUR2QixlQUFVLEdBQVYsVUFBVSxDQUEwQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBZTtRQUNyRyxZQUFPLEdBQVAsT0FBTyxDQUFnQjtJQUFHLENBQUM7SUFFdkM7Ozs7Ozs7O09BUUc7SUFDSCxJQUFJLENBQUMsT0FBWSxFQUFFLFVBQTJCLEVBQUU7UUFDOUMsTUFBTSxlQUFlLEdBQUcsRUFBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsT0FBTyxFQUFDLENBQUM7UUFDekYsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksZUFBZSxLQUFLLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBRWxFOzs7O09BSUc7SUFDSCxVQUFVLENBQUMsTUFBWSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVqRTs7OztPQUlHO0lBQ0gsYUFBYSxLQUFjLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7O3FHQXBDMUQsUUFBUTt5R0FBUixRQUFRLGNBREksTUFBTTsyRkFDbEIsUUFBUTtrQkFEcEIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIEluamVjdG9yLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYk1vZGFsT3B0aW9ucywgTmdiTW9kYWxDb25maWd9IGZyb20gJy4vbW9kYWwtY29uZmlnJztcbmltcG9ydCB7TmdiTW9kYWxSZWZ9IGZyb20gJy4vbW9kYWwtcmVmJztcbmltcG9ydCB7TmdiTW9kYWxTdGFja30gZnJvbSAnLi9tb2RhbC1zdGFjayc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIGZvciBvcGVuaW5nIG1vZGFsIHdpbmRvd3MuXG4gKlxuICogQ3JlYXRpbmcgYSBtb2RhbCBpcyBzdHJhaWdodGZvcndhcmQ6IGNyZWF0ZSBhIGNvbXBvbmVudCBvciBhIHRlbXBsYXRlIGFuZCBwYXNzIGl0IGFzIGFuIGFyZ3VtZW50IHRvXG4gKiB0aGUgYC5vcGVuKClgIG1ldGhvZC5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWwge1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX21vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgX21vZGFsU3RhY2s6IE5nYk1vZGFsU3RhY2ssXG4gICAgICBwcml2YXRlIF9jb25maWc6IE5nYk1vZGFsQ29uZmlnKSB7fVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG5ldyBtb2RhbCB3aW5kb3cgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbnRlbnQgYW5kIHN1cHBsaWVkIG9wdGlvbnMuXG4gICAqXG4gICAqIENvbnRlbnQgY2FuIGJlIHByb3ZpZGVkIGFzIGEgYFRlbXBsYXRlUmVmYCBvciBhIGNvbXBvbmVudCB0eXBlLiBJZiB5b3UgcGFzcyBhIGNvbXBvbmVudCB0eXBlIGFzIGNvbnRlbnQsXG4gICAqIHRoZW4gaW5zdGFuY2VzIG9mIHRob3NlIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgdGhlIGBOZ2JBY3RpdmVNb2RhbGAgY2xhc3MuIFlvdSBjYW4gdGhlblxuICAgKiB1c2UgYE5nYkFjdGl2ZU1vZGFsYCBtZXRob2RzIHRvIGNsb3NlIC8gZGlzbWlzcyBtb2RhbHMgZnJvbSBcImluc2lkZVwiIG9mIHlvdXIgY29tcG9uZW50LlxuICAgKlxuICAgKiBBbHNvIHNlZSB0aGUgW2BOZ2JNb2RhbE9wdGlvbnNgXSgjL2NvbXBvbmVudHMvbW9kYWwvYXBpI05nYk1vZGFsT3B0aW9ucykgZm9yIHRoZSBsaXN0IG9mIHN1cHBvcnRlZCBvcHRpb25zLlxuICAgKi9cbiAgb3Blbihjb250ZW50OiBhbnksIG9wdGlvbnM6IE5nYk1vZGFsT3B0aW9ucyA9IHt9KTogTmdiTW9kYWxSZWYge1xuICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9ucyA9IHsuLi50aGlzLl9jb25maWcsIGFuaW1hdGlvbjogdGhpcy5fY29uZmlnLmFuaW1hdGlvbiwgLi4ub3B0aW9uc307XG4gICAgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2sub3Blbih0aGlzLl9tb2R1bGVDRlIsIHRoaXMuX2luamVjdG9yLCBjb250ZW50LCBjb21iaW5lZE9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gb2JzZXJ2YWJsZSB0aGF0IGhvbGRzIHRoZSBhY3RpdmUgbW9kYWwgaW5zdGFuY2VzLlxuICAgKi9cbiAgZ2V0IGFjdGl2ZUluc3RhbmNlcygpIHsgcmV0dXJuIHRoaXMuX21vZGFsU3RhY2suYWN0aXZlSW5zdGFuY2VzOyB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyBhbGwgY3VycmVudGx5IGRpc3BsYXllZCBtb2RhbCB3aW5kb3dzIHdpdGggdGhlIHN1cHBsaWVkIHJlYXNvbi5cbiAgICpcbiAgICogQHNpbmNlIDMuMS4wXG4gICAqL1xuICBkaXNtaXNzQWxsKHJlYXNvbj86IGFueSkgeyB0aGlzLl9tb2RhbFN0YWNrLmRpc21pc3NBbGwocmVhc29uKTsgfVxuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgaWYgdGhlcmUgYXJlIGN1cnJlbnRseSBhbnkgb3BlbiBtb2RhbCB3aW5kb3dzIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHNpbmNlIDMuMy4wXG4gICAqL1xuICBoYXNPcGVuTW9kYWxzKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5oYXNPcGVuTW9kYWxzKCk7IH1cbn1cbiJdfQ==