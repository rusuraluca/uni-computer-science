import * as i0 from '@angular/core';
import { Injectable, Directive, EventEmitter, Input, Output, ContentChildren, Component, ViewEncapsulation, Optional, Host, NgModule, ChangeDetectionStrategy, forwardRef, PLATFORM_ID, Inject, LOCALE_ID, ElementRef, ViewChild, ContentChild, TemplateRef, Injector, Attribute, ViewChildren, HostBinding, InjectionToken } from '@angular/core';
import * as i2 from '@angular/common';
import { CommonModule, isPlatformBrowser, getLocaleMonthNames, FormStyle, TranslationWidth, getLocaleDayNames, formatDate, DOCUMENT, getLocaleDayPeriods } from '@angular/common';
import { Observable, EMPTY, of, Subject, fromEvent, timer, race, BehaviorSubject, combineLatest, NEVER, zip, merge } from 'rxjs';
import { endWith, takeUntil, filter, take, map, startWith, distinctUntilChanged, switchMap, tap, withLatestFrom, delay, mergeMap, skip, share, finalize } from 'rxjs/operators';
import * as i3 from '@angular/forms';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { flip, preventOverflow, arrow, createPopperLite, offset } from '@popperjs/core';

function toInteger(value) {
    return parseInt(`${value}`, 10);
}
function toString(value) {
    return (value !== undefined && value !== null) ? `${value}` : '';
}
function getValueInRange(value, max, min = 0) {
    return Math.max(Math.min(value, max), min);
}
function isString(value) {
    return typeof value === 'string';
}
function isNumber(value) {
    return !isNaN(toInteger(value));
}
function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
function isDefined(value) {
    return value !== undefined && value !== null;
}
function isPromise(v) {
    return v && v.then;
}
function padNumber(value) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    }
    else {
        return '';
    }
}
function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
function hasClassName(element, className) {
    return element && element.className && element.className.split &&
        element.className.split(/\s+/).indexOf(className) >= 0;
}
function closest(element, selector) {
    if (!selector) {
        return null;
    }
    /*
     * In certain browsers (e.g. Edge 44.18362.449.0) HTMLDocument does
     * not support `Element.prototype.closest`. To emulate the correct behaviour
     * we return null when the method is missing.
     *
     * Note that in evergreen browsers `closest(document.documentElement, 'html')`
     * will return the document element whilst in Edge null will be returned. This
     * compromise was deemed good enough.
     */
    if (typeof element.closest === 'undefined') {
        return null;
    }
    return element.closest(selector);
}
/**
 * Force a browser reflow
 * @param element element where to apply the reflow
 */
function reflow(element) {
    return (element || document.body).getBoundingClientRect();
}
/**
 * Creates an observable where all callbacks are executed inside a given zone
 *
 * @param zone
 */
function runInZone(zone) {
    return (source) => {
        return new Observable(observer => {
            const next = (value) => zone.run(() => observer.next(value));
            const error = (e) => zone.run(() => observer.error(e));
            const complete = () => zone.run(() => observer.complete());
            return source.subscribe({ next, error, complete });
        });
    };
}
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getTransitionDurationMs(element) {
    const { transitionDelay, transitionDuration } = window.getComputedStyle(element);
    const transitionDelaySec = parseFloat(transitionDelay);
    const transitionDurationSec = parseFloat(transitionDuration);
    return (transitionDelaySec + transitionDurationSec) * 1000;
}

const environment = {
    animation: true,
    transitionTimerDelayMs: 5,
};

const noopFn = () => { };
const { transitionTimerDelayMs } = environment;
const runningTransitions = new Map();
const ngbRunTransition = (zone, element, startFn, options) => {
    // Getting initial context from options
    let context = options.context || {};
    // Checking if there are already running transitions on the given element.
    const running = runningTransitions.get(element);
    if (running) {
        switch (options.runningTransition) {
            // If there is one running and we want for it to 'continue' to run, we have to cancel the new one.
            // We're not emitting any values, but simply completing the observable (EMPTY).
            case 'continue':
                return EMPTY;
            // If there is one running and we want for it to 'stop', we have to complete the running one.
            // We're simply completing the running one and not emitting any values and merging newly provided context
            // with the one coming from currently running transition.
            case 'stop':
                zone.run(() => running.transition$.complete());
                context = Object.assign(running.context, context);
                runningTransitions.delete(element);
        }
    }
    // Running the start function
    const endFn = startFn(element, options.animation, context) || noopFn;
    // If 'prefer-reduced-motion' is enabled, the 'transition' will be set to 'none'.
    // If animations are disabled, we have to emit a value and complete the observable
    // In this case we have to call the end function, but can finish immediately by emitting a value,
    // completing the observable and executing end functions synchronously.
    if (!options.animation || window.getComputedStyle(element).transitionProperty === 'none') {
        zone.run(() => endFn());
        return of(undefined).pipe(runInZone(zone));
    }
    // Starting a new transition
    const transition$ = new Subject();
    const finishTransition$ = new Subject();
    const stop$ = transition$.pipe(endWith(true));
    runningTransitions.set(element, {
        transition$,
        complete: () => {
            finishTransition$.next();
            finishTransition$.complete();
        },
        context
    });
    const transitionDurationMs = getTransitionDurationMs(element);
    // 1. We have to both listen for the 'transitionend' event and have a 'just-in-case' timer,
    // because 'transitionend' event might not be fired in some browsers, if the transitioning
    // element becomes invisible (ex. when scrolling, making browser tab inactive, etc.). The timer
    // guarantees, that we'll release the DOM element and complete 'ngbRunTransition'.
    // 2. We need to filter transition end events, because they might bubble from shorter transitions
    // on inner DOM elements. We're only interested in the transition on the 'element' itself.
    zone.runOutsideAngular(() => {
        const transitionEnd$ = fromEvent(element, 'transitionend').pipe(takeUntil(stop$), filter(({ target }) => target === element));
        const timer$ = timer(transitionDurationMs + transitionTimerDelayMs).pipe(takeUntil(stop$));
        race(timer$, transitionEnd$, finishTransition$).pipe(takeUntil(stop$)).subscribe(() => {
            runningTransitions.delete(element);
            zone.run(() => {
                endFn();
                transition$.next();
                transition$.complete();
            });
        });
    });
    return transition$.asObservable();
};
const ngbCompleteTransition = (element) => {
    runningTransitions.get(element)?.complete();
};

function measureCollapsingElementHeightPx(element) {
    // SSR fix for without injecting the PlatformId
    if (typeof navigator === 'undefined') {
        return '0px';
    }
    const { classList } = element;
    const hasShownClass = classList.contains('show');
    if (!hasShownClass) {
        classList.add('show');
    }
    element.style.height = '';
    const height = element.getBoundingClientRect().height + 'px';
    if (!hasShownClass) {
        classList.remove('show');
    }
    return height;
}
const ngbCollapsingTransition = (element, animation, context) => {
    let { direction, maxHeight } = context;
    const { classList } = element;
    function setInitialClasses() {
        classList.add('collapse');
        if (direction === 'show') {
            classList.add('show');
        }
        else {
            classList.remove('show');
        }
    }
    // without animations we just need to set initial classes
    if (!animation) {
        setInitialClasses();
        return;
    }
    // No maxHeight -> running the transition for the first time
    if (!maxHeight) {
        maxHeight = measureCollapsingElementHeightPx(element);
        context.maxHeight = maxHeight;
        // Fix the height before starting the animation
        element.style.height = direction !== 'show' ? maxHeight : '0px';
        classList.remove('collapse');
        classList.remove('collapsing');
        classList.remove('show');
        reflow(element);
        // Start the animation
        classList.add('collapsing');
    }
    // Start or revert the animation
    element.style.height = direction === 'show' ? maxHeight : '0px';
    return () => {
        setInitialClasses();
        classList.remove('collapsing');
        element.style.height = '';
    };
};

/**
 * Global ng-bootstrap config
 *
 * @since 8.0.0
 */
class NgbConfig {
    constructor() {
        this.animation = environment.animation;
    }
}
NgbConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * A configuration service for the [NgbAccordion](#/components/accordion/api#NgbAccordion) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all accordions used in the application.
 */
class NgbAccordionConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.closeOthers = false;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbAccordionConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbAccordionConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

let nextId$4 = 0;
/**
 * A directive that wraps an accordion panel header with any HTML markup and a toggling button
 * marked with [`NgbPanelToggle`](#/components/accordion/api#NgbPanelToggle).
 * See the [header customization demo](#/components/accordion/examples#header) for more details.
 *
 * You can also use [`NgbPanelTitle`](#/components/accordion/api#NgbPanelTitle) to customize only the panel title.
 *
 * @since 4.1.0
 */
class NgbPanelHeader {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelHeader, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPanelHeader, selector: "ng-template[ngbPanelHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelHeader, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelHeader]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps only the panel title with HTML markup inside.
 *
 * You can also use [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader) to customize the full panel header.
 */
class NgbPanelTitle {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelTitle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelTitle, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelTitle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPanelTitle, selector: "ng-template[ngbPanelTitle]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelTitle, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelTitle]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps the accordion panel content.
 */
class NgbPanelContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelContent, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPanelContent, selector: "ng-template[ngbPanelContent]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPanelContent]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive that wraps an individual accordion panel with title and collapsible content.
 */
class NgbPanel {
    constructor() {
        /**
         *  If `true`, the panel is disabled an can't be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel that must be unique on the page.
         *
         *  If not provided, it will be auto-generated in the `ngb-panel-xxx` format.
         */
        this.id = `ngb-panel-${nextId$4++}`;
        this.isOpen = false;
        /* A flag to specified that the transition panel classes have been initialized */
        this.initClassDone = false;
        /* A flag to specified if the panel is currently being animated, to ensure its presence in the dom */
        this.transitionRunning = false;
        /**
         * An event emitted when the panel is shown, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the panel is hidden, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
    }
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.headerTpl = this.headerTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbPanel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPanel, selector: "ngb-panel", inputs: { disabled: "disabled", id: "id", title: "title", type: "type", cardClass: "cardClass" }, outputs: { shown: "shown", hidden: "hidden" }, queries: [{ propertyName: "titleTpls", predicate: NgbPanelTitle }, { propertyName: "headerTpls", predicate: NgbPanelHeader }, { propertyName: "contentTpls", predicate: NgbPanelContent }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanel, decorators: [{
            type: Directive,
            args: [{ selector: 'ngb-panel' }]
        }], propDecorators: { disabled: [{
                type: Input
            }], id: [{
                type: Input
            }], title: [{
                type: Input
            }], type: [{
                type: Input
            }], cardClass: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], titleTpls: [{
                type: ContentChildren,
                args: [NgbPanelTitle, { descendants: false }]
            }], headerTpls: [{
                type: ContentChildren,
                args: [NgbPanelHeader, { descendants: false }]
            }], contentTpls: [{
                type: ContentChildren,
                args: [NgbPanelContent, { descendants: false }]
            }] } });
class NgbRefDirective {
    constructor(_El) {
        this._El = _El;
        this.ngbRef = new EventEmitter();
    }
    ngOnInit() { this.ngbRef.emit(this._El.nativeElement); }
    ngOnDestroy() { this.ngbRef.emit(null); }
}
NgbRefDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRefDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbRefDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbRefDirective, selector: "[ngbRef]", outputs: { ngbRef: "ngbRef" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRefDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbRef]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { ngbRef: [{
                type: Output
            }] } });
/**
 * Accordion is a collection of collapsible panels (bootstrap cards).
 *
 * It can ensure only one panel is opened at a time and allows to customize panel
 * headers.
 */
class NgbAccordion {
    constructor(config, _ngZone, _changeDetector) {
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        /**
         * An array or comma separated strings of panel ids that should be opened **initially**.
         *
         * For subsequent changes use methods like `expand()`, `collapse()`, etc. and
         * the `(panelChange)` event.
         */
        this.activeIds = [];
        /**
         * If `true`, panel content will be detached from DOM and not simply hidden when the panel is collapsed.
         */
        this.destroyOnHide = true;
        /**
         * Event emitted right before the panel toggle happens.
         *
         * See [NgbPanelChangeEvent](#/components/accordion/api#NgbPanelChangeEvent) for payload details.
         */
        this.panelChange = new EventEmitter();
        /**
         * An event emitted when the expanding animation is finished on the panel. The payload is the panel id.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapsing animation is finished on the panel, and before the panel element is removed.
         * The payload is the panel id.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Checks if a panel with a given id is expanded.
     */
    isExpanded(panelId) { return this.activeIds.indexOf(panelId) > -1; }
    /**
     * Expands a panel with a given id.
     *
     * Has no effect if the panel is already expanded or disabled.
     */
    expand(panelId) { this._changeOpenState(this._findPanelById(panelId), true); }
    /**
     * Expands all panels, if `[closeOthers]` is `false`.
     *
     * If `[closeOthers]` is `true`, it will expand the first panel, unless there is already a panel opened.
     */
    expandAll() {
        if (this.closeOtherPanels) {
            if (this.activeIds.length === 0 && this.panels.length) {
                this._changeOpenState(this.panels.first, true);
            }
        }
        else {
            this.panels.forEach(panel => this._changeOpenState(panel, true));
        }
    }
    /**
     * Collapses a panel with the given id.
     *
     * Has no effect if the panel is already collapsed or disabled.
     */
    collapse(panelId) { this._changeOpenState(this._findPanelById(panelId), false); }
    /**
     * Collapses all opened panels.
     */
    collapseAll() {
        this.panels.forEach((panel) => { this._changeOpenState(panel, false); });
    }
    /**
     * Toggles a panel with the given id.
     *
     * Has no effect if the panel is disabled.
     */
    toggle(panelId) {
        const panel = this._findPanelById(panelId);
        if (panel) {
            this._changeOpenState(panel, !panel.isOpen);
        }
    }
    ngAfterContentChecked() {
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        // update panels open states
        this.panels.forEach(panel => { panel.isOpen = !panel.disabled && this.activeIds.indexOf(panel.id) > -1; });
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0], false);
            this._updateActiveIds();
        }
        // Setup the initial classes here
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            this.panels.forEach(panel => {
                const panelElement = panel.panelDiv;
                if (panelElement) {
                    if (!panel.initClassDone) {
                        panel.initClassDone = true;
                        ngbRunTransition(this._ngZone, panelElement, ngbCollapsingTransition, {
                            animation: false,
                            runningTransition: 'continue',
                            context: { direction: panel.isOpen ? 'show' : 'hide' }
                        });
                    }
                }
                else {
                    // Classes must be initialized next time it will be in the dom
                    panel.initClassDone = false;
                }
            });
        });
    }
    _changeOpenState(panel, nextState) {
        if (panel != null && !panel.disabled && panel.isOpen !== nextState) {
            let defaultPrevented = false;
            this.panelChange.emit({ panelId: panel.id, nextState: nextState, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                panel.isOpen = nextState;
                panel.transitionRunning = true;
                if (nextState && this.closeOtherPanels) {
                    this._closeOthers(panel.id);
                }
                this._updateActiveIds();
                this._runTransitions(this.animation);
            }
        }
    }
    _closeOthers(panelId, enableTransition = true) {
        this.panels.forEach(panel => {
            if (panel.id !== panelId && panel.isOpen) {
                panel.isOpen = false;
                panel.transitionRunning = enableTransition;
            }
        });
    }
    _findPanelById(panelId) { return this.panels.find(p => p.id === panelId) || null; }
    _updateActiveIds() {
        this.activeIds = this.panels.filter(panel => panel.isOpen && !panel.disabled).map(panel => panel.id);
    }
    _runTransitions(animation) {
        // detectChanges is performed to ensure that all panels are in the dom (via transitionRunning = true)
        // before starting the animation
        this._changeDetector.detectChanges();
        this.panels.forEach(panel => {
            // When panel.transitionRunning is true, the transition needs to be started OR reversed,
            // The direction (show or hide) is choosen by each panel.isOpen state
            if (panel.transitionRunning) {
                const panelElement = panel.panelDiv;
                ngbRunTransition(this._ngZone, panelElement, ngbCollapsingTransition, {
                    animation,
                    runningTransition: 'stop',
                    context: { direction: panel.isOpen ? 'show' : 'hide' }
                }).subscribe(() => {
                    panel.transitionRunning = false;
                    const { id } = panel;
                    if (panel.isOpen) {
                        panel.shown.emit();
                        this.shown.emit(id);
                    }
                    else {
                        panel.hidden.emit();
                        this.hidden.emit(id);
                    }
                });
            }
        });
    }
}
NgbAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordion, deps: [{ token: NgbAccordionConfig }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
NgbAccordion.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbAccordion, selector: "ngb-accordion", inputs: { animation: "animation", activeIds: "activeIds", closeOtherPanels: ["closeOthers", "closeOtherPanels"], destroyOnHide: "destroyOnHide", type: "type" }, outputs: { panelChange: "panelChange", shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "tablist" }, properties: { "attr.aria-multiselectable": "!closeOtherPanels" }, classAttribute: "accordion" }, queries: [{ propertyName: "panels", predicate: NgbPanel }], exportAs: ["ngbAccordion"], ngImport: i0, template: `
    <ng-template #t ngbPanelHeader let-panel>
      <button class="accordion-button" [ngbPanelToggle]="panel">
        {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
      </button>
    </ng-template>
    <ng-template ngFor let-panel [ngForOf]="panels">
      <div [class]="'accordion-item ' + (panel.cardClass || '')">
        <div role="tab" id="{{panel.id}}-header" [class]="'accordion-header ' + (panel.type ? 'bg-'+panel.type: type ? 'bg-'+type : '')">
          <ng-template [ngTemplateOutlet]="panel.headerTpl?.templateRef || t"
                       [ngTemplateOutletContext]="{$implicit: panel, opened: panel.isOpen}"></ng-template>
        </div>
        <div id="{{panel.id}}" (ngbRef)="panel.panelDiv = $event" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'"
             *ngIf="!destroyOnHide || panel.isOpen || panel.transitionRunning">
          <div class="accordion-body">
            <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef || null"></ng-template>
          </div>
        </div>
      </div>
    </ng-template>
  `, isInline: true, directives: [{ type: i0.forwardRef(function () { return NgbPanelHeader; }), selector: "ng-template[ngbPanelHeader]" }, { type: i0.forwardRef(function () { return NgbPanelToggle; }), selector: "button[ngbPanelToggle]", inputs: ["ngbPanelToggle"] }, { type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i0.forwardRef(function () { return NgbRefDirective; }), selector: "[ngbRef]", outputs: ["ngbRef"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-accordion',
                    exportAs: 'ngbAccordion',
                    encapsulation: ViewEncapsulation.None,
                    host: { 'class': 'accordion', 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                    template: `
    <ng-template #t ngbPanelHeader let-panel>
      <button class="accordion-button" [ngbPanelToggle]="panel">
        {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
      </button>
    </ng-template>
    <ng-template ngFor let-panel [ngForOf]="panels">
      <div [class]="'accordion-item ' + (panel.cardClass || '')">
        <div role="tab" id="{{panel.id}}-header" [class]="'accordion-header ' + (panel.type ? 'bg-'+panel.type: type ? 'bg-'+type : '')">
          <ng-template [ngTemplateOutlet]="panel.headerTpl?.templateRef || t"
                       [ngTemplateOutletContext]="{$implicit: panel, opened: panel.isOpen}"></ng-template>
        </div>
        <div id="{{panel.id}}" (ngbRef)="panel.panelDiv = $event" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'"
             *ngIf="!destroyOnHide || panel.isOpen || panel.transitionRunning">
          <div class="accordion-body">
            <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef || null"></ng-template>
          </div>
        </div>
      </div>
    </ng-template>
  `
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordionConfig }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { panels: [{
                type: ContentChildren,
                args: [NgbPanel]
            }], animation: [{
                type: Input
            }], activeIds: [{
                type: Input
            }], closeOtherPanels: [{
                type: Input,
                args: ['closeOthers']
            }], destroyOnHide: [{
                type: Input
            }], type: [{
                type: Input
            }], panelChange: [{
                type: Output
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });
/**
 * A directive to put on a button that toggles panel opening and closing.
 *
 * To be used inside the [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader)
 *
 * @since 4.1.0
 */
class NgbPanelToggle {
    constructor(accordion, panel) {
        this.accordion = accordion;
        this.panel = panel;
    }
    set ngbPanelToggle(panel) {
        if (panel) {
            this.panel = panel;
        }
    }
}
NgbPanelToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelToggle, deps: [{ token: NgbAccordion }, { token: NgbPanel, host: true, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgbPanelToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPanelToggle, selector: "button[ngbPanelToggle]", inputs: { ngbPanelToggle: "ngbPanelToggle" }, host: { attributes: { "type": "button" }, listeners: { "click": "accordion.toggle(panel.id)" }, properties: { "disabled": "panel.disabled", "class.collapsed": "!panel.isOpen", "attr.aria-expanded": "panel.isOpen", "attr.aria-controls": "panel.id" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPanelToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: 'button[ngbPanelToggle]',
                    host: {
                        'type': 'button',
                        '[disabled]': 'panel.disabled',
                        '[class.collapsed]': '!panel.isOpen',
                        '[attr.aria-expanded]': 'panel.isOpen',
                        '[attr.aria-controls]': 'panel.id',
                        '(click)': 'accordion.toggle(panel.id)'
                    }
                }]
        }], ctorParameters: function () { return [{ type: NgbAccordion }, { type: NgbPanel, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }] }]; }, propDecorators: { ngbPanelToggle: [{
                type: Input
            }] } });

const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle];
class NgbAccordionModule {
}
NgbAccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbAccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, declarations: [NgbRefDirective, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle], imports: [CommonModule], exports: [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbPanelHeader, NgbPanelToggle] });
NgbAccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgbRefDirective, ...NGB_ACCORDION_DIRECTIVES],
                    exports: NGB_ACCORDION_DIRECTIVES,
                    imports: [CommonModule]
                }]
        }] });

const ngbAlertFadingTransition = ({ classList }) => {
    classList.remove('show');
};

/**
 * A configuration service for the [NgbAlert](#/components/alert/api#NgbAlert) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all alerts used in the application.
 */
class NgbAlertConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.dismissible = true;
        this.type = 'warning';
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbAlertConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbAlertConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
class NgbAlert {
    constructor(config, _renderer, _element, _zone) {
        this._renderer = _renderer;
        this._element = _element;
        this._zone = _zone;
        /**
         * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
         *
         * @since 8.0.0
         */
        this.closed = new EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
        this.animation = config.animation;
    }
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
    close() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbAlertFadingTransition, { animation: this.animation, runningTransition: 'continue' });
        transition.subscribe(() => this.closed.emit());
        return transition;
    }
    ngOnChanges(changes) {
        const typeChange = changes['type'];
        if (typeChange && !typeChange.firstChange) {
            this._renderer.removeClass(this._element.nativeElement, `alert-${typeChange.previousValue}`);
            this._renderer.addClass(this._element.nativeElement, `alert-${typeChange.currentValue}`);
        }
    }
    ngOnInit() { this._renderer.addClass(this._element.nativeElement, `alert-${this.type}`); }
}
NgbAlert.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlert, deps: [{ token: NgbAlertConfig }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbAlert.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbAlert, selector: "ngb-alert", inputs: { animation: "animation", dismissible: "dismissible", type: "type" }, outputs: { closed: "closed" }, host: { attributes: { "role": "alert" }, properties: { "class.fade": "animation", "class.alert-dismissible": "dismissible" }, classAttribute: "alert show" }, exportAs: ["ngbAlert"], usesOnChanges: true, ngImport: i0, template: `
    <ng-content></ng-content>
    <button *ngIf="dismissible" type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="close()">
    </button>
    `, isInline: true, styles: ["ngb-alert{display:block}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlert, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-alert', exportAs: 'ngbAlert', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: { 'role': 'alert', 'class': 'alert show', '[class.fade]': 'animation', '[class.alert-dismissible]': 'dismissible' }, template: `
    <ng-content></ng-content>
    <button *ngIf="dismissible" type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="close()">
    </button>
    `, styles: ["ngb-alert{display:block}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbAlertConfig }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], dismissible: [{
                type: Input
            }], type: [{
                type: Input
            }], closed: [{
                type: Output
            }] } });

class NgbAlertModule {
}
NgbAlertModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbAlertModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertModule, declarations: [NgbAlert], imports: [CommonModule], exports: [NgbAlert] });
NgbAlertModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAlertModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [CommonModule] }]
        }] });

/* eslint-disable */
/**
 * @deprecated 12.0.0 Please use native Angular code instead
 */
class NgbButtonLabel {
}
NgbButtonLabel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonLabel, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbButtonLabel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbButtonLabel, selector: "[ngbButtonLabel]", host: { properties: { "class.btn": "true", "class.active": "active", "class.disabled": "disabled", "class.focus": "focused" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonLabel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbButtonLabel]',
                    host: { '[class.btn]': 'true', '[class.active]': 'active', '[class.disabled]': 'disabled', '[class.focus]': 'focused' }
                }]
        }] });

/* eslint-disable */
/**
 * Allows to easily create Bootstrap-style checkbox buttons.
 *
 * Integrates with forms, so the value of a checked button is bound to the underlying form control
 * either in a reactive or template-driven way.
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
class NgbCheckBox {
    constructor(_label, _cd) {
        this._label = _label;
        this._cd = _cd;
        /**
         * If `true`, the checkbox button will be disabled
         */
        this.disabled = false;
        /**
         * The form control value when the checkbox is checked.
         */
        this.valueChecked = true;
        /**
         * The form control value when the checkbox is unchecked.
         */
        this.valueUnChecked = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    set focused(isFocused) {
        this._label.focused = isFocused;
        if (!isFocused) {
            this.onTouched();
        }
    }
    onInputChange($event) {
        const modelToPropagate = $event.target.checked ? this.valueChecked : this.valueUnChecked;
        this.onChange(modelToPropagate);
        this.onTouched();
        this.writeValue(modelToPropagate);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._label.disabled = isDisabled;
    }
    writeValue(value) {
        this.checked = value === this.valueChecked;
        this._label.active = this.checked;
        // label won't be updated, if it is inside the OnPush component when [ngModel] changes
        this._cd.markForCheck();
    }
}
NgbCheckBox.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCheckBox, deps: [{ token: NgbButtonLabel }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbCheckBox.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbCheckBox, selector: "[ngbButton][type=checkbox]", inputs: { disabled: "disabled", valueChecked: "valueChecked", valueUnChecked: "valueUnChecked" }, host: { listeners: { "change": "onInputChange($event)", "focus": "focused = true", "blur": "focused = false" }, properties: { "checked": "checked", "disabled": "disabled" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbCheckBox), multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCheckBox, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbButton][type=checkbox]',
                    host: {
                        '[checked]': 'checked',
                        '[disabled]': 'disabled',
                        '(change)': 'onInputChange($event)',
                        '(focus)': 'focused = true',
                        '(blur)': 'focused = false'
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbCheckBox), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: NgbButtonLabel }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { disabled: [{
                type: Input
            }], valueChecked: [{
                type: Input
            }], valueUnChecked: [{
                type: Input
            }] } });

/* eslint-disable */
let nextId$3 = 0;
/**
 * Allows to easily create Bootstrap-style radio buttons.
 *
 * Integrates with forms, so the value of a checked button is bound to the underlying form control
 * either in a reactive or template-driven way.
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
class NgbRadioGroup {
    constructor() {
        this._radios = new Set();
        this._value = null;
        /**
         * Name of the radio group applied to radio input elements.
         *
         * Will be applied to all radio input elements inside the group,
         * unless [`NgbRadio`](#/components/buttons/api#NgbRadio)'s specify names themselves.
         *
         * If not provided, will be generated in the `ngb-radio-xx` format.
         */
        this.name = `ngb-radio-${nextId$3++}`;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    get disabled() { return this._disabled; }
    set disabled(isDisabled) { this.setDisabledState(isDisabled); }
    onRadioChange(radio) {
        this.writeValue(radio.value);
        this.onChange(radio.value);
    }
    onRadioValueUpdate() { this._updateRadiosValue(); }
    register(radio) { this._radios.add(radio); }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
        this._updateRadiosDisabled();
    }
    unregister(radio) { this._radios.delete(radio); }
    writeValue(value) {
        this._value = value;
        this._updateRadiosValue();
    }
    _updateRadiosValue() { this._radios.forEach((radio) => radio.updateValue(this._value)); }
    _updateRadiosDisabled() { this._radios.forEach((radio) => radio.updateDisabled()); }
}
NgbRadioGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRadioGroup, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbRadioGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbRadioGroup, selector: "[ngbRadioGroup]", inputs: { name: "name" }, host: { attributes: { "role": "radiogroup" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRadioGroup), multi: true }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRadioGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbRadioGroup]',
                    host: { 'role': 'radiogroup' },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRadioGroup), multi: true }]
                }]
        }], propDecorators: { name: [{
                type: Input
            }] } });
/**
 * A directive that marks an input of type "radio" as a part of the
 * [`NgbRadioGroup`](#/components/buttons/api#NgbRadioGroup).
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
class NgbRadio {
    constructor(_group, _label, _renderer, _element, _cd) {
        this._group = _group;
        this._label = _label;
        this._renderer = _renderer;
        this._element = _element;
        this._cd = _cd;
        this._value = null;
        this._group.register(this);
        this.updateDisabled();
    }
    /**
     * The form control value when current radio button is checked.
     */
    set value(value) {
        this._value = value;
        const stringValue = value ? value.toString() : '';
        this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
        this._group.onRadioValueUpdate();
    }
    /**
     * If `true`, current radio button will be disabled.
     */
    set disabled(isDisabled) {
        this._disabled = isDisabled !== false;
        this.updateDisabled();
    }
    set focused(isFocused) {
        if (this._label) {
            this._label.focused = isFocused;
        }
        if (!isFocused) {
            this._group.onTouched();
        }
    }
    get checked() { return this._checked; }
    get disabled() { return this._group.disabled || this._disabled; }
    get value() { return this._value; }
    get nameAttr() { return this.name || this._group.name; }
    ngOnDestroy() { this._group.unregister(this); }
    onChange() { this._group.onRadioChange(this); }
    updateValue(value) {
        // label won't be updated, if it is inside the OnPush component when [ngModel] changes
        if (this.value !== value) {
            this._cd.markForCheck();
        }
        this._checked = this.value === value;
        this._label.active = this._checked;
    }
    updateDisabled() { this._label.disabled = this.disabled; }
}
NgbRadio.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRadio, deps: [{ token: NgbRadioGroup }, { token: NgbButtonLabel }, { token: i0.Renderer2 }, { token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbRadio.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbRadio, selector: "[ngbButton][type=radio]", inputs: { name: "name", value: "value", disabled: "disabled" }, host: { listeners: { "change": "onChange()", "focus": "focused = true", "blur": "focused = false" }, properties: { "checked": "checked", "disabled": "disabled", "name": "nameAttr" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRadio, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbButton][type=radio]',
                    host: {
                        '[checked]': 'checked',
                        '[disabled]': 'disabled',
                        '[name]': 'nameAttr',
                        '(change)': 'onChange()',
                        '(focus)': 'focused = true',
                        '(blur)': 'focused = false'
                    }
                }]
        }], ctorParameters: function () { return [{ type: NgbRadioGroup }, { type: NgbButtonLabel }, { type: i0.Renderer2 }, { type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { name: [{
                type: Input
            }], value: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });

/* eslint-disable */
const NGB_BUTTON_DIRECTIVES = [NgbButtonLabel, NgbCheckBox, NgbRadioGroup, NgbRadio];
/**
 * @deprecated 12.0.0 Please use native Angular code instead
 */
class NgbButtonsModule {
}
NgbButtonsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbButtonsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonsModule, declarations: [NgbButtonLabel, NgbCheckBox, NgbRadioGroup, NgbRadio], exports: [NgbButtonLabel, NgbCheckBox, NgbRadioGroup, NgbRadio] });
NgbButtonsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbButtonsModule, decorators: [{
            type: NgModule,
            args: [{ declarations: NGB_BUTTON_DIRECTIVES, exports: NGB_BUTTON_DIRECTIVES }]
        }] });

/**
 * Defines the carousel slide transition direction.
 */
var NgbSlideEventDirection;
(function (NgbSlideEventDirection) {
    NgbSlideEventDirection["START"] = "start";
    NgbSlideEventDirection["END"] = "end";
})(NgbSlideEventDirection || (NgbSlideEventDirection = {}));
const isBeingAnimated = ({ classList }) => {
    return classList.contains('carousel-item-start') || classList.contains('carousel-item-end');
};
const removeDirectionClasses = (classList) => {
    classList.remove('carousel-item-start');
    classList.remove('carousel-item-end');
};
const removeClasses = (classList) => {
    removeDirectionClasses(classList);
    classList.remove('carousel-item-prev');
    classList.remove('carousel-item-next');
};
const ngbCarouselTransitionIn = (element, animation, { direction }) => {
    const { classList } = element;
    if (!animation) {
        removeDirectionClasses(classList);
        removeClasses(classList);
        classList.add('active');
        return;
    }
    if (isBeingAnimated(element)) {
        // Revert the transition
        removeDirectionClasses(classList);
    }
    else {
        // For the 'in' transition, a 'pre-class' is applied to the element to ensure its visibility
        classList.add('carousel-item-' + (direction === NgbSlideEventDirection.START ? 'next' : 'prev'));
        reflow(element);
        classList.add('carousel-item-' + direction);
    }
    return () => {
        removeClasses(classList);
        classList.add('active');
    };
};
const ngbCarouselTransitionOut = (element, animation, { direction }) => {
    const { classList } = element;
    if (!animation) {
        removeDirectionClasses(classList);
        removeClasses(classList);
        classList.remove('active');
        return;
    }
    //  direction is left or right, depending on the way the slide goes out.
    if (isBeingAnimated(element)) {
        // Revert the transition
        removeDirectionClasses(classList);
    }
    else {
        classList.add('carousel-item-' + direction);
    }
    return () => {
        removeClasses(classList);
        classList.remove('active');
    };
};

/**
 * A configuration service for the [NgbCarousel](#/components/carousel/api#NgbCarousel) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all carousels used in the application.
 */
class NgbCarouselConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
        this.pauseOnHover = true;
        this.pauseOnFocus = true;
        this.showNavigationArrows = true;
        this.showNavigationIndicators = true;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbCarouselConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbCarouselConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

let nextId$2 = 0;
/**
 * A directive that wraps the individual carousel slide.
 */
class NgbSlide {
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Slide id that must be unique for the entire document.
         *
         * If not provided, will be generated in the `ngb-slide-xx` format.
         */
        this.id = `ngb-slide-${nextId$2++}`;
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
class NgbCarousel {
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
NgbCarousel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarousel, deps: [{ token: NgbCarouselConfig }, { token: PLATFORM_ID }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: NgbCarouselConfig }, { type: undefined, decorators: [{
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
var NgbSlideEventSource;
(function (NgbSlideEventSource) {
    NgbSlideEventSource["TIMER"] = "timer";
    NgbSlideEventSource["ARROW_LEFT"] = "arrowLeft";
    NgbSlideEventSource["ARROW_RIGHT"] = "arrowRight";
    NgbSlideEventSource["INDICATOR"] = "indicator";
})(NgbSlideEventSource || (NgbSlideEventSource = {}));
const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];

class NgbCarouselModule {
}
NgbCarouselModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbCarouselModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselModule, declarations: [NgbCarousel, NgbSlide], imports: [CommonModule], exports: [NgbCarousel, NgbSlide] });
NgbCarouselModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCarouselModule, decorators: [{
            type: NgModule,
            args: [{ declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule] }]
        }] });

/**
 * A configuration service for the [NgbCollapse](#/components/collapse/api#NgbCollapse) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all collapses used in the application.
 */
class NgbCollapseConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbCollapseConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbCollapseConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

/**
 * A directive to provide a simple way of hiding and showing elements on the page.
 */
class NgbCollapse {
    constructor(_element, config, _zone) {
        this._element = _element;
        this._zone = _zone;
        /**
         * If `true`, will collapse the element or show it otherwise.
         */
        this.collapsed = false;
        this.ngbCollapseChange = new EventEmitter();
        /**
         * An event emitted when the collapse element is shown, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapse element is hidden, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
    }
    ngOnInit() { this._runTransition(this.collapsed, false); }
    ngOnChanges({ collapsed }) {
        if (!collapsed.firstChange) {
            this._runTransitionWithEvents(this.collapsed, this.animation);
        }
    }
    /**
     * Triggers collapsing programmatically.
     *
     * If there is a collapsing transition running already, it will be reversed.
     * If the animations are turned off this happens synchronously.
     *
     * @since 8.0.0
     */
    toggle(open = this.collapsed) {
        this.collapsed = !open;
        this.ngbCollapseChange.next(this.collapsed);
        this._runTransitionWithEvents(this.collapsed, this.animation);
    }
    _runTransition(collapsed, animation) {
        return ngbRunTransition(this._zone, this._element.nativeElement, ngbCollapsingTransition, { animation, runningTransition: 'stop', context: { direction: collapsed ? 'hide' : 'show' } });
    }
    _runTransitionWithEvents(collapsed, animation) {
        this._runTransition(collapsed, animation).subscribe(() => {
            if (collapsed) {
                this.hidden.emit();
            }
            else {
                this.shown.emit();
            }
        });
    }
}
NgbCollapse.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapse, deps: [{ token: i0.ElementRef }, { token: NgbCollapseConfig }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Directive });
NgbCollapse.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbCollapse, selector: "[ngbCollapse]", inputs: { animation: "animation", collapsed: ["ngbCollapse", "collapsed"] }, outputs: { ngbCollapseChange: "ngbCollapseChange", shown: "shown", hidden: "hidden" }, exportAs: ["ngbCollapse"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapse, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbCollapse]', exportAs: 'ngbCollapse' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: NgbCollapseConfig }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], collapsed: [{
                type: Input,
                args: ['ngbCollapse']
            }], ngbCollapseChange: [{
                type: Output
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });

class NgbCollapseModule {
}
NgbCollapseModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbCollapseModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseModule, declarations: [NgbCollapse], exports: [NgbCollapse] });
NgbCollapseModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCollapseModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] }]
        }] });

/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `NgbDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `NgbDateStruct`, but return `NgbDate`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`NgbCalendar`](#/components/datepicker/api#NgbCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 *
 * @since 3.0.0
 */
class NgbDate {
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * A **static method** that creates a new date object from the `NgbDateStruct`,
     *
     * ex. `NgbDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `NgbDate` type, the method will return the same object.
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    /**
     * Checks if the current date is equal to another date.
     */
    equals(other) {
        return other != null && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if the current date is before another date.
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if the current date is after another date.
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}

function isChangedDate(prev, next) {
    return !dateComparator(prev, next);
}
function isChangedMonth(prev, next) {
    return !prev && !next ? false : !prev || !next ? true : prev.year !== next.year || prev.month !== next.month;
}
function dateComparator(prev, next) {
    return (!prev && !next) || (!!prev && !!next && prev.equals(next));
}
function checkMinBeforeMax(minDate, maxDate) {
    if (maxDate && minDate && maxDate.before(minDate)) {
        throw new Error(`'maxDate' ${maxDate} should be greater than 'minDate' ${minDate}`);
    }
}
function checkDateInRange(date, minDate, maxDate) {
    if (date && minDate && date.before(minDate)) {
        return minDate;
    }
    if (date && maxDate && date.after(maxDate)) {
        return maxDate;
    }
    return date || null;
}
function isDateSelectable(date, state) {
    const { minDate, maxDate, disabled, markDisabled } = state;
    // clang-format off
    return !(date === null ||
        date === undefined ||
        disabled ||
        (markDisabled && markDisabled(date, { year: date.year, month: date.month })) ||
        (minDate && date.before(minDate)) ||
        (maxDate && date.after(maxDate)));
    // clang-format on
}
function generateSelectBoxMonths(calendar, date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    let months = calendar.getMonths(date.year);
    if (minDate && date.year === minDate.year) {
        const index = months.findIndex(month => month === minDate.month);
        months = months.slice(index);
    }
    if (maxDate && date.year === maxDate.year) {
        const index = months.findIndex(month => month === maxDate.month);
        months = months.slice(0, index + 1);
    }
    return months;
}
function generateSelectBoxYears(date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    const start = minDate ? Math.max(minDate.year, date.year - 500) : date.year - 10;
    const end = maxDate ? Math.min(maxDate.year, date.year + 500) : date.year + 10;
    const length = end - start + 1;
    const numbers = Array(length);
    for (let i = 0; i < length; i++) {
        numbers[i] = start + i;
    }
    return numbers;
}
function nextMonthDisabled(calendar, date, maxDate) {
    const nextDate = Object.assign(calendar.getNext(date, 'm'), { day: 1 });
    return maxDate != null && nextDate.after(maxDate);
}
function prevMonthDisabled(calendar, date, minDate) {
    const prevDate = Object.assign(calendar.getPrev(date, 'm'), { day: 1 });
    return minDate != null && (prevDate.year === minDate.year && prevDate.month < minDate.month ||
        prevDate.year < minDate.year && minDate.month === 1);
}
function buildMonths(calendar, date, state, i18n, force) {
    const { displayMonths, months } = state;
    // move old months to a temporary array
    const monthsToReuse = months.splice(0, months.length);
    // generate new first dates, nullify or reuse months
    const firstDates = Array.from({ length: displayMonths }, (_, i) => {
        const firstDate = Object.assign(calendar.getNext(date, 'm', i), { day: 1 });
        months[i] = null;
        if (!force) {
            const reusedIndex = monthsToReuse.findIndex(month => month.firstDate.equals(firstDate));
            // move reused month back to months
            if (reusedIndex !== -1) {
                months[i] = monthsToReuse.splice(reusedIndex, 1)[0];
            }
        }
        return firstDate;
    });
    // rebuild nullified months
    firstDates.forEach((firstDate, i) => {
        if (months[i] === null) {
            months[i] = buildMonth(calendar, firstDate, state, i18n, monthsToReuse.shift() || {});
        }
    });
    return months;
}
function buildMonth(calendar, date, state, i18n, month = {}) {
    const { dayTemplateData, minDate, maxDate, firstDayOfWeek, markDisabled, outsideDays, weekdayWidth, weekdaysVisible } = state;
    const calendarToday = calendar.getToday();
    month.firstDate = null;
    month.lastDate = null;
    month.number = date.month;
    month.year = date.year;
    month.weeks = month.weeks || [];
    month.weekdays = month.weekdays || [];
    date = getFirstViewDate(calendar, date, firstDayOfWeek);
    // clearing weekdays, if not visible
    if (!weekdaysVisible) {
        month.weekdays.length = 0;
    }
    // month has weeks
    for (let week = 0; week < calendar.getWeeksPerMonth(); week++) {
        let weekObject = month.weeks[week];
        if (!weekObject) {
            weekObject = month.weeks[week] = { number: 0, days: [], collapsed: true };
        }
        const days = weekObject.days;
        // week has days
        for (let day = 0; day < calendar.getDaysPerWeek(); day++) {
            if (week === 0 && weekdaysVisible) {
                month.weekdays[day] = i18n.getWeekdayLabel(calendar.getWeekday(date), weekdayWidth);
            }
            const newDate = new NgbDate(date.year, date.month, date.day);
            const nextDate = calendar.getNext(newDate);
            const ariaLabel = i18n.getDayAriaLabel(newDate);
            // marking date as disabled
            let disabled = !!((minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate)));
            if (!disabled && markDisabled) {
                disabled = markDisabled(newDate, { month: month.number, year: month.year });
            }
            // today
            let today = newDate.equals(calendarToday);
            // adding user-provided data to the context
            let contextUserData = dayTemplateData ? dayTemplateData(newDate, { month: month.number, year: month.year }) : undefined;
            // saving first date of the month
            if (month.firstDate === null && newDate.month === month.number) {
                month.firstDate = newDate;
            }
            // saving last date of the month
            if (newDate.month === month.number && nextDate.month !== month.number) {
                month.lastDate = newDate;
            }
            let dayObject = days[day];
            if (!dayObject) {
                dayObject = days[day] = {};
            }
            dayObject.date = newDate;
            dayObject.context = Object.assign(dayObject.context || {}, {
                $implicit: newDate,
                date: newDate,
                data: contextUserData,
                currentMonth: month.number,
                currentYear: month.year, disabled,
                focused: false,
                selected: false, today
            });
            dayObject.tabindex = -1;
            dayObject.ariaLabel = ariaLabel;
            dayObject.hidden = false;
            date = nextDate;
        }
        weekObject.number = calendar.getWeekNumber(days.map(day => day.date), firstDayOfWeek);
        // marking week as collapsed
        weekObject.collapsed = outsideDays === 'collapsed' && days[0].date.month !== month.number &&
            days[days.length - 1].date.month !== month.number;
    }
    return month;
}
function getFirstViewDate(calendar, date, firstDayOfWeek) {
    const daysPerWeek = calendar.getDaysPerWeek();
    const firstMonthDate = new NgbDate(date.year, date.month, 1);
    const dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
    return calendar.getPrev(firstMonthDate, 'd', (daysPerWeek + dayOfWeek - firstDayOfWeek) % daysPerWeek);
}

function fromJSDate(jsDate) {
    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
function toJSDate(date) {
    const jsDate = new Date(date.year, date.month - 1, date.day, 12);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
        jsDate.setFullYear(date.year);
    }
    return jsDate;
}
function NGB_DATEPICKER_CALENDAR_FACTORY() {
    return new NgbCalendarGregorian();
}
/**
 * A service that represents the calendar used by the datepicker.
 *
 * The default implementation uses the Gregorian calendar. You can inject it in your own
 * implementations if necessary to simplify `NgbDate` calculations.
 */
class NgbCalendar {
}
NgbCalendar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendar, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendar, providedIn: 'root', useFactory: NGB_DATEPICKER_CALENDAR_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendar, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_CALENDAR_FACTORY }]
        }] });
class NgbCalendarGregorian extends NgbCalendar {
    getDaysPerWeek() { return 7; }
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    getWeeksPerMonth() { return 6; }
    getNext(date, period = 'd', number = 1) {
        let jsDate = toJSDate(date);
        let checkMonth = true;
        let expectedMonth = jsDate.getMonth();
        switch (period) {
            case 'y':
                jsDate.setFullYear(jsDate.getFullYear() + number);
                break;
            case 'm':
                expectedMonth += number;
                jsDate.setMonth(expectedMonth);
                expectedMonth = expectedMonth % 12;
                if (expectedMonth < 0) {
                    expectedMonth = expectedMonth + 12;
                }
                break;
            case 'd':
                jsDate.setDate(jsDate.getDate() + number);
                checkMonth = false;
                break;
            default:
                return date;
        }
        if (checkMonth && jsDate.getMonth() !== expectedMonth) {
            // this means the destination month has less days than the initial month
            // let's go back to the end of the previous month:
            jsDate.setDate(0);
        }
        return fromJSDate(jsDate);
    }
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    getWeekday(date) {
        let jsDate = toJSDate(date);
        let day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        let date = week[thursdayIndex];
        const jsDate = toJSDate(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    }
    getToday() { return fromJSDate(new Date()); }
    isValid(date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        // year 0 doesn't exist in Gregorian calendar
        if (date.year === 0) {
            return false;
        }
        const jsDate = toJSDate(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
            jsDate.getDate() === date.day;
    }
}
NgbCalendarGregorian.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarGregorian, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarGregorian.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarGregorian });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarGregorian, decorators: [{
            type: Injectable
        }] });

function NGB_DATEPICKER_18N_FACTORY(locale) {
    return new NgbDatepickerI18nDefault(locale);
}
/**
 * A service supplying i18n data to the datepicker component.
 *
 * The default implementation of this service uses the Angular locale and registered locale data for
 * weekdays and month names (as explained in the Angular i18n guide).
 *
 * It also provides a way to i18n data that depends on calendar calculations, like aria labels, day, week and year
 * numerals. For other static labels the datepicker uses the default Angular i18n.
 *
 * See the [i18n demo](#/components/datepicker/examples#i18n) and
 * [Hebrew calendar demo](#/components/datepicker/calendars#hebrew) on how to extend this class and define
 * a custom provider for i18n.
 */
class NgbDatepickerI18n {
    /**
     * Returns the text label to display above the day view.
     *
     * @since 9.1.0
     */
    getMonthLabel(date) {
        return `${this.getMonthFullName(date.month, date.year)} ${this.getYearNumerals(date.year)}`;
    }
    /**
     * Returns the textual representation of a day that is rendered in a day cell.
     *
     * @since 3.0.0
     */
    getDayNumerals(date) { return `${date.day}`; }
    /**
     * Returns the textual representation of a week number rendered by datepicker.
     *
     * @since 3.0.0
     */
    getWeekNumerals(weekNumber) { return `${weekNumber}`; }
    /**
     * Returns the textual representation of a year that is rendered in the datepicker year select box.
     *
     * @since 3.0.0
     */
    getYearNumerals(year) { return `${year}`; }
    /**
     * Returns the week label to display in the heading of the month view.
     *
     * @since 9.1.0
     */
    getWeekLabel() { return ''; }
}
NgbDatepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [{ token: LOCALE_ID }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18n, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_18N_FACTORY, deps: [LOCALE_ID] }]
        }] });
/**
 * A service providing default implementation for the datepicker i18n.
 * It can be used as a base implementation if necessary.
 *
 * @since 9.1.0
 */
class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    constructor(_locale) {
        super();
        this._locale = _locale;
        this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
        this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
    }
    getWeekdayLabel(weekday, width) {
        const weekdaysStartingOnSunday = getLocaleDayNames(this._locale, FormStyle.Standalone, width === undefined ? TranslationWidth.Short : width);
        const weekdays = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);
        return weekdays[weekday - 1] || '';
    }
    getMonthShortName(month) { return this._monthsShort[month - 1] || ''; }
    getMonthFullName(month) { return this._monthsFull[month - 1] || ''; }
    getDayAriaLabel(date) {
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this._locale);
    }
}
NgbDatepickerI18nDefault.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerI18nDefault.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nDefault, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });

class NgbDatepickerService {
    constructor(_calendar, _i18n) {
        this._calendar = _calendar;
        this._i18n = _i18n;
        this._VALIDATORS = {
            dayTemplateData: (dayTemplateData) => {
                if (this._state.dayTemplateData !== dayTemplateData) {
                    return { dayTemplateData };
                }
            },
            displayMonths: (displayMonths) => {
                displayMonths = toInteger(displayMonths);
                if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
                    return { displayMonths };
                }
            },
            disabled: (disabled) => {
                if (this._state.disabled !== disabled) {
                    return { disabled };
                }
            },
            firstDayOfWeek: (firstDayOfWeek) => {
                firstDayOfWeek = toInteger(firstDayOfWeek);
                if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
                    return { firstDayOfWeek };
                }
            },
            focusVisible: (focusVisible) => {
                if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
                    return { focusVisible };
                }
            },
            markDisabled: (markDisabled) => {
                if (this._state.markDisabled !== markDisabled) {
                    return { markDisabled };
                }
            },
            maxDate: (date) => {
                const maxDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.maxDate, maxDate)) {
                    return { maxDate };
                }
            },
            minDate: (date) => {
                const minDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.minDate, minDate)) {
                    return { minDate };
                }
            },
            navigation: (navigation) => {
                if (this._state.navigation !== navigation) {
                    return { navigation };
                }
            },
            outsideDays: (outsideDays) => {
                if (this._state.outsideDays !== outsideDays) {
                    return { outsideDays };
                }
            },
            weekdays: (weekdays) => {
                const weekdayWidth = weekdays === true || weekdays === false ? TranslationWidth.Short : weekdays;
                const weekdaysVisible = weekdays === true || weekdays === false ? weekdays : true;
                if (this._state.weekdayWidth !== weekdayWidth || this._state.weekdaysVisible !== weekdaysVisible) {
                    return { weekdayWidth, weekdaysVisible };
                }
            }
        };
        this._model$ = new Subject();
        this._dateSelect$ = new Subject();
        this._state = {
            dayTemplateData: null,
            markDisabled: null,
            maxDate: null,
            minDate: null,
            disabled: false,
            displayMonths: 1,
            firstDate: null,
            firstDayOfWeek: 1,
            lastDate: null,
            focusDate: null,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectedDate: null,
            selectBoxes: { years: [], months: [] },
            weekdayWidth: TranslationWidth.Short,
            weekdaysVisible: true
        };
    }
    get model$() { return this._model$.pipe(filter(model => model.months.length > 0)); }
    get dateSelect$() { return this._dateSelect$.pipe(filter(date => date !== null)); }
    set(options) {
        let patch = Object.keys(options)
            .map(key => this._VALIDATORS[key](options[key]))
            .reduce((obj, part) => ({ ...obj, ...part }), {});
        if (Object.keys(patch).length > 0) {
            this._nextState(patch);
        }
    }
    focus(date) {
        const focusedDate = this.toValidDate(date, null);
        if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
            this._nextState({ focusDate: date });
        }
    }
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    open(date) {
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (firstDate != null && !this._state.disabled &&
            (!this._state.firstDate || isChangedMonth(this._state.firstDate, firstDate))) {
            this._nextState({ firstDate });
        }
    }
    select(date, options = {}) {
        const selectedDate = this.toValidDate(date, null);
        if (selectedDate != null && !this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._dateSelect$.next(selectedDate);
            }
        }
    }
    toValidDate(date, defaultValue) {
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    getMonth(struct) {
        for (let month of this._state.months) {
            if (struct.month === month.number && struct.year === month.year) {
                return month;
            }
        }
        throw new Error(`month ${struct.month} of year ${struct.year} not found`);
    }
    _nextState(patch) {
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex =
                        !disabled && focusDate && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden = outsideDays === 'hidden' || outsideDays === 'collapsed' ||
                            (displayMonths > 1 && day.date.after(months[0].firstDate) &&
                                day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    _updateState(patch) {
        // patching fields
        const state = Object.assign({}, this._state, patch);
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // terminate early if only focus visibility was changed
        if ('focusVisible' in patch) {
            return state;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 && state.focusDate && !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            const forceRebuild = 'dayTemplateData' in patch || 'firstDayOfWeek' in patch || 'markDisabled' in patch ||
                'minDate' in patch || 'maxDate' in patch || 'disabled' in patch || 'outsideDays' in patch ||
                'weekdaysVisible' in patch;
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months[0].firstDate;
            state.lastDate = months[months.length - 1].lastDate;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            // adjusting months/years for the select box navigation
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months =
                        generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
}
NgbDatepickerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService, deps: [{ token: NgbCalendar }, { token: NgbDatepickerI18n }], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: NgbCalendar }, { type: NgbDatepickerI18n }]; } });

// clang-format on
var NavigationEvent;
(function (NavigationEvent) {
    NavigationEvent[NavigationEvent["PREV"] = 0] = "PREV";
    NavigationEvent[NavigationEvent["NEXT"] = 1] = "NEXT";
})(NavigationEvent || (NavigationEvent = {}));

/**
 * A configuration service for the [`NgbDatepicker`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekNumbers = false;
        this.weekdays = TranslationWidth.Short;
    }
}
NgbDatepickerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

function NGB_DATEPICKER_DATE_ADAPTER_FACTORY() {
    return new NgbDateStructAdapter();
}
/**
 * An abstract service that does the conversion between the internal datepicker `NgbDateStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding datepicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default datepicker implementation assumes we use `NgbDateStruct` as a user model.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details
 * and the [custom adapter demo](#/components/datepicker/examples#adapter) for an example.
 */
class NgbDateAdapter {
}
NgbDateAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDateAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateAdapter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY }]
        }] });
class NgbDateStructAdapter extends NgbDateAdapter {
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    fromModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    toModel(date) {
        return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
            { year: date.year, month: date.month, day: date.day } :
            null;
    }
}
NgbDateStructAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateStructAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateStructAdapter, decorators: [{
            type: Injectable
        }] });

class NgbDatepickerDayView {
    constructor(i18n) {
        this.i18n = i18n;
    }
    isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
NgbDatepickerDayView.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerDayView, deps: [{ token: NgbDatepickerI18n }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerDayView.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerDayView, selector: "[ngbDatepickerDayView]", inputs: { currentMonth: "currentMonth", date: "date", disabled: "disabled", focused: "focused", selected: "selected" }, host: { properties: { "class.bg-primary": "selected", "class.text-white": "selected", "class.text-muted": "isMuted()", "class.outside": "isMuted()", "class.active": "focused" }, classAttribute: "btn-light" }, ngImport: i0, template: `{{ i18n.getDayNumerals(date) }}`, isInline: true, styles: ["[ngbDatepickerDayView]{text-align:center;width:2rem;height:2rem;line-height:2rem;border-radius:.25rem;background:transparent}[ngbDatepickerDayView].outside{opacity:.5}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerDayView, decorators: [{
            type: Component,
            args: [{ selector: '[ngbDatepickerDayView]', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        'class': 'btn-light',
                        '[class.bg-primary]': 'selected',
                        '[class.text-white]': 'selected',
                        '[class.text-muted]': 'isMuted()',
                        '[class.outside]': 'isMuted()',
                        '[class.active]': 'focused'
                    }, template: `{{ i18n.getDayNumerals(date) }}`, styles: ["[ngbDatepickerDayView]{text-align:center;width:2rem;height:2rem;line-height:2rem;border-radius:.25rem;background:transparent}[ngbDatepickerDayView].outside{opacity:.5}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbDatepickerI18n }]; }, propDecorators: { currentMonth: [{
                type: Input
            }], date: [{
                type: Input
            }], disabled: [{
                type: Input
            }], focused: [{
                type: Input
            }], selected: [{
                type: Input
            }] } });

class NgbDatepickerNavigationSelect {
    constructor(i18n, _renderer) {
        this.i18n = i18n;
        this._renderer = _renderer;
        this.select = new EventEmitter();
        this._month = -1;
        this._year = -1;
    }
    changeMonth(month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }
    changeYear(year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
    ngAfterViewChecked() {
        if (this.date) {
            if (this.date.month !== this._month) {
                this._month = this.date.month;
                this._renderer.setProperty(this.monthSelect.nativeElement, 'value', this._month);
            }
            if (this.date.year !== this._year) {
                this._year = this.date.year;
                this._renderer.setProperty(this.yearSelect.nativeElement, 'value', this._year);
            }
        }
    }
}
NgbDatepickerNavigationSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigationSelect, deps: [{ token: NgbDatepickerI18n }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerNavigationSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerNavigationSelect, selector: "ngb-datepicker-navigation-select", inputs: { date: "date", disabled: "disabled", months: "months", years: "years" }, outputs: { select: "select" }, viewQueries: [{ propertyName: "monthSelect", first: true, predicate: ["month"], descendants: true, read: ElementRef, static: true }, { propertyName: "yearSelect", first: true, predicate: ["year"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: `
    <select #month
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-month" aria-label="Select month"
      i18n-title="@@ngb.datepicker.select-month" title="Select month"
      (change)="changeMonth($any($event).target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select #year
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-year" aria-label="Select year"
      i18n-title="@@ngb.datepicker.select-year" title="Select year"
      (change)="changeYear($any($event).target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `, isInline: true, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"], directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { type: i3.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigationSelect, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-navigation-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
    <select #month
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-month" aria-label="Select month"
      i18n-title="@@ngb.datepicker.select-month" title="Select month"
      (change)="changeMonth($any($event).target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select #year
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-year" aria-label="Select year"
      i18n-title="@@ngb.datepicker.select-year" title="Select year"
      (change)="changeYear($any($event).target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbDatepickerI18n }, { type: i0.Renderer2 }]; }, propDecorators: { date: [{
                type: Input
            }], disabled: [{
                type: Input
            }], months: [{
                type: Input
            }], years: [{
                type: Input
            }], select: [{
                type: Output
            }], monthSelect: [{
                type: ViewChild,
                args: ['month', { static: true, read: ElementRef }]
            }], yearSelect: [{
                type: ViewChild,
                args: ['year', { static: true, read: ElementRef }]
            }] } });

class NgbDatepickerNavigation {
    constructor(i18n) {
        this.i18n = i18n;
        this.navigation = NavigationEvent;
        this.months = [];
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
    onClickPrev(event) {
        event.currentTarget.focus();
        this.navigate.emit(this.navigation.PREV);
    }
    onClickNext(event) {
        event.currentTarget.focus();
        this.navigate.emit(this.navigation.NEXT);
    }
}
NgbDatepickerNavigation.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigation, deps: [{ token: NgbDatepickerI18n }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerNavigation.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerNavigation, selector: "ngb-datepicker-navigation", inputs: { date: "date", disabled: "disabled", months: "months", showSelect: "showSelect", prevDisabled: "prevDisabled", nextDisabled: "nextDisabled", selectBoxes: "selectBoxes" }, outputs: { navigate: "navigate", select: "select" }, ngImport: i0, template: `
    <div class="ngb-dp-arrow">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickPrev($event)" [disabled]="prevDisabled"
              i18n-aria-label="@@ngb.datepicker.previous-month" aria-label="Previous month"
              i18n-title="@@ngb.datepicker.previous-month" title="Previous month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="ngb-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </ngb-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
      <div class="ngb-dp-month-name">
        {{ i18n.getMonthLabel(month.firstDate) }}
      </div>
      <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="ngb-dp-arrow right">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickNext($event)" [disabled]="nextDisabled"
              i18n-aria-label="@@ngb.datepicker.next-month" aria-label="Next month"
              i18n-title="@@ngb.datepicker.next-month" title="Next month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    `, isInline: true, styles: ["ngb-datepicker-navigation{display:flex;align-items:center}.ngb-dp-navigation-chevron{border-style:solid;border-width:.2em .2em 0 0;display:inline-block;width:.75em;height:.75em;margin-left:.25em;margin-right:.15em;transform:rotate(-135deg)}.ngb-dp-arrow{display:flex;flex:1 1 auto;padding-right:0;padding-left:0;margin:0;width:2rem;height:2rem}.ngb-dp-arrow.right{justify-content:flex-end}.ngb-dp-arrow.right .ngb-dp-navigation-chevron{transform:rotate(45deg);margin-left:.15em;margin-right:.25em}.ngb-dp-arrow-btn{padding:0 .25rem;margin:0 .5rem;border:none;background-color:transparent;z-index:1}.ngb-dp-arrow-btn:focus{outline-width:1px;outline-style:auto}@media all and (-ms-high-contrast: none),(-ms-high-contrast: active){.ngb-dp-arrow-btn:focus{outline-style:solid}}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center}.ngb-dp-navigation-select{display:flex;flex:1 1 9rem}\n"], components: [{ type: NgbDatepickerNavigationSelect, selector: "ngb-datepicker-navigation-select", inputs: ["date", "disabled", "months", "years"], outputs: ["select"] }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigation, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-navigation', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
    <div class="ngb-dp-arrow">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickPrev($event)" [disabled]="prevDisabled"
              i18n-aria-label="@@ngb.datepicker.previous-month" aria-label="Previous month"
              i18n-title="@@ngb.datepicker.previous-month" title="Previous month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="ngb-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </ngb-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
      <div class="ngb-dp-month-name">
        {{ i18n.getMonthLabel(month.firstDate) }}
      </div>
      <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="ngb-dp-arrow right">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="onClickNext($event)" [disabled]="nextDisabled"
              i18n-aria-label="@@ngb.datepicker.next-month" aria-label="Next month"
              i18n-title="@@ngb.datepicker.next-month" title="Next month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    `, styles: ["ngb-datepicker-navigation{display:flex;align-items:center}.ngb-dp-navigation-chevron{border-style:solid;border-width:.2em .2em 0 0;display:inline-block;width:.75em;height:.75em;margin-left:.25em;margin-right:.15em;transform:rotate(-135deg)}.ngb-dp-arrow{display:flex;flex:1 1 auto;padding-right:0;padding-left:0;margin:0;width:2rem;height:2rem}.ngb-dp-arrow.right{justify-content:flex-end}.ngb-dp-arrow.right .ngb-dp-navigation-chevron{transform:rotate(45deg);margin-left:.15em;margin-right:.25em}.ngb-dp-arrow-btn{padding:0 .25rem;margin:0 .5rem;border:none;background-color:transparent;z-index:1}.ngb-dp-arrow-btn:focus{outline-width:1px;outline-style:auto}@media all and (-ms-high-contrast: none),(-ms-high-contrast: active){.ngb-dp-arrow-btn:focus{outline-style:solid}}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center}.ngb-dp-navigation-select{display:flex;flex:1 1 9rem}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbDatepickerI18n }]; }, propDecorators: { date: [{
                type: Input
            }], disabled: [{
                type: Input
            }], months: [{
                type: Input
            }], showSelect: [{
                type: Input
            }], prevDisabled: [{
                type: Input
            }], nextDisabled: [{
                type: Input
            }], selectBoxes: [{
                type: Input
            }], navigate: [{
                type: Output
            }], select: [{
                type: Output
            }] } });

var Key;
(function (Key) {
    Key[Key["Tab"] = 9] = "Tab";
    Key[Key["Enter"] = 13] = "Enter";
    Key[Key["Escape"] = 27] = "Escape";
    Key[Key["Space"] = 32] = "Space";
    Key[Key["PageUp"] = 33] = "PageUp";
    Key[Key["PageDown"] = 34] = "PageDown";
    Key[Key["End"] = 35] = "End";
    Key[Key["Home"] = 36] = "Home";
    Key[Key["ArrowLeft"] = 37] = "ArrowLeft";
    Key[Key["ArrowUp"] = 38] = "ArrowUp";
    Key[Key["ArrowRight"] = 39] = "ArrowRight";
    Key[Key["ArrowDown"] = 40] = "ArrowDown";
})(Key || (Key = {}));

/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/datepicker/overview#keyboard-shortcuts)
 *
 * @since 5.2.0
 */
