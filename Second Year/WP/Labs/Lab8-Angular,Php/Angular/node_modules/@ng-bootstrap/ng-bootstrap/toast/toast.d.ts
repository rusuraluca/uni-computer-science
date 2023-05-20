import { AfterContentInit, EventEmitter, OnChanges, SimpleChanges, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbToastConfig } from './toast-config';
import * as i0 from "@angular/core";
/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
export declare class NgbToastHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbToastHeader, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbToastHeader, "[ngbToastHeader]", never, {}, {}, never>;
}
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
export declare class NgbToast implements AfterContentInit, OnChanges {
    ariaLive: string;
    private _zone;
    private _element;
    /**
     * If `true`, toast opening and closing will be animated.
     *
     * Animation is triggered only when the `.hide()` or `.show()` functions are called
     *
     * @since 8.0.0
     */
    animation: boolean;
    private _timeoutID;
    /**
     * Delay after which the toast will hide (ms).
     * default: `500` (ms) (inherited from NgbToastConfig)
     */
    delay: number;
    /**
     * Auto hide the toast after a delay in ms.
     * default: `true` (inherited from NgbToastConfig)
     */
    autohide: boolean;
    /**
     * Text to be used as toast's header.
     * Ignored if a ContentChild template is specified at the same time.
     */
    header: string;
    /**
     * A template like `<ng-template ngbToastHeader></ng-template>` can be
     * used in the projected content to allow markup usage.
     */
    contentHeaderTpl: TemplateRef<any> | null;
    /**
     * An event fired after the animation triggered by calling `.show()` method has finished.
     *
     * @since 8.0.0
     */
    shown: EventEmitter<void>;
    /**
     * An event fired after the animation triggered by calling `.hide()` method has finished.
     *
     * It can only occur in 2 different scenarios:
     * - `autohide` timeout fires
     * - user clicks on a closing cross
     *
     * Additionally this output is purely informative. The toast won't be removed from DOM automatically, it's up
     * to the user to take care of that.
     *
     * @since 8.0.0
     */
    hidden: EventEmitter<void>;
    constructor(ariaLive: string, config: NgbToastConfig, _zone: NgZone, _element: ElementRef);
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Triggers toast closing programmatically.
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(hidden)` output
     *
     * @since 8.0.0
     */
    hide(): Observable<void>;
    /**
     * Triggers toast opening programmatically.
     *
     * The returned observable will emit and be completed once the opening transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(shown)` output
     *
     * @since 8.0.0
     */
    show(): Observable<void>;
    private _init;
    private _clearTimeout;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbToast, [{ attribute: "aria-live"; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbToast, "ngb-toast", ["ngbToast"], { "animation": "animation"; "delay": "delay"; "autohide": "autohide"; "header": "header"; }, { "shown": "shown"; "hidden": "hidden"; }, ["contentHeaderTpl"], ["*"]>;
}
