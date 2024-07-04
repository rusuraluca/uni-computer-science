import { EventEmitter, OnInit, OnDestroy, OnChanges, Injector, Renderer2, ElementRef, TemplateRef, ViewContainerRef, NgZone, SimpleChanges, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { PlacementArray } from '../util/positioning';
import { NgbPopoverConfig } from './popover-config';
import * as i0 from "@angular/core";
export declare class NgbPopoverWindow {
    animation: boolean;
    title: string | TemplateRef<any> | null | undefined;
    id: string;
    popoverClass: string;
    context: any;
    isTitleTemplate(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPopoverWindow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbPopoverWindow, "ngb-popover-window", never, { "animation": "animation"; "title": "title"; "id": "id"; "popoverClass": "popoverClass"; "context": "context"; }, {}, never, ["*"]>;
}
/**
 * A lightweight and extensible directive for fancy popover creation.
 */
export declare class NgbPopover implements OnInit, OnDestroy, OnChanges {
    private _elementRef;
    private _renderer;
    private _ngZone;
    private _document;
    private _changeDetector;
    static ngAcceptInputType_autoClose: boolean | string;
    /**
     * If `true`, popover opening and closing will be animated.
     *
     * @since 8.0.0
     */
    animation: boolean;
    /**
     * Indicates whether the popover should be closed on `Escape` key and inside/outside clicks:
     *
     * * `true` - closes on both outside and inside clicks as well as `Escape` presses
     * * `false` - disables the autoClose feature (NB: triggers still apply)
     * * `"inside"` - closes on inside clicks as well as Escape presses
     * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
     * as well as `Escape` presses
     *
     * @since 3.0.0
     */
    autoClose: boolean | 'inside' | 'outside';
    /**
     * The string content or a `TemplateRef` for the content to be displayed in the popover.
     *
     * If the title and the content are falsy, the popover won't open.
     */
    ngbPopover: string | TemplateRef<any> | null | undefined;
    /**
     * The title of the popover.
     *
     * If the title and the content are falsy, the popover won't open.
     */
    popoverTitle: string | TemplateRef<any> | null | undefined;
    /**
     * The preferred placement of the popover, among the [possible values](#/guides/positioning#api).
     *
     * The default order of preference is `"auto"`.
     *
     * Please see the [positioning overview](#/positioning) for more details.
     */
    placement: PlacementArray;
    /**
     * Specifies events that should trigger the tooltip.
     *
     * Supports a space separated list of event names.
     * For more details see the [triggers demo](#/components/popover/examples#triggers).
     */
    triggers: string;
    /**
     * A selector specifying the element the popover should be appended to.
     *
     * Currently only supports `body`.
     */
    container: string;
    /**
     * If `true`, popover is disabled and won't be displayed.
     *
     * @since 1.1.0
     */
    disablePopover: boolean;
    /**
     * An optional class applied to the popover window element.
     *
     * @since 2.2.0
     */
    popoverClass: string;
    /**
     * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
     *
     * @since 4.1.0
     */
    openDelay: number;
    /**
     * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
     *
     * @since 4.1.0
     */
    closeDelay: number;
    /**
     * An event emitted when the popover opening animation has finished. Contains no payload.
     */
    shown: EventEmitter<void>;
    /**
     * An event emitted when the popover closing animation has finished. Contains no payload.
     *
     * At this point popover is not in the DOM anymore.
     */
    hidden: EventEmitter<void>;
    private _ngbPopoverWindowId;
    private _popupService;
    private _windowRef;
    private _unregisterListenersFn;
    private _positioning;
    private _zoneSubscription;
    private _isDisabled;
    constructor(_elementRef: ElementRef<HTMLElement>, _renderer: Renderer2, injector: Injector, viewContainerRef: ViewContainerRef, config: NgbPopoverConfig, _ngZone: NgZone, _document: any, _changeDetector: ChangeDetectorRef, applicationRef: ApplicationRef);
    /**
     * Opens the popover.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the popover template when it is created.
     */
    open(context?: any): void;
    /**
     * Closes the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
     */
    close(): void;
    /**
     * Toggles the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
     */
    toggle(): void;
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen(): boolean;
    ngOnInit(): void;
    ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPopover, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPopover, "[ngbPopover]", ["ngbPopover"], { "animation": "animation"; "autoClose": "autoClose"; "ngbPopover": "ngbPopover"; "popoverTitle": "popoverTitle"; "placement": "placement"; "triggers": "triggers"; "container": "container"; "disablePopover": "disablePopover"; "popoverClass": "popoverClass"; "openDelay": "openDelay"; "closeDelay": "closeDelay"; }, { "shown": "shown"; "hidden": "hidden"; }, never>;
}
