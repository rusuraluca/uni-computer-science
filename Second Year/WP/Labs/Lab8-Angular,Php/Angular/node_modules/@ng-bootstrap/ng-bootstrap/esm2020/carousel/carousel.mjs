import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, NEVER, Subject, timer, zip } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ngbCompleteTransition, ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCarouselTransitionIn, ngbCarouselTransitionOut, NgbSlideEventDirection } from './carousel-transition';
import * as i0 from "@angular/core";
import * as i1 from "./carousel-config";
import * as i2 from "@angular/common";
let nextId = 0;
/**
 * A directive that wraps the individual carousel slide.
 */
export class NgbSlide {
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Slide id that must be unique for the entire document.
         *
         * If not provided, will be generated in the `ngb-slide-xx` format.
         */
        this.id = `ngb-slide-${nextId++}`;
        /**
         * An event emitted when the slide transition is finished
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
    }
}
NgbSlide.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbSlide, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbSlide.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbSlide, selector: "ng-template[ngbSlide]", inputs: { id: "id" }, outputs: { slid: "slid" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbSlide, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbSlide]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; }, propDecorators: { id: [{
                type: Input
            }], slid: [{
                type: Output
            }] } });
/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
export class NgbCarousel {
    constructor(config, _platformId, _ngZone, _cd, _container) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._container = _container;
        this.NgbSlideEventSource = NgbSlideEventSource;
        this._destroy$ = new Subject();
        this._interval$ = new BehaviorSubject(0);
        this._mouseHover$ = new BehaviorSubject(false);
        this._focused$ = new BehaviorSubject(false);
        this._pauseOnHover$ = new BehaviorSubject(false);
        this._pauseOnFocus$ = new BehaviorSubject(false);
        this._pause$ = new BehaviorSubject(false);
        this._wrap$ = new BehaviorSubject(false);
        /**
         * An event emitted just before the slide transition starts.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         */
        this.slide = new EventEmitter();
        /**
         * An event emitted right after the slide transition is completed.
         *
         * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
         *
         * @since 8.0.0
         */
        this.slid = new EventEmitter();
        /*
         * Keep the ids of the panels currently transitionning
         * in order to allow only the transition revertion
         */
        this._transitionIds = null;
        this.animation = config.animation;
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.pauseOnFocus = config.pauseOnFocus;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * Time in milliseconds before the next slide is shown.
     */
    set interval(value) {
        this._interval$.next(value);
    }
    get interval() { return this._interval$.value; }
    /**
     * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
     */
    set wrap(value) {
        this._wrap$.next(value);
    }
    get wrap() { return this._wrap$.value; }
    /**
     * If `true`, will pause slide switching when mouse cursor hovers the slide.
     *
     * @since 2.2.0
     */
    set pauseOnHover(value) {
        this._pauseOnHover$.next(value);
    }
    get pauseOnHover() { return this._pauseOnHover$.value; }
    /**
     * If `true`, will pause slide switching when the focus is inside the carousel.
     */
    set pauseOnFocus(value) {
        this._pauseOnFocus$.next(value);
    }
    get pauseOnFocus() { return this._pauseOnFocus$.value; }
    set mouseHover(value) { this._mouseHover$.next(value); }
    get mouseHover() { return this._mouseHover$.value; }
    set focused(value) { this._focused$.next(value); }
    get focused() { return this._focused$.value; }
    arrowLeft() {
        this.focus();
        this.prev(NgbSlideEventSource.ARROW_LEFT);
    }
    arrowRight() {
        this.focus();
        this.next(NgbSlideEventSource.ARROW_RIGHT);
    }
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                const hasNextSlide$ = combineLatest([
                    this.slide.pipe(map(slideEvent => slideEvent.current), startWith(this.activeId)),
                    this._wrap$, this.slides.changes.pipe(startWith(null))
                ])
                    .pipe(map(([currentSlideId, wrap]) => {
                    const slideArr = this.slides.toArray();
                    const currentSlideIdx = this._getSlideIdxById(currentSlideId);
                    return wrap ? slideArr.length > 1 : currentSlideIdx < slideArr.length - 1;
                }), distinctUntilChanged());
                combineLatest([
                    this._pause$, this._pauseOnHover$, this._mouseHover$, this._pauseOnFocus$, this._focused$, this._interval$,
                    hasNextSlide$
                ])
                    .pipe(map(([pause, pauseOnHover, mouseHover, pauseOnFocus, focused, interval, hasNextSlide]) => ((pause || (pauseOnHover && mouseHover) || (pauseOnFocus && focused) || !hasNextSlide) ?
                    0 :
                    interval)), distinctUntilChanged(), switchMap(interval => interval > 0 ? timer(interval, interval) : NEVER), takeUntil(this._destroy$))
                    .subscribe(() => this._ngZone.run(() => this.next(NgbSlideEventSource.TIMER)));
            });
        }
        this.slides.changes.pipe(takeUntil(this._destroy$)).subscribe(() => {
            this._transitionIds?.forEach(id => ngbCompleteTransition(this._getSlideElement(id)));
            this._transitionIds = null;
            this._cd.markForCheck();
            // The following code need to be done asynchronously, after the dom becomes stable,
            // otherwise all changes will be undone.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                for (const { id } of this.slides) {
                    const element = this._getSlideElement(id);
                    if (id === this.activeId) {
                        element.classList.add('active');
                    }
                    else {
                        element.classList.remove('active');
                    }
                }
            });
        });
    }
    ngAfterContentChecked() {
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : '');
    }
    ngAfterViewInit() {
        // Initialize the 'active' class (not managed by the template)
        if (this.activeId) {
            const element = this._getSlideElement(this.activeId);
            if (element) {
                element.classList.add('active');
            }
        }
    }
    ngOnDestroy() { this._destroy$.next(); }
    /**
     * Navigates to a slide with the specified identifier.
     */
    select(slideId, source) {
        this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId), source);
    }
    /**
     * Navigates to the previous slide.
     */
    prev(source) {
        this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.END, source);
    }
    /**
     * Navigates to the next slide.
     */
    next(source) {
        this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.START, source);
    }
    /**
     * Pauses cycling through the slides.
     */
    pause() { this._pause$.next(true); }
    /**
     * Restarts cycling through the slides from start to end.
     */
    cycle() { this._pause$.next(false); }
    /**
     * Set the focus on the carousel.
     */
    focus() { this._container.nativeElement.focus(); }
    _cycleToSelected(slideIdx, direction, source) {
        const transitionIds = this._transitionIds;
        if (transitionIds && (transitionIds[0] !== slideIdx || transitionIds[1] !== this.activeId)) {
            // Revert prevented
            return;
        }
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this._transitionIds = [this.activeId, slideIdx];
            this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction, paused: this._pause$.value, source });
            const options = {
                animation: this.animation,
                runningTransition: 'stop',
                context: { direction },
            };
            const transitions = [];
            const activeSlide = this._getSlideById(this.activeId);
            if (activeSlide) {
                const activeSlideTransition = ngbRunTransition(this._ngZone, this._getSlideElement(activeSlide.id), ngbCarouselTransitionOut, options);
                activeSlideTransition.subscribe(() => { activeSlide.slid.emit({ isShown: false, direction, source }); });
                transitions.push(activeSlideTransition);
            }
            const previousId = this.activeId;
            this.activeId = selectedSlide.id;
            const nextSlide = this._getSlideById(this.activeId);
            const transition = ngbRunTransition(this._ngZone, this._getSlideElement(selectedSlide.id), ngbCarouselTransitionIn, options);
            transition.subscribe(() => { nextSlide?.slid.emit({ isShown: true, direction, source }); });
            transitions.push(transition);
            zip(...transitions).pipe(take(1)).subscribe(() => {
                this._transitionIds = null;
                this.slid.emit({ prev: previousId, current: selectedSlide.id, direction: direction, paused: this._pause$.value, source });
            });
        }
        // we get here after the interval fires or any external API call like next(), prev() or select()
        this._cd.markForCheck();
    }
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.END : NgbSlideEventDirection.START;
    }
    _getSlideById(slideId) {
        return this.slides.find(slide => slide.id === slideId) || null;
    }
    _getSlideIdxById(slideId) {
        const slide = this._getSlideById(slideId);
        return slide != null ? this.slides.toArray().indexOf(slide) : -1;
    }
    _getNextSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    }
    _getPrevSlide(currentSlideId) {
        const slideArr = this.slides.toArray();
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    }
    _getSlideElement(slideId) {
        return this._container.nativeElement.querySelector(`#slide-${slideId}`);
    }
}
NgbCarousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarousel, deps: [{ token: i1.NgbCarouselConfig }, { token: PLATFORM_ID }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgbCarousel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbCarousel, selector: "ngb-carousel", inputs: { animation: "animation", activeId: "activeId", interval: "interval", wrap: "wrap", keyboard: "keyboard", pauseOnHover: "pauseOnHover", pauseOnFocus: "pauseOnFocus", showNavigationArrows: "showNavigationArrows", showNavigationIndicators: "showNavigationIndicators" }, outputs: { slide: "slide", slid: "slid" }, host: { attributes: { "tabIndex": "0" }, listeners: { "keydown.arrowLeft": "keyboard && arrowLeft()", "keydown.arrowRight": "keyboard && arrowRight()", "mouseenter": "mouseHover = true", "mouseleave": "mouseHover = false", "focusin": "focused = true", "focusout": "focused = false" }, properties: { "style.display": "\"block\"", "attr.aria-activedescendant": "'slide-' + activeId" }, classAttribute: "carousel slide" }, queries: [{ propertyName: "slides", predicate: NgbSlide }], exportAs: ["ngbCarousel"], ngImport: i0, template: `
    <div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
      <button type="button" data-bs-target *ngFor="let slide of slides" [class.active]="slide.id === activeId"
          role="tab" [attr.aria-labelledby]="'slide-' + slide.id" [attr.aria-controls]="'slide-' + slide.id"
          [attr.aria-selected]="slide.id === activeId"
          (click)="focus();select(slide.id, NgbSlideEventSource.INDICATOR);"></button>
    </div>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides; index as i; count as c" class="carousel-item" [id]="'slide-' + slide.id" role="tabpanel">
        <span class="visually-hidden" i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number">
          Slide {{i + 1}} of {{c}}
        </span>
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" (click)="arrowLeft()" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden" i18n="@@ngb.carousel.previous">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" (click)="arrowRight()" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden" i18n="@@ngb.carousel.next">Next</span>
    </button>
  `, isInline: true, directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarousel, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-carousel',
                    exportAs: 'ngbCarousel',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'carousel slide',
                        '[style.display]': '"block"',
                        'tabIndex': '0',
                        '(keydown.arrowLeft)': 'keyboard && arrowLeft()',
                        '(keydown.arrowRight)': 'keyboard && arrowRight()',
                        '(mouseenter)': 'mouseHover = true',
                        '(mouseleave)': 'mouseHover = false',
                        '(focusin)': 'focused = true',
                        '(focusout)': 'focused = false',
                        '[attr.aria-activedescendant]': `'slide-' + activeId`
                    },
                    template: `
    <div class="carousel-indicators" [class.visually-hidden]="!showNavigationIndicators" role="tablist">
      <button type="button" data-bs-target *ngFor="let slide of slides" [class.active]="slide.id === activeId"
          role="tab" [attr.aria-labelledby]="'slide-' + slide.id" [attr.aria-controls]="'slide-' + slide.id"
          [attr.aria-selected]="slide.id === activeId"
          (click)="focus();select(slide.id, NgbSlideEventSource.INDICATOR);"></button>
    </div>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides; index as i; count as c" class="carousel-item" [id]="'slide-' + slide.id" role="tabpanel">
        <span class="visually-hidden" i18n="Currently selected slide number read by screen reader@@ngb.carousel.slide-number">
          Slide {{i + 1}} of {{c}}
        </span>
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" (click)="arrowLeft()" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden" i18n="@@ngb.carousel.previous">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" (click)="arrowRight()" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden" i18n="@@ngb.carousel.next">Next</span>
    </button>
  `
                }]
        }], ctorParameters: function () { return [{ type: i1.NgbCarouselConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }]; }, propDecorators: { slides: [{
                type: ContentChildren,
                args: [NgbSlide]
            }], animation: [{
                type: Input
            }], activeId: [{
                type: Input
            }], interval: [{
                type: Input
            }], wrap: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], pauseOnHover: [{
                type: Input
            }], pauseOnFocus: [{
                type: Input
            }], showNavigationArrows: [{
                type: Input
            }], showNavigationIndicators: [{
                type: Input
            }], slide: [{
                type: Output
            }], slid: [{
                type: Output
            }] } });
