import { EventEmitter, Renderer2, ElementRef, OnChanges, OnInit, SimpleChanges, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbAlertConfig } from './alert-config';
import * as i0 from "@angular/core";
/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
export declare class NgbAlert implements OnInit, OnChanges {
    private _renderer;
    private _element;
    private _zone;
    /**
     * If `true`, alert closing will be animated.
     *
     * Animation is triggered only when clicked on the close button (×)
     * or via the `.close()` function
     *
     * @since 8.0.0
     */
    animation: boolean;
    /**
     * If `true`, alert can be dismissed by the user.
     *
     * The close button (×) will be displayed and you can be notified
     * of the event with the `(close)` output.
     */
    dismissible: boolean;
    /**
     * Type of the alert.
     *
     * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
     * `'secondary'`, `'light'` and `'dark'`.
     */
    type: string;
    /**
     * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
     *
     * @since 8.0.0
     */
    closed: EventEmitter<void>;
    constructor(config: NgbAlertConfig, _renderer: Renderer2, _element: ElementRef, _zone: NgZone);
    /**
     * Triggers alert closing programmatically (same as clicking on the close button (×)).
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(closed)` output
     *
     * @since 8.0.0
     */
    close(): Observable<void>;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbAlert, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbAlert, "ngb-alert", ["ngbAlert"], { "animation": "animation"; "dismissible": "dismissible"; "type": "type"; }, { "closed": "closed"; }, never, ["*"]>;
}