class NgbDatepickerKeyboardService {
    /**
     * Processes a keyboard event.
     */
    processKey(event, datepicker) {
        const { state, calendar } = datepicker;
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.PageUp:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case Key.PageDown:
                datepicker.focusDate(calendar.getNext(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case Key.End:
                datepicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
                break;
            case Key.Home:
                datepicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
                break;
            case Key.ArrowLeft:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', 1));
                break;
            case Key.ArrowUp:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case Key.ArrowRight:
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', 1));
                break;
            case Key.ArrowDown:
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case Key.Enter:
            case Key.Space:
                datepicker.focusSelect();
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
}
NgbDatepickerKeyboardService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerKeyboardService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * A directive that marks the content template that customizes the way datepicker months are displayed
 *
 * @since 5.3.0
 */
class NgbDatepickerContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbDatepickerContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerContent, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDatepickerContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerContent, selector: "ng-template[ngbDatepickerContent]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbDatepickerContent]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A highly configurable component that helps you with selecting calendar dates.
 *
 * `NgbDatepicker` is meant to be displayed inline on a page or put inside a popup.
 */
class NgbDatepicker {
    constructor(_service, _calendar, i18n, config, cd, _elementRef, _ngbDateAdapter, _ngZone) {
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this._elementRef = _elementRef;
        this._ngbDateAdapter = _ngbDateAdapter;
        this._ngZone = _ngZone;
        this._controlValue = null;
        this._destroyed$ = new Subject();
        this._publicState = {};
        /**
         * An event emitted right before the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 5.2.0
         */
        this.dateSelect = new EventEmitter();
        this.onChange = (_) => { };
        this.onTouched = () => { };
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showWeekNumbers', 'startDate', 'weekdays']
            .forEach(input => this[input] = config[input]);
        _service.dateSelect$.pipe(takeUntil(this._destroyed$)).subscribe(date => { this.dateSelect.emit(date); });
        _service.model$.pipe(takeUntil(this._destroyed$)).subscribe(model => {
            const newDate = model.firstDate;
            const oldDate = this.model ? this.model.firstDate : null;
            // update public state
            this._publicState = {
                maxDate: model.maxDate,
                minDate: model.minDate,
                firstDate: model.firstDate,
                lastDate: model.lastDate,
                focusedDate: model.focusDate,
                months: model.months.map(viewModel => viewModel.firstDate)
            };
            let navigationPrevented = false;
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                    next: { year: newDate.year, month: newDate.month },
                    preventDefault: () => navigationPrevented = true
                });
                // can't prevent the very first navigation
                if (navigationPrevented && oldDate !== null) {
                    this._service.open(oldDate);
                    return;
                }
            }
            const newSelectedDate = model.selectedDate;
            const newFocusedDate = model.focusDate;
            const oldFocusedDate = this.model ? this.model.focusDate : null;
            this.model = model;
            // handling selection change
            if (isChangedDate(newSelectedDate, this._controlValue)) {
                this._controlValue = newSelectedDate;
                this.onTouched();
                this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
            }
            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }
            cd.markForCheck();
        });
    }
    /**
     *  Returns the readonly public state of the datepicker
     *
     * @since 5.2.0
     */
    get state() { return this._publicState; }
    /**
     *  Returns the calendar service used in the specific datepicker instance.
     *
     *  @since 5.3.0
     */
    get calendar() { return this._calendar; }
    /**
     *  Focuses on given date.
     */
    focusDate(date) { this._service.focus(NgbDate.from(date)); }
    /**
     *  Selects focused date.
     */
    focusSelect() { this._service.focusSelect(); }
    focus() {
        this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            const elementToFocus = this._elementRef.nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]');
            if (elementToFocus) {
                elementToFocus.focus();
            }
        });
    }
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date) {
        this._service.open(NgbDate.from(date ? date.day ? date : { ...date, day: 1 } : null));
    }
    ngAfterViewInit() {
        this._ngZone.runOutsideAngular(() => {
            const focusIns$ = fromEvent(this._contentEl.nativeElement, 'focusin');
            const focusOuts$ = fromEvent(this._contentEl.nativeElement, 'focusout');
            const { nativeElement } = this._elementRef;
            // we're changing 'focusVisible' only when entering or leaving months view
            // and ignoring all focus events where both 'target' and 'related' target are day cells
            merge(focusIns$, focusOuts$)
                .pipe(filter(({ target, relatedTarget }) => !(hasClassName(target, 'ngb-dp-day') && hasClassName(relatedTarget, 'ngb-dp-day') &&
                nativeElement.contains(target) && nativeElement.contains(relatedTarget))), takeUntil(this._destroyed$))
                .subscribe(({ type }) => this._ngZone.run(() => this._service.set({ focusVisible: type === 'focusin' })));
        });
    }
    ngOnDestroy() { this._destroyed$.next(); }
    ngOnInit() {
        if (this.model === undefined) {
            const inputs = {};
            ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate',
                'outsideDays', 'weekdays']
                .forEach(name => inputs[name] = this[name]);
            this._service.set(inputs);
            this.navigateTo(this.startDate);
        }
        if (!this.dayTemplate) {
            this.dayTemplate = this._defaultDayTemplate;
        }
    }
    ngOnChanges(changes) {
        const inputs = {};
        ['dayTemplateData', 'displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate',
            'outsideDays', 'weekdays']
            .filter(name => name in changes)
            .forEach(name => inputs[name] = this[name]);
        this._service.set(inputs);
        if ('startDate' in changes) {
            const { currentValue, previousValue } = changes.startDate;
            if (isChangedMonth(previousValue, currentValue)) {
                this.navigateTo(this.startDate);
            }
        }
    }
    onDateSelect(date) {
        this._service.focus(date);
        this._service.select(date, { emitEvent: true });
    }
    onNavigateDateSelect(date) { this._service.open(date); }
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(disabled) { this._service.set({ disabled }); }
    writeValue(value) {
        this._controlValue = NgbDate.from(this._ngbDateAdapter.fromModel(value));
        this._service.select(this._controlValue);
    }
}
NgbDatepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepicker, deps: [{ token: NgbDatepickerService }, { token: NgbCalendar }, { token: NgbDatepickerI18n }, { token: NgbDatepickerConfig }, { token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: NgbDateAdapter }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepicker, selector: "ngb-datepicker", inputs: { dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", maxDate: "maxDate", minDate: "minDate", navigation: "navigation", outsideDays: "outsideDays", showWeekNumbers: "showWeekNumbers", startDate: "startDate", weekdays: "weekdays" }, outputs: { navigate: "navigate", dateSelect: "dateSelect" }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true }, NgbDatepickerService], queries: [{ propertyName: "contentTemplate", first: true, predicate: NgbDatepickerContent, descendants: true, static: true }], viewQueries: [{ propertyName: "_defaultDayTemplate", first: true, predicate: ["defaultDayTemplate"], descendants: true, static: true }, { propertyName: "_contentEl", first: true, predicate: ["content"], descendants: true, static: true }], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #defaultDayTemplate let-date="date" let-currentMonth="currentMonth" let-selected="selected"
                 let-disabled="disabled" let-focused="focused">
      <div ngbDatepickerDayView
        [date]="date"
        [currentMonth]="currentMonth"
        [selected]="selected"
        [disabled]="disabled"
        [focused]="focused">
      </div>
    </ng-template>

    <ng-template #defaultContentTemplate>
      <div *ngFor="let month of model.months; let i = index;" class="ngb-dp-month">
        <div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="ngb-dp-month-name">
          {{ i18n.getMonthLabel(month.firstDate) }}
        </div>
        <ngb-datepicker-month [month]="month.firstDate"></ngb-datepicker-month>
      </div>
    </ng-template>

    <div class="ngb-dp-header">
      <ngb-datepicker-navigation *ngIf="navigation !== 'none'"
        [date]="model.firstDate!"
        [months]="model.months"
        [disabled]="model.disabled"
        [showSelect]="model.navigation === 'select'"
        [prevDisabled]="model.prevDisabled"
        [nextDisabled]="model.nextDisabled"
        [selectBoxes]="model.selectBoxes"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
      <ng-template [ngTemplateOutlet]="contentTemplate?.templateRef || defaultContentTemplate"></ng-template>
    </div>

    <ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
  `, isInline: true, styles: ["ngb-datepicker{border:1px solid #dfdfdf;border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"], components: [{ type: i0.forwardRef(function () { return NgbDatepickerDayView; }), selector: "[ngbDatepickerDayView]", inputs: ["currentMonth", "date", "disabled", "focused", "selected"] }, { type: i0.forwardRef(function () { return NgbDatepickerMonth; }), selector: "ngb-datepicker-month", inputs: ["month"] }, { type: i0.forwardRef(function () { return NgbDatepickerNavigation; }), selector: "ngb-datepicker-navigation", inputs: ["date", "disabled", "months", "showSelect", "prevDisabled", "nextDisabled", "selectBoxes"], outputs: ["navigate", "select"] }], directives: [{ type: i0.forwardRef(function () { return i2.NgForOf; }), selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i0.forwardRef(function () { return i2.NgIf; }), selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i0.forwardRef(function () { return i2.NgTemplateOutlet; }), selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepicker, decorators: [{
            type: Component,
            args: [{ exportAs: 'ngbDatepicker', selector: 'ngb-datepicker', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
    <ng-template #defaultDayTemplate let-date="date" let-currentMonth="currentMonth" let-selected="selected"
                 let-disabled="disabled" let-focused="focused">
      <div ngbDatepickerDayView
        [date]="date"
        [currentMonth]="currentMonth"
        [selected]="selected"
        [disabled]="disabled"
        [focused]="focused">
      </div>
    </ng-template>

    <ng-template #defaultContentTemplate>
      <div *ngFor="let month of model.months; let i = index;" class="ngb-dp-month">
        <div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')" class="ngb-dp-month-name">
          {{ i18n.getMonthLabel(month.firstDate) }}
        </div>
        <ngb-datepicker-month [month]="month.firstDate"></ngb-datepicker-month>
      </div>
    </ng-template>

    <div class="ngb-dp-header">
      <ngb-datepicker-navigation *ngIf="navigation !== 'none'"
        [date]="model.firstDate!"
        [months]="model.months"
        [disabled]="model.disabled"
        [showSelect]="model.navigation === 'select'"
        [prevDisabled]="model.prevDisabled"
        [nextDisabled]="model.nextDisabled"
        [selectBoxes]="model.selectBoxes"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-content" [class.ngb-dp-months]="!contentTemplate" #content>
      <ng-template [ngTemplateOutlet]="contentTemplate?.templateRef || defaultContentTemplate"></ng-template>
    </div>

    <ng-template [ngTemplateOutlet]="footerTemplate"></ng-template>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbDatepicker), multi: true }, NgbDatepickerService], styles: ["ngb-datepicker{border:1px solid #dfdfdf;border-radius:.25rem;display:inline-block}ngb-datepicker-month{pointer-events:auto}ngb-datepicker.dropdown-menu{padding:0}.ngb-dp-body{z-index:1055}.ngb-dp-header{border-bottom:0;border-radius:.25rem .25rem 0 0;padding-top:.25rem;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-months{display:flex}.ngb-dp-month{pointer-events:none}.ngb-dp-month-name{font-size:larger;height:2rem;line-height:2rem;text-align:center;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-month+.ngb-dp-month .ngb-dp-month-name,.ngb-dp-month+.ngb-dp-month .ngb-dp-week{padding-left:1rem}.ngb-dp-month:last-child .ngb-dp-week{padding-right:.25rem}.ngb-dp-month:first-child .ngb-dp-week{padding-left:.25rem}.ngb-dp-month .ngb-dp-week:last-child{padding-bottom:.25rem}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbDatepickerService }, { type: NgbCalendar }, { type: NgbDatepickerI18n }, { type: NgbDatepickerConfig }, { type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: NgbDateAdapter }, { type: i0.NgZone }]; }, propDecorators: { _defaultDayTemplate: [{
                type: ViewChild,
                args: ['defaultDayTemplate', { static: true }]
            }], _contentEl: [{
                type: ViewChild,
                args: ['content', { static: true }]
            }], contentTemplate: [{
                type: ContentChild,
                args: [NgbDatepickerContent, { static: true }]
            }], dayTemplate: [{
                type: Input
            }], dayTemplateData: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], markDisabled: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], minDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], navigate: [{
                type: Output
            }], dateSelect: [{
                type: Output
            }] } });
/**
 * A component that renders one month including all the days, weekdays and week numbers. Can be used inside
 * the `<ng-template ngbDatepickerMonths></ng-template>` when you want to customize months layout.
 *
 * For a usage example, see [custom month layout demo](#/components/datepicker/examples#custommonth)
 *
 * @since 5.3.0
 */
class NgbDatepickerMonth {
    constructor(i18n, datepicker, _keyboardService, _service) {
        this.i18n = i18n;
        this.datepicker = datepicker;
        this._keyboardService = _keyboardService;
        this._service = _service;
    }
    /**
     * The first date of month to be rendered.
     *
     * This month must one of the months present in the
     * [datepicker state](#/components/datepicker/api#NgbDatepickerState).
     */
    set month(month) {
        this.viewModel = this._service.getMonth(month);
    }
    onKeyDown(event) { this._keyboardService.processKey(event, this.datepicker); }
    doSelect(day) {
        if (!day.context.disabled && !day.hidden) {
            this.datepicker.onDateSelect(day.date);
        }
    }
}
NgbDatepickerMonth.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerMonth, deps: [{ token: NgbDatepickerI18n }, { token: NgbDatepicker }, { token: NgbDatepickerKeyboardService }, { token: NgbDatepickerService }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerMonth.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerMonth, selector: "ngb-datepicker-month", inputs: { month: "month" }, host: { attributes: { "role": "grid" }, listeners: { "keydown": "onKeyDown($event)" } }, ngImport: i0, template: `
    <div *ngIf="viewModel.weekdays.length > 0" class="ngb-dp-week ngb-dp-weekdays" role="row">
      <div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek small">{{ i18n.getWeekLabel() }}</div>
      <div *ngFor="let weekday of viewModel.weekdays" class="ngb-dp-weekday small" role="columnheader">{{ weekday }}</div>
    </div>
    <ng-template ngFor let-week [ngForOf]="viewModel.weeks">
      <div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
        <div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day); $event.preventDefault()" class="ngb-dp-day" role="gridcell"
             [class.disabled]="day.context.disabled"
             [tabindex]="day.tabindex"
             [class.hidden]="day.hidden"
             [class.ngb-dp-today]="day.context.today"
             [attr.aria-label]="day.ariaLabel">
          <ng-template [ngIf]="!day.hidden">
            <ng-template [ngTemplateOutlet]="datepicker.dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `, isInline: true, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:#0dcaf0;color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid rgba(0,0,0,.125);border-radius:0;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerMonth, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-month', host: { 'role': 'grid', '(keydown)': 'onKeyDown($event)' }, encapsulation: ViewEncapsulation.None, template: `
    <div *ngIf="viewModel.weekdays.length > 0" class="ngb-dp-week ngb-dp-weekdays" role="row">
      <div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek small">{{ i18n.getWeekLabel() }}</div>
      <div *ngFor="let weekday of viewModel.weekdays" class="ngb-dp-weekday small" role="columnheader">{{ weekday }}</div>
    </div>
    <ng-template ngFor let-week [ngForOf]="viewModel.weeks">
      <div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
        <div *ngIf="datepicker.showWeekNumbers" class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day); $event.preventDefault()" class="ngb-dp-day" role="gridcell"
             [class.disabled]="day.context.disabled"
             [tabindex]="day.tabindex"
             [class.hidden]="day.hidden"
             [class.ngb-dp-today]="day.context.today"
             [attr.aria-label]="day.ariaLabel">
          <ng-template [ngIf]="!day.hidden">
            <ng-template [ngTemplateOutlet]="datepicker.dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `, styles: ["ngb-datepicker-month{display:block}.ngb-dp-weekday,.ngb-dp-week-number{line-height:2rem;text-align:center;font-style:italic}.ngb-dp-weekday{color:#0dcaf0;color:var(--bs-info)}.ngb-dp-week{border-radius:.25rem;display:flex}.ngb-dp-weekdays{border-bottom:1px solid rgba(0,0,0,.125);border-radius:0;background-color:#f8f9fa;background-color:var(--bs-light)}.ngb-dp-day,.ngb-dp-weekday,.ngb-dp-week-number{width:2rem;height:2rem}.ngb-dp-day{cursor:pointer}.ngb-dp-day.disabled,.ngb-dp-day.hidden{cursor:default;pointer-events:none}.ngb-dp-day[tabindex=\"0\"]{z-index:1}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbDatepickerI18n }, { type: NgbDatepicker }, { type: NgbDatepickerKeyboardService }, { type: NgbDatepickerService }]; }, propDecorators: { month: [{
                type: Input
            }] } });

const isContainedIn = (element, array) => array ? array.some(item => item.contains(element)) : false;
const matchesSelectorIfAny = (element, selector) => !selector || closest(element, selector) != null;
// we have to add a more significant delay to avoid re-opening when handling (click) on a toggling element
// TODO: use proper Angular platform detection when NgbAutoClose becomes a service and we can inject PLATFORM_ID
const isMobile = (() => {
    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    const isAndroid = () => /Android/.test(navigator.userAgent);
    return typeof navigator !== 'undefined' ? !!navigator.userAgent && (isIOS() || isAndroid()) : false;
})();
// setting 'ngbAutoClose' synchronously on mobile results in immediate popup closing
// when tapping on the triggering element
const wrapAsyncForMobile = fn => isMobile ? () => setTimeout(() => fn(), 100) : fn;
function ngbAutoClose(zone, document, type, close, closed$, insideElements, ignoreElements, insideSelector) {
    // closing on ESC and outside clicks
    if (type) {
        zone.runOutsideAngular(wrapAsyncForMobile(() => {
            const shouldCloseOnClick = (event) => {
                const element = event.target;
                if (event.button === 2 || isContainedIn(element, ignoreElements)) {
                    return false;
                }
                if (type === 'inside') {
                    return isContainedIn(element, insideElements) && matchesSelectorIfAny(element, insideSelector);
                }
                else if (type === 'outside') {
                    return !isContainedIn(element, insideElements);
                }
                else /* if (type === true) */ {
                    return matchesSelectorIfAny(element, insideSelector) || !isContainedIn(element, insideElements);
                }
            };
            const escapes$ = fromEvent(document, 'keydown')
                .pipe(takeUntil(closed$), 
            /* eslint-disable-next-line deprecation/deprecation */
            filter(e => e.which === Key.Escape), tap(e => e.preventDefault()));
            // we have to pre-calculate 'shouldCloseOnClick' on 'mousedown',
            // because on 'mouseup' DOM nodes might be detached
            const mouseDowns$ = fromEvent(document, 'mousedown').pipe(map(shouldCloseOnClick), takeUntil(closed$));
            const closeableClicks$ = fromEvent(document, 'mouseup')
                .pipe(withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose), delay(0), takeUntil(closed$));
            race([
                escapes$.pipe(map(_ => 0 /* ESCAPE */)), closeableClicks$.pipe(map(_ => 1 /* CLICK */))
            ]).subscribe((source) => zone.run(() => close(source)));
        }));
    }
}

const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');
/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 */
function getFocusableBoundaryElements(element) {
    const list = Array.from(element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR))
        .filter(el => el.tabIndex !== -1);
    return [list[0], list[list.length - 1]];
}
/**
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * @param zone Angular zone
 * @param element The element around which focus will be trapped inside
 * @param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
 * @param refocusOnClick Put the focus back to the last focused element whenever a click occurs on element (default to
 * false)
 */
const ngbFocusTrap = (zone, element, stopFocusTrap$, refocusOnClick = false) => {
    zone.runOutsideAngular(() => {
        // last focused element
        const lastFocusedElement$ = fromEvent(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map(e => e.target));
        // 'tab' / 'shift+tab' stream
        fromEvent(element, 'keydown')
            .pipe(takeUntil(stopFocusTrap$), 
        /* eslint-disable-next-line deprecation/deprecation */
        filter(e => e.which === Key.Tab), withLatestFrom(lastFocusedElement$))
            .subscribe(([tabEvent, focusedElement]) => {
            const [first, last] = getFocusableBoundaryElements(element);
            if ((focusedElement === first || focusedElement === element) && tabEvent.shiftKey) {
                last.focus();
                tabEvent.preventDefault();
            }
            if (focusedElement === last && !tabEvent.shiftKey) {
                first.focus();
                tabEvent.preventDefault();
            }
        });
        // inside click
        if (refocusOnClick) {
            fromEvent(element, 'click')
                .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map(arr => arr[1]))
                .subscribe(lastFocusedElement => lastFocusedElement.focus());
        }
    });
};

const placementSeparator = /\s+/;
const spacesRegExp = /  +/gi;
const startPrimaryPlacement = /^start/;
const endPrimaryPlacement = /^end/;
const startSecondaryPlacement = /-(top|left)$/;
const endSecondaryPlacement = /-(bottom|right)$/;
function getPopperClassPlacement(placement) {
    const newPlacement = placement.replace(startPrimaryPlacement, 'left')
        .replace(endPrimaryPlacement, 'right')
        .replace(startSecondaryPlacement, '-start')
        .replace(endSecondaryPlacement, '-end');
    return newPlacement;
}
const popperStartPrimaryPlacement = /^left/;
const popperEndPrimaryPlacement = /^right/;
const popperStartSecondaryPlacement = /^start/;
const popperEndSecondaryPlacement = /^end/;
function getBootstrapBaseClassPlacement(baseClass, placement) {
    let [primary, secondary] = placement.split('-');
    const newPrimary = primary.replace(popperStartPrimaryPlacement, 'start').replace(popperEndPrimaryPlacement, 'end');
    let classnames = [newPrimary];
    if (secondary) {
        let newSecondary = secondary;
        if (primary === 'left' || primary === 'right') {
            newSecondary =
                newSecondary.replace(popperStartSecondaryPlacement, 'top').replace(popperEndSecondaryPlacement, 'bottom');
        }
        classnames.push(`${newPrimary}-${newSecondary}`);
    }
    if (baseClass) {
        classnames = classnames.map((classname) => `${baseClass}-${classname}`);
    }
    return classnames.join(' ');
}
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'start', 'end',
 *   'top-start', 'top-end',
 *   'bottom-start', 'bottom-end',
 *   'start-top', 'start-bottom',
 *   'end-top', 'end-bottom'.
 * */
function getPopperOptions({ placement, baseClass }) {
    let placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
    // No need to consider left and right here, as start and end are enough, and it is used for 'auto' placement only
    const allowedPlacements = [
        'top', 'bottom', 'start', 'end', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'start-top', 'start-bottom',
        'end-top', 'end-bottom'
    ];
    // replace auto placement with other placements
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        allowedPlacements.forEach(function (obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, obj);
            }
        });
    }
    const popperPlacements = placementVals.map((_placement) => { return getPopperClassPlacement(_placement); });
    let mainPlacement = popperPlacements.shift();
    const bsModifier = {
        name: 'bootstrapClasses',
        enabled: !!baseClass,
        phase: 'write',
        fn({ state }) {
            const bsClassRegExp = new RegExp(baseClass + '-[a-z]+', 'gi');
            const popperElement = state.elements.popper;
            const popperPlacement = state.placement;
            let className = popperElement.className;
            // Remove old bootstrap classes
            className = className.replace(bsClassRegExp, '');
            // Add current placements
            className += ` ${getBootstrapBaseClassPlacement(baseClass, popperPlacement)}`;
            // Remove multiple spaces
            className = className.trim().replace(spacesRegExp, ' ');
            // Reassign
            popperElement.className = className;
        },
    };
    return {
        placement: mainPlacement,
        modifiers: [
            bsModifier,
            flip,
            preventOverflow,
            arrow,
            {
                enabled: true,
                name: 'flip',
                options: {
                    fallbackPlacements: popperPlacements,
                },
            },
            {
                enabled: true,
                name: 'preventOverflow',
                phase: 'main',
                fn: function () { },
            },
        ]
    };
}
function noop(arg) {
    return arg;
}
function ngbPositioning() {
    let popperInstance = null;
    return {
        createPopper(positioningOption) {
            if (!popperInstance) {
                const updatePopperOptions = positioningOption.updatePopperOptions || noop;
                let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
                popperInstance =
                    createPopperLite(positioningOption.hostElement, positioningOption.targetElement, popperOptions);
            }
        },
        update() {
            if (popperInstance) {
                popperInstance.update();
            }
        },
        setOptions(positioningOption) {
            if (popperInstance) {
                const updatePopperOptions = positioningOption.updatePopperOptions || noop;
                let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
                popperInstance.setOptions(popperOptions);
            }
        },
        destroy() {
            if (popperInstance) {
                popperInstance.destroy();
                popperInstance = null;
            }
        }
    };
}

/**
 * A configuration service for the [`NgbDatepickerInput`](#/components/datepicker/api#NgbDatepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepicker inputs used in the application.
 *
 * @since 5.2.0
 */
class NgbInputDatepickerConfig extends NgbDatepickerConfig {
    constructor() {
        super(...arguments);
        this.autoClose = true;
        this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
        this.restoreFocus = true;
    }
}
NgbInputDatepickerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbInputDatepickerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

function addPopperOffset(offset$1) {
    return (options) => {
        options.modifiers.push(offset, {
            name: 'offset',
            options: {
                offset: () => offset$1,
            },
        });
        return options;
    };
}

function NGB_DATEPICKER_PARSER_FORMATTER_FACTORY() {
    return new NgbDateISOParserFormatter();
}
/**
 * An abstract service for parsing and formatting dates for the
 * [`NgbInputDatepicker`](#/components/datepicker/api#NgbInputDatepicker) directive.
 * Converts between the internal `NgbDateStruct` model presentation and a `string` that is displayed in the
 * input element.
 *
 * When user types something in the input this service attempts to parse it into a `NgbDateStruct` object.
 * And vice versa, when users selects a date in the calendar with the mouse, it must be displayed as a `string`
 * in the input.
 *
 * Default implementation uses the ISO 8601 format, but you can provide another implementation via DI
 * to use an alternative string format or a custom parsing logic.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 */
class NgbDateParserFormatter {
}
NgbDateParserFormatter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDateParserFormatter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, providedIn: 'root', useFactory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateParserFormatter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_PARSER_FORMATTER_FACTORY }]
        }] });
class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    parse(value) {
        if (value != null) {
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    }
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}
NgbDateISOParserFormatter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateISOParserFormatter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateISOParserFormatter, decorators: [{
            type: Injectable
        }] });

/**
 * A directive that allows to stick a datepicker popup to an input field.
 *
 * Manages interaction with the input field itself, does value formatting and provides forms integration.
 */
class NgbInputDatepicker {
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _ngZone, _calendar, _dateAdapter, _document, _changeDetector, config) {
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._changeDetector = _changeDetector;
        this._cRef = null;
        this._disabled = false;
        this._elWithFocus = null;
        this._model = null;
        this._positioning = ngbPositioning();
        this._destroyCloseHandlers$ = new Subject();
        /**
         * An event emitted when user selects a date using keyboard or mouse.
         *
         * The payload of the event is currently selected `NgbDate`.
         *
         * @since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * Event emitted right after the navigation happens and displayed month changes.
         *
         * See [`NgbDatepickerNavigateEvent`](#/components/datepicker/api#NgbDatepickerNavigateEvent) for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired after closing datepicker window.
         *
         * @since 4.2.0
         */
        this.closed = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        ['autoClose', 'container', 'positionTarget', 'placement'].forEach(input => this[input] = config[input]);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => this._positioning.update());
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    registerOnValidatorChange(fn) { this._validatorChange = fn; }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    validate(c) {
        const { value } = c;
        if (value != null) {
            const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
            if (!ngbDate) {
                return { 'ngbDate': { invalid: value } };
            }
            if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
                return { 'ngbDate': { minDate: { minDate: this.minDate, actual: value } } };
            }
            if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
                return { 'ngbDate': { maxDate: { maxDate: this.maxDate, actual: value } } };
            }
        }
        return null;
    }
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    manualDateChange(value, updateView = false) {
        const inputValueChanged = value !== this._inputValue;
        if (inputValueChanged) {
            this._inputValue = value;
            this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        }
        if (inputValueChanged || !updateView) {
            this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        }
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    isOpen() { return !!this._cRef; }
    /**
     * Opens the datepicker popup.
     *
     * If the related form control contains a valid date, the corresponding month will be opened.
     */
    open() {
        if (!this.isOpen()) {
            this._cRef = this._vcRef.createComponent(NgbDatepicker);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
                this._onTouched();
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            this._elWithFocus = this._document.activeElement;
            ngbFocusTrap(this._ngZone, this._cRef.location.nativeElement, this.closed, true);
            setTimeout(() => this._cRef?.instance.focus());
            let hostElement;
            if (isString(this.positionTarget)) {
                hostElement = this._document.querySelector(this.positionTarget);
            }
            else if (this.positionTarget instanceof HTMLElement) {
                hostElement = this.positionTarget;
            }
            else {
                hostElement = this._elRef.nativeElement;
            }
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._cRef) {
                    this._positioning.createPopper({
                        hostElement,
                        targetElement: this._cRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: addPopperOffset([0, 2])
                    });
                }
            });
            if (this.positionTarget && !hostElement) {
                throw new Error('ngbDatepicker could not find element declared in [positionTarget] to position against.');
            }
            this._setCloseHandlers();
        }
    }
    /**
     * Closes the datepicker popup.
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._destroyCloseHandlers$.next();
            this.closed.emit();
            this._changeDetector.markForCheck();
            // restore focus
            let elementToFocus = this._elWithFocus;
            if (isString(this.restoreFocus)) {
                elementToFocus = this._document.querySelector(this.restoreFocus);
            }
            else if (this.restoreFocus !== undefined) {
                elementToFocus = this.restoreFocus;
            }
            // in IE document.activeElement can contain an object without 'focus()' sometimes
            if (elementToFocus && elementToFocus['focus']) {
                elementToFocus.focus();
            }
            else {
                this._document.body.focus();
            }
            this._positioning.destroy();
        }
    }
    /**
     * Toggles the datepicker popup.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates to the provided date.
     *
     * With the default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     *
     * Use the `[startDate]` input as an alternative.
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    onBlur() { this._onTouched(); }
    onFocus() { this._elWithFocus = this._elRef.nativeElement; }
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
            if (this.isOpen()) {
                if (changes['minDate']) {
                    this._cRef.instance.minDate = this.minDate;
                }
                if (changes['maxDate']) {
                    this._cRef.instance.maxDate = this.maxDate;
                }
                this._cRef.instance.ngOnChanges(changes);
            }
        }
        if (changes['datepickerClass']) {
            const { currentValue, previousValue } = changes['datepickerClass'];
            this._applyPopupClass(currentValue, previousValue);
        }
        if (changes['autoClose'] && this.isOpen()) {
            this._setCloseHandlers();
        }
    }
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }
    _applyDatepickerInputs(datepickerInstance) {
        ['dayTemplate', 'dayTemplateData', 'displayMonths', 'firstDayOfWeek', 'footerTemplate', 'markDisabled', 'minDate',
            'maxDate', 'navigation', 'outsideDays', 'showNavigation', 'showWeekNumbers', 'weekdays']
            .forEach((optionName) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }
    _applyPopupClass(newClass, oldClass) {
        const popupEl = this._cRef?.location.nativeElement;
        if (popupEl) {
            if (newClass) {
                this._renderer.addClass(popupEl, newClass);
            }
            if (oldClass) {
                this._renderer.removeClass(popupEl, oldClass);
            }
        }
    }
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.addClass(nativeElement, 'show');
        if (this.container === 'body') {
            this._renderer.addClass(nativeElement, 'ngb-dp-body');
        }
        this._applyPopupClass(this.datepickerClass);
    }
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe(navigateEvent => this.navigate.emit(navigateEvent));
        datepickerInstance.dateSelect.subscribe(date => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    _writeModelValue(model) {
        const value = this._parserFormatter.format(model);
        this._inputValue = value;
        this._renderer.setProperty(this._elRef.nativeElement, 'value', value);
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    _fromDateStruct(date) {
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next();
        ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this._destroyCloseHandlers$, [], [this._elRef.nativeElement, this._cRef.location.nativeElement]);
    }
}
NgbInputDatepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepicker, deps: [{ token: NgbDateParserFormatter }, { token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: NgbCalendar }, { token: NgbDateAdapter }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: NgbInputDatepickerConfig }], target: i0.ɵɵFactoryTarget.Directive });
NgbInputDatepicker.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbInputDatepicker, selector: "input[ngbDatepicker]", inputs: { autoClose: "autoClose", datepickerClass: "datepickerClass", dayTemplate: "dayTemplate", dayTemplateData: "dayTemplateData", displayMonths: "displayMonths", firstDayOfWeek: "firstDayOfWeek", footerTemplate: "footerTemplate", markDisabled: "markDisabled", minDate: "minDate", maxDate: "maxDate", navigation: "navigation", outsideDays: "outsideDays", placement: "placement", restoreFocus: "restoreFocus", showWeekNumbers: "showWeekNumbers", startDate: "startDate", container: "container", positionTarget: "positionTarget", weekdays: "weekdays", disabled: "disabled" }, outputs: { dateSelect: "dateSelect", navigate: "navigate", closed: "closed" }, host: { listeners: { "input": "manualDateChange($event.target.value)", "change": "manualDateChange($event.target.value, true)", "focus": "onFocus()", "blur": "onBlur()" }, properties: { "disabled": "disabled" } }, providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig }
    ], exportAs: ["ngbDatepicker"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbInputDatepicker, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbDatepicker]',
                    exportAs: 'ngbDatepicker',
                    host: {
                        '(input)': 'manualDateChange($event.target.value)',
                        '(change)': 'manualDateChange($event.target.value, true)',
                        '(focus)': 'onFocus()',
                        '(blur)': 'onBlur()',
                        '[disabled]': 'disabled'
                    },
                    providers: [
                        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NG_VALIDATORS, useExisting: forwardRef(() => NgbInputDatepicker), multi: true },
                        { provide: NgbDatepickerConfig, useExisting: NgbInputDatepickerConfig }
                    ],
                }]
        }], ctorParameters: function () { return [{ type: NgbDateParserFormatter }, { type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: NgbCalendar }, { type: NgbDateAdapter }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: NgbInputDatepickerConfig }]; }, propDecorators: { autoClose: [{
                type: Input
            }], datepickerClass: [{
                type: Input
            }], dayTemplate: [{
                type: Input
            }], dayTemplateData: [{
                type: Input
            }], displayMonths: [{
                type: Input
            }], firstDayOfWeek: [{
                type: Input
            }], footerTemplate: [{
                type: Input
            }], markDisabled: [{
                type: Input
            }], minDate: [{
                type: Input
            }], maxDate: [{
                type: Input
            }], navigation: [{
                type: Input
            }], outsideDays: [{
                type: Input
            }], placement: [{
                type: Input
            }], restoreFocus: [{
                type: Input
            }], showWeekNumbers: [{
                type: Input
            }], startDate: [{
                type: Input
            }], container: [{
                type: Input
            }], positionTarget: [{
                type: Input
            }], weekdays: [{
                type: Input
            }], dateSelect: [{
                type: Output
            }], navigate: [{
                type: Output
            }], closed: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });

class NgbCalendarHijri extends NgbCalendar {
    getDaysPerWeek() { return 7; }
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    getWeeksPerMonth() { return 6; }
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = this._setYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = this._setMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return this._setDay(date, date.day + number);
            default:
                return date;
        }
    }
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    getWeekday(date) {
        const day = this.toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        const date = week[thursdayIndex];
        const jsDate = this.toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const time = jsDate.getTime();
        const MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1)); // Compare with Muharram 1
        return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
    }
    getToday() { return this.fromGregorian(new Date()); }
    isValid(date) {
        return date != null && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
            !isNaN(this.toGregorian(date).getTime());
    }
    _setDay(date, day) {
        day = +day;
        let mDays = this.getDaysPerMonth(date.month, date.year);
        if (day <= 0) {
            while (day <= 0) {
                date = this._setMonth(date, date.month - 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
                day += mDays;
            }
        }
        else if (day > mDays) {
            while (day > mDays) {
                day -= mDays;
                date = this._setMonth(date, date.month + 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
            }
        }
        date.day = day;
        return date;
    }
    _setMonth(date, month) {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    }
    _setYear(date, year) {
        date.year = +year;
        return date;
    }
}
NgbCalendarHijri.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHijri, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarHijri.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHijri });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHijri, decorators: [{
            type: Injectable
        }] });

/**
 * Checks if islamic year is a leap year
 */
function isIslamicLeapYear(hYear) {
    return (14 + 11 * hYear) % 30 < 11;
}
/**
 * Checks if gregorian years is a leap year
 */
function isGregorianLeapYear$1(gDate) {
    const year = gDate.getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/**
 * Returns the start of Hijri Month.
 * `hMonth` is 0 for Muharram, 1 for Safar, etc.
 * `hYear` is any Hijri hYear.
 */
function getIslamicMonthStart(hYear, hMonth) {
    return Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30.0);
}
/**
 * Returns the start of Hijri year.
 * `year` is any Hijri year.
 */
