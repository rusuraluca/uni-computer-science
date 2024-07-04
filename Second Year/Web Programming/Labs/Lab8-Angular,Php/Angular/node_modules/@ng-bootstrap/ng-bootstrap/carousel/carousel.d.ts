import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, ElementRef, EventEmitter, NgZone, OnDestroy, QueryList, TemplateRef, AfterViewInit } from '@angular/core';
import { NgbCarouselConfig } from './carousel-config';
import { NgbSlideEventDirection } from './carousel-transition';
import * as i0 from "@angular/core";
/**
 * A directive that wraps the individual carousel slide.
 */
export declare class NgbSlide {
    tplRef: TemplateRef<any>;
    /**
     * Slide id that must be unique for the entire document.
     *
     * If not provided, will be generated in the `ngb-slide-xx` format.
     */
    id: string;
    /**
     * An event emitted when the slide transition is finished
     *
     * @since 8.0.0
     */
    slid: EventEmitter<NgbSingleSlideEvent>;
    constructor(tplRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbSlide, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbSlide, "ng-template[ngbSlide]", never, { "id": "id"; }, { "slid": "slid"; }, never>;
}
/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
export declare class NgbCarousel implements AfterContentChecked, AfterContentInit, AfterViewInit, OnDestroy {
    private _platformId;
    private _ngZone;
    private _cd;
    private _container;
    slides: QueryList<NgbSlide>;
    NgbSlideEventSource: typeof NgbSlideEventSource;
    private _destroy$;
    private _interval$;
    private _mouseHover$;
    private _focused$;
    private _pauseOnHover$;
    private _pauseOnFocus$;
    private _pause$;
    private _wrap$;
    /**
     * A flag to enable/disable the animations.
     *
     * @since 8.0.0
     */
    animation: boolean;
    /**
     * The slide id that should be displayed **initially**.
     *
     * For subsequent interactions use methods `select()`, `next()`, etc. and the `(slide)` output.
     */
    activeId: string;
    /**
     * Time in milliseconds before the next slide is shown.
     */
    set interval(value: number);
    get interval(): number;
    /**
     * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
     */
    set wrap(value: boolean);
    get wrap(): boolean;
    /**
     * If `true`, allows to interact with carousel using keyboard 'arrow left' and 'arrow right'.
     */
    keyboard: boolean;
    /**
     * If `true`, will pause slide switching when mouse cursor hovers the slide.
     *
     * @since 2.2.0
     */
    set pauseOnHover(value: boolean);
    get pauseOnHover(): boolean;
    /**
     * If `true`, will pause slide switching when the focus is inside the carousel.
     */
    set pauseOnFocus(value: boolean);
    get pauseOnFocus(): boolean;
    /**
     * If `true`, 'previous' and 'next' navigation arrows will be visible on the slide.
     *
     * @since 2.2.0
     */
    showNavigationArrows: boolean;
    /**
     * If `true`, navigation indicators at the bottom of the slide will be visible.
     *
     * @since 2.2.0
     */
    showNavigationIndicators: boolean;
    /**
     * An event emitted just before the slide transition starts.
     *
     * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
     */
    slide: EventEmitter<NgbSlideEvent>;
    /**
     * An event emitted right after the slide transition is completed.
     *
     * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
     *
     * @since 8.0.0
     */
    slid: EventEmitter<NgbSlideEvent>;
    private _transitionIds;
    set mouseHover(value: boolean);
    get mouseHover(): boolean;
    set focused(value: boolean);
    get focused(): boolean;
    constructor(config: NgbCarouselConfig, _platformId: any, _ngZone: NgZone, _cd: ChangeDetectorRef, _container: ElementRef);
    arrowLeft(): void;
    arrowRight(): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * Navigates to a slide with the specified identifier.
     */
    select(slideId: string, source?: NgbSlideEventSource): void;
    /**
     * Navigates to the previous slide.
     */
    prev(source?: NgbSlideEventSource): void;
    /**
     * Navigates to the next slide.
     */
    next(source?: NgbSlideEventSource): void;
    /**
     * Pauses cycling through the slides.
     */
    pause(): void;
    /**
     * Restarts cycling through the slides from start to end.
     */
    cycle(): void;
    /**
     * Set the focus on the carousel.
     */
    focus(): void;
    private _cycleToSelected;
    private _getSlideEventDirection;
    private _getSlideById;
    private _getSlideIdxById;
    private _getNextSlide;
    private _getPrevSlide;
    private _getSlideElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCarousel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbCarousel, "ngb-carousel", ["ngbCarousel"], { "animation": "animation"; "activeId": "activeId"; "interval": "interval"; "wrap": "wrap"; "keyboard": "keyboard"; "pauseOnHover": "pauseOnHover"; "pauseOnFocus": "pauseOnFocus"; "showNavigationArrows": "showNavigationArrows"; "showNavigationIndicators": "showNavigationIndicators"; }, { "slide": "slide"; "slid": "slid"; }, ["slides"], never>;
}
/**
 * A slide change event emitted right after the slide transition is completed.
 */
export interface NgbSlideEvent {
    /**
     * The previous slide id.
     */
    prev: string;
    /**
     * The current slide id.
     */
    current: string;
    /**
     * The slide event direction.
     *
     * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
     *
     * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
     */
    direction: NgbSlideEventDirection;
    /**
     * Whether the pause() method was called (and no cycle() call was done afterwards).
     *
     * @since 5.1.0
     */
    paused: boolean;
    /**
     * Source triggering the slide change event.
     *
     * Possible values are `'timer' | 'arrowLeft' | 'arrowRight' | 'indicator'`
     *
     * @since 5.1.0
     */
    source?: NgbSlideEventSource;
}
/**
 * A slide change event emitted right after the slide transition is completed.
 *
 * @since 8.0.0
 */
export interface NgbSingleSlideEvent {
    /**
     * true if the slide is shown, false otherwise
     */
    isShown: boolean;
    /**
     * The slide event direction.
     *
     * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
     *
     * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
     */
    direction: NgbSlideEventDirection;
    /**
     * Source triggering the slide change event.
     *
     * Possible values are `'timer' | 'arrowLeft' | 'arrowRight' | 'indicator'`
     *
     */
    source?: NgbSlideEventSource;
}
export declare enum NgbSlideEventSource {
    TIMER = "timer",
    ARROW_LEFT = "arrowLeft",
    ARROW_RIGHT = "arrowRight",
    INDICATOR = "indicator"
}
export declare const NGB_CAROUSEL_DIRECTIVES: (typeof NgbSlide | typeof NgbCarousel)[];
