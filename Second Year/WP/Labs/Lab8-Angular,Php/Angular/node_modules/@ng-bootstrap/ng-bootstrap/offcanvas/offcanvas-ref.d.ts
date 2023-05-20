import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentRef } from '../util/popup';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';
/**
 * A reference to the currently opened (active) offcanvas.
 *
 * Instances of this class can be injected into your component passed as offcanvas content.
 * So you can `.close()` or `.dismiss()` the offcanvas window from your component.
 *
 * @since 12.1.0
 */
export declare class NgbActiveOffcanvas {
    /**
     * Closes the offcanvas with an optional `result` value.
     *
     * The `NgbOffcanvasRef.result` promise will be resolved with the provided value.
     */
    close(result?: any): void;
    /**
     * Dismisses the offcanvas with an optional `reason` value.
     *
     * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason?: any): void;
}
/**
 * A reference to the newly opened offcanvas returned by the `NgbOffcanvas.open()` method.
 *
 * @since 12.1.0
 */
export declare class NgbOffcanvasRef {
    private _panelCmptRef;
    private _contentRef;
    private _backdropCmptRef?;
    private _beforeDismiss?;
    private _closed;
    private _dismissed;
    private _hidden;
    private _resolve;
    private _reject;
    /**
     * The instance of a component used for the offcanvas content.
     *
     * When a `TemplateRef` is used as the content or when the offcanvas is closed, will return `undefined`.
     */
    get componentInstance(): any;
    /**
     * The promise that is resolved when the offcanvas is closed and rejected when the offcanvas is dismissed.
     */
    result: Promise<any>;
    /**
     * The observable that emits when the offcanvas is closed via the `.close()` method.
     *
     * It will emit the result passed to the `.close()` method.
     */
    get closed(): Observable<any>;
    /**
     * The observable that emits when the offcanvas is dismissed via the `.dismiss()` method.
     *
     * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
     * reasons like backdrop click or ESC key press.
     */
    get dismissed(): Observable<any>;
    /**
     * The observable that emits when both offcanvas window and backdrop are closed and animations were finished.
     * At this point offcanvas and backdrop elements will be removed from the DOM tree.
     *
     * This observable will be completed after emitting.
     */
    get hidden(): Observable<void>;
    /**
     * The observable that emits when offcanvas is fully visible and animation was finished.
     * The offcanvas DOM element is always available synchronously after calling 'offcanvas.open()' service.
     *
     * This observable will be completed after emitting.
     * It will not emit, if offcanvas is closed before open animation is finished.
     */
    get shown(): Observable<void>;
    constructor(_panelCmptRef: ComponentRef<NgbOffcanvasPanel>, _contentRef: ContentRef, _backdropCmptRef?: ComponentRef<NgbOffcanvasBackdrop> | undefined, _beforeDismiss?: (() => boolean | Promise<boolean>) | undefined);
    /**
     * Closes the offcanvas with an optional `result` value.
     *
     * The `NgbMobalRef.result` promise will be resolved with the provided value.
     */
    close(result?: any): void;
    private _dismiss;
    /**
     * Dismisses the offcanvas with an optional `reason` value.
     *
     * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
     */
    dismiss(reason?: any): void;
    private _removeOffcanvasElements;
}