function getIslamicYearStart(year) {
    return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
}
function mod$1(a, b) {
    return a - b * Math.floor(a / b);
}
/**
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
 */
const GREGORIAN_EPOCH$1 = 1721425.5;
const ISLAMIC_EPOCH = 1948439.5;
class NgbCalendarIslamicCivil extends NgbCalendarHijri {
    /**
     * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
     * `gDate` is a JS Date to be converted to Hijri.
     */
    fromGregorian(gDate) {
        const gYear = gDate.getFullYear(), gMonth = gDate.getMonth(), gDay = gDate.getDate();
        let julianDay = GREGORIAN_EPOCH$1 - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
            -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
            Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear$1(gDate) ? -1 : -2) + gDay);
        julianDay = Math.floor(julianDay) + 0.5;
        const days = julianDay - ISLAMIC_EPOCH;
        const hYear = Math.floor((30 * days + 10646) / 10631.0);
        let hMonth = Math.ceil((days - 29 - getIslamicYearStart(hYear)) / 29.5);
        hMonth = Math.min(hMonth, 11);
        const hDay = Math.ceil(days - getIslamicMonthStart(hYear, hMonth)) + 1;
        return new NgbDate(hYear, hMonth + 1, hDay);
    }
    /**
     * Returns the equivalent JS date value for a give input islamic(civil) date.
     * `hDate` is an islamic(civil) date to be converted to Gregorian.
     */
    toGregorian(hDate) {
        const hYear = hDate.year;
        const hMonth = hDate.month - 1;
        const hDay = hDate.day;
        const julianDay = hDay + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;
        const wjd = Math.floor(julianDay - 0.5) + 0.5, depoch = wjd - GREGORIAN_EPOCH$1, quadricent = Math.floor(depoch / 146097), dqc = mod$1(depoch, 146097), cent = Math.floor(dqc / 36524), dcent = mod$1(dqc, 36524), quad = Math.floor(dcent / 1461), dquad = mod$1(dcent, 1461), yindex = Math.floor(dquad / 365);
        let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
        if (!(cent === 4 || yindex === 4)) {
            year++;
        }
        const gYearStart = GREGORIAN_EPOCH$1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400);
        const yearday = wjd - gYearStart;
        const tjd = GREGORIAN_EPOCH$1 - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear$1(new Date(year, 3, 1)) ? -1 : -2) + 1);
        const leapadj = wjd < tjd ? 0 : isGregorianLeapYear$1(new Date(year, 3, 1)) ? 1 : 2;
        const month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
        const tjd2 = GREGORIAN_EPOCH$1 - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) +
            Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear$1(new Date(year, month - 1, 1)) ? -1 : -2) +
                1);
        const day = wjd - tjd2 + 1;
        return new Date(year, month - 1, day);
    }
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     */
    getDaysPerMonth(month, year) {
        year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        let length = 29 + month % 2;
        if (month === 12 && isIslamicLeapYear(year)) {
            length++;
        }
        return length;
    }
}
NgbCalendarIslamicCivil.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicCivil, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarIslamicCivil.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicCivil });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicCivil, decorators: [{
            type: Injectable
        }] });

/**
 * Umalqura calendar is one type of Hijri calendars used in islamic countries.
 * This Calendar is used by Saudi Arabia for administrative purpose.
 * Unlike tabular calendars, the algorithm involves astronomical calculation, but it's still deterministic.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 */
const GREGORIAN_FIRST_DATE = new Date(1882, 10, 12);
const GREGORIAN_LAST_DATE = new Date(2174, 10, 25);
const HIJRI_BEGIN = 1300;
const HIJRI_END = 1600;
const ONE_DAY = 1000 * 60 * 60 * 24;
const MONTH_LENGTH = [
    // 1300-1304
    '101010101010', '110101010100', '111011001001', '011011010100', '011011101010',
    // 1305-1309
    '001101101100', '101010101101', '010101010101', '011010101001', '011110010010',
    // 1310-1314
    '101110101001', '010111010100', '101011011010', '010101011100', '110100101101',
    // 1315-1319
    '011010010101', '011101001010', '101101010100', '101101101010', '010110101101',
    // 1320-1324
    '010010101110', '101001001111', '010100010111', '011010001011', '011010100101',
    // 1325-1329
    '101011010101', '001011010110', '100101011011', '010010011101', '101001001101',
    // 1330-1334
    '110100100110', '110110010101', '010110101100', '100110110110', '001010111010',
    // 1335-1339
    '101001011011', '010100101011', '101010010101', '011011001010', '101011101001',
    // 1340-1344
    '001011110100', '100101110110', '001010110110', '100101010110', '101011001010',
    // 1345-1349
    '101110100100', '101111010010', '010111011001', '001011011100', '100101101101',
    // 1350-1354
    '010101001101', '101010100101', '101101010010', '101110100101', '010110110100',
    // 1355-1359
    '100110110110', '010101010111', '001010010111', '010101001011', '011010100011',
    // 1360-1364
    '011101010010', '101101100101', '010101101010', '101010101011', '010100101011',
    // 1365-1369
    '110010010101', '110101001010', '110110100101', '010111001010', '101011010110',
    // 1370-1374
    '100101010111', '010010101011', '100101001011', '101010100101', '101101010010',
    // 1375-1379
    '101101101010', '010101110101', '001001110110', '100010110111', '010001011011',
    // 1380-1384
    '010101010101', '010110101001', '010110110100', '100111011010', '010011011101',
    // 1385-1389
    '001001101110', '100100110110', '101010101010', '110101010100', '110110110010',
    // 1390-1394
    '010111010101', '001011011010', '100101011011', '010010101011', '101001010101',
    // 1395-1399
    '101101001001', '101101100100', '101101110001', '010110110100', '101010110101',
    // 1400-1404
    '101001010101', '110100100101', '111010010010', '111011001001', '011011010100',
    // 1405-1409
    '101011101001', '100101101011', '010010101011', '101010010011', '110101001001',
    // 1410-1414
    '110110100100', '110110110010', '101010111001', '010010111010', '101001011011',
    // 1415-1419
    '010100101011', '101010010101', '101100101010', '101101010101', '010101011100',
    // 1420-1424
    '010010111101', '001000111101', '100100011101', '101010010101', '101101001010',
    // 1425-1429
    '101101011010', '010101101101', '001010110110', '100100111011', '010010011011',
    // 1430-1434
    '011001010101', '011010101001', '011101010100', '101101101010', '010101101100',
    // 1435-1439
    '101010101101', '010101010101', '101100101001', '101110010010', '101110101001',
    // 1440-1444
    '010111010100', '101011011010', '010101011010', '101010101011', '010110010101',
    // 1445-1449
    '011101001001', '011101100100', '101110101010', '010110110101', '001010110110',
    // 1450-1454
    '101001010110', '111001001101', '101100100101', '101101010010', '101101101010',
    // 1455-1459
    '010110101101', '001010101110', '100100101111', '010010010111', '011001001011',
    // 1460-1464
    '011010100101', '011010101100', '101011010110', '010101011101', '010010011101',
    // 1465-1469
    '101001001101', '110100010110', '110110010101', '010110101010', '010110110101',
    // 1470-1474
    '001011011010', '100101011011', '010010101101', '010110010101', '011011001010',
    // 1475-1479
    '011011100100', '101011101010', '010011110101', '001010110110', '100101010110',
    // 1480-1484
    '101010101010', '101101010100', '101111010010', '010111011001', '001011101010',
    // 1485-1489
    '100101101101', '010010101101', '101010010101', '101101001010', '101110100101',
    // 1490-1494
    '010110110010', '100110110101', '010011010110', '101010010111', '010101000111',
    // 1495-1499
    '011010010011', '011101001001', '101101010101', '010101101010', '101001101011',
    // 1500-1504
    '010100101011', '101010001011', '110101000110', '110110100011', '010111001010',
    // 1505-1509
    '101011010110', '010011011011', '001001101011', '100101001011', '101010100101',
    // 1510-1514
    '101101010010', '101101101001', '010101110101', '000101110110', '100010110111',
    // 1515-1519
    '001001011011', '010100101011', '010101100101', '010110110100', '100111011010',
    // 1520-1524
    '010011101101', '000101101101', '100010110110', '101010100110', '110101010010',
    // 1525-1529
    '110110101001', '010111010100', '101011011010', '100101011011', '010010101011',
    // 1530-1534
    '011001010011', '011100101001', '011101100010', '101110101001', '010110110010',
    // 1535-1539
    '101010110101', '010101010101', '101100100101', '110110010010', '111011001001',
    // 1540-1544
    '011011010010', '101011101001', '010101101011', '010010101011', '101001010101',
    // 1545-1549
    '110100101001', '110101010100', '110110101010', '100110110101', '010010111010',
    // 1550-1554
    '101000111011', '010010011011', '101001001101', '101010101010', '101011010101',
    // 1555-1559
    '001011011010', '100101011101', '010001011110', '101000101110', '110010011010',
    // 1560-1564
    '110101010101', '011010110010', '011010111001', '010010111010', '101001011101',
    // 1565-1569
    '010100101101', '101010010101', '101101010010', '101110101000', '101110110100',
    // 1570-1574
    '010110111001', '001011011010', '100101011010', '101101001010', '110110100100',
    // 1575-1579
    '111011010001', '011011101000', '101101101010', '010101101101', '010100110101',
    // 1580-1584
    '011010010101', '110101001010', '110110101000', '110111010100', '011011011010',
    // 1585-1589
    '010101011011', '001010011101', '011000101011', '101100010101', '101101001010',
    // 1590-1594
    '101110010101', '010110101010', '101010101110', '100100101110', '110010001111',
    // 1595-1599
    '010100100111', '011010010101', '011010101010', '101011010110', '010101011101',
    // 1600
    '001010011101'
];
function getDaysDiff(date1, date2) {
    // Ignores the time part in date1 and date2:
    const time1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const time2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    const diff = Math.abs(time1 - time2);
    return Math.round(diff / ONE_DAY);
}
class NgbCalendarIslamicUmalqura extends NgbCalendarIslamicCivil {
    /**
    * Returns the equivalent islamic(Umalqura) date value for a give input Gregorian date.
    * `gdate` is s JS Date to be converted to Hijri.
    */
    fromGregorian(gDate) {
        let hDay = 1, hMonth = 0, hYear = 1300;
        let daysDiff = getDaysDiff(gDate, GREGORIAN_FIRST_DATE);
        if (gDate.getTime() - GREGORIAN_FIRST_DATE.getTime() >= 0 && gDate.getTime() - GREGORIAN_LAST_DATE.getTime() <= 0) {
            let year = 1300;
            for (let i = 0; i < MONTH_LENGTH.length; i++, year++) {
                for (let j = 0; j < 12; j++) {
                    let numOfDays = +MONTH_LENGTH[i][j] + 29;
                    if (daysDiff <= numOfDays) {
                        hDay = daysDiff + 1;
                        if (hDay > numOfDays) {
                            hDay = 1;
                            j++;
                        }
                        if (j > 11) {
                            j = 0;
                            year++;
                        }
                        hMonth = j;
                        hYear = year;
                        return new NgbDate(hYear, hMonth + 1, hDay);
                    }
                    daysDiff = daysDiff - numOfDays;
                }
            }
            return null;
        }
        else {
            return super.fromGregorian(gDate);
        }
    }
    /**
    * Converts the current Hijri date to Gregorian.
    */
    toGregorian(hDate) {
        const hYear = hDate.year;
        const hMonth = hDate.month - 1;
        const hDay = hDate.day;
        let gDate = new Date(GREGORIAN_FIRST_DATE);
        let dayDiff = hDay - 1;
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            for (let y = 0; y < hYear - HIJRI_BEGIN; y++) {
                for (let m = 0; m < 12; m++) {
                    dayDiff += +MONTH_LENGTH[y][m] + 29;
                }
            }
            for (let m = 0; m < hMonth; m++) {
                dayDiff += +MONTH_LENGTH[hYear - HIJRI_BEGIN][m] + 29;
            }
            gDate.setDate(GREGORIAN_FIRST_DATE.getDate() + dayDiff);
        }
        else {
            gDate = super.toGregorian(hDate);
        }
        return gDate;
    }
    /**
    * Returns the number of days in a specific Hijri hMonth.
    * `hMonth` is 1 for Muharram, 2 for Safar, etc.
    * `hYear` is any Hijri hYear.
    */
    getDaysPerMonth(hMonth, hYear) {
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            const pos = hYear - HIJRI_BEGIN;
            return +MONTH_LENGTH[pos][hMonth - 1] + 29;
        }
        return super.getDaysPerMonth(hMonth, hYear);
    }
}
NgbCalendarIslamicUmalqura.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicUmalqura, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarIslamicUmalqura.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicUmalqura });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarIslamicUmalqura, decorators: [{
            type: Injectable
        }] });

/**
 * Returns the equivalent JS date value for a give input Jalali date.
 * `jalaliDate` is an Jalali date to be converted to Gregorian.
 */
function toGregorian$2(jalaliDate) {
    let jdn = jalaliToJulian(jalaliDate.year, jalaliDate.month, jalaliDate.day);
    let date = julianToGregorian(jdn);
    date.setHours(6, 30, 3, 200);
    return date;
}
/**
 * Returns the equivalent jalali date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to jalali.
 * utc to local
 */
function fromGregorian$2(gdate) {
    let g2d = gregorianToJulian(gdate.getFullYear(), gdate.getMonth() + 1, gdate.getDate());
    return julianToJalali(g2d);
}
function setJalaliYear(date, yearValue) {
    date.year = +yearValue;
    return date;
}
function setJalaliMonth(date, month) {
    month = +month;
    date.year = date.year + Math.floor((month - 1) / 12);
    date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
    return date;
}
function setJalaliDay(date, day) {
    let mDays = getDaysPerMonth(date.month, date.year);
    if (day <= 0) {
        while (day <= 0) {
            date = setJalaliMonth(date, date.month - 1);
            mDays = getDaysPerMonth(date.month, date.year);
            day += mDays;
        }
    }
    else if (day > mDays) {
        while (day > mDays) {
            day -= mDays;
            date = setJalaliMonth(date, date.month + 1);
            mDays = getDaysPerMonth(date.month, date.year);
        }
    }
    date.day = day;
    return date;
}
function mod(a, b) {
    return a - b * Math.floor(a / b);
}
function div(a, b) {
    return Math.trunc(a / b);
}
/*
 This function determines if the Jalali (Persian) year is
 leap (366-day long) or is the common year (365 days), and
 finds the day in March (Gregorian calendar) of the first
 day of the Jalali year (jalaliYear).
 @param jalaliYear Jalali calendar year (-61 to 3177)
 @return
 leap: number of years since the last leap year (0 to 4)
 gYear: Gregorian year of the beginning of Jalali year
 march: the March day of Farvardin the 1st (1st day of jalaliYear)
 @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
 @see: http://www.fourmilab.ch/documents/calendar/
 */
function jalCal(jalaliYear) {
    // Jalali years starting the 33-year rule.
    let breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    const breaksLength = breaks.length;
    const gYear = jalaliYear + 621;
    let leapJ = -14;
    let jp = breaks[0];
    if (jalaliYear < jp || jalaliYear >= breaks[breaksLength - 1]) {
        throw new Error('Invalid Jalali year ' + jalaliYear);
    }
    // Find the limiting years for the Jalali year jalaliYear.
    let jump;
    for (let i = 1; i < breaksLength; i += 1) {
        const jm = breaks[i];
        jump = jm - jp;
        if (jalaliYear < jm) {
            break;
        }
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
    }
    let n = jalaliYear - jp;
    // Find the number of leap years from AD 621 to the beginning
    // of the current Jalali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4) {
        leapJ += 1;
    }
    // And the same in the Gregorian calendar (until the year gYear).
    const leapG = div(gYear, 4) - div((div(gYear, 100) + 1) * 3, 4) - 150;
    // Determine the Gregorian date of Farvardin the 1st.
    const march = 20 + leapJ - leapG;
    // Find how many years have passed since the last leap year.
    if (jump - n < 6) {
        n = n - jump + div(jump + 4, 33) * 33;
    }
    let leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
        leap = 4;
    }
    return { leap: leap, gy: gYear, march: march };
}
/*
 Calculates Gregorian and Julian calendar dates from the Julian Day number
 (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
 calendars) to some millions years ahead of the present.
 @param jdn Julian Day number
 @return
 gYear: Calendar year (years BC numbered 0, -1, -2, ...)
 gMonth: Calendar month (1 to 12)
 gDay: Calendar day of the month M (1 to 28/29/30/31)
 */
function julianToGregorian(julianDayNumber) {
    let j = 4 * julianDayNumber + 139361631;
    j = j + div(div(4 * julianDayNumber + 183187720, 146097) * 3, 4) * 4 - 3908;
    const i = div(mod(j, 1461), 4) * 5 + 308;
    const gDay = div(mod(i, 153), 5) + 1;
    const gMonth = mod(div(i, 153), 12) + 1;
    const gYear = div(j, 1461) - 100100 + div(8 - gMonth, 6);
    return new Date(gYear, gMonth - 1, gDay);
}
/*
 Converts a date of the Jalali calendar to the Julian Day number.
 @param jy Jalali year (1 to 3100)
 @param jm Jalali month (1 to 12)
 @param jd Jalali day (1 to 29/31)
 @return Julian Day number
 */
function gregorianToJulian(gy, gm, gd) {
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}
/*
 Converts the Julian Day number to a date in the Jalali calendar.
 @param julianDayNumber Julian Day number
 @return
 jalaliYear: Jalali year (1 to 3100)
 jalaliMonth: Jalali month (1 to 12)
 jalaliDay: Jalali day (1 to 29/31)
 */
function julianToJalali(julianDayNumber) {
    let gy = julianToGregorian(julianDayNumber).getFullYear() // Calculate Gregorian year (gy).
    , jalaliYear = gy - 621, r = jalCal(jalaliYear), gregorianDay = gregorianToJulian(gy, 3, r.march), jalaliDay, jalaliMonth, numberOfDays;
    // Find number of days that passed since 1 Farvardin.
    numberOfDays = julianDayNumber - gregorianDay;
    if (numberOfDays >= 0) {
        if (numberOfDays <= 185) {
            // The first 6 months.
            jalaliMonth = 1 + div(numberOfDays, 31);
            jalaliDay = mod(numberOfDays, 31) + 1;
            return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
        }
        else {
            // The remaining months.
            numberOfDays -= 186;
        }
    }
    else {
        // Previous Jalali year.
        jalaliYear -= 1;
        numberOfDays += 179;
        if (r.leap === 1) {
            numberOfDays += 1;
        }
    }
    jalaliMonth = 7 + div(numberOfDays, 30);
    jalaliDay = mod(numberOfDays, 30) + 1;
    return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
}
/*
 Converts a date of the Jalali calendar to the Julian Day number.
 @param jYear Jalali year (1 to 3100)
 @param jMonth Jalali month (1 to 12)
 @param jDay Jalali day (1 to 29/31)
 @return Julian Day number
 */
function jalaliToJulian(jYear, jMonth, jDay) {
    let r = jalCal(jYear);
    return gregorianToJulian(r.gy, 3, r.march) + (jMonth - 1) * 31 - div(jMonth, 7) * (jMonth - 7) + jDay - 1;
}
/**
 * Returns the number of days in a specific jalali month.
 */
function getDaysPerMonth(month, year) {
    if (month <= 6) {
        return 31;
    }
    if (month <= 11) {
        return 30;
    }
    if (jalCal(year).leap === 0) {
        return 30;
    }
    return 29;
}

class NgbCalendarPersian extends NgbCalendar {
    getDaysPerWeek() { return 7; }
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    getWeeksPerMonth() { return 6; }
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = setJalaliYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = setJalaliMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return setJalaliDay(date, date.day + number);
            default:
                return date;
        }
    }
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    getWeekday(date) {
        const day = toGregorian$2(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        const date = week[thursdayIndex];
        const jsDate = toGregorian$2(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const time = jsDate.getTime();
        const startDate = toGregorian$2(new NgbDate(date.year, 1, 1));
        return Math.floor(Math.round((time - startDate.getTime()) / 86400000) / 7) + 1;
    }
    getToday() { return fromGregorian$2(new Date()); }
    isValid(date) {
        return date != null && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) &&
            !isNaN(toGregorian$2(date).getTime());
    }
}
NgbCalendarPersian.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarPersian, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarPersian.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarPersian });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarPersian, decorators: [{
            type: Injectable
        }] });

const PARTS_PER_HOUR = 1080;
const PARTS_PER_DAY = 24 * PARTS_PER_HOUR;
const PARTS_FRACTIONAL_MONTH = 12 * PARTS_PER_HOUR + 793;
const PARTS_PER_MONTH = 29 * PARTS_PER_DAY + PARTS_FRACTIONAL_MONTH;
const BAHARAD = 11 * PARTS_PER_HOUR + 204;
const HEBREW_DAY_ON_JAN_1_1970 = 2092591;
const GREGORIAN_EPOCH = 1721425.5;
function isGregorianLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function numberOfFirstDayInYear(year) {
    let monthsBeforeYear = Math.floor((235 * year - 234) / 19);
    let fractionalMonthsBeforeYear = monthsBeforeYear * PARTS_FRACTIONAL_MONTH + BAHARAD;
    let dayNumber = monthsBeforeYear * 29 + Math.floor(fractionalMonthsBeforeYear / PARTS_PER_DAY);
    let timeOfDay = fractionalMonthsBeforeYear % PARTS_PER_DAY;
    let dayOfWeek = dayNumber % 7; // 0 == Monday
    if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 6) {
        dayNumber++;
        dayOfWeek = dayNumber % 7;
    }
    if (dayOfWeek === 1 && timeOfDay > 15 * PARTS_PER_HOUR + 204 && !isHebrewLeapYear(year)) {
        dayNumber += 2;
    }
    else if (dayOfWeek === 0 && timeOfDay > 21 * PARTS_PER_HOUR + 589 && isHebrewLeapYear(year - 1)) {
        dayNumber++;
    }
    return dayNumber;
}
function getDaysInGregorianMonth(month, year) {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isGregorianLeapYear(year)) {
        days[1]++;
    }
    return days[month - 1];
}
function getHebrewMonths(year) {
    return isHebrewLeapYear(year) ? 13 : 12;
}
/**
 * Returns the number of days in a specific Hebrew year.
 * `year` is any Hebrew year.
 */
function getDaysInHebrewYear(year) {
    return numberOfFirstDayInYear(year + 1) - numberOfFirstDayInYear(year);
}
function isHebrewLeapYear(year) {
    if (year != null) {
        let b = (year * 12 + 17) % 19;
        return b >= ((b < 0) ? -7 : 12);
    }
    return false;
}
/**
 * Returns the number of days in a specific Hebrew month.
 * `month` is 1 for Nisan, 2 for Iyar etc. Note: Hebrew leap year contains 13 months.
 * `year` is any Hebrew year.
 */
function getDaysInHebrewMonth(month, year) {
    let yearLength = numberOfFirstDayInYear(year + 1) - numberOfFirstDayInYear(year);
    let yearType = (yearLength <= 380 ? yearLength : (yearLength - 30)) - 353;
    let leapYear = isHebrewLeapYear(year);
    let daysInMonth = leapYear ? [30, 29, 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29] :
        [30, 29, 29, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    if (yearType > 0) {
        daysInMonth[2]++; // Kislev gets an extra day in normal or complete years.
    }
    if (yearType > 1) {
        daysInMonth[1]++; // Heshvan gets an extra day in complete years only.
    }
    return daysInMonth[month - 1];
}
function getDayNumberInHebrewYear(date) {
    let numberOfDay = 0;
    for (let i = 1; i < date.month; i++) {
        numberOfDay += getDaysInHebrewMonth(i, date.year);
    }
    return numberOfDay + date.day;
}
function setHebrewMonth(date, val) {
    let after = val >= 0;
    if (!after) {
        val = -val;
    }
    while (val > 0) {
        if (after) {
            if (val > getHebrewMonths(date.year) - date.month) {
                val -= getHebrewMonths(date.year) - date.month + 1;
                date.year++;
                date.month = 1;
            }
            else {
                date.month += val;
                val = 0;
            }
        }
        else {
            if (val >= date.month) {
                date.year--;
                val -= date.month;
                date.month = getHebrewMonths(date.year);
            }
            else {
                date.month -= val;
                val = 0;
            }
        }
    }
    return date;
}
function setHebrewDay(date, val) {
    let after = val >= 0;
    if (!after) {
        val = -val;
    }
    while (val > 0) {
        if (after) {
            if (val > getDaysInHebrewYear(date.year) - getDayNumberInHebrewYear(date)) {
                val -= getDaysInHebrewYear(date.year) - getDayNumberInHebrewYear(date) + 1;
                date.year++;
                date.month = 1;
                date.day = 1;
            }
            else if (val > getDaysInHebrewMonth(date.month, date.year) - date.day) {
                val -= getDaysInHebrewMonth(date.month, date.year) - date.day + 1;
                date.month++;
                date.day = 1;
            }
            else {
                date.day += val;
                val = 0;
            }
        }
        else {
            if (val >= date.day) {
                val -= date.day;
                date.month--;
                if (date.month === 0) {
                    date.year--;
                    date.month = getHebrewMonths(date.year);
                }
                date.day = getDaysInHebrewMonth(date.month, date.year);
            }
            else {
                date.day -= val;
                val = 0;
            }
        }
    }
    return date;
}
/**
 * Returns the equivalent Hebrew date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to Hebrew date.
 */
function fromGregorian$1(gdate) {
    const date = new Date(gdate);
    const gYear = date.getFullYear(), gMonth = date.getMonth(), gDay = date.getDate();
    let julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) -
        Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
        Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(gYear) ? -1 : -2) + gDay);
    julianDay = Math.floor(julianDay + 0.5);
    let daysSinceHebEpoch = julianDay - 347997;
    let monthsSinceHebEpoch = Math.floor(daysSinceHebEpoch * PARTS_PER_DAY / PARTS_PER_MONTH);
    let hYear = Math.floor((monthsSinceHebEpoch * 19 + 234) / 235) + 1;
    let firstDayOfThisYear = numberOfFirstDayInYear(hYear);
    let dayOfYear = daysSinceHebEpoch - firstDayOfThisYear;
    while (dayOfYear < 1) {
        hYear--;
        firstDayOfThisYear = numberOfFirstDayInYear(hYear);
        dayOfYear = daysSinceHebEpoch - firstDayOfThisYear;
    }
    let hMonth = 1;
    let hDay = dayOfYear;
    while (hDay > getDaysInHebrewMonth(hMonth, hYear)) {
        hDay -= getDaysInHebrewMonth(hMonth, hYear);
        hMonth++;
    }
    return new NgbDate(hYear, hMonth, hDay);
}
/**
 * Returns the equivalent JS date value for a given Hebrew date.
 * `hebrewDate` is an Hebrew date to be converted to Gregorian.
 */
function toGregorian$1(hebrewDate) {
    const hYear = hebrewDate.year;
    const hMonth = hebrewDate.month;
    const hDay = hebrewDate.day;
    let days = numberOfFirstDayInYear(hYear);
    for (let i = 1; i < hMonth; i++) {
        days += getDaysInHebrewMonth(i, hYear);
    }
    days += hDay;
    let diffDays = days - HEBREW_DAY_ON_JAN_1_1970;
    let after = diffDays >= 0;
    if (!after) {
        diffDays = -diffDays;
    }
    let gYear = 1970;
    let gMonth = 1;
    let gDay = 1;
    while (diffDays > 0) {
        if (after) {
            if (diffDays >= (isGregorianLeapYear(gYear) ? 366 : 365)) {
                diffDays -= isGregorianLeapYear(gYear) ? 366 : 365;
                gYear++;
            }
            else if (diffDays >= getDaysInGregorianMonth(gMonth, gYear)) {
                diffDays -= getDaysInGregorianMonth(gMonth, gYear);
                gMonth++;
            }
            else {
                gDay += diffDays;
                diffDays = 0;
            }
        }
        else {
            if (diffDays >= (isGregorianLeapYear(gYear - 1) ? 366 : 365)) {
                diffDays -= isGregorianLeapYear(gYear - 1) ? 366 : 365;
                gYear--;
            }
            else {
                if (gMonth > 1) {
                    gMonth--;
                }
                else {
                    gMonth = 12;
                    gYear--;
                }
                if (diffDays >= getDaysInGregorianMonth(gMonth, gYear)) {
                    diffDays -= getDaysInGregorianMonth(gMonth, gYear);
                }
                else {
                    gDay = getDaysInGregorianMonth(gMonth, gYear) - diffDays + 1;
                    diffDays = 0;
                }
            }
        }
    }
    return new Date(gYear, gMonth - 1, gDay);
}
function hebrewNumerals(numerals) {
    if (!numerals) {
        return '';
    }
    const hArray0_9 = ['', '\u05d0', '\u05d1', '\u05d2', '\u05d3', '\u05d4', '\u05d5', '\u05d6', '\u05d7', '\u05d8'];
    const hArray10_19 = [
        '\u05d9', '\u05d9\u05d0', '\u05d9\u05d1', '\u05d9\u05d2', '\u05d9\u05d3', '\u05d8\u05d5', '\u05d8\u05d6',
        '\u05d9\u05d6', '\u05d9\u05d7', '\u05d9\u05d8'
    ];
    const hArray20_90 = ['', '', '\u05db', '\u05dc', '\u05de', '\u05e0', '\u05e1', '\u05e2', '\u05e4', '\u05e6'];
    const hArray100_900 = [
        '', '\u05e7', '\u05e8', '\u05e9', '\u05ea', '\u05ea\u05e7', '\u05ea\u05e8', '\u05ea\u05e9', '\u05ea\u05ea',
        '\u05ea\u05ea\u05e7'
    ];
    const hArray1000_9000 = [
        '', '\u05d0', '\u05d1', '\u05d1\u05d0', '\u05d1\u05d1', '\u05d4', '\u05d4\u05d0', '\u05d4\u05d1',
        '\u05d4\u05d1\u05d0', '\u05d4\u05d1\u05d1'
    ];
    const geresh = '\u05f3', gershaim = '\u05f4';
    let mem = 0;
    let result = [];
    let step = 0;
    while (numerals > 0) {
        let m = numerals % 10;
        if (step === 0) {
            mem = m;
        }
        else if (step === 1) {
            if (m !== 1) {
                result.unshift(hArray20_90[m], hArray0_9[mem]);
            }
            else {
                result.unshift(hArray10_19[mem]);
            }
        }
        else if (step === 2) {
            result.unshift(hArray100_900[m]);
        }
        else {
            if (m !== 5) {
                result.unshift(hArray1000_9000[m], geresh, ' ');
            }
            break;
        }
        numerals = Math.floor(numerals / 10);
        if (step === 0 && numerals === 0) {
            result.unshift(hArray0_9[m]);
        }
        step++;
    }
    result = result.join('').split('');
    if (result.length === 1) {
        result.push(geresh);
    }
    else if (result.length > 1) {
        result.splice(result.length - 1, 0, gershaim);
    }
    return result.join('');
}

/**
 * @since 3.2.0
 */
class NgbCalendarHebrew extends NgbCalendar {
    getDaysPerWeek() { return 7; }
    getMonths(year) {
        if (year && isHebrewLeapYear(year)) {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        }
        else {
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        }
    }
    getWeeksPerMonth() { return 6; }
    isValid(date) {
        if (date != null) {
            let b = isNumber(date.year) && isNumber(date.month) && isNumber(date.day);
            b = b && date.month > 0 && date.month <= (isHebrewLeapYear(date.year) ? 13 : 12);
            b = b && date.day > 0 && date.day <= getDaysInHebrewMonth(date.month, date.year);
            return b && !isNaN(toGregorian$1(date).getTime());
        }
        return false;
    }
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date.year += number;
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = setHebrewMonth(date, number);
                date.day = 1;
                return date;
            case 'd':
                return setHebrewDay(date, number);
            default:
                return date;
        }
    }
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    getWeekday(date) {
        const day = toGregorian$1(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    getWeekNumber(week, firstDayOfWeek) {
        const date = week[week.length - 1];
        return Math.ceil(getDayNumberInHebrewYear(date) / 7);
    }
    getToday() { return fromGregorian$1(new Date()); }
    /**
     * @since 3.4.0
     */
    toGregorian(date) { return fromJSDate(toGregorian$1(date)); }
    /**
     * @since 3.4.0
     */
    fromGregorian(date) { return fromGregorian$1(toJSDate(date)); }
}
NgbCalendarHebrew.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHebrew, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarHebrew.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHebrew });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarHebrew, decorators: [{
            type: Injectable
        }] });

const WEEKDAYS = ['שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת', 'ראשון'];
const MONTHS = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const MONTHS_LEAP = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר א׳', 'אדר ב׳', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
/**
 * @since 3.2.0
 */
class NgbDatepickerI18nHebrew extends NgbDatepickerI18n {
    getMonthShortName(month, year) { return this.getMonthFullName(month, year); }
    getMonthFullName(month, year) {
        return isHebrewLeapYear(year) ? MONTHS_LEAP[month - 1] || '' : MONTHS[month - 1] || '';
    }
    getWeekdayLabel(weekday, width) { return WEEKDAYS[weekday - 1] || ''; }
    getDayAriaLabel(date) {
        return `${hebrewNumerals(date.day)} ${this.getMonthFullName(date.month, date.year)} ${hebrewNumerals(date.year)}`;
    }
    getDayNumerals(date) { return hebrewNumerals(date.day); }
    getWeekNumerals(weekNumber) { return hebrewNumerals(weekNumber); }
    getYearNumerals(year) { return hebrewNumerals(year); }
}
NgbDatepickerI18nHebrew.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nHebrew, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerI18nHebrew.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nHebrew });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerI18nHebrew, decorators: [{
            type: Injectable
        }] });

/**
 * Returns the equivalent JS date value for a give input Buddhist date.
 * `date` is an Buddhist date to be converted to Gregorian.
 */
function toGregorian(date) {
    return new Date(date.year - 543, date.month - 1, date.day);
}
/**
 * Returns the equivalent Buddhist date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to Buddhist.
 * utc to local
 */
function fromGregorian(gdate) {
    return new NgbDate(gdate.getFullYear() + 543, gdate.getMonth() + 1, gdate.getDate());
}