export var NgbSlideEventSource;
(function (NgbSlideEventSource) {
    NgbSlideEventSource["TIMER"] = "timer";
    NgbSlideEventSource["ARROW_LEFT"] = "arrowLeft";
    NgbSlideEventSource["ARROW_RIGHT"] = "arrowRight";
    NgbSlideEventSource["INDICATOR"] = "indicator";
})(NgbSlideEventSource || (NgbSlideEventSource = {}));
export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY2Fyb3VzZWwvY2Fyb3VzZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFHTCxNQUFNLEVBQ04sV0FBVyxFQUdYLGlCQUFpQixFQUVsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUlsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUYsT0FBTyxFQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRyxPQUFPLEVBQUMscUJBQXFCLEVBQUUsZ0JBQWdCLEVBQXVCLE1BQU0sa0NBQWtDLENBQUM7QUFDL0csT0FBTyxFQUNMLHVCQUF1QixFQUN2Qix3QkFBd0IsRUFDeEIsc0JBQXNCLEVBRXZCLE1BQU0sdUJBQXVCLENBQUM7Ozs7QUFFL0IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRWY7O0dBRUc7QUFFSCxNQUFNLE9BQU8sUUFBUTtJQWVuQixZQUFtQixNQUF3QjtRQUF4QixXQUFNLEdBQU4sTUFBTSxDQUFrQjtRQWQzQzs7OztXQUlHO1FBQ00sT0FBRSxHQUFHLGFBQWEsTUFBTSxFQUFFLEVBQUUsQ0FBQztRQUV0Qzs7OztXQUlHO1FBQ08sU0FBSSxHQUFHLElBQUksWUFBWSxFQUF1QixDQUFDO0lBRVgsQ0FBQzs7cUdBZnBDLFFBQVE7eUZBQVIsUUFBUTsyRkFBUixRQUFRO2tCQURwQixTQUFTO21CQUFDLEVB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QUNwQyxXQUFXLEVBQUUsZ0JBQWdCO3dCQUM3QixZQUFZLEVBQUUsaUJBQWlCO3dCQUMvQiw4QkFBOEIsRUFBRSxxQkFBcUI7cUJBQ3REO29CQUNELFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QlQ7aUJBQ0Y7OzBCQTBIaUMsTUFBTTsyQkFBQyxXQUFXOzBIQXZIdkIsTUFBTTtzQkFBaEMsZUFBZTt1QkFBQyxRQUFRO2dCQWtCaEIsU0FBUztzQkFBakIsS0FBSztnQkFPRyxRQUFRO3NCQUFoQixLQUFLO2dCQU1GLFFBQVE7c0JBRFgsS0FBSztnQkFXRixJQUFJO3NCQURQLEtBQUs7Z0JBVUcsUUFBUTtzQkFBaEIsS0FBSztnQkFRRixZQUFZO3NCQURmLEtBQUs7Z0JBV0YsWUFBWTtzQkFEZixLQUFLO2dCQVlHLG9CQUFvQjtzQkFBNUIsS0FBSztnQkFPRyx3QkFBd0I7c0JBQWhDLEtBQUs7Z0JBT0ksS0FBSztzQkFBZCxNQUFNO2dCQVNHLElBQUk7c0JBQWIsTUFBTTs7QUE2U1QsTUFBTSxDQUFOLElBQVksbUJBS1g7QUFMRCxXQUFZLG1CQUFtQjtJQUM3QixzQ0FBZSxDQUFBO0lBQ2YsK0NBQXdCLENBQUE7SUFDeEIsaURBQTBCLENBQUE7SUFDMUIsOENBQXVCLENBQUE7QUFDekIsQ0FBQyxFQUxXLG1CQUFtQixLQUFuQixtQkFBbUIsUUFLOUI7QUFFRCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYkNhcm91c2VsQ29uZmlnfSBmcm9tICcuL2Nhcm91c2VsLWNvbmZpZyc7XG5cbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBORVZFUiwgT2JzZXJ2YWJsZSwgU3ViamVjdCwgdGltZXIsIHppcH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAsIHN0YXJ0V2l0aCwgc3dpdGNoTWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7bmdiQ29tcGxldGVUcmFuc2l0aW9uLCBuZ2JSdW5UcmFuc2l0aW9uLCBOZ2JUcmFuc2l0aW9uT3B0aW9uc30gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHtcbiAgbmdiQ2Fyb3VzZWxUcmFuc2l0aW9uSW4sXG4gIG5nYkNhcm91c2VsVHJhbnNpdGlvbk91dCxcbiAgTmdiU2xpZGVFdmVudERpcmVjdGlvbixcbiAgTmdiQ2Fyb3VzZWxDdHhcbn0gZnJvbSAnLi9jYXJvdXNlbC10cmFuc2l0aW9uJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3cmFwcyB0aGUgaW5kaXZpZHVhbCBjYXJvdXNlbCBzbGlkZS5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JTbGlkZV0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JTbGlkZSB7XG4gIC8qKlxuICAgKiBTbGlkZSBpZCB0aGF0IG11c3QgYmUgdW5pcXVlIGZvciB0aGUgZW50aXJlIGRvY3VtZW50LlxuICAgKlxuICAgKiBJZiBub3QgcHJvdmlkZWQsIHdpbGwgYmUgZ2VuZXJhdGVkIGluIHRoZSBgbmdiLXNsaWRlLXh4YCBmb3JtYXQuXG4gICAqL1xuICBASW5wdXQoKSBpZCA9IGBuZ2Itc2xpZGUtJHtuZXh0SWQrK31gO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgZmluaXNoZWRcbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgc2xpZCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiU2luZ2xlU2xpZGVFdmVudD4oKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHBsUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIENhcm91c2VsIGlzIGEgY29tcG9uZW50IHRvIGVhc2lseSBjcmVhdGUgYW5kIGNvbnRyb2wgc2xpZGVzaG93cy5cbiAqXG4gKiBBbGxvd3MgdG8gc2V0IGludGVydmFscywgY2hhbmdlIHRoZSB3YXkgdXNlciBpbnRlcmFjdHMgd2l0aCB0aGUgc2xpZGVzIGFuZCBwcm92aWRlcyBhIHByb2dyYW1tYXRpYyBBUEkuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1jYXJvdXNlbCcsXG4gIGV4cG9ydEFzOiAnbmdiQ2Fyb3VzZWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdjYXJvdXNlbCBzbGlkZScsXG4gICAgJ1tzdHlsZS5kaXNwbGF5XSc6ICdcImJsb2NrXCInLFxuICAgICd0YWJJbmRleCc6ICcwJyxcbiAgICAnKGtleWRvd24uYXJyb3dMZWZ0KSc6ICdrZXlib2FyZCAmJiBhcnJvd0xlZnQoKScsXG4gICAgJyhrZXlkb3duLmFycm93UmlnaHQpJzogJ2tleWJvYXJkICYmIGFycm93UmlnaHQoKScsXG4gICAgJyhtb3VzZWVudGVyKSc6ICdtb3VzZUhvdmVyID0gdHJ1ZScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdtb3VzZUhvdmVyID0gZmFsc2UnLFxuICAgICcoZm9jdXNpbiknOiAnZm9jdXNlZCA9IHRydWUnLFxuICAgICcoZm9jdXNvdXQpJzogJ2ZvY3VzZWQgPSBmYWxzZScsXG4gICAgJ1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiBgJ3NsaWRlLScgKyBhY3RpdmVJZGBcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaW5kaWNhdG9yc1wiIFtjbGFzcy52aXN1YWxseS1oaWRkZW5dPVwiIXNob3dOYXZpZ2F0aW9uSW5kaWNhdG9yc1wiIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJzLXRhcmdldCAqbmdGb3I9XCJsZXQgc2xpZGUgb2Ygc2xpZGVzXCIgW2NsYXNzLmFjdGl2ZV09XCJzbGlkZS5pZCA9PT0gYWN0aXZlSWRcIlxuICAgICAgICAgIHJvbGU9XCJ0YWJcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiJ3NsaWRlLScgKyBzbGlkZS5pZFwiIFthdHRyLmFyaWEtY29udHJvbHNdPVwiJ3NsaWRlLScgKyBzbGlkZS5pZFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1zZWxlY3RlZF09XCJzbGlkZS5pZCA9PT0gYWN0aXZlSWRcIlxuICAgICAgICAgIChjbGljayk9XCJmb2N1cygpO3NlbGVjdChzbGlkZS5pZCwgTmdiU2xpZGVFdmVudFNvdXJjZS5JTkRJQ0FUT1IpO1wiPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjYXJvdXNlbC1pbm5lclwiPlxuICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgc2xpZGUgb2Ygc2xpZGVzOyBpbmRleCBhcyBpOyBjb3VudCBhcyBjXCIgY2xhc3M9XCJjYXJvdXNlbC1pdGVtXCIgW2lkXT1cIidzbGlkZS0nICsgc2xpZGUuaWRcIiByb2xlPVwidGFicGFuZWxcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIiBpMThuPVwiQ3VycmVudGx5IHNlbGVjdGVkIHNsaWRlIG51bWJlciByZWFkIGJ5IHNjcmVlbiByZWFkZXJAQG5nYi5jYXJvdXNlbC5zbGlkZS1udW1iZXJcIj5cbiAgICAgICAgICBTbGlkZSB7e2kgKyAxfX0gb2Yge3tjfX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudHBsUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxidXR0b24gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXZcIiB0eXBlPVwiYnV0dG9uXCIgKGNsaWNrKT1cImFycm93TGVmdCgpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXYtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLnByZXZpb3VzXCI+UHJldmlvdXM8L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtbmV4dFwiIHR5cGU9XCJidXR0b25cIiAoY2xpY2spPVwiYXJyb3dSaWdodCgpXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkFycm93c1wiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLW5leHQtaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLm5leHRcIj5OZXh0PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkNhcm91c2VsIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgICBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBAQ29udGVudENoaWxkcmVuKE5nYlNsaWRlKSBzbGlkZXM6IFF1ZXJ5TGlzdDxOZ2JTbGlkZT47XG5cbiAgcHVibGljIE5nYlNsaWRlRXZlbnRTb3VyY2UgPSBOZ2JTbGlkZUV2ZW50U291cmNlO1xuXG4gIHByaXZhdGUgX2Rlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfaW50ZXJ2YWwkID0gbmV3IEJlaGF2aW9yU3ViamVjdCgwKTtcbiAgcHJpdmF0ZSBfbW91c2VIb3ZlciQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcbiAgcHJpdmF0ZSBfZm9jdXNlZCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGZhbHNlKTtcbiAgcHJpdmF0ZSBfcGF1c2VPbkhvdmVyJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuICBwcml2YXRlIF9wYXVzZU9uRm9jdXMkID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG4gIHByaXZhdGUgX3BhdXNlJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuICBwcml2YXRlIF93cmFwJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoZmFsc2UpO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gZW5hYmxlL2Rpc2FibGUgdGhlIGFuaW1hdGlvbnMuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgc2xpZGUgaWQgdGhhdCBzaG91bGQgYmUgZGlzcGxheWVkICoqaW5pdGlhbGx5KiouXG4gICAqXG4gICAqIEZvciBzdWJzZXF1ZW50IGludGVyYWN0aW9ucyB1c2UgbWV0aG9kcyBgc2VsZWN0KClgLCBgbmV4dCgpYCwgZXRjLiBhbmQgdGhlIGAoc2xpZGUpYCBvdXRwdXQuXG4gICAqL1xuICBASW5wdXQoKSBhY3RpdmVJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaW1lIGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgdGhlIG5leHQgc2xpZGUgaXMgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgaW50ZXJ2YWwodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2ludGVydmFsJC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBpbnRlcnZhbCgpIHsgcmV0dXJuIHRoaXMuX2ludGVydmFsJC52YWx1ZTsgfVxuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHdpbGwgJ3dyYXAnIHRoZSBjYXJvdXNlbCBieSBzd2l0Y2hpbmcgZnJvbSB0aGUgbGFzdCBzbGlkZSBiYWNrIHRvIHRoZSBmaXJzdC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCB3cmFwKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fd3JhcCQubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBnZXQgd3JhcCgpIHsgcmV0dXJuIHRoaXMuX3dyYXAkLnZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgYWxsb3dzIHRvIGludGVyYWN0IHdpdGggY2Fyb3VzZWwgdXNpbmcga2V5Ym9hcmQgJ2Fycm93IGxlZnQnIGFuZCAnYXJyb3cgcmlnaHQnLlxuICAgKi9cbiAgQElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2lsbCBwYXVzZSBzbGlkZSBzd2l0Y2hpbmcgd2hlbiBtb3VzZSBjdXJzb3IgaG92ZXJzIHRoZSBzbGlkZS5cbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgcGF1c2VPbkhvdmVyKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcGF1c2VPbkhvdmVyJC5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIGdldCBwYXVzZU9uSG92ZXIoKSB7IHJldHVybiB0aGlzLl9wYXVzZU9uSG92ZXIkLnZhbHVlOyB9XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2lsbCBwYXVzZSBzbGlkZSBzd2l0Y2hpbmcgd2hlbiB0aGUgZm9jdXMgaXMgaW5zaWRlIHRoZSBjYXJvdXNlbC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBwYXVzZU9uRm9jdXModmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9wYXVzZU9uRm9jdXMkLm5leHQodmFsdWUpO1xuICB9XG5cbiAgZ2V0IHBhdXNlT25Gb2N1cygpIHsgcmV0dXJuIHRoaXMuX3BhdXNlT25Gb2N1cyQudmFsdWU7IH1cblxuICAvKipcbiAgICogSWYgYHRydWVgLCAncHJldmlvdXMnIGFuZCAnbmV4dCcgbmF2aWdhdGlvbiBhcnJvd3Mgd2lsbCBiZSB2aXNpYmxlIG9uIHRoZSBzbGlkZS5cbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBASW5wdXQoKSBzaG93TmF2aWdhdGlvbkFycm93czogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBuYXZpZ2F0aW9uIGluZGljYXRvcnMgYXQgdGhlIGJvdHRvbSBvZiB0aGUgc2xpZGUgd2lsbCBiZSB2aXNpYmxlLlxuICAgKlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uSW5kaWNhdG9yczogYm9vbGVhbjtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCBqdXN0IGJlZm9yZSB0aGUgc2xpZGUgdHJhbnNpdGlvbiBzdGFydHMuXG4gICAqXG4gICAqIFNlZSBbYE5nYlNsaWRlRXZlbnRgXSgjL2NvbXBvbmVudHMvY2Fyb3VzZWwvYXBpI05nYlNsaWRlRXZlbnQpIGZvciBwYXlsb2FkIGRldGFpbHMuXG4gICAqL1xuICBAT3V0cHV0KCkgc2xpZGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlNsaWRlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYWZ0ZXIgdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkLlxuICAgKlxuICAgKiBTZWUgW2BOZ2JTbGlkZUV2ZW50YF0oIy9jb21wb25lbnRzL2Nhcm91c2VsL2FwaSNOZ2JTbGlkZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBzbGlkID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG4gIC8qXG4gICAqIEtlZXAgdGhlIGlkcyBvZiB0aGUgcGFuZWxzIGN1cnJlbnRseSB0cmFuc2l0aW9ubmluZ1xuICAgKiBpbiBvcmRlciB0byBhbGxvdyBvbmx5IHRoZSB0cmFuc2l0aW9uIHJldmVydGlvblxuICAgKi9cbiAgcHJpdmF0ZSBfdHJhbnNpdGlvbklkczogW3N0cmluZywgc3RyaW5nXSB8IG51bGwgPSBudWxsO1xuXG4gIHNldCBtb3VzZUhvdmVyKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX21vdXNlSG92ZXIkLm5leHQodmFsdWUpOyB9XG5cbiAgZ2V0IG1vdXNlSG92ZXIoKSB7IHJldHVybiB0aGlzLl9tb3VzZUhvdmVyJC52YWx1ZTsgfVxuXG4gIHNldCBmb2N1c2VkKHZhbHVlOiBib29sZWFuKSB7IHRoaXMuX2ZvY3VzZWQkLm5leHQodmFsdWUpOyB9XG5cbiAgZ2V0IGZvY3VzZWQoKSB7IHJldHVybiB0aGlzLl9mb2N1c2VkJC52YWx1ZTsgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29uZmlnOiBOZ2JDYXJvdXNlbENvbmZpZywgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgX2NvbnRhaW5lcjogRWxlbWVudFJlZikge1xuICAgIHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcbiAgICB0aGlzLmludGVydmFsID0gY29uZmlnLmludGVydmFsO1xuICAgIHRoaXMud3JhcCA9IGNvbmZpZy53cmFwO1xuICAgIHRoaXMua2V5Ym9hcmQgPSBjb25maWcua2V5Ym9hcmQ7XG4gICAgdGhpcy5wYXVzZU9uSG92ZXIgPSBjb25maWcucGF1c2VPbkhvdmVyO1xuICAgIHRoaXMucGF1c2VPbkZvY3VzID0gY29uZmlnLnBhdXNlT25Gb2N1cztcbiAgICB0aGlzLnNob3dOYXZpZ2F0aW9uQXJyb3dzID0gY29uZmlnLnNob3dOYXZpZ2F0aW9uQXJyb3dzO1xuICAgIHRoaXMuc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzID0gY29uZmlnLnNob3dOYXZpZ2F0aW9uSW5kaWNhdG9ycztcbiAgfVxuXG4gIGFycm93TGVmdCgpIHtcbiAgICB0aGlzLmZvY3VzKCk7XG4gICAgdGhpcy5wcmV2KE5nYlNsaWRlRXZlbnRTb3VyY2UuQVJST1dfTEVGVCk7XG4gIH1cblxuICBhcnJvd1JpZ2h0KCkge1xuICAgIHRoaXMuZm9jdXMoKTtcbiAgICB0aGlzLm5leHQoTmdiU2xpZGVFdmVudFNvdXJjZS5BUlJPV19SSUdIVCk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gc2V0SW50ZXJ2YWwoKSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIFNTUiBhbmQgcHJvdHJhY3RvcixcbiAgICAvLyBzbyB3ZSBzaG91bGQgcnVuIGl0IGluIHRoZSBicm93c2VyIGFuZCBvdXRzaWRlIEFuZ3VsYXJcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhc05leHRTbGlkZSQgPSBjb21iaW5lTGF0ZXN0KFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbGlkZS5waXBlKG1hcChzbGlkZUV2ZW50ID0+IHNsaWRlRXZlbnQuY3VycmVudCksIHN0YXJ0V2l0aCh0aGlzLmFjdGl2ZUlkKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dyYXAkLCB0aGlzLnNsaWRlcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwKChbY3VycmVudFNsaWRlSWQsIHdyYXBdKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2xpZGVBcnIgPSB0aGlzLnNsaWRlcy50b0FycmF5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRTbGlkZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gd3JhcCA/IHNsaWRlQXJyLmxlbmd0aCA+IDEgOiBjdXJyZW50U2xpZGVJZHggPCBzbGlkZUFyci5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSk7XG4gICAgICAgIGNvbWJpbmVMYXRlc3QoW1xuICAgICAgICAgIHRoaXMuX3BhdXNlJCwgdGhpcy5fcGF1c2VPbkhvdmVyJCwgdGhpcy5fbW91c2VIb3ZlciQsIHRoaXMuX3BhdXNlT25Gb2N1cyQsIHRoaXMuX2ZvY3VzZWQkLCB0aGlzLl9pbnRlcnZhbCQsXG4gICAgICAgICAgaGFzTmV4dFNsaWRlJFxuICAgICAgICBdKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKChbcGF1c2UsIHBhdXNlT25Ib3ZlciwgbW91c2VIb3ZlciwgcGF1c2VPbkZvY3VzLCBmb2N1c2VkLCBpbnRlcnZhbCxcbiAgICAgICAgICAgICAgICAgICAgICBoYXNOZXh0U2xpZGVdOiBbYm9vbGVhbiwgYm9vbGVhbiwgYm9vbGVhbiwgYm9vbGVhbiwgYm9vbGVhbiwgbnVtYmVyLCBib29sZWFuXSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgICgocGF1c2UgfHwgKHBhdXNlT25Ib3ZlciAmJiBtb3VzZUhvdmVyKSB8fCAocGF1c2VPbkZvY3VzICYmIGZvY3VzZWQpIHx8ICFoYXNOZXh0U2xpZGUpID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsKSksXG5cbiAgICAgICAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLCBzd2l0Y2hNYXAoaW50ZXJ2YWwgPT4gaW50ZXJ2YWwgPiAwID8gdGltZXIoaW50ZXJ2YWwsIGludGVydmFsKSA6IE5FVkVSKSxcbiAgICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fZGVzdHJveSQpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMubmV4dChOZ2JTbGlkZUV2ZW50U291cmNlLlRJTUVSKSkpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5zbGlkZXMuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl90cmFuc2l0aW9uSWRzID8uZm9yRWFjaChpZCA9PiBuZ2JDb21wbGV0ZVRyYW5zaXRpb24odGhpcy5fZ2V0U2xpZGVFbGVtZW50KGlkKSkpO1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbklkcyA9IG51bGw7XG5cbiAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAvLyBUaGUgZm9sbG93aW5nIGNvZGUgbmVlZCB0byBiZSBkb25lIGFzeW5jaHJvbm91c2x5LCBhZnRlciB0aGUgZG9tIGJlY29tZXMgc3RhYmxlLFxuICAgICAgLy8gb3RoZXJ3aXNlIGFsbCBjaGFuZ2VzIHdpbGwgYmUgdW5kb25lLlxuICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgZm9yIChjb25zdCB7IGlkIH0gb2YgdGhpcy5zbGlkZXMpIHtcbiAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZ2V0U2xpZGVFbGVtZW50KGlkKTtcbiAgICAgICAgICBpZiAoaWQgPT09IHRoaXMuYWN0aXZlSWQpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICBsZXQgYWN0aXZlU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG4gICAgdGhpcy5hY3RpdmVJZCA9IGFjdGl2ZVNsaWRlID8gYWN0aXZlU2xpZGUuaWQgOiAodGhpcy5zbGlkZXMubGVuZ3RoID8gdGhpcy5zbGlkZXMuZmlyc3QuaWQgOiAnJyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgJ2FjdGl2ZScgY2xhc3MgKG5vdCBtYW5hZ2VkIGJ5IHRoZSB0ZW1wbGF0ZSlcbiAgICBpZiAodGhpcy5hY3RpdmVJZCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2dldFNsaWRlRWxlbWVudCh0aGlzLmFjdGl2ZUlkKTtcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuX2Rlc3Ryb3kkLm5leHQoKTsgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gYSBzbGlkZSB3aXRoIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci5cbiAgICovXG4gIHNlbGVjdChzbGlkZUlkOiBzdHJpbmcsIHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2UpIHtcbiAgICB0aGlzLl9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZCwgdGhpcy5fZ2V0U2xpZGVFdmVudERpcmVjdGlvbih0aGlzLmFjdGl2ZUlkLCBzbGlkZUlkKSwgc291cmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIHByZXZpb3VzIHNsaWRlLlxuICAgKi9cbiAgcHJldihzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG4gICAgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldFByZXZTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5FTkQsIHNvdXJjZSk7XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIHRvIHRoZSBuZXh0IHNsaWRlLlxuICAgKi9cbiAgbmV4dChzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG4gICAgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldE5leHRTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5TVEFSVCwgc291cmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXVzZXMgY3ljbGluZyB0aHJvdWdoIHRoZSBzbGlkZXMuXG4gICAqL1xuICBwYXVzZSgpIHsgdGhpcy5fcGF1c2UkLm5leHQodHJ1ZSk7IH1cblxuICAvKipcbiAgICogUmVzdGFydHMgY3ljbGluZyB0aHJvdWdoIHRoZSBzbGlkZXMgZnJvbSBzdGFydCB0byBlbmQuXG4gICAqL1xuICBjeWNsZSgpIHsgdGhpcy5fcGF1c2UkLm5leHQoZmFsc2UpOyB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgZm9jdXMgb24gdGhlIGNhcm91c2VsLlxuICAgKi9cbiAgZm9jdXMoKSB7IHRoaXMuX2NvbnRhaW5lci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7IH1cblxuICBwcml2YXRlIF9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZHg6IHN0cmluZywgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLCBzb3VyY2U/OiBOZ2JTbGlkZUV2ZW50U291cmNlKSB7XG4gICAgY29uc3QgdHJhbnNpdGlvbklkcyA9IHRoaXMuX3RyYW5zaXRpb25JZHM7XG4gICAgaWYgKHRyYW5zaXRpb25JZHMgJiYgKHRyYW5zaXRpb25JZHNbMF0gIT09IHNsaWRlSWR4IHx8IHRyYW5zaXRpb25JZHNbMV0gIT09IHRoaXMuYWN0aXZlSWQpKSB7XG4gICAgICAvLyBSZXZlcnQgcHJldmVudGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHNlbGVjdGVkU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZHgpO1xuICAgIGlmIChzZWxlY3RlZFNsaWRlICYmIHNlbGVjdGVkU2xpZGUuaWQgIT09IHRoaXMuYWN0aXZlSWQpIHtcbiAgICAgIHRoaXMuX3RyYW5zaXRpb25JZHMgPSBbdGhpcy5hY3RpdmVJZCwgc2xpZGVJZHhdO1xuICAgICAgdGhpcy5zbGlkZS5lbWl0KFxuICAgICAgICAgIHtwcmV2OiB0aGlzLmFjdGl2ZUlkLCBjdXJyZW50OiBzZWxlY3RlZFNsaWRlLmlkLCBkaXJlY3Rpb246IGRpcmVjdGlvbiwgcGF1c2VkOiB0aGlzLl9wYXVzZSQudmFsdWUsIHNvdXJjZX0pO1xuXG4gICAgICBjb25zdCBvcHRpb25zOiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxOZ2JDYXJvdXNlbEN0eD4gPSB7XG4gICAgICAgIGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG4gICAgICAgIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcsXG4gICAgICAgIGNvbnRleHQ6IHtkaXJlY3Rpb259LFxuICAgICAgfTtcblxuICAgICAgY29uc3QgdHJhbnNpdGlvbnM6IEFycmF5PE9ic2VydmFibGU8YW55Pj4gPSBbXTtcbiAgICAgIGNvbnN0IGFjdGl2ZVNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHRoaXMuYWN0aXZlSWQpO1xuICAgICAgaWYgKGFjdGl2ZVNsaWRlKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZVNsaWRlVHJhbnNpdGlvbiA9XG4gICAgICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX25nWm9uZSwgdGhpcy5fZ2V0U2xpZGVFbGVtZW50KGFjdGl2ZVNsaWRlLmlkKSwgbmdiQ2Fyb3VzZWxUcmFuc2l0aW9uT3V0LCBvcHRpb25zKTtcbiAgICAgICAgYWN0aXZlU2xpZGVUcmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7IGFjdGl2ZVNsaWRlLnNsaWQuZW1pdCh7aXNTaG93bjogZmFsc2UsIGRpcmVjdGlvbiwgc291cmNlfSk7IH0pO1xuICAgICAgICB0cmFuc2l0aW9ucy5wdXNoKGFjdGl2ZVNsaWRlVHJhbnNpdGlvbik7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXZpb3VzSWQgPSB0aGlzLmFjdGl2ZUlkO1xuICAgICAgdGhpcy5hY3RpdmVJZCA9IHNlbGVjdGVkU2xpZGUuaWQ7XG4gICAgICBjb25zdCBuZXh0U2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG4gICAgICBjb25zdCB0cmFuc2l0aW9uID1cbiAgICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX25nWm9uZSwgdGhpcy5fZ2V0U2xpZGVFbGVtZW50KHNlbGVjdGVkU2xpZGUuaWQpLCBuZ2JDYXJvdXNlbFRyYW5zaXRpb25Jbiwgb3B0aW9ucyk7XG4gICAgICB0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7IG5leHRTbGlkZSA/LnNsaWQuZW1pdCh7aXNTaG93bjogdHJ1ZSwgZGlyZWN0aW9uLCBzb3VyY2V9KTsgfSk7XG4gICAgICB0cmFuc2l0aW9ucy5wdXNoKHRyYW5zaXRpb24pO1xuXG4gICAgICB6aXAoLi4udHJhbnNpdGlvbnMpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbklkcyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2xpZC5lbWl0KFxuICAgICAgICAgICAge3ByZXY6IHByZXZpb3VzSWQsIGN1cnJlbnQ6IHNlbGVjdGVkU2xpZGUgIS5pZCwgZGlyZWN0aW9uOiBkaXJlY3Rpb24sIHBhdXNlZDogdGhpcy5fcGF1c2UkLnZhbHVlLCBzb3VyY2V9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHdlIGdldCBoZXJlIGFmdGVyIHRoZSBpbnRlcnZhbCBmaXJlcyBvciBhbnkgZXh0ZXJuYWwgQVBJIGNhbGwgbGlrZSBuZXh0KCksIHByZXYoKSBvciBzZWxlY3QoKVxuICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVFdmVudERpcmVjdGlvbihjdXJyZW50QWN0aXZlU2xpZGVJZDogc3RyaW5nLCBuZXh0QWN0aXZlU2xpZGVJZDogc3RyaW5nKTogTmdiU2xpZGVFdmVudERpcmVjdGlvbiB7XG4gICAgY29uc3QgY3VycmVudEFjdGl2ZVNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRBY3RpdmVTbGlkZUlkKTtcbiAgICBjb25zdCBuZXh0QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQobmV4dEFjdGl2ZVNsaWRlSWQpO1xuXG4gICAgcmV0dXJuIGN1cnJlbnRBY3RpdmVTbGlkZUlkeCA+IG5leHRBY3RpdmVTbGlkZUlkeCA/IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uRU5EIDogTmdiU2xpZGVFdmVudERpcmVjdGlvbi5TVEFSVDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlQnlJZChzbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnNsaWRlcy5maW5kKHNsaWRlID0+IHNsaWRlLmlkID09PSBzbGlkZUlkKSB8fCBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVJZHhCeUlkKHNsaWRlSWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgY29uc3Qgc2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZCk7XG4gICAgcmV0dXJuIHNsaWRlICE9IG51bGwgPyB0aGlzLnNsaWRlcy50b0FycmF5KCkuaW5kZXhPZihzbGlkZSkgOiAtMTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE5leHRTbGlkZShjdXJyZW50U2xpZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudFNsaWRlSWQpO1xuICAgIGNvbnN0IGlzTGFzdFNsaWRlID0gY3VycmVudFNsaWRlSWR4ID09PSBzbGlkZUFyci5sZW5ndGggLSAxO1xuXG4gICAgcmV0dXJuIGlzTGFzdFNsaWRlID8gKHRoaXMud3JhcCA/IHNsaWRlQXJyWzBdLmlkIDogc2xpZGVBcnJbc2xpZGVBcnIubGVuZ3RoIC0gMV0uaWQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggKyAxXS5pZDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFByZXZTbGlkZShjdXJyZW50U2xpZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudFNsaWRlSWQpO1xuICAgIGNvbnN0IGlzRmlyc3RTbGlkZSA9IGN1cnJlbnRTbGlkZUlkeCA9PT0gMDtcblxuICAgIHJldHVybiBpc0ZpcnN0U2xpZGUgPyAodGhpcy53cmFwID8gc2xpZGVBcnJbc2xpZGVBcnIubGVuZ3RoIC0gMV0uaWQgOiBzbGlkZUFyclswXS5pZCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggLSAxXS5pZDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlRWxlbWVudChzbGlkZUlkOiBzdHJpbmcpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lci5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYCNzbGlkZS0ke3NsaWRlSWR9YCk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNsaWRlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JTbGlkZUV2ZW50IHtcbiAgLyoqXG4gICAqIFRoZSBwcmV2aW91cyBzbGlkZSBpZC5cbiAgICovXG4gIHByZXY6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgc2xpZGUgaWQuXG4gICAqL1xuICBjdXJyZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzbGlkZSBldmVudCBkaXJlY3Rpb24uXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctaW5mbyB0ZXh0LWRhcmtcIj5zaW5jZSAxMi4wLjA8L3NwYW4+IFBvc3NpYmxlIHZhbHVlcyBhcmUgYCdzdGFydCcgfCAnZW5kJ2AuXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctc2Vjb25kYXJ5XCI+YmVmb3JlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIHdlcmUgYCdsZWZ0JyB8ICdyaWdodCdgLlxuICAgKi9cbiAgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYXVzZSgpIG1ldGhvZCB3YXMgY2FsbGVkIChhbmQgbm8gY3ljbGUoKSBjYWxsIHdhcyBkb25lIGFmdGVyd2FyZHMpLlxuICAgKlxuICAgKiBAc2luY2UgNS4xLjBcbiAgICovXG4gIHBhdXNlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogU291cmNlIHRyaWdnZXJpbmcgdGhlIHNsaWRlIGNoYW5nZSBldmVudC5cbiAgICpcbiAgICogUG9zc2libGUgdmFsdWVzIGFyZSBgJ3RpbWVyJyB8ICdhcnJvd0xlZnQnIHwgJ2Fycm93UmlnaHQnIHwgJ2luZGljYXRvcidgXG4gICAqXG4gICAqIEBzaW5jZSA1LjEuMFxuICAgKi9cbiAgc291cmNlPzogTmdiU2xpZGVFdmVudFNvdXJjZTtcbn1cblxuLyoqXG4gKiBBIHNsaWRlIGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGFmdGVyIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAqXG4gKiBAc2luY2UgOC4wLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JTaW5nbGVTbGlkZUV2ZW50IHtcbiAgLyoqXG4gICAqIHRydWUgaWYgdGhlIHNsaWRlIGlzIHNob3duLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGlzU2hvd246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBzbGlkZSBldmVudCBkaXJlY3Rpb24uXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctaW5mbyB0ZXh0LWRhcmtcIj5zaW5jZSAxMi4wLjA8L3NwYW4+IFBvc3NpYmxlIHZhbHVlcyBhcmUgYCdzdGFydCcgfCAnZW5kJ2AuXG4gICAqXG4gICAqIDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmctc2Vjb25kYXJ5XCI+YmVmb3JlIDEyLjAuMDwvc3Bhbj4gUG9zc2libGUgdmFsdWVzIHdlcmUgYCdsZWZ0JyB8ICdyaWdodCdgLlxuICAgKi9cbiAgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBTb3VyY2UgdHJpZ2dlcmluZyB0aGUgc2xpZGUgY2hhbmdlIGV2ZW50LlxuICAgKlxuICAgKiBQb3NzaWJsZSB2YWx1ZXMgYXJlIGAndGltZXInIHwgJ2Fycm93TGVmdCcgfCAnYXJyb3dSaWdodCcgfCAnaW5kaWNhdG9yJ2BcbiAgICpcbiAgICovXG4gIHNvdXJjZT86IE5nYlNsaWRlRXZlbnRTb3VyY2U7XG59XG5cbmV4cG9ydCBlbnVtIE5nYlNsaWRlRXZlbnRTb3VyY2Uge1xuICBUSU1FUiA9ICd0aW1lcicsXG4gIEFSUk9XX0xFRlQgPSAnYXJyb3dMZWZ0JyxcbiAgQVJST1dfUklHSFQgPSAnYXJyb3dSaWdodCcsXG4gIElORElDQVRPUiA9ICdpbmRpY2F0b3InXG59XG5cbmV4cG9ydCBjb25zdCBOR0JfQ0FST1VTRUxfRElSRUNUSVZFUyA9IFtOZ2JDYXJvdXNlbCwgTmdiU2xpZGVdO1xuIl19