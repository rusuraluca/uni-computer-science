import { of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPromise } from '../util/util';
/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.close()` or `.dismiss()` the modal window from your component.
 */
export class NgbActiveModal {
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbModalRef.result` promise will be resolved with the provided value.
     */
    close(result) { }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) { }
}
/**
 * A reference to the newly opened modal returned by the `NgbModal.open()` method.
 */
export class NgbModalRef {
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        this._closed = new Subject();
        this._dismissed = new Subject();
        this._hidden = new Subject();
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of a component used for the modal content.
     *
     * When a `TemplateRef` is used as the content or when the modal is closed, will return `undefined`.
     */
    get componentInstance() {
        if (this._contentRef && this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * The observable that emits when the modal is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     *
     * @since 8.0.0
     */
    get closed() { return this._closed.asObservable().pipe(takeUntil(this._hidden)); }
    /**
     * The observable that emits when the modal is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     *
     * @since 8.0.0
     */
    get dismissed() { return this._dismissed.asObservable().pipe(takeUntil(this._hidden)); }
    /**
     * The observable that emits when both modal window and backdrop are closed and animations were finished.
     * At this point modal and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     *
     * @since 8.0.0
     */
    get hidden() { return this._hidden.asObservable(); }
    /**
     * The observable that emits when modal is fully visible and animation was finished.
     * Modal DOM element is always available synchronously after calling 'modal.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if modal is closed before open animation is finished.
     *
     * @since 8.0.0
     */
    get shown() { return this._windowCmptRef.instance.shown.asObservable(); }
    /**
     * Closes the modal with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result) {
        if (this._windowCmptRef) {
            this._closed.next(result);
            this._resolve(result);
            this._removeModalElements();
        }
    }
    _dismiss(reason) {
        this._dismissed.next(reason);
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Dismisses the modal with an optional `reason` value.
     *
     * The `NgbModalRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
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
    _removeModalElements() {
        const windowTransition$ = this._windowCmptRef.instance.hide();
        const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);
        // hiding window
        windowTransition$.subscribe(() => {
            const { nativeElement } = this._windowCmptRef.location;
            nativeElement.parentNode.removeChild(nativeElement);
            this._windowCmptRef.destroy();
            if (this._contentRef && this._contentRef.viewRef) {
                this._contentRef.viewRef.destroy();
            }
            this._windowCmptRef = null;
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
        zip(windowTransition$, backdropTransition$).subscribe(() => {
            this._hidden.next();
            this._hidden.complete();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtcmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkM7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sY0FBYztJQUN6Qjs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLE1BQVksSUFBUyxDQUFDO0lBRTVCOzs7O09BSUc7SUFDSCxPQUFPLENBQUMsTUFBWSxJQUFTLENBQUM7Q0FDL0I7QUFFRDs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBK0R0QixZQUNZLGNBQTRDLEVBQVUsV0FBdUIsRUFDN0UsZ0JBQWlELEVBQ2pELGNBQWlEO1FBRmpELG1CQUFjLEdBQWQsY0FBYyxDQUE4QjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQzdFLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBaUM7UUFDakQsbUJBQWMsR0FBZCxjQUFjLENBQW1DO1FBakVyRCxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUM3QixlQUFVLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUNoQyxZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQWdFcEMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFB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Q3pELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCwgemlwfSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TmdiTW9kYWxCYWNrZHJvcH0gZnJvbSAnLi9tb2RhbC1iYWNrZHJvcCc7XG5pbXBvcnQge05nYk1vZGFsV2luZG93fSBmcm9tICcuL21vZGFsLXdpbmRvdyc7XG5cbmltcG9ydCB7Q29udGVudFJlZn0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge2lzUHJvbWlzZX0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byB0aGUgY3VycmVudGx5IG9wZW5lZCAoYWN0aXZlKSBtb2RhbC5cbiAqXG4gKiBJbnN0YW5jZXMgb2YgdGhpcyBjbGFzcyBjYW4gYmUgaW5qZWN0ZWQgaW50byB5b3VyIGNvbXBvbmVudCBwYXNzZWQgYXMgbW9kYWwgY29udGVudC5cbiAqIFNvIHlvdSBjYW4gYC5jbG9zZSgpYCBvciBgLmRpc21pc3MoKWAgdGhlIG1vZGFsIHdpbmRvdyBmcm9tIHlvdXIgY29tcG9uZW50LlxuICovXG5leHBvcnQgY2xhc3MgTmdiQWN0aXZlTW9kYWwge1xuICAvKipcbiAgICogQ2xvc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZXN1bHRgIHZhbHVlLlxuICAgKlxuICAgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlc29sdmVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgKi9cbiAgY2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7fVxuXG4gIC8qKlxuICAgKiBEaXNtaXNzZXMgdGhlIG1vZGFsIHdpdGggYW4gb3B0aW9uYWwgYHJlYXNvbmAgdmFsdWUuXG4gICAqXG4gICAqIFRoZSBgTmdiTW9kYWxSZWYucmVzdWx0YCBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgdmFsdWUuXG4gICAqL1xuICBkaXNtaXNzKHJlYXNvbj86IGFueSk6IHZvaWQge31cbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byB0aGUgbmV3bHkgb3BlbmVkIG1vZGFsIHJldHVybmVkIGJ5IHRoZSBgTmdiTW9kYWwub3BlbigpYCBtZXRob2QuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFJlZiB7XG4gIHByaXZhdGUgX2Nsb3NlZCA9IG5ldyBTdWJqZWN0PGFueT4oKTtcbiAgcHJpdmF0ZSBfZGlzbWlzc2VkID0gbmV3IFN1YmplY3Q8YW55PigpO1xuICBwcml2YXRlIF9oaWRkZW4gPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9yZXNvbHZlOiAocmVzdWx0PzogYW55KSA9PiB2b2lkO1xuICBwcml2YXRlIF9yZWplY3Q6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFRoZSBpbnN0YW5jZSBvZiBhIGNvbXBvbmVudCB1c2VkIGZvciB0aGUgbW9kYWwgY29udGVudC5cbiAgICpcbiAgICogV2hlbiBhIGBUZW1wbGF0ZVJlZmAgaXMgdXNlZCBhcyB0aGUgY29udGVudCBvciB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQsIHdpbGwgcmV0dXJuIGB1bmRlZmluZWRgLlxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYgJiYgdGhpcy5fY29udGVudFJlZi5jb21wb25lbnRSZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50UmVmLmNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBtb2RhbCBpcyBjbG9zZWQgYW5kIHJlamVjdGVkIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZC5cbiAgICovXG4gIHJlc3VsdDogUHJvbWlzZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1vZGFsIGlzIGNsb3NlZCB2aWEgdGhlIGAuY2xvc2UoKWAgbWV0aG9kLlxuICAgKlxuICAgKiBJdCB3aWxsIGVtaXQgdGhlIHJlc3VsdCBwYXNzZWQgdG8gdGhlIGAuY2xvc2UoKWAgbWV0aG9kLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIGdldCBjbG9zZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHsgcmV0dXJuIHRoaXMuX2Nsb3NlZC5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9oaWRkZW4pKTsgfVxuXG4gIC8qKlxuICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gdGhlIG1vZGFsIGlzIGRpc21pc3NlZCB2aWEgdGhlIGAuZGlzbWlzcygpYCBtZXRob2QuXG4gICAqXG4gICAqIEl0IHdpbGwgZW1pdCB0aGUgcmVhc29uIHBhc3NlZCB0byB0aGUgYC5kaXNtaXNzZWQoKWAgbWV0aG9kIGJ5IHRoZSB1c2VyLCBvciBvbmUgb2YgdGhlIGludGVybmFsXG4gICAqIHJlYXNvbnMgbGlrZSBiYWNrZHJvcCBjbGljayBvciBFU0Mga2V5IHByZXNzLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIGdldCBkaXNtaXNzZWQoKTogT2JzZXJ2YWJsZTxhbnk+IHsgcmV0dXJuIHRoaXMuX2Rpc21pc3NlZC5hc09ic2VydmFibGUoKS5waXBlKHRha2VVbnRpbCh0aGlzLl9oaWRkZW4pKTsgfVxuXG4gIC8qKlxuICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gYm90aCBtb2RhbCB3aW5kb3cgYW5kIGJhY2tkcm9wIGFyZSBjbG9zZWQgYW5kIGFuaW1hdGlvbnMgd2VyZSBmaW5pc2hlZC5cbiAgICogQXQgdGhpcyBwb2ludCBtb2RhbCBhbmQgYmFja2Ryb3AgZWxlbWVudHMgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIERPTSB0cmVlLlxuICAgKlxuICAgKiBUaGlzIG9ic2VydmFibGUgd2lsbCBiZSBjb21wbGV0ZWQgYWZ0ZXIgZW1pdHRpbmcuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgZ2V0IGhpZGRlbigpOiBPYnNlcnZhYmxlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuX2hpZGRlbi5hc09ic2VydmFibGUoKTsgfVxuXG4gIC8qKlxuICAgKiBUaGUgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdoZW4gbW9kYWwgaXMgZnVsbHkgdmlzaWJsZSBhbmQgYW5pbWF0aW9uIHdhcyBmaW5pc2hlZC5cbiAgICogTW9kYWwgRE9NIGVsZW1lbnQgaXMgYWx3YXlzIGF2YWlsYWJsZSBzeW5jaHJvbm91c2x5IGFmdGVyIGNhbGxpbmcgJ21vZGFsLm9wZW4oKScgc2VydmljZS5cbiAgICpcbiAgICogVGhpcyBvYnNlcnZhYmxlIHdpbGwgYmUgY29tcGxldGVkIGFmdGVyIGVtaXR0aW5nLlxuICAgKiBJdCB3aWxsIG5vdCBlbWl0LCBpZiBtb2RhbCBpcyBjbG9zZWQgYmVmb3JlIG9wZW4gYW5pbWF0aW9uIGlzIGZpbmlzaGVkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIGdldCBzaG93bigpOiBPYnNlcnZhYmxlPHZvaWQ+IHsgcmV0dXJuIHRoaXMuX3dpbmRvd0NtcHRSZWYuaW5zdGFuY2Uuc2hvd24uYXNPYnNlcnZhYmxlKCk7IH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3dpbmRvd0NtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4sIHByaXZhdGUgX2NvbnRlbnRSZWY6IENvbnRlbnRSZWYsXG4gICAgICBwcml2YXRlIF9iYWNrZHJvcENtcHRSZWY/OiBDb21wb25lbnRSZWY8TmdiTW9kYWxCYWNrZHJvcD4sXG4gICAgICBwcml2YXRlIF9iZWZvcmVEaXNtaXNzPzogKCkgPT4gYm9vbGVhbiB8IFByb21pc2U8Ym9vbGVhbj4pIHtcbiAgICBfd2luZG93Q21wdFJlZi5pbnN0YW5jZS5kaXNtaXNzRXZlbnQuc3Vic2NyaWJlKChyZWFzb246IGFueSkgPT4geyB0aGlzLmRpc21pc3MocmVhc29uKTsgfSk7XG5cbiAgICB0aGlzLnJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0LnRoZW4obnVsbCwgKCkgPT4ge30pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgbW9kYWwgd2l0aCBhbiBvcHRpb25hbCBgcmVzdWx0YCB2YWx1ZS5cbiAgICpcbiAgICogVGhlIGBOZ2JNb2JhbFJlZi5yZXN1bHRgIHByb21pc2Ugd2lsbCBiZSByZXNvbHZlZCB3aXRoIHRoZSBwcm92aWRlZCB2YWx1ZS5cbiAgICovXG4gIGNsb3NlKHJlc3VsdD86IGFueSk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dDbXB0UmVmKSB7XG4gICAgICB0aGlzLl9jbG9zZWQubmV4dChyZXN1bHQpO1xuICAgICAgdGhpcy5fcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgdGhpcy5fcmVtb3ZlTW9kYWxFbGVtZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Rpc21pc3MocmVhc29uPzogYW55KSB7XG4gICAgdGhpcy5fZGlzbWlzc2VkLm5leHQocmVhc29uKTtcbiAgICB0aGlzLl9yZWplY3QocmVhc29uKTtcbiAgICB0aGlzLl9yZW1vdmVNb2RhbEVsZW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzbWlzc2VzIHRoZSBtb2RhbCB3aXRoIGFuIG9wdGlvbmFsIGByZWFzb25gIHZhbHVlLlxuICAgKlxuICAgKiBUaGUgYE5nYk1vZGFsUmVmLnJlc3VsdGAgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlLlxuICAgKi9cbiAgZGlzbWlzcyhyZWFzb24/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93Q21wdFJlZikge1xuICAgICAgaWYgKCF0aGlzLl9iZWZvcmVEaXNtaXNzKSB7XG4gICAgICAgIHRoaXMuX2Rpc21pc3MocmVhc29uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRpc21pc3MgPSB0aGlzLl9iZWZvcmVEaXNtaXNzKCk7XG4gICAgICAgIGlmIChpc1Byb21pc2UoZGlzbWlzcykpIHtcbiAgICAgICAgICBkaXNtaXNzLnRoZW4oXG4gICAgICAgICAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc21pc3MocmVhc29uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICgpID0+IHt9KTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXNtaXNzICE9PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMuX2Rpc21pc3MocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3JlbW92ZU1vZGFsRWxlbWVudHMoKSB7XG4gICAgY29uc3Qgd2luZG93VHJhbnNpdGlvbiQgPSB0aGlzLl93aW5kb3dDbXB0UmVmLmluc3RhbmNlLmhpZGUoKTtcbiAgICBjb25zdCBiYWNrZHJvcFRyYW5zaXRpb24kID0gdGhpcy5fYmFja2Ryb3BDbXB0UmVmID8gdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlLmhpZGUoKSA6IG9mKHVuZGVmaW5lZCk7XG5cbiAgICAvLyBoaWRpbmcgd2luZG93XG4gICAgd2luZG93VHJhbnNpdGlvbiQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNvbnN0IHtuYXRpdmVFbGVtZW50fSA9IHRoaXMuX3dpbmRvd0NtcHRSZWYubG9jYXRpb247XG4gICAgICBuYXRpdmVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLl93aW5kb3dDbXB0UmVmLmRlc3Ryb3koKTtcblxuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYgJiYgdGhpcy5fY29udGVudFJlZi52aWV3UmVmKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRSZWYudmlld1JlZi5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3dpbmRvd0NtcHRSZWYgPSA8YW55Pm51bGw7XG4gICAgICB0aGlzLl9jb250ZW50UmVmID0gPGFueT5udWxsO1xuICAgIH0pO1xuXG4gICAgLy8gaGlkaW5nIGJhY2tkcm9wXG4gICAgYmFja2Ryb3BUcmFuc2l0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2JhY2tkcm9wQ21wdFJlZikge1xuICAgICAgICBjb25zdCB7bmF0aXZlRWxlbWVudH0gPSB0aGlzLl9iYWNrZHJvcENtcHRSZWYubG9jYXRpb247XG4gICAgICAgIG5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuYXRpdmVFbGVtZW50KTtcbiAgICAgICAgdGhpcy5fYmFja2Ryb3BDbXB0UmVmLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5fYmFja2Ryb3BDbXB0UmVmID0gPGFueT5udWxsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gYWxsIGRvbmVcbiAgICB6aXAod2luZG93VHJhbnNpdGlvbiQsIGJhY2tkcm9wVHJhbnNpdGlvbiQpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9oaWRkZW4ubmV4dCgpO1xuICAgICAgdGhpcy5faGlkZGVuLmNvbXBsZXRlKCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==