/**
 * @since 9.1.0
 */
class NgbCalendarBuddhist extends NgbCalendarGregorian {
    getToday() { return fromGregorian(new Date()); }
    getNext(date, period = 'd', number = 1) {
        let jsDate = toGregorian(date);
        let checkMonth = true;
        let expectedMonth = jsDate.getMonth();
        switch (period) {
            case 'y':
                jsDate.setFullYear(jsDate.getFullYear() + number);
                break;
            case 'm':
                expectedMonth += number;
                jsDate.setMonth(expectedMonth);
                expectedMonth = expectedMonth % 12;
                if (expectedMonth < 0) {
                    expectedMonth = expectedMonth + 12;
                }
                break;
            case 'd':
                jsDate.setDate(jsDate.getDate() + number);
                checkMonth = false;
                break;
            default:
                return date;
        }
        if (checkMonth && jsDate.getMonth() !== expectedMonth) {
            // this means the destination month has less days than the initial month
            // let's go back to the end of the previous month:
            jsDate.setDate(0);
        }
        return fromGregorian(jsDate);
    }
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    getWeekday(date) {
        let jsDate = toGregorian(date);
        let day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        let date = week[thursdayIndex];
        const jsDate = toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7)); // Thursday
        const time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    }
    isValid(date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        // year 0 doesn't exist in Gregorian calendar
        if (date.year === 0) {
            return false;
        }
        const jsDate = toGregorian(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year - 543 &&
            jsDate.getMonth() + 1 === date.month && jsDate.getDate() === date.day;
    }
}
NgbCalendarBuddhist.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarBuddhist, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbCalendarBuddhist.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarBuddhist });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbCalendarBuddhist, decorators: [{
            type: Injectable
        }] });

/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */
class NgbDateNativeAdapter extends NgbDateAdapter {
    /**
     * Converts a native `Date` to a `NgbDateStruct`.
     */
    fromModel(date) {
        return (date instanceof Date && !isNaN(date.getTime())) ? this._fromNativeDate(date) : null;
    }
    /**
     * Converts a `NgbDateStruct` to a native `Date`.
     */
    toModel(date) {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) ? this._toNativeDate(date) :
            null;
    }
    _fromNativeDate(date) {
        return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    }
    _toNativeDate(date) {
        const jsDate = new Date(date.year, date.month - 1, date.day, 12);
        // avoid 30 -> 1930 conversion
        jsDate.setFullYear(date.year);
        return jsDate;
    }
}
NgbDateNativeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateNativeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeAdapter, decorators: [{
            type: Injectable
        }] });

/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
class NgbDateNativeUTCAdapter extends NgbDateNativeAdapter {
    _fromNativeDate(date) {
        return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
    }
    _toNativeDate(date) {
        const jsDate = new Date(Date.UTC(date.year, date.month - 1, date.day));
        // avoid 30 -> 1930 conversion
        jsDate.setUTCFullYear(date.year);
        return jsDate;
    }
}
NgbDateNativeUTCAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbDateNativeUTCAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDateNativeUTCAdapter, decorators: [{
            type: Injectable
        }] });

class NgbDatepickerModule {
}
NgbDatepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbDatepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, declarations: [NgbDatepicker, NgbDatepickerContent, NgbDatepickerMonth, NgbDatepickerNavigation, NgbDatepickerNavigationSelect,
        NgbDatepickerDayView, NgbInputDatepicker], imports: [CommonModule, FormsModule], exports: [NgbDatepicker, NgbDatepickerContent, NgbInputDatepicker, NgbDatepickerMonth] });
NgbDatepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, imports: [[CommonModule, FormsModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        NgbDatepicker, NgbDatepickerContent, NgbDatepickerMonth, NgbDatepickerNavigation, NgbDatepickerNavigationSelect,
                        NgbDatepickerDayView, NgbInputDatepicker
                    ],
                    exports: [NgbDatepicker, NgbDatepickerContent, NgbInputDatepicker, NgbDatepickerMonth],
                    imports: [CommonModule, FormsModule]
                }]
        }] });

/**
 * A configuration service for the [`NgbDropdown`](#/components/dropdown/api#NgbDropdown) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
class NgbDropdownConfig {
    constructor() {
        this.autoClose = true;
        this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
    }
}
NgbDropdownConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDropdownConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

class NgbNavbar {
}
NgbNavbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavbar, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbNavbar.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavbar, selector: ".navbar", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavbar, decorators: [{
            type: Directive,
            args: [{ selector: '.navbar' }]
        }] });
/**
 * A directive you should put on a dropdown item to enable keyboard navigation.
 * Arrow keys will move focus between items marked with this directive.
 *
 * @since 4.1.0
 */
class NgbDropdownItem {
    constructor(elementRef, _renderer) {
        this.elementRef = elementRef;
        this._renderer = _renderer;
        this._disabled = false;
    }
    set disabled(value) {
        this._disabled = value === '' || value === true; // accept an empty attribute as true
        // note: we don't use a host binding for disabled because when used on links, it fails because links don't have a
        // disabled property
        // setting the property using the renderer, OTOH, works fine in both cases.
        this._renderer.setProperty(this.elementRef.nativeElement, 'disabled', this._disabled);
    }
    get disabled() { return this._disabled; }
}
NgbDropdownItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownItem, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdownItem, selector: "[ngbDropdownItem]", inputs: { disabled: "disabled" }, host: { properties: { "class.disabled": "disabled", "tabIndex": "disabled ? -1 : 0" }, classAttribute: "dropdown-item" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownItem, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownItem]',
                    host: { 'class': 'dropdown-item', '[class.disabled]': 'disabled', '[tabIndex]': 'disabled ? -1 : 0' }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { disabled: [{
                type: Input
            }] } });
/**
 * A directive that wraps dropdown menu content and dropdown items.
 */
class NgbDropdownMenu {
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this.placement = 'bottom';
        this.isOpen = false;
        this.nativeElement = _elementRef.nativeElement;
    }
}
NgbDropdownMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownMenu, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownMenu.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdownMenu, selector: "[ngbDropdownMenu]", host: { listeners: { "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Enter": "dropdown.onKeyDown($event)", "keydown.Space": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "class.dropdown-menu": "true", "class.show": "dropdown.isOpen()" } }, queries: [{ propertyName: "menuItems", predicate: NgbDropdownItem }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownMenu, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownMenu]',
                    host: {
                        '[class.dropdown-menu]': 'true',
                        '[class.show]': 'dropdown.isOpen()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Enter)': 'dropdown.onKeyDown($event)',
                        '(keydown.Space)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { menuItems: [{
                type: ContentChildren,
                args: [NgbDropdownItem]
            }] } });
/**
 * A directive to mark an element to which dropdown menu will be anchored.
 *
 * This is a simple version of the `NgbDropdownToggle` directive.
 * It plays the same role, but doesn't listen to click events to toggle dropdown menu thus enabling support
 * for events other than click.
 *
 * @since 1.1.0
 */
class NgbDropdownAnchor {
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this.nativeElement = _elementRef.nativeElement;
    }
}
NgbDropdownAnchor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownAnchor, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownAnchor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdownAnchor, selector: "[ngbDropdownAnchor]", host: { properties: { "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownAnchor, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbDropdownAnchor]', host: { 'class': 'dropdown-toggle', '[attr.aria-expanded]': 'dropdown.isOpen()' } }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; } });
/**
 * A directive to mark an element that will toggle dropdown via the `click` event.
 *
 * You can also use `NgbDropdownAnchor` as an alternative.
 */
class NgbDropdownToggle extends NgbDropdownAnchor {
    constructor(dropdown, elementRef) {
        super(dropdown, elementRef);
    }
}
NgbDropdownToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownToggle, deps: [{ token: forwardRef(() => NgbDropdown) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdownToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdownToggle, selector: "[ngbDropdownToggle]", host: { listeners: { "click": "dropdown.toggle()", "keydown.ArrowUp": "dropdown.onKeyDown($event)", "keydown.ArrowDown": "dropdown.onKeyDown($event)", "keydown.Home": "dropdown.onKeyDown($event)", "keydown.End": "dropdown.onKeyDown($event)", "keydown.Tab": "dropdown.onKeyDown($event)", "keydown.Shift.Tab": "dropdown.onKeyDown($event)" }, properties: { "attr.aria-expanded": "dropdown.isOpen()" }, classAttribute: "dropdown-toggle" }, providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbDropdownToggle]',
                    host: {
                        'class': 'dropdown-toggle',
                        '[attr.aria-expanded]': 'dropdown.isOpen()',
                        '(click)': 'dropdown.toggle()',
                        '(keydown.ArrowUp)': 'dropdown.onKeyDown($event)',
                        '(keydown.ArrowDown)': 'dropdown.onKeyDown($event)',
                        '(keydown.Home)': 'dropdown.onKeyDown($event)',
                        '(keydown.End)': 'dropdown.onKeyDown($event)',
                        '(keydown.Tab)': 'dropdown.onKeyDown($event)',
                        '(keydown.Shift.Tab)': 'dropdown.onKeyDown($event)'
                    },
                    providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }]
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbDropdown)]
                }] }, { type: i0.ElementRef }]; } });
/**
 * A directive that provides contextual overlays for displaying lists of links and more.
 */
class NgbDropdown {
    constructor(_changeDetector, config, _document, _ngZone, _elementRef, _renderer, ngbNavbar) {
        this._changeDetector = _changeDetector;
        this._document = _document;
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._destroyCloseHandlers$ = new Subject();
        this._bodyContainer = null;
        this._positioning = ngbPositioning();
        /**
         * Defines whether or not the dropdown menu is opened initially.
         */
        this._open = false;
        /**
         * An event fired when the dropdown is opened or closed.
         *
         * The event payload is a `boolean`:
         * * `true` - the dropdown was opened
         * * `false` - the dropdown was closed
         */
        this.openChange = new EventEmitter();
        this.placement = config.placement;
        this.container = config.container;
        this.autoClose = config.autoClose;
        this.display = ngbNavbar ? 'static' : 'dynamic';
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positionMenu(); });
    }
    ngAfterContentInit() {
        this._ngZone.onStable.pipe(take(1)).subscribe(() => {
            this._applyPlacementClasses();
            if (this._open) {
                this._setCloseHandlers();
            }
        });
    }
    ngOnChanges(changes) {
        if (changes.container && this._open) {
            this._applyContainer(this.container);
        }
        if (changes.placement && !changes.placement.firstChange) {
            this._positioning.setOptions({
                hostElement: this._anchor.nativeElement,
                targetElement: this._bodyContainer || this._menu.nativeElement,
                placement: this.placement,
                appendToBody: this.container === 'body',
            });
            this._applyPlacementClasses();
        }
        if (changes.dropdownClass) {
            const { currentValue, previousValue } = changes.dropdownClass;
            this._applyCustomDropdownClass(currentValue, previousValue);
        }
        if (changes.autoClose && this._open) {
            this.autoClose = changes.autoClose.currentValue;
            this._setCloseHandlers();
        }
    }
    /**
     * Checks if the dropdown menu is open.
     */
    isOpen() { return this._open; }
    /**
     * Opens the dropdown menu.
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._applyContainer(this.container);
            this.openChange.emit(true);
            this._setCloseHandlers();
            if (this._anchor) {
                this._anchor.nativeElement.focus();
                if (this.display === 'dynamic') {
                    this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                        this._positioning.createPopper({
                            hostElement: this._anchor.nativeElement,
                            targetElement: this._bodyContainer || this._menu.nativeElement,
                            placement: this.placement,
                            appendToBody: this.container === 'body',
                            updatePopperOptions: addPopperOffset([0, 2]),
                        });
                        this._applyPlacementClasses();
                    });
                }
            }
        }
    }
    _setCloseHandlers() {
        this._destroyCloseHandlers$.next(); // destroy any existing close handlers
        ngbAutoClose(this._ngZone, this._document, this.autoClose, (source) => {
            this.close();
            if (source === 0 /* ESCAPE */) {
                this._anchor.nativeElement.focus();
            }
        }, this._destroyCloseHandlers$, this._menu ? [this._menu.nativeElement] : [], this._anchor ? [this._anchor.nativeElement] : [], '.dropdown-item,.dropdown-divider');
    }
    /**
     * Closes the dropdown menu.
     */
    close() {
        if (this._open) {
            this._open = false;
            this._positioning.destroy();
            this._resetContainer();
            this._destroyCloseHandlers$.next();
            this.openChange.emit(false);
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Toggles the dropdown menu.
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    ngOnDestroy() {
        this._resetContainer();
        this._destroyCloseHandlers$.next();
        this._zoneSubscription.unsubscribe();
    }
    onKeyDown(event) {
        /* eslint-disable-next-line deprecation/deprecation */
        const key = event.which;
        const itemElements = this._getMenuElements();
        let position = -1;
        let itemElement = null;
        const isEventFromToggle = this._isEventFromToggle(event);
        if (!isEventFromToggle && itemElements.length) {
            itemElements.forEach((item, index) => {
                if (item.contains(event.target)) {
                    itemElement = item;
                }
                if (item === this._document.activeElement) {
                    position = index;
                }
            });
        }
        // closing on Enter / Space
        if (key === Key.Space || key === Key.Enter) {
            if (itemElement && (this.autoClose === true || this.autoClose === 'inside')) {
                // Item is either a button or a link, so click will be triggered by the browser on Enter or Space.
                // So we have to register a one-time click handler that will fire after any user defined click handlers
                // to close the dropdown
                fromEvent(itemElement, 'click').pipe(take(1)).subscribe(() => this.close());
            }
            return;
        }
        if (key === Key.Tab) {
            if (event.target && this.isOpen() && this.autoClose) {
                if (this._anchor.nativeElement === event.target) {
                    if (this.container === 'body' && !event.shiftKey) {
                        /* This case is special: user is using [Tab] from the anchor/toggle.
                           User expects the next focusable element in the dropdown menu to get focus.
                           But the menu is not a sibling to anchor/toggle, it is at the end of the body.
                           Trick is to synchronously focus the menu element, and let the [keydown.Tab] go
                           so that browser will focus the proper element (first one focusable in the menu) */
                        this._renderer.setAttribute(this._menu.nativeElement, 'tabindex', '0');
                        this._menu.nativeElement.focus();
                        this._renderer.removeAttribute(this._menu.nativeElement, 'tabindex');
                    }
                    else if (event.shiftKey) {
                        this.close();
                    }
                    return;
                }
                else if (this.container === 'body') {
                    const focusableElements = this._menu.nativeElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
                    if (event.shiftKey && event.target === focusableElements[0]) {
                        this._anchor.nativeElement.focus();
                        event.preventDefault();
                    }
                    else if (!event.shiftKey && event.target === focusableElements[focusableElements.length - 1]) {
                        this._anchor.nativeElement.focus();
                        this.close();
                    }
                }
                else {
                    fromEvent(event.target, 'focusout').pipe(take(1)).subscribe(({ relatedTarget }) => {
                        if (!this._elementRef.nativeElement.contains(relatedTarget)) {
                            this.close();
                        }
                    });
                }
            }
            return;
        }
        // opening / navigating
        if (isEventFromToggle || itemElement) {
            this.open();
            if (itemElements.length) {
                switch (key) {
                    case Key.ArrowDown:
                        position = Math.min(position + 1, itemElements.length - 1);
                        break;
                    case Key.ArrowUp:
                        if (this._isDropup() && position === -1) {
                            position = itemElements.length - 1;
                            break;
                        }
                        position = Math.max(position - 1, 0);
                        break;
                    case Key.Home:
                        position = 0;
                        break;
                    case Key.End:
                        position = itemElements.length - 1;
                        break;
                }
                itemElements[position].focus();
            }
            event.preventDefault();
        }
    }
    _isDropup() { return this._elementRef.nativeElement.classList.contains('dropup'); }
    _isEventFromToggle(event) {
        return this._anchor.nativeElement.contains(event.target);
    }
    _getMenuElements() {
        const menu = this._menu;
        if (menu == null) {
            return [];
        }
        return menu.menuItems.filter(item => !item.disabled).map(item => item.elementRef.nativeElement);
    }
    _positionMenu() {
        const menu = this._menu;
        if (this.isOpen() && menu) {
            if (this.display === 'dynamic') {
                this._positioning.update();
                this._applyPlacementClasses();
            }
            else {
                this._applyPlacementClasses(this._getFirstPlacement(this.placement));
            }
        }
    }
    _getFirstPlacement(placement) {
        return Array.isArray(placement) ? placement[0] : placement.split(' ')[0];
    }
    _resetContainer() {
        const renderer = this._renderer;
        if (this._menu) {
            const dropdownElement = this._elementRef.nativeElement;
            const dropdownMenuElement = this._menu.nativeElement;
            renderer.appendChild(dropdownElement, dropdownMenuElement);
        }
        if (this._bodyContainer) {
            renderer.removeChild(this._document.body, this._bodyContainer);
            this._bodyContainer = null;
        }
    }
    _applyContainer(container = null) {
        this._resetContainer();
        if (container === 'body') {
            const renderer = this._renderer;
            const dropdownMenuElement = this._menu.nativeElement;
            const bodyContainer = this._bodyContainer = this._bodyContainer || renderer.createElement('div');
            // Override some styles to have the positioning working
            renderer.setStyle(bodyContainer, 'position', 'absolute');
            renderer.setStyle(dropdownMenuElement, 'position', 'static');
            renderer.setStyle(bodyContainer, 'z-index', '1055');
            renderer.appendChild(bodyContainer, dropdownMenuElement);
            renderer.appendChild(this._document.body, bodyContainer);
        }
        this._applyCustomDropdownClass(this.dropdownClass);
    }
    _applyCustomDropdownClass(newClass, oldClass) {
        const targetElement = this.container === 'body' ? this._bodyContainer : this._elementRef.nativeElement;
        if (targetElement) {
            if (oldClass) {
                this._renderer.removeClass(targetElement, oldClass);
            }
            if (newClass) {
                this._renderer.addClass(targetElement, newClass);
            }
        }
    }
    _applyPlacementClasses(placement) {
        const menu = this._menu;
        if (menu) {
            if (!placement) {
                placement = this._getFirstPlacement(this.placement);
            }
            const renderer = this._renderer;
            const dropdownElement = this._elementRef.nativeElement;
            // remove the current placement classes
            renderer.removeClass(dropdownElement, 'dropup');
            renderer.removeClass(dropdownElement, 'dropdown');
            const { nativeElement } = menu;
            if (this.display === 'static') {
                menu.placement = null;
                renderer.setAttribute(nativeElement, 'data-bs-popper', 'static');
            }
            else {
                menu.placement = placement;
                renderer.removeAttribute(nativeElement, 'data-bs-popper');
            }
            /*
            * apply the new placement
            * in case of top use up-arrow or down-arrow otherwise
            */
            const dropdownClass = placement.search('^top') !== -1 ? 'dropup' : 'dropdown';
            renderer.addClass(dropdownElement, dropdownClass);
            const bodyContainer = this._bodyContainer;
            if (bodyContainer) {
                renderer.removeClass(bodyContainer, 'dropup');
                renderer.removeClass(bodyContainer, 'dropdown');
                renderer.addClass(bodyContainer, dropdownClass);
            }
        }
    }
}
NgbDropdown.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdown, deps: [{ token: i0.ChangeDetectorRef }, { token: NgbDropdownConfig }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: NgbNavbar, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdown.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdown, selector: "[ngbDropdown]", inputs: { autoClose: "autoClose", dropdownClass: "dropdownClass", _open: ["open", "_open"], placement: "placement", container: "container", display: "display" }, outputs: { openChange: "openChange" }, host: { properties: { "class.show": "isOpen()" } }, queries: [{ propertyName: "_menu", first: true, predicate: NgbDropdownMenu, descendants: true }, { propertyName: "_anchor", first: true, predicate: NgbDropdownAnchor, descendants: true }], exportAs: ["ngbDropdown"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdown, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: NgbDropdownConfig }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: NgbNavbar, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { _menu: [{
                type: ContentChild,
                args: [NgbDropdownMenu, { static: false }]
            }], _anchor: [{
                type: ContentChild,
                args: [NgbDropdownAnchor, { static: false }]
            }], autoClose: [{
                type: Input
            }], dropdownClass: [{
                type: Input
            }], _open: [{
                type: Input,
                args: ['open']
            }], placement: [{
                type: Input
            }], container: [{
                type: Input
            }], display: [{
                type: Input
            }], openChange: [{
                type: Output
            }] } });

const NGB_DROPDOWN_DIRECTIVES = [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbNavbar];
class NgbDropdownModule {
}
NgbDropdownModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbDropdownModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownModule, declarations: [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbNavbar], exports: [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbNavbar] });
NgbDropdownModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdownModule, decorators: [{
            type: NgModule,
            args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES }]
        }] });

class ContentRef {
    constructor(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
}
class PopupService {
    constructor(_type, _injector, _viewContainerRef, _renderer, _ngZone, _applicationRef) {
        this._type = _type;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._applicationRef = _applicationRef;
        this._windowRef = null;
        this._contentRef = null;
    }
    open(content, context, animation = false) {
        if (!this._windowRef) {
            this._contentRef = this._getContentRef(content, context);
            this._windowRef = this._viewContainerRef.createComponent(this._type, { index: this._viewContainerRef.length, injector: this._injector, projectableNodes: this._contentRef.nodes });
        }
        const { nativeElement } = this._windowRef.location;
        const transition$ = this._ngZone.onStable.pipe(take(1), mergeMap(() => ngbRunTransition(this._ngZone, nativeElement, ({ classList }) => classList.add('show'), { animation, runningTransition: 'continue' })));
        return { windowRef: this._windowRef, transition$ };
    }
    close(animation = false) {
        if (!this._windowRef) {
            return of(undefined);
        }
        return ngbRunTransition(this._ngZone, this._windowRef.location.nativeElement, ({ classList }) => classList.remove('show'), { animation, runningTransition: 'stop' })
            .pipe(tap(() => {
            if (this._windowRef) {
                // this is required because of the container='body' option
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
                this._windowRef = null;
            }
            if (this._contentRef?.viewRef) {
                this._applicationRef.detachView(this._contentRef.viewRef);
                this._contentRef.viewRef.destroy();
                this._contentRef = null;
            }
        }));
    }
    _getContentRef(content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            const viewRef = content.createEmbeddedView(context);
            this._applicationRef.attachView(viewRef);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else {
            return new ContentRef([[this._renderer.createText(`${content}`)]]);
        }
    }
}

class NgbModalBackdrop {
    constructor(_el, _zone) {
        this._el = _el;
        this._zone = _zone;
    }
    ngOnInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            ngbRunTransition(this._zone, this._el.nativeElement, (element, animation) => {
                if (animation) {
                    reflow(element);
                }
                element.classList.add('show');
            }, { animation: this.animation, runningTransition: 'continue' });
        });
    }
    hide() {
        return ngbRunTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), { animation: this.animation, runningTransition: 'stop' });
    }
}
NgbModalBackdrop.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalBackdrop, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbModalBackdrop.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbModalBackdrop, selector: "ngb-modal-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass" }, host: { properties: { "class": "\"modal-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" }, styleAttribute: "z-index: 1055" }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-modal-backdrop',
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        'style': 'z-index: 1055'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }] } });

/**
 * A reference to the currently opened (active) modal.
 *
 * Instances of this class can be injected into your component passed as modal content.
 * So you can `.close()` or `.dismiss()` the modal window from your component.
 */
