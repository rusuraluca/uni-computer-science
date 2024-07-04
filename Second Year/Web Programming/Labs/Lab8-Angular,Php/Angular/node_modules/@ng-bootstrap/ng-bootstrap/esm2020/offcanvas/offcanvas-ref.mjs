import { of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPromise } from '../util/util';
/**
 * A reference to the currently opened (active) offcanvas.
 *
 * Instances of this class can be injected into your component passed as offcanvas content.
 * So you can `.close()` or `.dismiss()` the offcanvas window from your component.
 *
 * @since 12.1.0
 */
export class NgbActiveOffcanvas {
    /**
     * Closes the offcanvas with an optional `result` value.
     *
     * The `NgbOffcanvasRef.result` promise will be resolved with the provided value.
     */
    close(result) { }
    /**
     * Dismisses the offcanvas with an optional `reason` value.
     *
     * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) { }
}
/**
 * A reference to the newly opened offcanvas returned by the `NgbOffcanvas.open()` method.
 *
 * @since 12.1.0
 */
export class NgbOffcanvasRef {
    constructor(_panelCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._panelCmptRef = _panelCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        this._closed = new Subject();
        this._dismissed = new Subject();
        this._hidden = new Subject();
        _panelCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        if (_backdropCmptRef) {
            _backdropCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        }
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of a component used for the offcanvas content.
     *
     * When a `TemplateRef` is used as the content or when the offcanvas is closed, will return `undefined`.
     */
    get componentInstance() {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * The observable that emits when the offcanvas is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     */
    get closed() { return this._closed.asObservable().pipe(takeUntil(this._hidden)); }
    /**
     * The observable that emits when the offcanvas is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     */
    get dismissed() { return this._dismissed.asObservable().pipe(takeUntil(this._hidden)); }
    /**
     * The observable that emits when both offcanvas window and backdrop are closed and animations were finished.
     * At this point offcanvas and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     */
    get hidden() { return this._hidden.asObservable(); }
    /**
     * The observable that emits when offcanvas is fully visible and animation was finished.
     * The offcanvas DOM element is always available synchronously after calling 'offcanvas.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if offcanvas is closed before open animation is finished.
     */
    get shown() { return this._panelCmptRef.instance.shown.asObservable(); }
    /**
     * Closes the offcanvas with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result) {
        if (this._panelCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeOffcanvasElements();
        }
    }
    _dismiss(reason) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeOffcanvasElements();
    }
    /**
     * Dismisses the offcanvas with an optional `reason` value.
     *
     * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) {
        if (this._panelCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                const dismiss = this._beforeDismiss();
                if (isPromise(dismiss)) {
                    dismiss.then(result => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    _removeOffcanvasElements() {
        const panelTransition$ = this._panelCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);
        // hiding panel
        panelTransition$.subscribe(() => {
            const { nativeElement } = this._panelCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._panelCmptRef.destroy();
            if (this._contentRef && this._contentRef.viewRef) {
                this._contentRef.viewRef.destroy();
            }
            this._panelCmptRef = null;
            this._contentRef = null;
        });
        // hiding backdrop
        backdropTransition$.subscribe(() => {
            if (this._backdropCmptRef) {
                const { nativeElement } = this._backdropCmptRef.location;
                nativeElement.parentNode.removeChild(nativeElement);
                this._backdropCmptRef.destroy();
                this._backdropCmptRef = null;
            }
        });
        // all done
        zip(panelTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLXJlZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9vZmZjYW52YXMvb2ZmY2FudmFzLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBR3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFJdkM7Ozs7Ozs7R0FPRztBQUNILE1BQU0sT0FBTyxrQkFBa0I7SUFDN0I7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxNQUFZLElBQVMsQ0FBQztJQUU1Qjs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLE1BQVksSUFBUyxDQUFDO0NBQy9CO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxlQUFlO0lBdUQxQixZQUNZLGFBQThDLEVBQVUsV0FBdUIsRUFDL0UsZ0JBQXFELEVBQ3JELGNBQWlEO1FBRmpELGtCQUFhLEdBQWIsYUFBYSxDQUFpQztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQy9FLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBcUM7UUFDckQsbUJBQWMsR0FBZCxjQUFjLENBQW1DO1FBekRyRCxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUM3QixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNoQyxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQXdEcEMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsSUFBSSxnQkFBZ0IsRUFBRTtZQUNwQixnQkFBZ0IsQ0FBQyxRQUFRLENBQUMs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Z0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDaEMsSUFBSSxDQUFDLGdCQUFnQixHQUFRLElBQUksQ0FBQzthQUNuQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsV0FBVztRQUNYLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge09ic2VydmFibGUsIG9mLCBTdWJqZWN0LCB6aXB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtDb250ZW50UmVmfSBmcm9tICcuLi91dGlsL3BvcHVwJztcbmltcG9ydCB7aXNQcm9taXNlfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JPZmZjYW52YXNCYWNrZHJvcH0gZnJvbSAnLi9vZmZjYW52YXMtYmFja2Ryb3AnO1xuaW1wb3J0IHtOZ2JPZmZjYW52YXNQYW5lbH0gZnJvbSAnLi9vZmZjYW52YXMtcGFuZWwnO1xuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBjdXJyZW50bHkgb3BlbmVkIChhY3RpdmUpIG9mZmNhbnZhcy5cbiAqXG4gKiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBjYW4gYmUgaW5qZWN0ZWQgaW50byB5b3VyIGNvbXBvbmVudCBwYXNzZWQgYXMgb2ZmY2FudmFzIGNvbnRlbnQuXG4gKiBTbyB5b3UgY2FuIGAuY2xvc2UoKWAgb3IgYC5kaXNtaXNzKClgIHRoZSBvZmZjYW52YXMgd2luZG93IGZyb20geW91ciBjb21wb25lbnQuXG4gKlxuICogQHNpbmNlIDEyLjEuMFxuICovXG5leHBvcnQgY2xhc3MgTmdiQWN0aXZlT2ZmY2FudmFzIHtcbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgb2ZmY2FudmFzIHdpdGggYW4gb3B0aW9uYWwgYHJlc3VsdGAgdmFsdWUuXG4gICAqXG4gICAqIFRoZSBgTmdiT2ZmY2FudmFzUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgKi9cbiAgY2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7fVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIG9mZmNhbnZhcyB3aXRoIGFuIG9wdGlvbmFsIGByZWFzb25gIHZhbHVlLlxuICAgKlxuICAgKiBUaGUgYE5nYk9mZmNhbnZhc1JlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICovXG4gIGRpc21pc3MocmVhc29uPzogYW55KTogdm9pZCB7fVxufVxuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIHRoZSBuZXdseSBvcGVuZWQgb2ZmY2FudmFzIHJldHVybmVkIGJ5IHRoZSBgTmdiT2ZmY2FudmFzLm9wZW4oKWAgbWV0aG9kLlxuICpcbiAqIEBzaW5jZSAxMi4xLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE5nYk9mZmNhbnZhc1JlZiB7XG4gIHByaXZhdGUgX2Nsb3NlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgcHJpdmF0ZSBfZGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIF9oaWRkZW4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9yZXNvbHZlOiAocmVzdWx0PzogYW55KSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudCB1c2VkIGZvciB0aGUgb2ZmY2FudmFzIGNvbnRlbnQuXG4gICAqXG4gICAqIFdoZW4gYSBgVGVtcGxhdGVSZWZgIGlzIHVzZWQgYXMgdGhlIGNvbnRlbnQgb3Igd2hlbiB0aGUgb2ZmY2FudmFzIGlzIGNsb3NlZCwgd2lsbCByZXR1cm4gYHVuZGVmaW5lZGAuXG4gICAqL1xuICBnZXQgY29tcG9uZW50SW5zdGFuY2UoKTogYW55IHtcbiAgICBpZiAodGhpcy5fY29udGVudFJlZiAmJiB0aGlzLl9jb250ZW50UmVmLmNvbXBvbmVudFJlZikge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRSZWYuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIG9mZmNhbnZhcyBpcyBjbG9zZWQgYW5kIHJlamVjdGVkIHdoZW4gdGhlIG9mZmNhbnZhcyBpcyBkaXNtaXNzZWQuXG4gICAqL1xuICByZXN1bHQ6IFByb21pc2U8YW55PjtcblxuICAvKipcbiAgICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvZmZjYW52YXMgaXMgY2xvc2VkIHZpYSB0aGUgYC5jbG9zZSgpYCBtZXRob2QuXG4gICAqXG4gICAqIEl0IHdpbGwgZW1pdCB0aGUgcmVzdWx0IHBhc3NlZCB0byB0aGUgYC5jbG9zZSgpYCBtZXRob2QuXG4gICAqL1xuICBnZXQgY2xvc2VkKCk6IE9ic2VydmFibGU8YW55PiB7IHJldHVybiB0aGlzLl9jbG9zZWQuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwodGhpcy5faGlkZGVuKSk7IH1cblxuICAvKipcbiAgICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIHRoZSBvZmZjYW52YXMgaXMgZGlzbWlzc2VkIHZpYSB0aGUgYC5kaXNtaXNzKClgIG1ldGhvZC5cbiAgICpcbiAgICogSXQgd2lsbCBlbWl0IHRoZSByZWFzb24gcGFzc2VkIHRvIHRoZSBgLmRpc21pc3NlZCgpYCBtZXRob2QgYnkgdGhlIHVzZXIsIG9yIG9uZSBvZiB0aGUgaW50ZXJuYWxcbiAgICogcmVhc29ucyBsaWtlIGJhY2tkcm9wIGNsaWNrIG9yIEVTQyBrZXkgcHJlc3MuXG4gICAqL1xuICBnZXQgZGlzbWlzc2VkKCk6IE9ic2VydmFibGU8YW55PiB7IHJldHVybiB0aGlzLl9kaXNtaXNzZWQuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlVW50aWwodGhpcy5faGlkZGVuKSk7IH1cblxuICAvKipcbiAgICogVGhlIG9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuIGJvdGggb2ZmY2FudmFzIHdpbmRvdyBhbmQgYmFja2Ryb3AgYXJlIGNsb3NlZCBhbmQgYW5pbWF0aW9ucyB3ZXJlIGZpbmlzaGVkLlxuICAgKiBBdCB0aGlzIHBvaW50IG9mZmNhbnZhcyBhbmQgYmFja2Ryb3AgZWxlbWVudHMgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIERPTSB0cmVlLlxuICAgKlxuICAgKiBUaGlzIG9ic2VydmFibGUgd2lsbCBiZSBjb21wbGV0ZWQgYWZ0ZXIgZW1pdHRpbmcuXG4gICAqL1xuICBnZXQgaGlkZGVuKCk6IE9ic2VydmFibGU8dm9pZD4geyByZXR1cm4gdGhpcy5faGlkZGVuLmFzT2JzZXJ2YWJsZSgpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hlbiBvZmZjYW52YXMgaXMgZnVsbHkgdmlzaWJsZSBhbmQgYW5pbWF0aW9uIHdhcyBmaW5pc2hlZC5cbiAgICogVGhlIG9mZmNhbnZhcyBET00gZWxlbWVudCBpcyBhbHdheXMgYXZhaWxhYmxlIHN5bmNocm9ub3VzbHkgYWZ0ZXIgY2FsbGluZyAnb2ZmY2FudmFzLm9wZW4oKScgc2VydmljZS5cbiAgICpcbiAgICogVGhpcyBvYnNlcnZhYmxlIHdpbGwgYmUgY29tcGxldGVkIGFmdGVyIGVtaXR0aW5nLlxuICAgKiBJdCB3aWxsIG5vdCBlbWl0LCBpZiBvZmZjYW52YXMgaXMgY2xvc2VkIGJlZm9yZSBvcGVuIGFuaW1hdGlvbiBpcyBmaW5pc2hlZC5cbiAgICovXG4gIGdldCBzaG93bigpOiBPYnNlcnZhYmxlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuX3BhbmVsQ21wdFJlZi5pbnN0YW5jZS5zaG93bi5hc09ic2VydmFibGUoKTsgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcGFuZWxDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiT2ZmY2FudmFzUGFuZWw+LCBwcml2YXRlIF9jb250ZW50UmVmOiBDb250ZW50UmVmLFxuICAgICAgcHJpdmF0ZSBfYmFja2Ryb3BDbXB0UmVmPzogQ29tcG9uZW50UmVmPE5nYk9mZmNhbnZhc0JhY2tkcm9wPixcbiAgICAgIHByaXZhdGUgX2JlZm9yZURpc21pc3M/OiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPikge1xuICAgIF9wYW5lbENtcHRSZWYuaW5zdGFuY2UuZGlzbWlzc0V2ZW50LnN1YnNjcmliZSgocmVhc29uOiBhbnkpID0+IHsgdGhpcy5kaXNtaXNzKHJlYXNvbik7IH0pO1xuICAgIGlmIChfYmFja2Ryb3BDbXB0UmVmKSB7XG4gICAgICBfYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlLmRpc21pc3NFdmVudC5zdWJzY3JpYmUoKHJlYXNvbjogYW55KSA9PiB7IHRoaXMuZGlzbWlzcyhyZWFzb24pOyB9KTtcbiAgICB9XG4gICAgdGhpcy5yZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgICB0aGlzLnJlc3VsdC50aGVuKG51bGwsICgpID0+IHt9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIG9mZmNhbnZhcyB3aXRoIGFuIG9wdGlvbmFsIGByZXN1bHRgIHZhbHVlLlxuICAgKlxuICAgKiBUaGUgYE5nYk1vYmFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgKi9cbiAgY2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BhbmVsQ21wdFJlZikge1xuICAgICAgdGhpcy5fY2xvc2VkLm5leHQocmVzdWx0KTtcbiAgICAgIHRoaXMuX3Jlc29sdmUocmVzdWx0KTtcbiAgICAgIHRoaXMuX3JlbW92ZU9mZmNhbnZhc0VsZW1lbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGlzbWlzcyhyZWFzb24/OiBhbnkpIHtcbiAgICB0aGlzLl9kaXNtaXNzZWQubmV4dChyZWFzb24pO1xuICAgIHRoaXMuX3JlamVjdChyZWFzb24pO1xuICAgIHRoaXMuX3JlbW92ZU9mZmNhbnZhc0VsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBvZmZjYW52YXMgd2l0aCBhbiBvcHRpb25hbCBgcmVhc29uYCB2YWx1ZS5cbiAgICpcbiAgICogVGhlIGBOZ2JPZmZjYW52YXNSZWYucmVzdWx0YCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAqL1xuICBkaXNtaXNzKHJlYXNvbj86IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYW5lbENtcHRSZWYpIHtcbiAgICAgIGlmICghdGhpcy5fYmVmb3JlRGlzbWlzcykge1xuICAgICAgICB0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkaXNtaXNzID0gdGhpcy5fYmVmb3JlRGlzbWlzcygpO1xuICAgICAgICBpZiAoaXNQcm9taXNlKGRpc21pc3MpKSB7XG4gICAgICAgICAgZGlzbWlzcy50aGVuKFxuICAgICAgICAgICAgICByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAoKSA9PiB7fSk7XG4gICAgICAgIH0gZWxzZSBpZiAoZGlzbWlzcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGlzLl9kaXNtaXNzKHJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVPZmZjYW52YXNFbGVtZW50cygpIHtcbiAgICBjb25zdCBwYW5lbFRyYW5zaXRpb24kID0gdGhpcy5fcGFuZWxDbXB0UmVmLmluc3RhbmNlLmhpZGUoKTtcbiAgICBjb25zdCBiYWNrZHJvcFRyYW5zaXRpb24kID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmID8gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlLmhpZGUoKSA6IG9mKHVuZGVmaW5lZCk7XG5cbiAgICAvLyBoaWRpbmcgcGFuZWxcbiAgICBwYW5lbFRyYW5zaXRpb24kLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBjb25zdCB7bmF0aXZlRWxlbWVudH0gPSB0aGlzLl9wYW5lbENtcHRSZWYubG9jYXRpb247XG4gICAgICBuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLl9wYW5lbENtcHRSZWYuZGVzdHJveSgpO1xuXG4gICAgICBpZiAodGhpcy5fY29udGVudFJlZiAmJiB0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYpIHtcbiAgICAgICAgdGhpcy5fY29udGVudFJlZi52aWV3UmVmLmRlc3Ryb3koKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGFuZWxDbXB0UmVmID0gPGFueT5udWxsO1xuICAgICAgdGhpcy5fY29udGVudFJlZiA9IDxhbnk+bnVsbDtcbiAgICB9KTtcblxuICAgIC8vIGhpZGluZyBiYWNrZHJvcFxuICAgIGJhY2tkcm9wVHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9iYWNrZHJvcENtcHRSZWYpIHtcbiAgICAgICAgY29uc3Qge25hdGl2ZUVsZW1lbnR9ID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uO1xuICAgICAgICBuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA9IDxhbnk+bnVsbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGFsbCBkb25lXG4gICAgemlwKHBhbmVsVHJhbnNpdGlvbiQsIGJhY2tkcm9wVHJhbnNpdGlvbiQpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9oaWRkZW4ubmV4dCgpO1xuICAgICAgdGhpcy5faGlkZGVuLmNvbXBsZXRlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==