class NgbActiveModal {
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
class NgbModalRef {
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

var ModalDismissReasons;
(function (ModalDismissReasons) {
    ModalDismissReasons[ModalDismissReasons["BACKDROP_CLICK"] = 0] = "BACKDROP_CLICK";
    ModalDismissReasons[ModalDismissReasons["ESC"] = 1] = "ESC";
})(ModalDismissReasons || (ModalDismissReasons = {}));

class NgbModalWindow {
    constructor(_document, _elRef, _zone) {
        this._document = _document;
        this._elRef = _elRef;
        this._zone = _zone;
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to modal opening
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    get fullscreenClass() {
        return this.fullscreen === true ? ' modal-fullscreen' :
            isString(this.fullscreen) ? ` modal-fullscreen-${this.fullscreen}-down` : '';
    }
    dismiss(reason) { this.dismissEvent.emit(reason); }
    ngOnInit() {
        this._elWithFocus = this._document.activeElement;
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => { this._show(); });
    }
    ngOnDestroy() { this._disableEventHandling(); }
    hide() {
        const { nativeElement } = this._elRef;
        const context = { animation: this.animation, runningTransition: 'stop' };
        const windowTransition$ = ngbRunTransition(this._zone, nativeElement, () => nativeElement.classList.remove('show'), context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        const transitions$ = zip(windowTransition$, dialogTransition$);
        transitions$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return transitions$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        const windowTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show');
        }, context);
        const dialogTransition$ = ngbRunTransition(this._zone, this._dialogEl.nativeElement, () => { }, context);
        zip(windowTransition$, dialogTransition$).subscribe(() => {
            this.shown.next();
            this.shown.complete();
        });
        this._enableEventHandling();
        this._setFocus();
    }
    _enableEventHandling() {
        const { nativeElement } = this._elRef;
        this._zone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'keydown')
                .pipe(takeUntil(this._closed$), 
            /* eslint-disable-next-line deprecation/deprecation */
            filter(e => e.which === Key.Escape))
                .subscribe(event => {
                if (this.keyboard) {
                    requestAnimationFrame(() => {
                        if (!event.defaultPrevented) {
                            this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                        }
                    });
                }
                else if (this.backdrop === 'static') {
                    this._bumpBackdrop();
                }
            });
            // We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
            // inside the modal dialog and releasing it outside
            let preventClose = false;
            fromEvent(this._dialogEl.nativeElement, 'mousedown')
                .pipe(takeUntil(this._closed$), tap(() => preventClose = false), switchMap(() => fromEvent(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))), filter(({ target }) => nativeElement === target))
                .subscribe(() => { preventClose = true; });
            // We're listening to 'click' to dismiss modal on modal window click, except when:
            // 1. clicking on modal dialog itself
            // 2. closing was prevented by mousedown/up handlers
            // 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
            fromEvent(nativeElement, 'click').pipe(takeUntil(this._closed$)).subscribe(({ target }) => {
                if (nativeElement === target) {
                    if (this.backdrop === 'static') {
                        this._bumpBackdrop();
                    }
                    else if (this.backdrop === true && !preventClose) {
                        this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
                    }
                }
                preventClose = false;
            });
        });
    }
    _disableEventHandling() { this._closed$.next(); }
    _setFocus() {
        const { nativeElement } = this._elRef;
        if (!nativeElement.contains(document.activeElement)) {
            const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`);
            const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];
            const elementToFocus = autoFocusable || firstFocusable || nativeElement;
            elementToFocus.focus();
        }
    }
    _restoreFocus() {
        const body = this._document.body;
        const elWithFocus = this._elWithFocus;
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        this._zone.runOutsideAngular(() => {
            setTimeout(() => elementToFocus.focus());
            this._elWithFocus = null;
        });
    }
    _bumpBackdrop() {
        if (this.backdrop === 'static') {
            ngbRunTransition(this._zone, this._elRef.nativeElement, ({ classList }) => {
                classList.add('modal-static');
                return () => classList.remove('modal-static');
            }, { animation: this.animation, runningTransition: 'continue' });
        }
    }
}
NgbModalWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalWindow, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbModalWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbModalWindow, selector: "ngb-modal-window", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", backdrop: "backdrop", centered: "centered", fullscreen: "fullscreen", keyboard: "keyboard", scrollable: "scrollable", size: "size", windowClass: "windowClass", modalDialogClass: "modalDialogClass" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"modal d-block\" + (windowClass ? \" \" + windowClass : \"\")", "class.fade": "animation", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, viewQueries: [{ propertyName: "_dialogEl", first: true, predicate: ["dialog"], descendants: true, static: true }], ngImport: i0, template: `
    <div #dialog [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '') +
     fullscreenClass + (scrollable ? ' modal-dialog-scrollable' : '') + (modalDialogClass ? ' ' + modalDialogClass : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `, isInline: true, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalWindow, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-modal-window', host: {
                        '[class]': '"modal d-block" + (windowClass ? " " + windowClass : "")',
                        '[class.fade]': 'animation',
                        'role': 'dialog',
                        'tabindex': '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy'
                    }, template: `
    <div #dialog [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '') +
     fullscreenClass + (scrollable ? ' modal-dialog-scrollable' : '') + (modalDialogClass ? ' ' + modalDialogClass : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `, encapsulation: ViewEncapsulation.None, styles: ["ngb-modal-window .component-host-scrollable{display:flex;flex-direction:column;overflow:hidden}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { _dialogEl: [{
                type: ViewChild,
                args: ['dialog', { static: true }]
            }], animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], backdrop: [{
                type: Input
            }], centered: [{
                type: Input
            }], fullscreen: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], scrollable: [{
                type: Input
            }], size: [{
                type: Input
            }], windowClass: [{
                type: Input
            }], modalDialogClass: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });

/**
 * Utility to handle the scrollbar.
 *
 * It allows to hide the scrollbar and compensate the lack of a vertical scrollbar
 * by adding an equivalent padding on the right of the body, and to revert this change.
 */
class ScrollBar {
    constructor(_document) {
        this._document = _document;
    }
    /**
     * To be called to hide a potential vertical scrollbar:
     * - if a scrollbar is there and has a width greater than 0, adds some compensation
     * padding to the body to keep the same layout as when the scrollbar is there
     * - adds overflow: hidden
     *
     * @return a callback used to revert the change
     */
    hide() {
        const scrollbarWidth = Math.abs(window.innerWidth - this._document.documentElement.clientWidth);
        const body = this._document.body;
        const bodyStyle = body.style;
        const { overflow, paddingRight } = bodyStyle;
        if (scrollbarWidth > 0) {
            const actualPadding = parseFloat(window.getComputedStyle(body).paddingRight);
            bodyStyle.paddingRight = `${actualPadding + scrollbarWidth}px`;
        }
        bodyStyle.overflow = 'hidden';
        return () => {
            if (scrollbarWidth > 0) {
                bodyStyle.paddingRight = paddingRight;
            }
            bodyStyle.overflow = overflow;
        };
    }
}
ScrollBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ScrollBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });

class NgbModalStack {
    constructor(_applicationRef, _injector, _document, _scrollBar, _rendererFactory, _ngZone) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._rendererFactory = _rendererFactory;
        this._ngZone = _ngZone;
        this._activeWindowCmptHasChanged = new Subject();
        this._ariaHiddenValues = new Map();
        this._scrollBarRestoreFn = null;
        this._backdropAttributes = ['animation', 'backdropClass'];
        this._modalRefs = [];
        this._windowAttributes = [
            'animation', 'ariaLabelledBy', 'ariaDescribedBy', 'backdrop', 'centered', 'fullscreen', 'keyboard', 'scrollable',
            'size', 'windowClass', 'modalDialogClass'
        ];
        this._windowCmpts = [];
        this._activeInstances = new EventEmitter();
        // Trap focus on active WindowCmpt
        this._activeWindowCmptHasChanged.subscribe(() => {
            if (this._windowCmpts.length) {
                const activeWindowCmpt = this._windowCmpts[this._windowCmpts.length - 1];
                ngbFocusTrap(this._ngZone, activeWindowCmpt.location.nativeElement, this._activeWindowCmptHasChanged);
                this._revertAriaHidden();
                this._setAriaHidden(activeWindowCmpt.location.nativeElement);
            }
        });
    }
    _restoreScrollBar() {
        const scrollBarRestoreFn = this._scrollBarRestoreFn;
        if (scrollBarRestoreFn) {
            this._scrollBarRestoreFn = null;
            scrollBarRestoreFn();
        }
    }
    _hideScrollBar() {
        if (!this._scrollBarRestoreFn) {
            this._scrollBarRestoreFn = this._scrollBar.hide();
        }
    }
    open(moduleCFR, contentInjector, content, options) {
        const containerEl = options.container instanceof HTMLElement ? options.container : isDefined(options.container) ?
            this._document.querySelector(options.container) :
            this._document.body;
        const renderer = this._rendererFactory.createRenderer(null, null);
        if (!containerEl) {
            throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
        }
        this._hideScrollBar();
        const activeModal = new NgbActiveModal();
        const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeModal, options);
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : undefined;
        let windowCmptRef = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        let ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerModalRef(ngbModalRef);
        this._registerWindowCmpt(windowCmptRef);
        // We have to cleanup DOM after the last modal when BOTH 'hidden' was emitted and 'result' promise was resolved:
        // - with animations OFF, 'hidden' emits synchronously, then 'result' is resolved asynchronously
        // - with animations ON, 'result' is resolved asynchronously, then 'hidden' emits asynchronously
        ngbModalRef.hidden.pipe(take(1)).subscribe(() => Promise.resolve(true).then(() => {
            if (!this._modalRefs.length) {
                renderer.removeClass(this._document.body, 'modal-open');
                this._restoreScrollBar();
                this._revertAriaHidden();
            }
        }));
        activeModal.close = (result) => { ngbModalRef.close(result); };
        activeModal.dismiss = (reason) => { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        if (this._modalRefs.length === 1) {
            renderer.addClass(this._document.body, 'modal-open');
        }
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
            backdropCmptRef.changeDetectorRef.detectChanges();
        }
        windowCmptRef.changeDetectorRef.detectChanges();
        return ngbModalRef;
    }
    get activeInstances() { return this._activeInstances; }
    dismissAll(reason) { this._modalRefs.forEach(ngbModalRef => ngbModalRef.dismiss(reason)); }
    hasOpenModals() { return this._modalRefs.length > 0; }
    _attachBackdrop(moduleCFR, containerEl) {
        let backdropFactory = moduleCFR.resolveComponentFactory(NgbModalBackdrop);
        let backdropCmptRef = backdropFactory.create(this._injector);
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    _attachWindowComponent(moduleCFR, containerEl, contentRef) {
        let windowFactory = moduleCFR.resolveComponentFactory(NgbModalWindow);
        let windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }
    _applyWindowOptions(windowInstance, options) {
        this._windowAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    _getContentRef(moduleCFR, contentInjector, content, activeModal, options) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeModal);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(moduleCFR, contentInjector, content, activeModal, options);
        }
    }
    _createFromTemplateRef(content, activeModal) {
        const context = {
            $implicit: activeModal,
            close(result) { activeModal.close(result); },
            dismiss(reason) { activeModal.dismiss(reason); }
        };
        const viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    _createFromString(content) {
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    _createFromComponent(moduleCFR, contentInjector, content, context, options) {
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        const modalContentInjector = Injector.create({ providers: [{ provide: NgbActiveModal, useValue: context }], parent: contentInjector });
        const componentRef = contentCmptFactory.create(modalContentInjector);
        const componentNativeEl = componentRef.location.nativeElement;
        if (options.scrollable) {
            componentNativeEl.classList.add('component-host-scrollable');
        }
        this._applicationRef.attachView(componentRef.hostView);
        // FIXME: we should here get rid of the component nativeElement
        // and use `[Array.from(componentNativeEl.childNodes)]` instead and remove the above CSS class.
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    }
    _setAriaHidden(element) {
        const parent = element.parentElement;
        if (parent && element !== this._document.body) {
            Array.from(parent.children).forEach(sibling => {
                if (sibling !== element && sibling.nodeName !== 'SCRIPT') {
                    this._ariaHiddenValues.set(sibling, sibling.getAttribute('aria-hidden'));
                    sibling.setAttribute('aria-hidden', 'true');
                }
            });
            this._setAriaHidden(parent);
        }
    }
    _revertAriaHidden() {
        this._ariaHiddenValues.forEach((value, element) => {
            if (value) {
                element.setAttribute('aria-hidden', value);
            }
            else {
                element.removeAttribute('aria-hidden');
            }
        });
        this._ariaHiddenValues.clear();
    }
    _registerModalRef(ngbModalRef) {
        const unregisterModalRef = () => {
            const index = this._modalRefs.indexOf(ngbModalRef);
            if (index > -1) {
                this._modalRefs.splice(index, 1);
                this._activeInstances.emit(this._modalRefs);
            }
        };
        this._modalRefs.push(ngbModalRef);
        this._activeInstances.emit(this._modalRefs);
        ngbModalRef.result.then(unregisterModalRef, unregisterModalRef);
    }
    _registerWindowCmpt(ngbWindowCmpt) {
        this._windowCmpts.push(ngbWindowCmpt);
        this._activeWindowCmptHasChanged.next();
        ngbWindowCmpt.onDestroy(() => {
            const index = this._windowCmpts.indexOf(ngbWindowCmpt);
            if (index > -1) {
                this._windowCmpts.splice(index, 1);
                this._activeWindowCmptHasChanged.next();
            }
        });
    }
}
NgbModalStack.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }, { token: ScrollBar }, { token: i0.RendererFactory2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModalStack.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: ScrollBar }, { type: i0.RendererFactory2 }, { type: i0.NgZone }]; } });

/**
 * A configuration service for the [`NgbModal`](#/components/modal/api#NgbModal) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all modals used in the application.
*
* @since 3.1.0
*/
class NgbModalConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.backdrop = true;
        this.fullscreen = false;
        this.keyboard = true;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbModalConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModalConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

/**
 * A service for opening modal windows.
 *
 * Creating a modal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
class NgbModal {
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
NgbModal.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.Injector }, { token: NgbModalStack }, { token: NgbModalConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModal.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModal, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.Injector }, { type: NgbModalStack }, { type: NgbModalConfig }]; } });

class NgbModalModule {
}
NgbModalModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbModalModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalModule, declarations: [NgbModalBackdrop, NgbModalWindow] });
NgbModalModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalModule, providers: [NgbModal] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbModalBackdrop, NgbModalWindow], providers: [NgbModal] }]
        }] });

/**
 * A configuration service for the [`NgbNav`](#/components/nav/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 *
 * @since 5.2.0
 */
class NgbNavConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.destroyOnHide = true;
        this.orientation = 'horizontal';
        this.roles = 'tablist';
        this.keyboard = false;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbNavConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbNavConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

const isValidNavId = (id) => isDefined(id) && id !== '';
let navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
class NgbNavContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbNavContent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavContent, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavContent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavContent, selector: "ng-template[ngbNavContent]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavContent, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbNavContent]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * The directive used to group nav link and related nav content. As well as set nav identifier and some options.
 *
 * @since 5.2.0
 */
class NgbNavItem {
    constructor(nav, elementRef) {
        this.elementRef = elementRef;
        /**
         * If `true`, the current nav item is disabled and can't be toggled by user.
         *
         * Nevertheless disabled nav can be selected programmatically via the `.select()` method and the `[activeId]` binding.
         */
        this.disabled = false;
        /**
         * An event emitted when the fade in transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        // TODO: cf https://github.com/angular/angular/issues/30106
        this._nav = nav;
    }
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.contentTpl = this.contentTpls.first;
    }
    ngOnInit() {
        if (!isDefined(this.domId)) {
            this.domId = `ngb-nav-${navCounter++}`;
        }
    }
    get active() { return this._nav.activeId === this.id; }
    get id() { return isValidNavId(this._id) ? this._id : this.domId; }
    get panelDomId() { return `${this.domId}-panel`; }
    isPanelInDom() {
        return (isDefined(this.destroyOnHide) ? !this.destroyOnHide : !this._nav.destroyOnHide) || this.active;
    }
}
NgbNavItem.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavItem, deps: [{ token: forwardRef(() => NgbNav) }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavItem.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavItem, selector: "[ngbNavItem]", inputs: { destroyOnHide: "destroyOnHide", disabled: "disabled", domId: "domId", _id: ["ngbNavItem", "_id"] }, outputs: { shown: "shown", hidden: "hidden" }, host: { properties: { "class.nav-item": "true" } }, queries: [{ propertyName: "contentTpls", predicate: NgbNavContent }], exportAs: ["ngbNavItem"], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavItem, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbNavItem]', exportAs: 'ngbNavItem', host: { '[class.nav-item]': 'true' } }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => NgbNav)]
                }] }, { type: i0.ElementRef }]; }, propDecorators: { destroyOnHide: [{
                type: Input
            }], disabled: [{
                type: Input
            }], domId: [{
                type: Input
            }], _id: [{
                type: Input,
                args: ['ngbNavItem']
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], contentTpls: [{
                type: ContentChildren,
                args: [NgbNavContent, { descendants: false }]
            }] } });
/**
 * A nav directive that helps with implementing tabbed navigation components.
 *
 * @since 5.2.0
 */
class NgbNav {
    constructor(role, config, _cd, _document) {
        this.role = role;
        this._cd = _cd;
        this._document = _document;
        /**
         * The event emitted after the active nav changes
         * The payload of the event is the newly active nav id
         *
         * If you want to prevent nav change, you should use `(navChange)` event
         */
        this.activeIdChange = new EventEmitter();
        /**
         * An event emitted when the fade in transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just shown.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just hidden.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.destroy$ = new Subject();
        this.navItemChange$ = new Subject();
        /**
         * The nav change event emitted right before the nav change happens on user click.
         *
         * This event won't be emitted if nav is changed programmatically via `[activeId]` or `.select()`.
         *
         * See [`NgbNavChangeEvent`](#/components/nav/api#NgbNavChangeEvent) for payload details.
         */
        this.navChange = new EventEmitter();
        this.animation = config.animation;
        this.destroyOnHide = config.destroyOnHide;
        this.orientation = config.orientation;
        this.roles = config.roles;
        this.keyboard = config.keyboard;
    }
    click(item) {
        if (!item.disabled) {
            this._updateActiveId(item.id);
        }
    }
    onKeyDown(event) {
        if (this.roles !== 'tablist' || !this.keyboard) {
            return;
        }
        /* eslint-disable-next-line deprecation/deprecation */
        const key = event.which;
        const enabledLinks = this.links.filter(link => !link.navItem.disabled);
        const { length } = enabledLinks;
        let position = -1;
        enabledLinks.forEach((link, index) => {
            if (link.elRef.nativeElement === this._document.activeElement) {
                position = index;
            }
        });
        if (length) {
            switch (key) {
                case Key.ArrowLeft:
                    if (this.orientation === 'vertical') {
                        return;
                    }
                    position = (position - 1 + length) % length;
                    break;
                case Key.ArrowRight:
                    if (this.orientation === 'vertical') {
                        return;
                    }
                    position = (position + 1) % length;
                    break;
                case Key.ArrowDown:
                    if (this.orientation === 'horizontal') {
                        return;
                    }
                    position = (position + 1) % length;
                    break;
                case Key.ArrowUp:
                    if (this.orientation === 'horizontal') {
                        return;
                    }
                    position = (position - 1 + length) % length;
                    break;
                case Key.Home:
                    position = 0;
                    break;
                case Key.End:
                    position = length - 1;
                    break;
            }
            if (this.keyboard === 'changeWithArrows') {
                this.select(enabledLinks[position].navItem.id);
            }
            enabledLinks[position].elRef.nativeElement.focus();
            event.preventDefault();
        }
    }
    /**
     * Selects the nav with the given id and shows its associated pane.
     * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
     */
    select(id) { this._updateActiveId(id, false); }
    ngAfterContentInit() {
        if (!isDefined(this.activeId)) {
            const nextId = this.items.first ? this.items.first.id : null;
            if (isValidNavId(nextId)) {
                this._updateActiveId(nextId, false);
                this._cd.detectChanges();
            }
        }
        this.items.changes.pipe(takeUntil(this.destroy$)).subscribe(() => this._notifyItemChanged(this.activeId));
    }
    ngOnChanges({ activeId }) {
        if (activeId && !activeId.firstChange) {
            this._notifyItemChanged(activeId.currentValue);
        }
    }
    ngOnDestroy() { this.destroy$.next(); }
    _updateActiveId(nextId, emitNavChange = true) {
        if (this.activeId !== nextId) {
            let defaultPrevented = false;
            if (emitNavChange) {
                this.navChange.emit({ activeId: this.activeId, nextId, preventDefault: () => { defaultPrevented = true; } });
            }
            if (!defaultPrevented) {
                this.activeId = nextId;
                this.activeIdChange.emit(nextId);
                this._notifyItemChanged(nextId);
            }
        }
    }
    _notifyItemChanged(nextItemId) { this.navItemChange$.next(this._getItemById(nextItemId)); }
    _getItemById(itemId) {
        return this.items && this.items.find(item => item.id === itemId) || null;
    }
}
NgbNav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNav, deps: [{ token: 'role', attribute: true }, { token: NgbNavConfig }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
NgbNav.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNav, selector: "[ngbNav]", inputs: { activeId: "activeId", animation: "animation", destroyOnHide: "destroyOnHide", orientation: "orientation", roles: "roles", keyboard: "keyboard" }, outputs: { activeIdChange: "activeIdChange", shown: "shown", hidden: "hidden", navChange: "navChange" }, host: { listeners: { "keydown.arrowLeft": "onKeyDown($event)", "keydown.arrowRight": "onKeyDown($event)", "keydown.arrowDown": "onKeyDown($event)", "keydown.arrowUp": "onKeyDown($event)", "keydown.Home": "onKeyDown($event)", "keydown.End": "onKeyDown($event)" }, properties: { "class.nav": "true", "class.flex-column": "orientation === 'vertical'", "attr.aria-orientation": "orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined", "attr.role": "role ? role : roles ? 'tablist' : undefined" } }, queries: [{ propertyName: "items", predicate: NgbNavItem }, { propertyName: "links", predicate: i0.forwardRef(function () { return NgbNavLink; }), descendants: true }], exportAs: ["ngbNav"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNav, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNav]',
                    exportAs: 'ngbNav',
                    host: {
                        '[class.nav]': 'true',
                        '[class.flex-column]': `orientation === 'vertical'`,
                        '[attr.aria-orientation]': `orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined`,
                        '[attr.role]': `role ? role : roles ? 'tablist' : undefined`,
                        '(keydown.arrowLeft)': 'onKeyDown($event)',
                        '(keydown.arrowRight)': 'onKeyDown($event)',
                        '(keydown.arrowDown)': 'onKeyDown($event)',
                        '(keydown.arrowUp)': 'onKeyDown($event)',
                        '(keydown.Home)': 'onKeyDown($event)',
                        '(keydown.End)': 'onKeyDown($event)'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['role']
                }] }, { type: NgbNavConfig }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; }, propDecorators: { activeId: [{
                type: Input
            }], activeIdChange: [{
                type: Output
            }], animation: [{
                type: Input
            }], destroyOnHide: [{
                type: Input
            }], orientation: [{
                type: Input
            }], roles: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], items: [{
                type: ContentChildren,
                args: [NgbNavItem]
            }], links: [{
                type: ContentChildren,
                args: [forwardRef(() => NgbNavLink), { descendants: true }]
            }], navChange: [{
                type: Output
            }] } });
/**
 * A directive to put on the nav link.
 *
 * @since 5.2.0
 */
class NgbNavLink {
    constructor(role, navItem, nav, elRef) {
        this.role = role;
        this.navItem = navItem;
        this.nav = nav;
        this.elRef = elRef;
    }
    hasNavItemClass() {
        // with alternative markup we have to add `.nav-item` class, because `ngbNavItem` is on the ng-container
        return this.navItem.elementRef.nativeElement.nodeType === Node.COMMENT_NODE;
    }
}
NgbNavLink.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavLink, deps: [{ token: 'role', attribute: true }, { token: NgbNavItem }, { token: NgbNav }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavLink.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavLink, selector: "a[ngbNavLink]", host: { attributes: { "href": "" }, listeners: { "click": "nav.click(navItem); $event.preventDefault()" }, properties: { "id": "navItem.domId", "class.nav-link": "true", "class.nav-item": "hasNavItemClass()", "attr.role": "role ? role : nav.roles ? 'tab' : undefined", "class.active": "navItem.active", "class.disabled": "navItem.disabled", "attr.tabindex": "navItem.disabled ? -1 : undefined", "attr.aria-controls": "navItem.isPanelInDom() ? navItem.panelDomId : null", "attr.aria-selected": "navItem.active", "attr.aria-disabled": "navItem.disabled" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavLink, decorators: [{
            type: Directive,
            args: [{
                    selector: 'a[ngbNavLink]',
                    host: {
                        '[id]': 'navItem.domId',
                        '[class.nav-link]': 'true',
                        '[class.nav-item]': 'hasNavItemClass()',
                        '[attr.role]': `role ? role : nav.roles ? 'tab' : undefined`,
                        'href': '',
                        '[class.active]': 'navItem.active',
                        '[class.disabled]': 'navItem.disabled',
                        '[attr.tabindex]': 'navItem.disabled ? -1 : undefined',
                        '[attr.aria-controls]': 'navItem.isPanelInDom() ? navItem.panelDomId : null',
                        '[attr.aria-selected]': 'navItem.active',
                        '[attr.aria-disabled]': 'navItem.disabled',
                        '(click)': 'nav.click(navItem); $event.preventDefault()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['role']
                }] }, { type: NgbNavItem }, { type: NgbNav }, { type: i0.ElementRef }]; } });

const ngbNavFadeOutTransition = ({ classList }) => {
    classList.remove('show');
    return () => classList.remove('active');
};
const ngbNavFadeInTransition = (element, animation) => {
    if (animation) {
        reflow(element);
    }
    element.classList.add('show');
};

class NgbNavPane {
    constructor(elRef) {
        this.elRef = elRef;
    }
}
NgbNavPane.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavPane, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavPane.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavPane, selector: "[ngbNavPane]", inputs: { item: "item", nav: "nav", role: "role" }, host: { properties: { "id": "item.panelDomId", "class.fade": "nav.animation", "attr.role": "role ? role : nav.roles ? \"tabpanel\" : undefined", "attr.aria-labelledby": "item.domId" }, classAttribute: "tab-pane" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavPane, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavPane]',
                    host: {
                        '[id]': 'item.panelDomId',
                        'class': 'tab-pane',
                        '[class.fade]': 'nav.animation',
                        '[attr.role]': 'role ? role : nav.roles ? "tabpanel" : undefined',
                        '[attr.aria-labelledby]': 'item.domId'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { item: [{
                type: Input
            }], nav: [{
                type: Input
            }], role: [{
                type: Input
            }] } });
/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
class NgbNavOutlet {
    constructor(_cd, _ngZone) {
        this._cd = _cd;
        this._ngZone = _ngZone;
        this._activePane = null;
    }
    isPanelTransitioning(item) { return this._activePane?.item === item; }
    ngAfterViewInit() {
        // initial display
        this._updateActivePane();
        // this will be emitted for all 3 types of nav changes: .select(), [activeId] or (click)
        this.nav.navItemChange$
            .pipe(takeUntil(this.nav.destroy$), startWith(this._activePane?.item || null), distinctUntilChanged(), skip(1))
            .subscribe(nextItem => {
            const options = { animation: this.nav.animation, runningTransition: 'stop' };
            // next panel we're switching to will only appear in DOM after the change detection is done
            // and `this._panes` will be updated
            this._cd.detectChanges();
            // fading out
            if (this._activePane) {
                ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeOutTransition, options)
                    .subscribe(() => {
                    const activeItem = this._activePane?.item;
                    this._activePane = this._getPaneForItem(nextItem);
                    // mark for check when transition finishes as outlet or parent containers might be OnPush
                    // without this the panes that have "faded out" will stay in DOM
                    this._cd.markForCheck();
                    // fading in
                    if (this._activePane) {
                        // we have to add the '.active' class before running the transition,
                        // because it should be in place before `ngbRunTransition` does `reflow()`
                        this._activePane.elRef.nativeElement.classList.add('active');
                        ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeInTransition, options)
                            .subscribe(() => {
                            if (nextItem) {
                                nextItem.shown.emit();
                                this.nav.shown.emit(nextItem.id);
                            }
                        });
                    }
                    if (activeItem) {
                        activeItem.hidden.emit();
                        this.nav.hidden.emit(activeItem.id);
                    }
                });
            }
            else {
                this._updateActivePane();
            }
        });
    }
    _updateActivePane() {
        this._activePane = this._getActivePane();
        this._activePane?.elRef.nativeElement.classList.add('show');
        this._activePane?.elRef.nativeElement.classList.add('active');
    }
    _getPaneForItem(item) {
        return this._panes && this._panes.find(pane => pane.item === item) || null;
    }
    _getActivePane() {
        return this._panes && this._panes.find(pane => pane.item.active) || null;
    }
}
NgbNavOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavOutlet, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbNavOutlet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavOutlet, selector: "[ngbNavOutlet]", inputs: { paneRole: "paneRole", nav: ["ngbNavOutlet", "nav"] }, host: { properties: { "class.tab-content": "true" } }, viewQueries: [{ propertyName: "_panes", predicate: NgbNavPane, descendants: true }], ngImport: i0, template: `
    <ng-template ngFor let-item [ngForOf]="nav.items">
      <div ngbNavPane *ngIf="item.isPanelInDom() || isPanelTransitioning(item)" [item]="item" [nav]="nav" [role]="paneRole">
        <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                     [ngTemplateOutletContext]="{$implicit: item.active || isPanelTransitioning(item)}"></ng-template>
      </div>
    </ng-template>
  `, isInline: true, directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: NgbNavPane, selector: "[ngbNavPane]", inputs: ["item", "nav", "role"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavOutlet, decorators: [{
            type: Component,
            args: [{
                    selector: '[ngbNavOutlet]',
                    host: { '[class.tab-content]': 'true' },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `
    <ng-template ngFor let-item [ngForOf]="nav.items">
      <div ngbNavPane *ngIf="item.isPanelInDom() || isPanelTransitioning(item)" [item]="item" [nav]="nav" [role]="paneRole">
        <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                     [ngTemplateOutletContext]="{$implicit: item.active || isPanelTransitioning(item)}"></ng-template>
      </div>
    </ng-template>
  `
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { _panes: [{
                type: ViewChildren,
                args: [NgbNavPane]
            }], paneRole: [{
                type: Input
            }], nav: [{
                type: Input,
                args: ['ngbNavOutlet']
            }] } });

const NGB_NAV_DIRECTIVES = [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbNavPane];
class NgbNavModule {
}
NgbNavModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbNavModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavModule, declarations: [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbNavPane], imports: [CommonModule], exports: [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavOutlet, NgbNavPane] });
NgbNavModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavModule, decorators: [{
            type: NgModule,
            args: [{ declarations: NGB_NAV_DIRECTIVES, exports: NGB_NAV_DIRECTIVES, imports: [CommonModule] }]
        }] });

/**
 * A configuration service for the [`NgbPagination`](#/components/pagination/api#NgbPagination) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
class NgbPaginationConfig {
    constructor() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
}
NgbPaginationConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbPaginationConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
class NgbPaginationEllipsis {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationEllipsis.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationEllipsis, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationEllipsis.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationEllipsis, selector: "ng-template[ngbPaginationEllipsis]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationEllipsis, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationEllipsis]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the 'first' link template
 *
 * @since 4.1.0
 */
class NgbPaginationFirst {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationFirst.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationFirst, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationFirst.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationFirst, selector: "ng-template[ngbPaginationFirst]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationFirst, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationFirst]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the 'last' link template
 *
 * @since 4.1.0
 */
class NgbPaginationLast {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationLast.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationLast, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationLast.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationLast, selector: "ng-template[ngbPaginationLast]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationLast, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationLast]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the 'next' link template
 *
 * @since 4.1.0
 */
class NgbPaginationNext {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationNext.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationNext, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationNext.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationNext, selector: "ng-template[ngbPaginationNext]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationNext, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationNext]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the page 'number' link template
 *
 * @since 4.1.0
 */
class NgbPaginationNumber {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationNumber.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationNumber, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationNumber.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationNumber, selector: "ng-template[ngbPaginationNumber]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationNumber, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationNumber]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the 'previous' link template
 *
 * @since 4.1.0
 */
class NgbPaginationPrevious {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationPrevious.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationPrevious, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationPrevious.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationPrevious, selector: "ng-template[ngbPaginationPrevious]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationPrevious, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationPrevious]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A directive to match the 'pages' whole content
 *
 * @since 9.1.0
 */
class NgbPaginationPages {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPaginationPages.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationPages, deps: [{ token: i0.TemplateRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPaginationPages.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPaginationPages, selector: "ng-template[ngbPaginationPages]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationPages, decorators: [{
            type: Directive,
            args: [{ selector: 'ng-template[ngbPaginationPages]' }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }]; } });
/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
class NgbPagination {
    constructor(config) {
        this.pageCount = 0;
        this.pages = [];
        /**
         *  The current page.
         *
         *  Page numbers start with `1`.
         */
        this.page = 1;
        /**
         *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
         *
         *  Event payload is the number of the newly selected page.
         *
         *  Page numbers start with `1`.
         */
        this.pageChange = new EventEmitter(true);
        this.disabled = config.disabled;
        this.boundaryLinks = config.boundaryLinks;
        this.directionLinks = config.directionLinks;
        this.ellipses = config.ellipses;
        this.maxSize = config.maxSize;
        this.pageSize = config.pageSize;
        this.rotate = config.rotate;
        this.size = config.size;
    }
    hasPrevious() { return this.page > 1; }
    hasNext() { return this.page < this.pageCount; }
    nextDisabled() { return !this.hasNext() || this.disabled; }
    previousDisabled() { return !this.hasPrevious() || this.disabled; }
    selectPage(pageNumber) { this._updatePages(pageNumber); }
    ngOnChanges(changes) { this._updatePages(this.page); }
    isEllipsis(pageNumber) { return pageNumber === -1; }
    /**
     * Appends ellipses and first/last page number to the displayed pages
     */
    _applyEllipses(start, end) {
        if (this.ellipses) {
            if (start > 0) {
                // The first page will always be included. If the displayed range
                // starts after the third page, then add ellipsis. But if the range
                // starts on the third page, then add the second page instead of
                // an ellipsis, because the ellipsis would only hide a single page.
                if (start > 2) {
                    this.pages.unshift(-1);
                }
                else if (start === 2) {
                    this.pages.unshift(2);
                }
                this.pages.unshift(1);
            }
            if (end < this.pageCount) {
                // The last page will always be included. If the displayed range
                // ends before the third-last page, then add ellipsis. But if the range
                // ends on third-last page, then add the second-last page instead of
                // an ellipsis, because the ellipsis would only hide a single page.
                if (end < (this.pageCount - 2)) {
                    this.pages.push(-1);
                }
                else if (end === (this.pageCount - 2)) {
                    this.pages.push(this.pageCount - 1);
                }
                this.pages.push(this.pageCount);
            }
        }
    }
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     */
    _applyRotation() {
        let start = 0;
        let end = this.pageCount;
        let leftOffset = Math.floor(this.maxSize / 2);
        let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
        if (this.page <= leftOffset) {
            // very beginning, no rotation -> [0..maxSize]
            end = this.maxSize;
        }
        else if (this.pageCount - this.page < leftOffset) {
            // very end, no rotation -> [len-maxSize..len]
            start = this.pageCount - this.maxSize;
        }
        else {
            // rotate
            start = this.page - leftOffset - 1;
            end = this.page + rightOffset;
        }
        return [start, end];
    }
    /**
     * Paginates page numbers based on maxSize items per page.
     */
    _applyPagination() {
        let page = Math.ceil(this.page / this.maxSize) - 1;
        let start = page * this.maxSize;
        let end = start + this.maxSize;
        return [start, end];
    }
    _setPageInRange(newPageNo) {
        const prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
            this.pageChange.emit(this.page);
        }
    }
    _updatePages(newPage) {
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (let i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            let start = 0;
            let end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                [start, end] = this._applyRotation();
            }
            else {
                [start, end] = this._applyPagination();
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
    }
}
NgbPagination.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPagination, deps: [{ token: NgbPaginationConfig }], target: i0.ɵɵFactoryTarget.Component });
NgbPagination.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbPagination, selector: "ngb-pagination", inputs: { disabled: "disabled", boundaryLinks: "boundaryLinks", directionLinks: "directionLinks", ellipses: "ellipses", rotate: "rotate", collectionSize: "collectionSize", maxSize: "maxSize", page: "page", pageSize: "pageSize", size: "size" }, outputs: { pageChange: "pageChange" }, host: { attributes: { "role": "navigation" } }, queries: [{ propertyName: "tplEllipsis", first: true, predicate: NgbPaginationEllipsis, descendants: true }, { propertyName: "tplFirst", first: true, predicate: NgbPaginationFirst, descendants: true }, { propertyName: "tplLast", first: true, predicate: NgbPaginationLast, descendants: true }, { propertyName: "tplNext", first: true, predicate: NgbPaginationNext, descendants: true }, { propertyName: "tplNumber", first: true, predicate: NgbPaginationNumber, descendants: true }, { propertyName: "tplPrevious", first: true, predicate: NgbPaginationPrevious, descendants: true }, { propertyName: "tplPages", first: true, predicate: NgbPaginationPages, descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
    <ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
    <ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
    <ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
    <ng-template #ellipsis>...</ng-template>
    <ng-template #defaultNumber let-page let-currentPage="currentPage">
      {{ page }}
      <span *ngIf="page === currentPage" class="visually-hidden">(current)</span>
    </ng-template>
    <ng-template #defaultPages let-page let-pages="pages" let-disabled="disabled">
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled" [attr.aria-current]="(pageNumber === page ? 'page' : null)">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link" tabindex="-1" aria-disabled="true">
          <ng-template [ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
                      [ngTemplateOutletContext]="{disabled: true, currentPage: page}"></ng-template>
        </a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="selectPage(pageNumber); $event.preventDefault()"
          [attr.tabindex]="disabled ? '-1' : null" [attr.aria-disabled]="disabled ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
                      [ngTemplateOutletContext]="{disabled: disabled, $implicit: pageNumber, currentPage: page}"></ng-template>
        </a>
      </li>
    </ng-template>
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="First" i18n-aria-label="@@ngb.pagination.first-aria" class="page-link" href
          (click)="selectPage(1); $event.preventDefault()" [attr.tabindex]="previousDisabled() ? '-1' : null"
          [attr.aria-disabled]="previousDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplFirst?.templateRef || first"
                       [ngTemplateOutletContext]="{disabled: previousDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="Previous" i18n-aria-label="@@ngb.pagination.previous-aria" class="page-link" href
          (click)="selectPage(page-1); $event.preventDefault()" [attr.tabindex]="previousDisabled() ? '-1' : null"
          [attr.aria-disabled]="previousDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplPrevious?.templateRef || previous"
                       [ngTemplateOutletContext]="{disabled: previousDisabled()}"></ng-template>
        </a>
      </li>
      <ng-template
        [ngTemplateOutlet]="tplPages?.templateRef || defaultPages"
        [ngTemplateOutletContext]="{ $implicit: page, pages: pages, disabled: disabled }"
      >
      </ng-template>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Next" i18n-aria-label="@@ngb.pagination.next-aria" class="page-link" href
          (click)="selectPage(page+1); $event.preventDefault()" [attr.tabindex]="nextDisabled() ? '-1' : null"
          [attr.aria-disabled]="nextDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplNext?.templateRef || next"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Last" i18n-aria-label="@@ngb.pagination.last-aria" class="page-link" href
          (click)="selectPage(pageCount); $event.preventDefault()" [attr.tabindex]="nextDisabled() ? '-1' : null"
          [attr.aria-disabled]="nextDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplLast?.templateRef || last"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>
    </ul>
  `, isInline: true, directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPagination, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-pagination',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: { 'role': 'navigation' },
                    template: `
    <ng-template #first><span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span></ng-template>
    <ng-template #previous><span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span></ng-template>
    <ng-template #next><span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span></ng-template>
    <ng-template #last><span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span></ng-template>
    <ng-template #ellipsis>...</ng-template>
    <ng-template #defaultNumber let-page let-currentPage="currentPage">
      {{ page }}
      <span *ngIf="page === currentPage" class="visually-hidden">(current)</span>
    </ng-template>
    <ng-template #defaultPages let-page let-pages="pages" let-disabled="disabled">
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled" [attr.aria-current]="(pageNumber === page ? 'page' : null)">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link" tabindex="-1" aria-disabled="true">
          <ng-template [ngTemplateOutlet]="tplEllipsis?.templateRef || ellipsis"
                      [ngTemplateOutletContext]="{disabled: true, currentPage: page}"></ng-template>
        </a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="selectPage(pageNumber); $event.preventDefault()"
          [attr.tabindex]="disabled ? '-1' : null" [attr.aria-disabled]="disabled ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplNumber?.templateRef || defaultNumber"
                      [ngTemplateOutletContext]="{disabled: disabled, $implicit: pageNumber, currentPage: page}"></ng-template>
        </a>
      </li>
    </ng-template>
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="First" i18n-aria-label="@@ngb.pagination.first-aria" class="page-link" href
          (click)="selectPage(1); $event.preventDefault()" [attr.tabindex]="previousDisabled() ? '-1' : null"
          [attr.aria-disabled]="previousDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplFirst?.templateRef || first"
                       [ngTemplateOutletContext]="{disabled: previousDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="previousDisabled()">
        <a aria-label="Previous" i18n-aria-label="@@ngb.pagination.previous-aria" class="page-link" href
          (click)="selectPage(page-1); $event.preventDefault()" [attr.tabindex]="previousDisabled() ? '-1' : null"
          [attr.aria-disabled]="previousDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplPrevious?.templateRef || previous"
                       [ngTemplateOutletContext]="{disabled: previousDisabled()}"></ng-template>
        </a>
      </li>
      <ng-template
        [ngTemplateOutlet]="tplPages?.templateRef || defaultPages"
        [ngTemplateOutletContext]="{ $implicit: page, pages: pages, disabled: disabled }"
      >
      </ng-template>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Next" i18n-aria-label="@@ngb.pagination.next-aria" class="page-link" href
          (click)="selectPage(page+1); $event.preventDefault()" [attr.tabindex]="nextDisabled() ? '-1' : null"
          [attr.aria-disabled]="nextDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplNext?.templateRef || next"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="nextDisabled()">
        <a aria-label="Last" i18n-aria-label="@@ngb.pagination.last-aria" class="page-link" href
          (click)="selectPage(pageCount); $event.preventDefault()" [attr.tabindex]="nextDisabled() ? '-1' : null"
          [attr.aria-disabled]="nextDisabled() ? 'true' : null">
          <ng-template [ngTemplateOutlet]="tplLast?.templateRef || last"
                       [ngTemplateOutletContext]="{disabled: nextDisabled(), currentPage: page}"></ng-template>
        </a>
      </li>
    </ul>
  `
                }]
        }], ctorParameters: function () { return [{ type: NgbPaginationConfig }]; }, propDecorators: { tplEllipsis: [{
                type: ContentChild,
                args: [NgbPaginationEllipsis, { static: false }]
            }], tplFirst: [{
                type: ContentChild,
                args: [NgbPaginationFirst, { static: false }]
            }], tplLast: [{
                type: ContentChild,
                args: [NgbPaginationLast, { static: false }]
            }], tplNext: [{
                type: ContentChild,
                args: [NgbPaginationNext, { static: false }]
            }], tplNumber: [{
                type: ContentChild,
                args: [NgbPaginationNumber, { static: false }]
            }], tplPrevious: [{
                type: ContentChild,
                args: [NgbPaginationPrevious, { static: false }]
            }], tplPages: [{
                type: ContentChild,
                args: [NgbPaginationPages, { static: false }]
            }], disabled: [{
                type: Input
            }], boundaryLinks: [{
                type: Input
            }], directionLinks: [{
                type: Input
            }], ellipses: [{
                type: Input
            }], rotate: [{
                type: Input
            }], collectionSize: [{
                type: Input
            }], maxSize: [{
                type: Input
            }], page: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageChange: [{
                type: Output
            }], size: [{
                type: Input
            }] } });

const DIRECTIVES = [
    NgbPagination, NgbPaginationEllipsis, NgbPaginationFirst, NgbPaginationLast, NgbPaginationNext, NgbPaginationNumber,
    NgbPaginationPrevious, NgbPaginationPages
];
class NgbPaginationModule {
}
NgbPaginationModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbPaginationModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationModule, declarations: [NgbPagination, NgbPaginationEllipsis, NgbPaginationFirst, NgbPaginationLast, NgbPaginationNext, NgbPaginationNumber,
        NgbPaginationPrevious, NgbPaginationPages], imports: [CommonModule], exports: [NgbPagination, NgbPaginationEllipsis, NgbPaginationFirst, NgbPaginationLast, NgbPaginationNext, NgbPaginationNumber,
        NgbPaginationPrevious, NgbPaginationPages] });
NgbPaginationModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationModule, decorators: [{
            type: NgModule,
            args: [{ declarations: DIRECTIVES, exports: DIRECTIVES, imports: [CommonModule] }]
        }] });

class Trigger {
    constructor(open, close) {
        this.open = open;
        this.close = close;
        if (!close) {
            this.close = open;
        }
    }
    isManual() { return this.open === 'manual' || this.close === 'manual'; }
}
const DEFAULT_ALIASES = {
    'hover': ['mouseenter', 'mouseleave'],
    'focus': ['focusin', 'focusout'],
};
function parseTriggers(triggers, aliases = DEFAULT_ALIASES) {
    const trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
        let alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());
    if (manualTriggers.length > 1) {
        throw 'Triggers parse error: only one manual trigger is allowed';
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
    }
    return parsedTriggers;
}
function observeTriggers(renderer, nativeElement, triggers, isOpenedFn) {
    return new Observable(subscriber => {
        const listeners = [];
        const openFn = () => subscriber.next(true);
        const closeFn = () => subscriber.next(false);
        const toggleFn = () => subscriber.next(!isOpenedFn());
        triggers.forEach((trigger) => {
            if (trigger.open === trigger.close) {
                listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
            }
            else {
                listeners.push(renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
            }
        });
        return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
    });
}
const delayOrNoop = (time) => time > 0 ? delay(time) : (a) => a;
function triggerDelay(openDelay, closeDelay, isOpenedFn) {
    return (input$) => {
        let pending = null;
        const filteredInput$ = input$.pipe(map(open => ({ open })), filter(event => {
            const currentlyOpen = isOpenedFn();
            if (currentlyOpen !== event.open && (!pending || pending.open === currentlyOpen)) {
                pending = event;
                return true;
            }
            if (pending && pending.open !== event.open) {
                pending = null;
            }
            return false;
        }), share());
        const delayedOpen$ = filteredInput$.pipe(filter(event => event.open), delayOrNoop(openDelay));
        const delayedClose$ = filteredInput$.pipe(filter(event => !event.open), delayOrNoop(closeDelay));
        return merge(delayedOpen$, delayedClose$)
            .pipe(filter(event => {
            if (event === pending) {
                pending = null;
                return event.open !== isOpenedFn();
            }
            return false;
        }), map(event => event.open));
    };
}
function listenToTriggers(renderer, nativeElement, triggers, isOpenedFn, openFn, closeFn, openDelay = 0, closeDelay = 0) {
    const parsedTriggers = parseTriggers(triggers);
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return () => { };
    }
    const subscription = observeTriggers(renderer, nativeElement, parsedTriggers, isOpenedFn)
        .pipe(triggerDelay(openDelay, closeDelay, isOpenedFn))
        .subscribe(open => (open ? openFn() : closeFn()));
    return () => subscription.unsubscribe();
}

/**
 * A configuration service for the [`NgbPopover`](#/components/popover/api#NgbPopover) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
class NgbPopoverConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.autoClose = true;
        this.placement = 'auto';
        this.triggers = 'click';
        this.disablePopover = false;
        this.openDelay = 0;
        this.closeDelay = 0;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbPopoverConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbPopoverConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

let nextId$1 = 0;
class NgbPopoverWindow {
    isTitleTemplate() { return this.title instanceof TemplateRef; }
}
NgbPopoverWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbPopoverWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbPopoverWindow, selector: "ngb-popover-window", inputs: { animation: "animation", title: "title", id: "id", popoverClass: "popoverClass", context: "context" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"popover\" + (popoverClass ? \" \" + popoverClass : \"\")", "class.fade": "animation", "id": "id" } }, ngImport: i0, template: `
    <div class="popover-arrow" data-popper-arrow></div>
    <h3 class="popover-header" *ngIf="title">
      <ng-template #simpleTitle>{{title}}</ng-template>
      <ng-template [ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle" [ngTemplateOutletContext]="context"></ng-template>
    </h3>
    <div class="popover-body"><ng-content></ng-content></div>`, isInline: true, directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-popover-window',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"popover" + (popoverClass ? " " + popoverClass : "")',
                        '[class.fade]': 'animation',
                        'role': 'tooltip',
                        '[id]': 'id'
                    },
                    template: `
    <div class="popover-arrow" data-popper-arrow></div>
    <h3 class="popover-header" *ngIf="title">
      <ng-template #simpleTitle>{{title}}</ng-template>
      <ng-template [ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle" [ngTemplateOutletContext]="context"></ng-template>
    </h3>
    <div class="popover-body"><ng-content></ng-content></div>`
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], title: [{
                type: Input
            }], id: [{
                type: Input
            }], popoverClass: [{
                type: Input
            }], context: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy popover creation.
 */
class NgbPopover {
    constructor(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, _document, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        this._changeDetector = _changeDetector;
        /**
         * An event emitted when the popover opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the popover closing animation has finished. Contains no payload.
         *
         * At this point popover is not in the DOM anymore.
         */
        this.hidden = new EventEmitter();
        this._ngbPopoverWindowId = `ngb-popover-${nextId$1++}`;
        this._windowRef = null;
        this._positioning = ngbPositioning();
        this.animation = config.animation;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disablePopover = config.disablePopover;
        this.popoverClass = config.popoverClass;
        this.openDelay = config.openDelay;
        this.closeDelay = config.closeDelay;
        this._popupService = new PopupService(NgbPopoverWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positioning.update(); });
    }
    _isDisabled() {
        if (this.disablePopover) {
            return true;
        }
        if (!this.ngbPopover && !this.popoverTitle) {
            return true;
        }
        return false;
    }
    /**
     * Opens the popover.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the popover template when it is created.
     */
    open(context) {
        if (!this._windowRef && !this._isDisabled()) {
            // this type assertion is safe because otherwise _isDisabled would return true
            const { windowRef, transition$ } = this._popupService.open(this.ngbPopover, context, this.animation);
            this._windowRef = windowRef;
            this._windowRef.instance.animation = this.animation;
            this._windowRef.instance.title = this.popoverTitle;
            this._windowRef.instance.context = context;
            this._windowRef.instance.popoverClass = this.popoverClass;
            this._windowRef.instance.id = this._ngbPopoverWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening popover from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because popover won't work inside the OnPush component.
            // Ex. when we use expression like `{{ popover.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the popover from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Schedule positioning on stable, to avoid several positioning updates.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                this._positioning.createPopper({
                    hostElement: this._elementRef.nativeElement,
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    appendToBody: this.container === 'body',
                    baseClass: 'bs-popover',
                    updatePopperOptions: addPopperOffset([0, 8]),
                });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [this._windowRef.location.nativeElement]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
     */
    close() {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close(this.animation).subscribe(() => {
                this._windowRef = null;
                this._positioning.destroy();
                this.hidden.emit();
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * Toggles the popover.
     *
     * This is considered to be a "manual" triggering of the popover.
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen() { return this._windowRef != null; }
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    }
    ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }) {
        if (popoverClass && this.isOpen()) {
            this._windowRef.instance.popoverClass = popoverClass.currentValue;
        }
        // close popover if title and content become empty, or disablePopover set to true
        if ((ngbPopover || popoverTitle || disablePopover) && this._isDisabled()) {
            this.close();
        }
    }
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
}
NgbPopover.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopover, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: NgbPopoverConfig }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbPopover.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbPopover, selector: "[ngbPopover]", inputs: { animation: "animation", autoClose: "autoClose", ngbPopover: "ngbPopover", popoverTitle: "popoverTitle", placement: "placement", triggers: "triggers", container: "container", disablePopover: "disablePopover", popoverClass: "popoverClass", openDelay: "openDelay", closeDelay: "closeDelay" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbPopover"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopover, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: NgbPopoverConfig }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], ngbPopover: [{
                type: Input
            }], popoverTitle: [{
                type: Input
            }], placement: [{
                type: Input
            }], triggers: [{
                type: Input
            }], container: [{
                type: Input
            }], disablePopover: [{
                type: Input
            }], popoverClass: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });

class NgbPopoverModule {
}
NgbPopoverModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbPopoverModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverModule, declarations: [NgbPopover, NgbPopoverWindow], imports: [CommonModule], exports: [NgbPopover] });
NgbPopoverModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPopoverModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], imports: [CommonModule] }]
        }] });

/**
 * A configuration service for the [`NgbProgressbar`](#/components/progressbar/api#NgbProgressbar) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
class NgbProgressbarConfig {
    constructor() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
        this.showValue = false;
    }
}
NgbProgressbarConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbProgressbarConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
class NgbProgressbar {
    constructor(config) {
        /**
         * The current value for the progress bar.
         *
         * Should be in the `[0, max]` range.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.textType = config.textType;
        this.type = config.type;
        this.showValue = config.showValue;
        this.height = config.height;
    }
    /**
     * The maximal value to be displayed in the progress bar.
     *
     * Should be a positive number. Will default to 100 otherwise.
     */
    set max(max) {
        this._max = !isNumber(max) || max <= 0 ? 100 : max;
    }
    get max() { return this._max; }
    getValue() { return getValueInRange(this.value, this.max); }
    getPercentValue() { return 100 * this.getValue() / this.max; }
}
NgbProgressbar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbar, deps: [{ token: NgbProgressbarConfig }], target: i0.ɵɵFactoryTarget.Component });
NgbProgressbar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbProgressbar, selector: "ngb-progressbar", inputs: { max: "max", animated: "animated", striped: "striped", showValue: "showValue", textType: "textType", type: "type", value: "value", height: "height" }, host: { properties: { "style.height": "this.height" }, classAttribute: "progress" }, ngImport: i0, template: `
    <div class="progress-bar{{type ? ' bg-' + type : ''}}{{textType ? ' text-' + textType : ''}}
    {{animated ? ' progress-bar-animated' : ''}}{{striped ? ' progress-bar-striped' : ''}}"
    role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
      <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getValue() / max | percent}}</span><ng-content></ng-content>
    </div>
  `, isInline: true, directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], pipes: { "percent": i2.PercentPipe }, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbar, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-progressbar',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: { class: 'progress' },
                    template: `
    <div class="progress-bar{{type ? ' bg-' + type : ''}}{{textType ? ' text-' + textType : ''}}
    {{animated ? ' progress-bar-animated' : ''}}{{striped ? ' progress-bar-striped' : ''}}"
    role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
      <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getValue() / max | percent}}</span><ng-content></ng-content>
    </div>
  `
                }]
        }], ctorParameters: function () { return [{ type: NgbProgressbarConfig }]; }, propDecorators: { max: [{
                type: Input
            }], animated: [{
                type: Input
            }], striped: [{
                type: Input
            }], showValue: [{
                type: Input
            }], textType: [{
                type: Input
            }], type: [{
                type: Input
            }], value: [{
                type: Input
            }], height: [{
                type: Input
            }, {
                type: HostBinding,
                args: ['style.height']
            }] } });

class NgbProgressbarModule {
}
NgbProgressbarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbProgressbarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarModule, declarations: [NgbProgressbar], imports: [CommonModule], exports: [NgbProgressbar] });
NgbProgressbarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbProgressbarModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [CommonModule] }]
        }] });

/**
 * A configuration service for the [`NgbRating`](#/components/rating/api#NgbRating) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
class NgbRatingConfig {
    constructor() {
        this.max = 10;
        this.readonly = false;
        this.resettable = false;
    }
}
NgbRatingConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbRatingConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
class NgbRating {
    constructor(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event emitted when the user is hovering over a given rating.
         *
         * Event payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event emitted when the user stops hovering over a given rating.
         *
         * Event payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event emitted when the rating is changed.
         *
         * Event payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    ariaValueText() { return `${this.nextRate} out of ${this.max}`; }
    isInteractive() { return !this.readonly && !this.disabled; }
    enter(value) {
        if (this.isInteractive()) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    handleBlur() { this.onTouched(); }
    handleClick(value) {
        if (this.isInteractive()) {
            this.update(this.resettable && this.rate === value ? 0 : value);
        }
    }
    handleKeyDown(event) {
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.ArrowDown:
            case Key.ArrowLeft:
                this.update(this.rate - 1);
                break;
            case Key.ArrowUp:
            case Key.ArrowRight:
                this.update(this.rate + 1);
                break;
            case Key.Home:
                this.update(0);
                break;
            case Key.End:
                this.update(this.max);
                break;
            default:
                return;
        }
        // note 'return' in default case
        event.preventDefault();
    }
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
        if (changes['max']) {
            this._updateMax();
        }
    }
    ngOnInit() {
        this._setupContexts();
        this._updateState(this.rate);
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    update(value, internalChange = true) {
        const newRate = getValueInRange(value, this.max, 0);
        if (this.isInteractive() && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => context.fill = Math.round(getValueInRange(nextValue - index, 1, 0) * 100));
    }
    _updateMax() {
        if (this.max > 0) {
            this._setupContexts();
            this.update(this.rate);
        }
    }
    _setupContexts() { this.contexts = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k })); }
}
NgbRating.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRating, deps: [{ token: NgbRatingConfig }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
NgbRating.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbRating, selector: "ngb-rating", inputs: { max: "max", rate: "rate", readonly: "readonly", resettable: "resettable", starTemplate: "starTemplate" }, outputs: { hover: "hover", leave: "leave", rateChange: "rateChange" }, host: { attributes: { "role": "slider", "aria-valuemin": "0" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)", "mouseleave": "reset()" }, properties: { "tabindex": "disabled ? -1 : 0", "attr.aria-valuemax": "max", "attr.aria-valuenow": "nextRate", "attr.aria-valuetext": "ariaValueText()", "attr.aria-disabled": "readonly ? true : null" }, classAttribute: "d-inline-flex" }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }], queries: [{ propertyName: "starTemplateFromContent", first: true, predicate: TemplateRef, descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="isInteractive() ? 'pointer' : 'default'">
        <ng-template [ngTemplateOutlet]="starTemplate || starTemplateFromContent || t" [ngTemplateOutletContext]="contexts[index]">
        </ng-template>
      </span>
    </ng-template>
  `, isInline: true, directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRating, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-rating',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        'class': 'd-inline-flex',
                        '[tabindex]': 'disabled ? -1 : 0',
                        'role': 'slider',
                        'aria-valuemin': '0',
                        '[attr.aria-valuemax]': 'max',
                        '[attr.aria-valuenow]': 'nextRate',
                        '[attr.aria-valuetext]': 'ariaValueText()',
                        '[attr.aria-disabled]': 'readonly ? true : null',
                        '(blur)': 'handleBlur()',
                        '(keydown)': 'handleKeyDown($event)',
                        '(mouseleave)': 'reset()'
                    },
                    template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="visually-hidden">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="isInteractive() ? 'pointer' : 'default'">
        <ng-template [ngTemplateOutlet]="starTemplate || starTemplateFromContent || t" [ngTemplateOutletContext]="contexts[index]">
        </ng-template>
      </span>
    </ng-template>
  `,
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbRating), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: NgbRatingConfig }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { max: [{
                type: Input
            }], rate: [{
                type: Input
            }], readonly: [{
                type: Input
            }], resettable: [{
                type: Input
            }], starTemplate: [{
                type: Input
            }], starTemplateFromContent: [{
                type: ContentChild,
                args: [TemplateRef, { static: false }]
            }], hover: [{
                type: Output
            }], leave: [{
                type: Output
            }], rateChange: [{
                type: Output
            }] } });

class NgbRatingModule {
}
NgbRatingModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbRatingModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingModule, declarations: [NgbRating], imports: [CommonModule], exports: [NgbRating] });
NgbRatingModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbRatingModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule] }]
        }] });

class NgbTime {
    constructor(hour, minute, second) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }
    changeHour(step = 1) { this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step); }
    updateHour(hour) {
        if (isNumber(hour)) {
            this.hour = (hour < 0 ? 24 + hour : hour) % 24;
        }
        else {
            this.hour = NaN;
        }
    }
    changeMinute(step = 1) { this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step); }
    updateMinute(minute) {
        if (isNumber(minute)) {
            this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
            this.changeHour(Math.floor(minute / 60));
        }
        else {
            this.minute = NaN;
        }
    }
    changeSecond(step = 1) { this.updateSecond((isNaN(this.second) ? 0 : this.second) + step); }
    updateSecond(second) {
        if (isNumber(second)) {
            this.second = second < 0 ? 60 + second % 60 : second % 60;
            this.changeMinute(Math.floor(second / 60));
        }
        else {
            this.second = NaN;
        }
    }
    isValid(checkSecs = true) {
        return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
    }
    toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}

/**
 * A configuration service for the [`NgbTimepicker`](#/components/timepicker/api#NgbTimepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
class NgbTimepickerConfig {
    constructor() {
        this.meridian = false;
        this.spinners = true;
        this.seconds = false;
        this.hourStep = 1;
        this.minuteStep = 1;
        this.secondStep = 1;
        this.disabled = false;
        this.readonlyInputs = false;
        this.size = 'medium';
    }
}
NgbTimepickerConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTimepickerConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

function NGB_DATEPICKER_TIME_ADAPTER_FACTORY() {
    return new NgbTimeStructAdapter();
}
/**
 * An abstract service that does the conversion between the internal timepicker `NgbTimeStruct` model and
 * any provided user time model `T`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding timepicker to a form control,
 * ex. `[(ngModel)]="userTimeModel"`. Here `userTimeModel` can be of any type.
 *
 * The default timepicker implementation assumes we use `NgbTimeStruct` as a user model.
 *
 * See the [custom time adapter demo](#/components/timepicker/examples#adapter) for an example.
 *
 * @since 2.2.0
 */
class NgbTimeAdapter {
}
NgbTimeAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTimeAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, providedIn: 'root', useFactory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeAdapter, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_DATEPICKER_TIME_ADAPTER_FACTORY }]
        }] });
class NgbTimeStructAdapter extends NgbTimeAdapter {
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    fromModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    toModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
}
NgbTimeStructAdapter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
NgbTimeStructAdapter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimeStructAdapter, decorators: [{
            type: Injectable
        }] });

function NGB_TIMEPICKER_I18N_FACTORY(locale) {
    return new NgbTimepickerI18nDefault(locale);
}
/**
 * Type of the service supplying day periods (for example, 'AM' and 'PM') to NgbTimepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 */
class NgbTimepickerI18n {
}
NgbTimepickerI18n.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18n, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTimepickerI18n.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18n, providedIn: 'root', useFactory: NGB_TIMEPICKER_I18N_FACTORY, deps: [{ token: LOCALE_ID }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18n, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root', useFactory: NGB_TIMEPICKER_I18N_FACTORY, deps: [LOCALE_ID] }]
        }] });
class NgbTimepickerI18nDefault extends NgbTimepickerI18n {
    constructor(locale) {
        super();
        this._periods = getLocaleDayPeriods(locale, FormStyle.Standalone, TranslationWidth.Narrow);
    }
    getMorningPeriod() { return this._periods[0]; }
    getAfternoonPeriod() { return this._periods[1]; }
}
NgbTimepickerI18nDefault.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18nDefault, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
NgbTimepickerI18nDefault.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18nDefault });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerI18nDefault, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });

const FILTER_REGEX = /[^0-9]/g;
/**
 * A directive that helps with wth picking hours, minutes and seconds.
 */
class NgbTimepicker {
    constructor(_config, _ngbTimeAdapter, _cd, i18n) {
        this._config = _config;
        this._ngbTimeAdapter = _ngbTimeAdapter;
        this._cd = _cd;
        this.i18n = i18n;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.meridian = _config.meridian;
        this.spinners = _config.spinners;
        this.seconds = _config.seconds;
        this.hourStep = _config.hourStep;
        this.minuteStep = _config.minuteStep;
        this.secondStep = _config.secondStep;
        this.disabled = _config.disabled;
        this.readonlyInputs = _config.readonlyInputs;
        this.size = _config.size;
    }
    /**
     * The number of hours to add/subtract when clicking hour spinners.
     */
    set hourStep(step) {
        this._hourStep = isInteger(step) ? step : this._config.hourStep;
    }
    get hourStep() { return this._hourStep; }
    /**
     * The number of minutes to add/subtract when clicking minute spinners.
     */
    set minuteStep(step) {
        this._minuteStep = isInteger(step) ? step : this._config.minuteStep;
    }
    get minuteStep() { return this._minuteStep; }
    /**
     * The number of seconds to add/subtract when clicking second spinners.
     */
    set secondStep(step) {
        this._secondStep = isInteger(step) ? step : this._config.secondStep;
    }
    get secondStep() { return this._secondStep; }
    writeValue(value) {
        const structValue = this._ngbTimeAdapter.fromModel(value);
        this.model = structValue ? new NgbTime(structValue.hour, structValue.minute, structValue.second) : new NgbTime();
        if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
            this.model.second = 0;
        }
        this._cd.markForCheck();
    }
    registerOnChange(fn) { this.onChange = fn; }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    changeHour(step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    }
    changeMinute(step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    }
    changeSecond(step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    }
    updateHour(newVal) {
        const isPM = this.model.hour >= 12;
        const enteredHour = toInteger(newVal);
        if (this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12)) {
            this.model.updateHour(enteredHour + 12);
        }
        else {
            this.model.updateHour(enteredHour);
        }
        this.propagateModelChange();
    }
    updateMinute(newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    }
    updateSecond(newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    }
    toggleMeridian() {
        if (this.meridian) {
            this.changeHour(12);
        }
    }
    formatInput(input) { input.value = input.value.replace(FILTER_REGEX, ''); }
    formatHour(value) {
        if (isNumber(value)) {
            if (this.meridian) {
                return padNumber(value % 12 === 0 ? 12 : value % 12);
            }
            else {
                return padNumber(value % 24);
            }
        }
        else {
            return padNumber(NaN);
        }
    }
    formatMinSec(value) { return padNumber(isNumber(value) ? value : NaN); }
    handleBlur() { this.onTouched(); }
    get isSmallSize() { return this.size === 'small'; }
    get isLargeSize() { return this.size === 'large'; }
    ngOnChanges(changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    }
    propagateModelChange(touched = true) {
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange(this._ngbTimeAdapter.toModel({ hour: this.model.hour, minute: this.model.minute, second: this.model.second }));
        }
        else {
            this.onChange(this._ngbTimeAdapter.toModel(null));
        }
    }
}
NgbTimepicker.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepicker, deps: [{ token: NgbTimepickerConfig }, { token: NgbTimeAdapter }, { token: i0.ChangeDetectorRef }, { token: NgbTimepickerI18n }], target: i0.ɵɵFactoryTarget.Component });
NgbTimepicker.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbTimepicker, selector: "ngb-timepicker", inputs: { meridian: "meridian", spinners: "spinners", seconds: "seconds", hourStep: "hourStep", minuteStep: "minuteStep", secondStep: "secondStep", readonlyInputs: "readonlyInputs", size: "size" }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTimepicker), multi: true }], usesOnChanges: true, ngImport: i0, template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-input-container ngb-tp-hour">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize"
            [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeHour(hourStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeHour(-hourStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(-hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-input-container ngb-tp-minute">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeMinute(minuteStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeMinute(-minuteStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(-minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden"  i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-input-container ngb-tp-second">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeSecond(secondStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeSecond(-secondStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(-secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"
            [disabled]="disabled" [class.disabled]="disabled"
                  (click)="toggleMeridian()">
            <ng-container *ngIf="model && model.hour >= 12; else am"
                          i18n="@@ngb.timepicker.PM">{{ i18n.getAfternoonPeriod() }}</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">{{ i18n.getMorningPeriod() }}</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `, isInline: true, styles: ["ngb-timepicker{font-size:1rem}.ngb-tp{display:flex;align-items:center}.ngb-tp-input-container{width:4em}.ngb-tp-chevron:before{border-style:solid;border-width:.29em .29em 0 0;content:\"\";display:inline-block;height:.69em;left:.05em;position:relative;top:.15em;transform:rotate(-45deg);vertical-align:middle;width:.69em}.ngb-tp-chevron.bottom:before{top:-.3em;transform:rotate(135deg)}.ngb-tp-input{text-align:center}.ngb-tp-hour,.ngb-tp-minute,.ngb-tp-second,.ngb-tp-meridian{display:flex;flex-direction:column;align-items:center;justify-content:space-around}.ngb-tp-spacer{width:1em;text-align:center}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepicker, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-timepicker', encapsulation: ViewEncapsulation.None, template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-input-container ngb-tp-hour">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize"
            [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeHour(hourStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeHour(-hourStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeHour(-hourStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-input-container ngb-tp-minute">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeMinute(minuteStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeMinute(-minuteStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeMinute(-minuteStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden"  i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-input-container ngb-tp-second">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize" [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
          </button>
          <input type="text" class="ngb-tp-input form-control" [class.form-control-sm]="isSmallSize" [class.form-control-lg]="isLargeSize"
            maxlength="2" inputmode="numeric" placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($any($event).target.value)"
            [readOnly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds"
            (blur)="handleBlur()"
            (input)="formatInput($any($event).target)"
            (keydown.ArrowUp)="changeSecond(secondStep); $event.preventDefault()"
            (keydown.ArrowDown)="changeSecond(-secondStep); $event.preventDefault()">
          <button *ngIf="spinners" tabindex="-1" type="button" (click)="changeSecond(-secondStep)"
            class="btn btn-link" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"  [class.disabled]="disabled"
            [disabled]="disabled">
            <span class="chevron ngb-tp-chevron bottom"></span>
            <span class="visually-hidden" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [class.btn-sm]="isSmallSize" [class.btn-lg]="isLargeSize"
            [disabled]="disabled" [class.disabled]="disabled"
                  (click)="toggleMeridian()">
            <ng-container *ngIf="model && model.hour >= 12; else am"
                          i18n="@@ngb.timepicker.PM">{{ i18n.getAfternoonPeriod() }}</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">{{ i18n.getMorningPeriod() }}</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTimepicker), multi: true }], styles: ["ngb-timepicker{font-size:1rem}.ngb-tp{display:flex;align-items:center}.ngb-tp-input-container{width:4em}.ngb-tp-chevron:before{border-style:solid;border-width:.29em .29em 0 0;content:\"\";display:inline-block;height:.69em;left:.05em;position:relative;top:.15em;transform:rotate(-45deg);vertical-align:middle;width:.69em}.ngb-tp-chevron.bottom:before{top:-.3em;transform:rotate(135deg)}.ngb-tp-input{text-align:center}.ngb-tp-hour,.ngb-tp-minute,.ngb-tp-second,.ngb-tp-meridian{display:flex;flex-direction:column;align-items:center;justify-content:space-around}.ngb-tp-spacer{width:1em;text-align:center}\n"] }]
        }], ctorParameters: function () { return [{ type: NgbTimepickerConfig }, { type: NgbTimeAdapter }, { type: i0.ChangeDetectorRef }, { type: NgbTimepickerI18n }]; }, propDecorators: { meridian: [{
                type: Input
            }], spinners: [{
                type: Input
            }], seconds: [{
                type: Input
            }], hourStep: [{
                type: Input
            }], minuteStep: [{
                type: Input
            }], secondStep: [{
                type: Input
            }], readonlyInputs: [{
                type: Input
            }], size: [{
                type: Input
            }] } });

class NgbTimepickerModule {
}
NgbTimepickerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbTimepickerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerModule, declarations: [NgbTimepicker], imports: [CommonModule], exports: [NgbTimepicker] });
NgbTimepickerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTimepickerModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbTimepicker], exports: [NgbTimepicker], imports: [CommonModule] }]
        }] });

const ngbToastFadeInTransition = (element, animation) => {
    const { classList } = element;
    if (!animation) {
        classList.add('show');
        return;
    }
    classList.remove('hide');
    reflow(element);
    classList.add('showing');
    return () => {
        classList.remove('showing');
        classList.add('show');
    };
};
const ngbToastFadeOutTransition = ({ classList }) => {
    classList.remove('show');
    return () => { classList.add('hide'); };
};

/**
 * Configuration service for the NgbToast component. You can inject this service, typically in your root component,
 * and customize the values of its properties in order to provide default values for all the toasts used in the
 * application.
 *
 * @since 5.0.0
 */
class NgbToastConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.autohide = true;
        this.delay = 5000;
        this.ariaLive = 'polite';
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbToastConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbToastConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
class NgbToastHeader {
}
NgbToastHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastHeader, deps: [], target: i0.ɵɵFactoryTarget.Directive });
NgbToastHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbToastHeader, selector: "[ngbToastHeader]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastHeader, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbToastHeader]' }]
        }] });
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
class NgbToast {
    constructor(ariaLive, config, _zone, _element) {
        this.ariaLive = ariaLive;
        this._zone = _zone;
        this._element = _element;
        /**
         * A template like `<ng-template ngbToastHeader></ng-template>` can be
         * used in the projected content to allow markup usage.
         */
        this.contentHeaderTpl = null;
        /**
         * An event fired after the animation triggered by calling `.show()` method has finished.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
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
        this.hidden = new EventEmitter();
        if (this.ariaLive == null) {
            this.ariaLive = config.ariaLive;
        }
        this.delay = config.delay;
        this.autohide = config.autohide;
        this.animation = config.animation;
    }
    ngAfterContentInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this._init();
            this.show();
        });
    }
    ngOnChanges(changes) {
        if ('autohide' in changes) {
            this._clearTimeout();
            this._init();
        }
    }
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
    hide() {
        this._clearTimeout();
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeOutTransition, { animation: this.animation, runningTransition: 'stop' });
        transition.subscribe(() => { this.hidden.emit(); });
        return transition;
    }
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
    show() {
        const transition = ngbRunTransition(this._zone, this._element.nativeElement, ngbToastFadeInTransition, {
            animation: this.animation,
            runningTransition: 'continue',
        });
        transition.subscribe(() => { this.shown.emit(); });
        return transition;
    }
    _init() {
        if (this.autohide && !this._timeoutID) {
            this._timeoutID = setTimeout(() => this.hide(), this.delay);
        }
    }
    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
}
NgbToast.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToast, deps: [{ token: 'aria-live', attribute: true }, { token: NgbToastConfig }, { token: i0.NgZone }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
NgbToast.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbToast, selector: "ngb-toast", inputs: { animation: "animation", delay: "delay", autohide: "autohide", header: "header" }, outputs: { shown: "shown", hidden: "hidden" }, host: { attributes: { "role": "alert", "aria-atomic": "true" }, properties: { "attr.aria-live": "ariaLive", "class.fade": "animation" }, classAttribute: "toast" }, queries: [{ propertyName: "contentHeaderTpl", first: true, predicate: NgbToastHeader, descendants: true, read: TemplateRef, static: true }], exportAs: ["ngbToast"], usesOnChanges: true, ngImport: i0, template: `
    <ng-template #headerTpl>
      <strong class="me-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `, isInline: true, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToast, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-toast', exportAs: 'ngbToast', encapsulation: ViewEncapsulation.None, host: {
                        'role': 'alert',
                        '[attr.aria-live]': 'ariaLive',
                        'aria-atomic': 'true',
                        'class': 'toast',
                        '[class.fade]': 'animation',
                    }, template: `
    <ng-template #headerTpl>
      <strong class="me-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="btn-close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `, styles: ["ngb-toast{display:block}ngb-toast .toast-header .close{margin-left:auto;margin-bottom:.25rem}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Attribute,
                    args: ['aria-live']
                }] }, { type: NgbToastConfig }, { type: i0.NgZone }, { type: i0.ElementRef }]; }, propDecorators: { animation: [{
                type: Input
            }], delay: [{
                type: Input
            }], autohide: [{
                type: Input
            }], header: [{
                type: Input
            }], contentHeaderTpl: [{
                type: ContentChild,
                args: [NgbToastHeader, { read: TemplateRef, static: true }]
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }] } });

class NgbToastModule {
}
NgbToastModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbToastModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastModule, declarations: [NgbToast, NgbToastHeader], imports: [CommonModule], exports: [NgbToast, NgbToastHeader] });
NgbToastModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbToastModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbToast, NgbToastHeader], imports: [CommonModule], exports: [NgbToast, NgbToastHeader] }]
        }] });

/**
 * A configuration service for the [`NgbTooltip`](#/components/tooltip/api#NgbTooltip) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
class NgbTooltipConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.autoClose = true;
        this.placement = 'auto';
        this.triggers = 'hover focus';
        this.disableTooltip = false;
        this.openDelay = 0;
        this.closeDelay = 0;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbTooltipConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbTooltipConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

let nextId = 0;
class NgbTooltipWindow {
}
NgbTooltipWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbTooltipWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbTooltipWindow, selector: "ngb-tooltip-window", inputs: { animation: "animation", id: "id", tooltipClass: "tooltipClass" }, host: { attributes: { "role": "tooltip" }, properties: { "class": "\"tooltip\" + (tooltipClass ? \" \" + tooltipClass : \"\")", "class.fade": "animation", "id": "id" } }, ngImport: i0, template: `<div class="tooltip-arrow" data-popper-arrow></div><div class="tooltip-inner"><ng-content></ng-content></div>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-tooltip-window',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
                        '[class.fade]': 'animation',
                        'role': 'tooltip',
                        '[id]': 'id'
                    },
                    template: `<div class="tooltip-arrow" data-popper-arrow></div><div class="tooltip-inner"><ng-content></ng-content></div>`
                }]
        }], propDecorators: { animation: [{
                type: Input
            }], id: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }] } });
/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
class NgbTooltip {
    constructor(_elementRef, _renderer, injector, viewContainerRef, config, _ngZone, _document, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        this._changeDetector = _changeDetector;
        /**
         * An event emitted when the tooltip opening animation has finished. Contains no payload.
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the tooltip closing animation has finished. Contains no payload.
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
        this._windowRef = null;
        this._positioning = ngbPositioning();
        this.animation = config.animation;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this.tooltipClass = config.tooltipClass;
        this.openDelay = config.openDelay;
        this.closeDelay = config.closeDelay;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positioning.update(); });
    }
    /**
     * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
     *
     * If the content if falsy, the tooltip won't open.
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    get ngbTooltip() { return this._ngbTooltip; }
    /**
     * Opens the tooltip.
     *
     * This is considered to be a "manual" triggering.
     * The `context` is an optional value to be injected into the tooltip template when it is created.
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            const { windowRef, transition$ } = this._popupService.open(this._ngbTooltip, context, this.animation);
            this._windowRef = windowRef;
            this._windowRef.instance.animation = this.animation;
            this._windowRef.instance.tooltipClass = this.tooltipClass;
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // We need to detect changes, because we don't know where .open() might be called from.
            // Ex. opening tooltip from one of lifecycle hooks that run after the CD
            // (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
            this._windowRef.changeDetectorRef.detectChanges();
            // We need to mark for check, because tooltip won't work inside the OnPush component.
            // Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
            // inside the template of an OnPush component and we change the tooltip from
            // open -> closed, the expression in question won't be updated unless we explicitly
            // mark the parent component to be checked.
            this._windowRef.changeDetectorRef.markForCheck();
            // Schedule positioning on stable, to avoid several positioning updates.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                this._positioning.createPopper({
                    hostElement: this._elementRef.nativeElement,
                    targetElement: this._windowRef.location.nativeElement,
                    placement: this.placement,
                    appendToBody: this.container === 'body',
                    baseClass: 'bs-tooltip',
                });
            });
            ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [this._windowRef.location.nativeElement]);
            transition$.subscribe(() => this.shown.emit());
        }
    }
    /**
     * Closes the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    close() {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close(this.animation).subscribe(() => {
                this._windowRef = null;
                this._positioning.destroy();
                this.hidden.emit();
                this._changeDetector.markForCheck();
            });
        }
    }
    /**
     * Toggles the tooltip.
     *
     * This is considered to be a "manual" triggering of the tooltip.
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns `true`, if the popover is currently shown.
     */
    isOpen() { return this._windowRef != null; }
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.isOpen.bind(this), this.open.bind(this), this.close.bind(this), +this.openDelay, +this.closeDelay);
    }
    ngOnChanges({ tooltipClass }) {
        if (tooltipClass && this.isOpen()) {
            this._windowRef.instance.tooltipClass = tooltipClass.currentValue;
        }
    }
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
}
NgbTooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltip, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: i0.ViewContainerRef }, { token: NgbTooltipConfig }, { token: i0.NgZone }, { token: DOCUMENT }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbTooltip, selector: "[ngbTooltip]", inputs: { animation: "animation", autoClose: "autoClose", placement: "placement", triggers: "triggers", container: "container", disableTooltip: "disableTooltip", tooltipClass: "tooltipClass", openDelay: "openDelay", closeDelay: "closeDelay", ngbTooltip: "ngbTooltip" }, outputs: { shown: "shown", hidden: "hidden" }, exportAs: ["ngbTooltip"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltip, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: i0.ViewContainerRef }, { type: NgbTooltipConfig }, { type: i0.NgZone }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { animation: [{
                type: Input
            }], autoClose: [{
                type: Input
            }], placement: [{
                type: Input
            }], triggers: [{
                type: Input
            }], container: [{
                type: Input
            }], disableTooltip: [{
                type: Input
            }], tooltipClass: [{
                type: Input
            }], openDelay: [{
                type: Input
            }], closeDelay: [{
                type: Input
            }], shown: [{
                type: Output
            }], hidden: [{
                type: Output
            }], ngbTooltip: [{
                type: Input
            }] } });

class NgbTooltipModule {
}
NgbTooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbTooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipModule, declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip] });
NgbTooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTooltipModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip] }]
        }] });

/**
 * A component that helps with text highlighting.
 *
 * If splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
class NgbHighlight {
    constructor() {
        /**
         * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
         */
        this.highlightClass = 'ngb-highlight';
        /**
         * Boolean option to determine if the highlighting should be sensitive to accents or not.
         *
         * This feature is only available for browsers that implement the `String.normalize` function
         * (typically not Internet Explorer).
         * If you want to use this feature in a browser that does not implement `String.normalize`,
         * you will have to include a polyfill in your application (`unorm` for example).
         *
         * @since 9.1.0
         */
        this.accentSensitive = true;
    }
    ngOnChanges(changes) {
        if (!this.accentSensitive && !String.prototype.normalize) {
            console.warn('The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser ' +
                'that does not implement the `String.normalize` function. ' +
                'You will have to include a polyfill in your application to use this feature in the current browser.');
            this.accentSensitive = true;
        }
        const result = toString(this.result);
        const terms = Array.isArray(this.term) ? this.term : [this.term];
        const prepareTerm = term => this.accentSensitive ? term : removeAccents(term);
        const escapedTerms = terms.map(term => regExpEscape(prepareTerm(toString(term)))).filter(term => term);
        const toSplit = this.accentSensitive ? result : removeAccents(result);
        const parts = escapedTerms.length ? toSplit.split(new RegExp(`(${escapedTerms.join('|')})`, 'gmi')) : [result];
        if (this.accentSensitive) {
            this.parts = parts;
        }
        else {
            let offset = 0;
            this.parts = parts.map(part => result.substring(offset, offset += part.length));
        }
    }
}
NgbHighlight.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbHighlight, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbHighlight.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbHighlight, selector: "ngb-highlight", inputs: { highlightClass: "highlightClass", result: "result", term: "term", accentSensitive: "accentSensitive" }, usesOnChanges: true, ngImport: i0, template: "<ng-template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\"><span *ngIf=\"isOdd; else even\" [class]=\"highlightClass\">{{part}}</span><ng-template #even>{{part}}</ng-template></ng-template>", isInline: true, styles: [".ngb-highlight{font-weight:700}\n"], directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbHighlight, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-highlight', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                        `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                        `</ng-template>`, styles: [".ngb-highlight{font-weight:700}\n"] }]
        }], propDecorators: { highlightClass: [{
                type: Input
            }], result: [{
                type: Input
            }], term: [{
                type: Input
            }], accentSensitive: [{
                type: Input
            }] } });

class NgbTypeaheadWindow {
    constructor() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    hasActive() { return this.activeIdx > -1 && this.activeIdx < this.results.length; }
    getActive() { return this.results[this.activeIdx]; }
    markActive(activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    }
    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    }
    prev() {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    }
    resetActive() {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    }
    select(item) { this.selectEvent.emit(item); }
    ngOnInit() { this.resetActive(); }
    _activeChanged() {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    }
}
NgbTypeaheadWindow.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadWindow, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbTypeaheadWindow.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbTypeaheadWindow, selector: "ngb-typeahead-window", inputs: { id: "id", focusFirst: "focusFirst", results: "results", term: "term", formatter: "formatter", resultTemplate: "resultTemplate", popupClass: "popupClass" }, outputs: { selectEvent: "select", activeChangeEvent: "activeChange" }, host: { attributes: { "role": "listbox" }, listeners: { "mousedown": "$event.preventDefault()" }, properties: { "class": "\"dropdown-menu show\" + (popupClass ? \" \" + popupClass : \"\")", "id": "id" } }, exportAs: ["ngbTypeaheadWindow"], ngImport: i0, template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" role="option"
        [id]="id + '-' + idx"
        [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)"
        (click)="select(result)">
          <ng-template [ngTemplateOutlet]="resultTemplate || rt"
          [ngTemplateOutletContext]="{result: result, term: term, formatter: formatter}"></ng-template>
      </button>
    </ng-template>
  `, isInline: true, components: [{ type: NgbHighlight, selector: "ngb-highlight", inputs: ["highlightClass", "result", "term", "accentSensitive"] }], directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadWindow, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-typeahead-window',
                    exportAs: 'ngbTypeaheadWindow',
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        '(mousedown)': '$event.preventDefault()',
                        '[class]': '"dropdown-menu show" + (popupClass ? " " + popupClass : "")',
                        'role': 'listbox',
                        '[id]': 'id'
                    },
                    template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" role="option"
        [id]="id + '-' + idx"
        [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)"
        (click)="select(result)">
          <ng-template [ngTemplateOutlet]="resultTemplate || rt"
          [ngTemplateOutletContext]="{result: result, term: term, formatter: formatter}"></ng-template>
      </button>
    </ng-template>
  `
                }]
        }], propDecorators: { id: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], results: [{
                type: Input
            }], term: [{
                type: Input
            }], formatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectEvent: [{
                type: Output,
                args: ['select']
            }], activeChangeEvent: [{
                type: Output,
                args: ['activeChange']
            }] } });

/**
 * A configuration service for the [`NgbTypeahead`](#/components/typeahead/api#NgbTypeahead) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
class NgbTypeaheadConfig {
    constructor() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
        this.placement = ['bottom-start', 'bottom-end', 'top-start', 'top-end'];
    }
}
NgbTypeaheadConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbTypeaheadConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

const ARIA_LIVE_DELAY = new InjectionToken('live announcer delay', { providedIn: 'root', factory: ARIA_LIVE_DELAY_FACTORY });
function ARIA_LIVE_DELAY_FACTORY() {
    return 100;
}
function getLiveElement(document, lazyCreate = false) {
    let element = document.body.querySelector('#ngb-live');
    if (element == null && lazyCreate) {
        element = document.createElement('div');
        element.setAttribute('id', 'ngb-live');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('aria-atomic', 'true');
        element.classList.add('visually-hidden');
        document.body.appendChild(element);
    }
    return element;
}
class Live {
    constructor(_document, _delay) {
        this._document = _document;
        this._delay = _delay;
    }
    ngOnDestroy() {
        const element = getLiveElement(this._document);
        if (element) {
            // if exists, it will always be attached to the <body>
            element.parentElement.removeChild(element);
        }
    }
    say(message) {
        const element = getLiveElement(this._document, true);
        const delay = this._delay;
        if (element != null) {
            element.textContent = '';
            const setText = () => element.textContent = message;
            if (delay === null) {
                setText();
            }
            else {
                setTimeout(setText, delay);
            }
        }
    }
}
Live.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, deps: [{ token: DOCUMENT }, { token: ARIA_LIVE_DELAY }], target: i0.ɵɵFactoryTarget.Injectable });
Live.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ARIA_LIVE_DELAY]
                }] }]; } });

let nextWindowId = 0;
/**
 * A directive providing a simple way of creating powerful typeaheads from any text input.
 */
class NgbTypeahead {
    constructor(_elementRef, viewContainerRef, _renderer, injector, config, ngZone, _live, _document, _ngZone, _changeDetector, applicationRef) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._live = _live;
        this._document = _document;
        this._ngZone = _ngZone;
        this._changeDetector = _changeDetector;
        this._subscription = null;
        this._closed$ = new Subject();
        this._inputValueBackup = null;
        this._windowRef = null;
        this._positioning = ngbPositioning();
        /**
         * The value for the `autocomplete` attribute for the `<input>` element.
         *
         * Defaults to `"off"` to disable the native browser autocomplete, but you can override it if necessary.
         *
         * @since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * The preferred placement of the typeahead, among the [possible values](#/guides/positioning#api).
         *
         * The default order of preference is `"bottom-start bottom-end top-start top-end"`
         *
         * Please see the [positioning overview](#/positioning) for more details.
         */
        this.placement = 'bottom-start';
        /**
         * An event emitted right before an item is selected from the result list.
         *
         * Event payload is of type [`NgbTypeaheadSelectItemEvent`](#/components/typeahead/api#NgbTypeaheadSelectItemEvent).
         */
        this.selectItem = new EventEmitter();
        this.activeDescendant = null;
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input')
            .pipe(map($event => $event.target.value));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, injector, viewContainerRef, _renderer, this._ngZone, applicationRef);
        this._zoneSubscription = ngZone.onStable.subscribe(() => { this._positioning.update(); });
    }
    ngOnInit() { this._subscribeToUserInput(); }
    ngOnChanges({ ngbTypeahead }) {
        if (ngbTypeahead && !ngbTypeahead.firstChange) {
            this._unsubscribeFromUserInput();
            this._subscribeToUserInput();
        }
    }
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    }
    registerOnChange(fn) { this._onChange = fn; }
    registerOnTouched(fn) { this._onTouched = fn; }
    writeValue(value) {
        this._writeInputValue(this._formatItemForInput(value));
        if (this.showHint) {
            this._inputValueBackup = value;
        }
    }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * Dismisses typeahead popup window
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._resubscribeTypeahead.next(null);
            this._closePopup();
            if (this.showHint && this._inputValueBackup !== null) {
                this._writeInputValue(this._inputValueBackup);
            }
            this._changeDetector.markForCheck();
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     */
    isPopupOpen() { return this._windowRef != null; }
    handleBlur() {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    }
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.ArrowDown:
                event.preventDefault();
                this._windowRef.instance.next();
                this._showHint();
                break;
            case Key.ArrowUp:
                event.preventDefault();
                this._windowRef.instance.prev();
                this._showHint();
                break;
            case Key.Enter:
            case Key.Tab: {
                const result = this._windowRef.instance.getActive();
                if (isDefined(result)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this._selectResult(result);
                }
                this._closePopup();
                break;
            }
        }
    }
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            const { windowRef } = this._popupService.open();
            this._windowRef = windowRef;
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => this.activeDescendant = activeId);
            this._windowRef.instance.popupClass = this.popupClass;
            if (this.container === 'body') {
                this._renderer.setStyle(this._windowRef.location.nativeElement, 'z-index', '1055');
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._changeDetector.markForCheck();
            // Schedule positioning on stable, to avoid several positioning updates.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._windowRef) {
                    this._positioning.createPopper({
                        hostElement: this._elementRef.nativeElement,
                        targetElement: this._windowRef.location.nativeElement,
                        placement: this.placement,
                        appendToBody: this.container === 'body',
                        updatePopperOptions: addPopperOffset([0, 2]),
                    });
                }
            });
            ngbAutoClose(this._ngZone, this._document, 'outside', () => this.dismissPopup(), this._closed$, [this._elementRef.nativeElement, this._windowRef.location.nativeElement]);
        }
    }
    _closePopup() {
        this._popupService.close().subscribe(() => {
            this._positioning.destroy();
            this._closed$.next();
            this._windowRef = null;
            this.activeDescendant = null;
        });
    }
    _selectResult(result) {
        let defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: () => { defaultPrevented = true; } });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    _showHint() {
        if (this.showHint && this._windowRef?.instance.hasActive() && this._inputValueBackup != null) {
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
            }
            else {
                this._writeInputValue(formattedVal);
            }
        }
    }
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    }
    _subscribeToUserInput() {
        const results$ = this._valueChanges.pipe(tap(value => {
            this._inputValueBackup = this.showHint ? value : null;
            this._onChange(this.editable ? value : undefined);
        }), this.ngbTypeahead ? this.ngbTypeahead : () => of([]));
        this._subscription = this._resubscribeTypeahead.pipe(switchMap(() => results$)).subscribe(results => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
                this._showHint();
            }
            // live announcer
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeahead, deps: [{ token: i0.ElementRef }, { token: i0.ViewContainerRef }, { token: i0.Renderer2 }, { token: i0.Injector }, { token: NgbTypeaheadConfig }, { token: i0.NgZone }, { token: Live }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i0.ApplicationRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbTypeahead.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbTypeahead, selector: "input[ngbTypeahead]", inputs: { autocomplete: "autocomplete", container: "container", editable: "editable", focusFirst: "focusFirst", inputFormatter: "inputFormatter", ngbTypeahead: "ngbTypeahead", resultFormatter: "resultFormatter", resultTemplate: "resultTemplate", showHint: "showHint", placement: "placement", popupClass: "popupClass" }, outputs: { selectItem: "selectItem" }, host: { attributes: { "autocapitalize": "off", "autocorrect": "off", "role": "combobox", "aria-multiline": "false" }, listeners: { "blur": "handleBlur()", "keydown": "handleKeyDown($event)" }, properties: { "class.open": "isPopupOpen()", "autocomplete": "autocomplete", "attr.aria-autocomplete": "showHint ? \"both\" : \"list\"", "attr.aria-activedescendant": "activeDescendant", "attr.aria-owns": "isPopupOpen() ? popupId : null", "attr.aria-expanded": "isPopupOpen()" } }, providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }], exportAs: ["ngbTypeahead"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeahead, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[ngbTypeahead]',
                    exportAs: 'ngbTypeahead',
                    host: {
                        '(blur)': 'handleBlur()',
                        '[class.open]': 'isPopupOpen()',
                        '(keydown)': 'handleKeyDown($event)',
                        '[autocomplete]': 'autocomplete',
                        'autocapitalize': 'off',
                        'autocorrect': 'off',
                        'role': 'combobox',
                        'aria-multiline': 'false',
                        '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                        '[attr.aria-activedescendant]': 'activeDescendant',
                        '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                        '[attr.aria-expanded]': 'isPopupOpen()'
                    },
                    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NgbTypeahead), multi: true }]
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ViewContainerRef }, { type: i0.Renderer2 }, { type: i0.Injector }, { type: NgbTypeaheadConfig }, { type: i0.NgZone }, { type: Live }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i0.ApplicationRef }]; }, propDecorators: { autocomplete: [{
                type: Input
            }], container: [{
                type: Input
            }], editable: [{
                type: Input
            }], focusFirst: [{
                type: Input
            }], inputFormatter: [{
                type: Input
            }], ngbTypeahead: [{
                type: Input
            }], resultFormatter: [{
                type: Input
            }], resultTemplate: [{
                type: Input
            }], showHint: [{
                type: Input
            }], placement: [{
                type: Input
            }], popupClass: [{
                type: Input
            }], selectItem: [{
                type: Output
            }] } });

class NgbTypeaheadModule {
}
NgbTypeaheadModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbTypeaheadModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadModule, declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow], imports: [CommonModule], exports: [NgbTypeahead, NgbHighlight] });
NgbTypeaheadModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbTypeaheadModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                    exports: [NgbTypeahead, NgbHighlight],
                    imports: [CommonModule]
                }]
        }] });

var OffcanvasDismissReasons;
(function (OffcanvasDismissReasons) {
    OffcanvasDismissReasons[OffcanvasDismissReasons["BACKDROP_CLICK"] = 0] = "BACKDROP_CLICK";
    OffcanvasDismissReasons[OffcanvasDismissReasons["ESC"] = 1] = "ESC";
})(OffcanvasDismissReasons || (OffcanvasDismissReasons = {}));

class NgbOffcanvasBackdrop {
    constructor(_el, _zone) {
        this._el = _el;
        this._zone = _zone;
        this.dismissEvent = new EventEmitter();
    }
    ngOnInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            ngbRunTransition(this._zone, this._el.nativeElement, (element, animation) => {
                if (animation) {
                    reflow(element);
                }
                element.classList.add('show');
            }, { animation: this.animation, runningTransition: 'continue' });
        });
    }
    hide() {
        return ngbRunTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), { animation: this.animation, runningTransition: 'stop' });
    }
    dismiss() { this.dismissEvent.emit(OffcanvasDismissReasons.BACKDROP_CLICK); }
}
NgbOffcanvasBackdrop.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasBackdrop, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbOffcanvasBackdrop.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbOffcanvasBackdrop, selector: "ngb-offcanvas-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass" }, outputs: { dismissEvent: "dismiss" }, host: { listeners: { "mousedown": "dismiss()" }, properties: { "class": "\"offcanvas-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" } }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-offcanvas-backdrop',
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        '(mousedown)': 'dismiss()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });

class NgbOffcanvasPanel {
    constructor(_document, _elRef, _zone) {
        this._document = _document;
        this._elRef = _elRef;
        this._zone = _zone;
        this._closed$ = new Subject();
        this._elWithFocus = null; // element that is focused prior to offcanvas opening
        this.keyboard = true;
        this.position = 'start';
        this.dismissEvent = new EventEmitter();
        this.shown = new Subject();
        this.hidden = new Subject();
    }
    dismiss(reason) { this.dismissEvent.emit(reason); }
    ngOnInit() {
        this._elWithFocus = this._document.activeElement;
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => { this._show(); });
    }
    ngOnDestroy() { this._disableEventHandling(); }
    hide() {
        const { nativeElement } = this._elRef;
        const context = { animation: this.animation, runningTransition: 'stop' };
        // TODO when we target Bootstrap 5.2+, the style.visibility handling can be removed, because Bootstrap has improved
        // its CSS
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element) => {
            nativeElement.classList.remove('show');
            return () => element.style.visibility = 'hidden';
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.hidden.next();
            this.hidden.complete();
        });
        this._disableEventHandling();
        this._restoreFocus();
        return offcanvasTransition$;
    }
    _show() {
        const context = { animation: this.animation, runningTransition: 'continue' };
        // TODO when we target Bootstrap 5.2+, the style.visibility handling can be removed, because Bootstrap has improved
        // its CSS
        const offcanvasTransition$ = ngbRunTransition(this._zone, this._elRef.nativeElement, (element, animation) => {
            if (animation) {
                reflow(element);
            }
            element.classList.add('show');
            element.style.visibility = 'visible';
        }, context);
        offcanvasTransition$.subscribe(() => {
            this.shown.next();
            this.shown.complete();
        });
        this._enableEventHandling();
        this._setFocus();
    }
    _enableEventHandling() {
        const { nativeElement } = this._elRef;
        this._zone.runOutsideAngular(() => {
            fromEvent(nativeElement, 'keydown')
                .pipe(takeUntil(this._closed$), 
            /* eslint-disable-next-line deprecation/deprecation */
            filter(e => e.which === Key.Escape))
                .subscribe(event => {
                if (this.keyboard) {
                    requestAnimationFrame(() => {
                        if (!event.defaultPrevented) {
                            this._zone.run(() => this.dismiss(OffcanvasDismissReasons.ESC));
                        }
                    });
                }
            });
        });
    }
    _disableEventHandling() { this._closed$.next(); }
    _setFocus() {
        const { nativeElement } = this._elRef;
        if (!nativeElement.contains(document.activeElement)) {
            const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`);
            const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];
            const elementToFocus = autoFocusable || firstFocusable || nativeElement;
            elementToFocus.focus();
        }
    }
    _restoreFocus() {
        const body = this._document.body;
        const elWithFocus = this._elWithFocus;
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        this._zone.runOutsideAngular(() => {
            setTimeout(() => elementToFocus.focus());
            this._elWithFocus = null;
        });
    }
}
NgbOffcanvasPanel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasPanel, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbOffcanvasPanel.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbOffcanvasPanel, selector: "ngb-offcanvas-panel", inputs: { animation: "animation", ariaLabelledBy: "ariaLabelledBy", ariaDescribedBy: "ariaDescribedBy", keyboard: "keyboard", panelClass: "panelClass", position: "position" }, outputs: { dismissEvent: "dismiss" }, host: { attributes: { "role": "dialog", "tabindex": "-1" }, properties: { "class": "\"offcanvas offcanvas-\" + position  + (panelClass ? \" \" + panelClass : \"\")", "attr.aria-modal": "true", "attr.aria-labelledby": "ariaLabelledBy", "attr.aria-describedby": "ariaDescribedBy" } }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasPanel, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-offcanvas-panel', template: '<ng-content></ng-content>', encapsulation: ViewEncapsulation.None, host: {
                        '[class]': '"offcanvas offcanvas-" + position  + (panelClass ? " " + panelClass : "")',
                        'role': 'dialog',
                        'tabindex': '-1',
                        '[attr.aria-modal]': 'true',
                        '[attr.aria-labelledby]': 'ariaLabelledBy',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                    }, styles: [] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], ariaDescribedBy: [{
                type: Input
            }], keyboard: [{
                type: Input
            }], panelClass: [{
                type: Input
            }], position: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });

/**
 * A reference to the currently opened (active) offcanvas.
 *
 * Instances of this class can be injected into your component passed as offcanvas content.
 * So you can `.close()` or `.dismiss()` the offcanvas window from your component.
 *
 * @since 12.1.0
 */
class NgbActiveOffcanvas {
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
class NgbOffcanvasRef {
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

class NgbOffcanvasStack {
    constructor(_applicationRef, _injector, _document, _scrollBar, _ngZone) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._ngZone = _ngZone;
        this._activePanelCmptHasChanged = new Subject();
        this._scrollBarRestoreFn = null;
        this._backdropAttributes = ['animation', 'backdropClass'];
        this._panelAttributes = ['animation', 'ariaDescribedBy', 'ariaLabelledBy', 'keyboard', 'panelClass', 'position'];
        this._activeInstance = new EventEmitter();
        // Trap focus on active PanelCmpt
        this._activePanelCmptHasChanged.subscribe(() => {
            if (this._panelCmpt) {
                ngbFocusTrap(this._ngZone, this._panelCmpt.location.nativeElement, this._activePanelCmptHasChanged);
            }
        });
    }
    _restoreScrollBar() {
        const scrollBarRestoreFn = this._scrollBarRestoreFn;
        if (scrollBarRestoreFn) {
            this._scrollBarRestoreFn = null;
            scrollBarRestoreFn();
        }
    }
    _hideScrollBar() {
        if (!this._scrollBarRestoreFn) {
            this._scrollBarRestoreFn = this._scrollBar.hide();
        }
    }
    open(moduleCFR, contentInjector, content, options) {
        const containerEl = options.container instanceof HTMLElement ? options.container : isDefined(options.container) ?
            this._document.querySelector(options.container) :
            this._document.body;
        if (!containerEl) {
            throw new Error(`The specified offcanvas container "${options.container || 'body'}" was not found in the DOM.`);
        }
        if (!options.scroll) {
            this._hideScrollBar();
        }
        const activeOffcanvas = new NgbActiveOffcanvas();
        const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeOffcanvas);
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : undefined;
        let panelCmptRef = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        let ngbOffcanvasRef = new NgbOffcanvasRef(panelCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        this._registerOffcanvasRef(ngbOffcanvasRef);
        this._registerPanelCmpt(panelCmptRef);
        ngbOffcanvasRef.hidden.pipe(finalize(() => this._restoreScrollBar())).subscribe();
        activeOffcanvas.close = (result) => { ngbOffcanvasRef.close(result); };
        activeOffcanvas.dismiss = (reason) => { ngbOffcanvasRef.dismiss(reason); };
        this._applyPanelOptions(panelCmptRef.instance, options);
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
            backdropCmptRef.changeDetectorRef.detectChanges();
        }
        panelCmptRef.changeDetectorRef.detectChanges();
        return ngbOffcanvasRef;
    }
    get activeInstance() { return this._activeInstance; }
    dismiss(reason) { this._offcanvasRef?.dismiss(reason); }
    hasOpenOffcanvas() { return !!this._offcanvasRef; }
    _attachBackdrop(moduleCFR, containerEl) {
        let backdropFactory = moduleCFR.resolveComponentFactory(NgbOffcanvasBackdrop);
        let backdropCmptRef = backdropFactory.create(this._injector);
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    _attachWindowComponent(moduleCFR, containerEl, contentRef) {
        let panelFactory = moduleCFR.resolveComponentFactory(NgbOffcanvasPanel);
        let panelCmptRef = panelFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(panelCmptRef.hostView);
        containerEl.appendChild(panelCmptRef.location.nativeElement);
        return panelCmptRef;
    }
    _applyPanelOptions(windowInstance, options) {
        this._panelAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    _getContentRef(moduleCFR, contentInjector, content, activeOffcanvas) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, activeOffcanvas);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(moduleCFR, contentInjector, content, activeOffcanvas);
        }
    }
    _createFromTemplateRef(content, activeOffcanvas) {
        const context = {
            $implicit: activeOffcanvas,
            close(result) { activeOffcanvas.close(result); },
            dismiss(reason) { activeOffcanvas.dismiss(reason); }
        };
        const viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    _createFromString(content) {
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    _createFromComponent(moduleCFR, contentInjector, content, context) {
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        const offcanvasContentInjector = Injector.create({ providers: [{ provide: NgbActiveOffcanvas, useValue: context }], parent: contentInjector });
        const componentRef = contentCmptFactory.create(offcanvasContentInjector);
        const componentNativeEl = componentRef.location.nativeElement;
        this._applicationRef.attachView(componentRef.hostView);
        return new ContentRef([[componentNativeEl]], componentRef.hostView, componentRef);
    }
    _registerOffcanvasRef(ngbOffcanvasRef) {
        const unregisterOffcanvasRef = () => {
            this._offcanvasRef = undefined;
            this._activeInstance.emit(this._offcanvasRef);
        };
        this._offcanvasRef = ngbOffcanvasRef;
        this._activeInstance.emit(this._offcanvasRef);
        ngbOffcanvasRef.result.then(unregisterOffcanvasRef, unregisterOffcanvasRef);
    }
    _registerPanelCmpt(ngbPanelCmpt) {
        this._panelCmpt = ngbPanelCmpt;
        this._activePanelCmptHasChanged.next();
        ngbPanelCmpt.onDestroy(() => {
            this._panelCmpt = undefined;
            this._activePanelCmptHasChanged.next();
        });
    }
}
NgbOffcanvasStack.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasStack, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }, { token: ScrollBar }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvasStack.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasStack, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: ScrollBar }, { type: i0.NgZone }]; } });

/**
 * A configuration service for the [`NgbOffcanvas`](#/components/offcanvas/api#NgbOffcanvas) service.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all offcanvases used in the application.
 *
 * @since 12.1.0
 */
class NgbOffcanvasConfig {
    constructor(_ngbConfig) {
        this._ngbConfig = _ngbConfig;
        this.backdrop = true;
        this.keyboard = true;
        this.position = 'start';
        this.scroll = false;
    }
    get animation() { return (this._animation === undefined) ? this._ngbConfig.animation : this._animation; }
    set animation(animation) { this._animation = animation; }
}
NgbOffcanvasConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasConfig, deps: [{ token: NgbConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvasConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: NgbConfig }]; } });

/**
 * A service for opening an offcanvas.
 *
 * Creating an offcanvas is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 *
 * @since 12.1.0
 */
class NgbOffcanvas {
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
NgbOffcanvas.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.Injector }, { token: NgbOffcanvasStack }, { token: NgbOffcanvasConfig }], target: i0.ɵɵFactoryTarget.Injectable });
NgbOffcanvas.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvas, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.Injector }, { type: NgbOffcanvasStack }, { type: NgbOffcanvasConfig }]; } });

class NgbOffcanvasModule {
}
NgbOffcanvasModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbOffcanvasModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasModule, declarations: [NgbOffcanvasPanel, NgbOffcanvasBackdrop] });
NgbOffcanvasModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasModule, decorators: [{
            type: NgModule,
            args: [{ declarations: [NgbOffcanvasPanel, NgbOffcanvasBackdrop] }]
        }] });

const NGB_MODULES = [
    /* eslint-disable-next-line deprecation/deprecation */
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbNavModule, NgbOffcanvasModule, NgbPaginationModule, NgbPopoverModule,
    NgbProgressbarModule, NgbRatingModule, NgbTimepickerModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule
];
class NgbModule {
}
NgbModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgbModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModule, imports: [
        /* eslint-disable-next-line deprecation/deprecation */
        NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
        NgbDropdownModule, NgbModalModule, NgbNavModule, NgbOffcanvasModule, NgbPaginationModule, NgbPopoverModule,
        NgbProgressbarModule, NgbRatingModule, NgbTimepickerModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule], exports: [
        /* eslint-disable-next-line deprecation/deprecation */
        NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
        NgbDropdownModule, NgbModalModule, NgbNavModule, NgbOffcanvasModule, NgbPaginationModule, NgbPopoverModule,
        NgbProgressbarModule, NgbRatingModule, NgbTimepickerModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule] });
NgbModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModule, imports: [NGB_MODULES, 
        /* eslint-disable-next-line deprecation/deprecation */
        NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
        NgbDropdownModule, NgbModalModule, NgbNavModule, NgbOffcanvasModule, NgbPaginationModule, NgbPopoverModule,
        NgbProgressbarModule, NgbRatingModule, NgbTimepickerModule, NgbToastModule, NgbTooltipModule, NgbTypeaheadModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModule, decorators: [{
            type: NgModule,
            args: [{ imports: NGB_MODULES, exports: NGB_MODULES }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { ModalDismissReasons, NgbAccordion, NgbAccordionConfig, NgbAccordionModule, NgbActiveModal, NgbActiveOffcanvas, NgbAlert, NgbAlertConfig, NgbAlertModule, NgbButtonLabel, NgbButtonsModule, NgbCalendar, NgbCalendarBuddhist, NgbCalendarGregorian, NgbCalendarHebrew, NgbCalendarIslamicCivil, NgbCalendarIslamicUmalqura, NgbCalendarPersian, NgbCarousel, NgbCarouselConfig, NgbCarouselModule, NgbCheckBox, NgbCollapse, NgbCollapseConfig, NgbCollapseModule, NgbConfig, NgbDate, NgbDateAdapter, NgbDateNativeAdapter, NgbDateNativeUTCAdapter, NgbDateParserFormatter, NgbDatepicker, NgbDatepickerConfig, NgbDatepickerContent, NgbDatepickerI18n, NgbDatepickerI18nDefault, NgbDatepickerI18nHebrew, NgbDatepickerKeyboardService, NgbDatepickerModule, NgbDatepickerMonth, NgbDropdown, NgbDropdownAnchor, NgbDropdownConfig, NgbDropdownItem, NgbDropdownMenu, NgbDropdownModule, NgbDropdownToggle, NgbHighlight, NgbInputDatepicker, NgbInputDatepickerConfig, NgbModal, NgbModalConfig, NgbModalModule, NgbModalRef, NgbModule, NgbNav, NgbNavConfig, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavModule, NgbNavOutlet, NgbNavPane, NgbNavbar, NgbOffcanvas, NgbOffcanvasConfig, NgbOffcanvasModule, NgbOffcanvasRef, NgbPagination, NgbPaginationConfig, NgbPaginationEllipsis, NgbPaginationFirst, NgbPaginationLast, NgbPaginationModule, NgbPaginationNext, NgbPaginationNumber, NgbPaginationPages, NgbPaginationPrevious, NgbPanel, NgbPanelContent, NgbPanelHeader, NgbPanelTitle, NgbPanelToggle, NgbPopover, NgbPopoverConfig, NgbPopoverModule, NgbProgressbar, NgbProgressbarConfig, NgbProgressbarModule, NgbRadio, NgbRadioGroup, NgbRating, NgbRatingConfig, NgbRatingModule, NgbSlide, NgbSlideEventDirection, NgbSlideEventSource, NgbTimeAdapter, NgbTimepicker, NgbTimepickerConfig, NgbTimepickerI18n, NgbTimepickerModule, NgbToast, NgbToastConfig, NgbToastHeader, NgbToastModule, NgbTooltip, NgbTooltipConfig, NgbTooltipModule, NgbTypeahead, NgbTypeaheadConfig, NgbTypeaheadModule, OffcanvasDismissReasons };
//# sourceMappingURL=ng-bootstrap.mjs.map
