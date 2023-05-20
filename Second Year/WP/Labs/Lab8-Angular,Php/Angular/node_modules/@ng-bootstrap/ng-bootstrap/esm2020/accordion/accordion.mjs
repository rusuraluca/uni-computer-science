import { Component, ContentChildren, Directive, EventEmitter, Host, Input, Optional, Output, ViewEncapsulation, } from '@angular/core';
import { isString } from '../util/util';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./accordion-config";
import * as i2 from "@angular/common";
let nextId = 0;
/**
 * A directive that wraps an accordion panel header with any HTML markup and a toggling button
 * marked with [`NgbPanelToggle`](#/components/accordion/api#NgbPanelToggle).
 * See the [header customization demo](#/components/accordion/examples#header) for more details.
 *
 * You can also use [`NgbPanelTitle`](#/components/accordion/api#NgbPanelTitle) to customize only the panel title.
 *
 * @since 4.1.0
 */
export class NgbPanelHeader {
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
export class NgbPanelTitle {
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
export class NgbPanelContent {
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
export class NgbPanel {
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
        this.id = `ngb-panel-${nextId++}`;
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
export class NgbRefDirective {
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
export class NgbAccordion {
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
NgbAccordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbAccordion, deps: [{ token: i1.NgbAccordionConfig }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: i1.NgbAccordionConfig }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { panels: [{
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
export class NgbPanelToggle {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FjY29yZGlvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUVULFlBQVksRUFDWixJQUFJLEVBQ0osS0FBSyxFQUNMLFFBQVEsRUFDUixNQUFNLEVBR04saUJBQWlCLEdBSWxCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFHdEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDakYsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7O0FBRXBDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQWNmOzs7Ozs7OztHQVFHO0FBRUgsTUFBTSxPQUFPLGNBQWM7SUFDekIsWUFBbUIsV0FBNkI7UUFBN0IsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO0lBQUcsQ0FBQzs7MkdBRHpDLGNBQWM7K0ZBQWQsY0FBYzsyRkFBZCxjQUFjO2tCQUQxQixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLDZCQUE2QixFQUFDOztBQUtwRDs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFBbUIsV0FBNkI7UUFBN0IsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO0lBQUcsQ0FBQzs7MEdBRHpDLGFBQWE7OEZBQWIsYUFBYTsyRkFBYixhQUFhO2tCQUR6QixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFDOztBQUtuRDs7R0FFRztBQUVILE1BQU0sT0FBTyxlQUFlO0lBQzFCLFlBQW1CLFdBQTZCO1FBQTdCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtJQUFHLENBQUM7OzRHQUR6Qyxl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O21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUUsUUFBUTt3QkFDaEIsWUFBWSxFQUFFLGdCQUFnQjt3QkFDOUIsbUJBQW1CLEVBQUUsZUFBZTt3QkFDcEMsc0JBQXNCLEVBQUUsY0FBYzt3QkFDdEMsc0JBQXNCLEVBQUUsVUFBVTt3QkFDbEMsU0FBUyxFQUFFLDRCQUE0QjtxQkFDeEM7aUJBQ0Y7MERBVytCLFlBQVksWUFBb0MsUUFBUTswQkFBekMsUUFBUTs7MEJBQUksSUFBSTs0Q0FOekQsY0FBYztzQkFEakIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEhvc3QsXG4gIElucHV0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7aXNTdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7TmdiQWNjb3JkaW9uQ29uZmlnfSBmcm9tICcuL2FjY29yZGlvbi1jb25maWcnO1xuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge25nYkNvbGxhcHNpbmdUcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiQ29sbGFwc2VUcmFuc2l0aW9uJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBUaGUgY29udGV4dCBmb3IgdGhlIFtOZ2JQYW5lbEhlYWRlcl0oIy9jb21wb25lbnRzL2FjY29yZGlvbi9hcGkjTmdiUGFuZWxIZWFkZXIpIHRlbXBsYXRlXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiUGFuZWxIZWFkZXJDb250ZXh0IHtcbiAgLyoqXG4gICAqIGBUcnVlYCBpZiBjdXJyZW50IHBhbmVsIGlzIG9wZW5lZFxuICAgKi9cbiAgb3BlbmVkOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgYW4gYWNjb3JkaW9uIHBhbmVsIGhlYWRlciB3aXRoIGFueSBIVE1MIG1hcmt1cCBhbmQgYSB0b2dnbGluZyBidXR0b25cbiAqIG1hcmtlZCB3aXRoIFtgTmdiUGFuZWxUb2dnbGVgXSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FwaSNOZ2JQYW5lbFRvZ2dsZSkuXG4gKiBTZWUgdGhlIFtoZWFkZXIgY3VzdG9taXphdGlvbiBkZW1vXSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2V4YW1wbGVzI2hlYWRlcikgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3UgY2FuIGFsc28gdXNlIFtgTmdiUGFuZWxUaXRsZWBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYlBhbmVsVGl0bGUpIHRvIGN1c3RvbWl6ZSBvbmx5IHRoZSBwYW5lbCB0aXRsZS5cbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYW5lbEhlYWRlcl0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbEhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIG9ubHkgdGhlIHBhbmVsIHRpdGxlIHdpdGggSFRNTCBtYXJrdXAgaW5zaWRlLlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgW2BOZ2JQYW5lbEhlYWRlcmBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYlBhbmVsSGVhZGVyKSB0byBjdXN0b21pemUgdGhlIGZ1bGwgcGFuZWwgaGVhZGVyLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhbmVsVGl0bGVdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFuZWxUaXRsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIHRoZSBhY2NvcmRpb24gcGFuZWwgY29udGVudC5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYW5lbENvbnRlbnRdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFuZWxDb250ZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgd3JhcHMgYW4gaW5kaXZpZHVhbCBhY2NvcmRpb24gcGFuZWwgd2l0aCB0aXRsZSBhbmQgY29sbGFwc2libGUgY29udGVudC5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ2ItcGFuZWwnfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuICAvKipcbiAgICogIElmIGB0cnVlYCwgdGhlIHBhbmVsIGlzIGRpc2FibGVkIGFuIGNhbid0IGJlIHRvZ2dsZWQuXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiAgQW4gb3B0aW9uYWwgaWQgZm9yIHRoZSBwYW5lbCB0aGF0IG11c3QgYmUgdW5pcXVlIG9uIHRoZSBwYWdlLlxuICAgKlxuICAgKiAgSWYgbm90IHByb3ZpZGVkLCBpdCB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkIGluIHRoZSBgbmdiLXBhbmVsLXh4eGAgZm9ybWF0LlxuICAgKi9cbiAgQElucHV0KCkgaWQgPSBgbmdiLXBhbmVsLSR7bmV4dElkKyt9YDtcblxuICBpc09wZW4gPSBmYWxzZTtcblxuICAvKiBBIGZsYWcgdG8gc3BlY2lmaWVkIHRoYXQgdGhlIHRyYW5zaXRpb24gcGFuZWwgY2xhc3NlcyBoYXZlIGJlZW4gaW5pdGlhbGl6ZWQgKi9cbiAgaW5pdENsYXNzRG9uZSA9IGZhbHNlO1xuXG4gIC8qIEEgZmxhZyB0byBzcGVjaWZpZWQgaWYgdGhlIHBhbmVsIGlzIGN1cnJlbnRseSBiZWluZyBhbmltYXRlZCwgdG8gZW5zdXJlIGl0cyBwcmVzZW5jZSBpbiB0aGUgZG9tICovXG4gIHRyYW5zaXRpb25SdW5uaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqICBUaGUgcGFuZWwgdGl0bGUuXG4gICAqXG4gICAqICBZb3UgY2FuIGFsdGVybmF0aXZlbHkgdXNlIFtgTmdiUGFuZWxUaXRsZWBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYlBhbmVsVGl0bGUpIHRvIHNldCBwYW5lbCB0aXRsZS5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgdGhlIGN1cnJlbnQgcGFuZWwuXG4gICAqXG4gICAqIEJvb3RzdHJhcCBwcm92aWRlcyBzdHlsZXMgZm9yIHRoZSBmb2xsb3dpbmcgdHlwZXM6IGAnc3VjY2VzcydgLCBgJ2luZm8nYCwgYCd3YXJuaW5nJ2AsIGAnZGFuZ2VyJ2AsIGAncHJpbWFyeSdgLFxuICAgKiBgJ3NlY29uZGFyeSdgLCBgJ2xpZ2h0J2AgYW5kIGAnZGFyaydgLlxuICAgKi9cbiAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIHRoZSBhY2NvcmRpb24gY2FyZCBlbGVtZW50IHRoYXQgd3JhcHMgYm90aCBwYW5lbCB0aXRsZSBhbmQgY29udGVudC5cbiAgICpcbiAgICogQHNpbmNlIDUuMy4wXG4gICAqL1xuICBASW5wdXQoKSBjYXJkQ2xhc3M6IHN0cmluZztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBwYW5lbCBpcyBzaG93biwgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uIEl0IGhhcyBubyBwYXlsb2FkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBwYW5lbCBpcyBoaWRkZW4sIGFmdGVyIHRoZSB0cmFuc2l0aW9uLiBJdCBoYXMgbm8gcGF5bG9hZC5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG5cbiAgdGl0bGVUcGw6IE5nYlBhbmVsVGl0bGU7XG4gIGhlYWRlclRwbDogTmdiUGFuZWxIZWFkZXI7XG4gIGNvbnRlbnRUcGw6IE5nYlBhbmVsQ29udGVudDtcbiAgcGFuZWxEaXY6IEhUTUxFbGVtZW50IHwgbnVsbDtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsVGl0bGUsIHtkZXNjZW5kYW50czogZmFsc2V9KSB0aXRsZVRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbFRpdGxlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JQYW5lbEhlYWRlciwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGhlYWRlclRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbEhlYWRlcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWxDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbENvbnRlbnQ+O1xuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250ZW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG4gICAgLy8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG4gICAgLy8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuICAgIHRoaXMudGl0bGVUcGwgPSB0aGlzLnRpdGxlVHBscy5maXJzdDtcbiAgICB0aGlzLmhlYWRlclRwbCA9IHRoaXMuaGVhZGVyVHBscy5maXJzdDtcbiAgICB0aGlzLmNvbnRlbnRUcGwgPSB0aGlzLmNvbnRlbnRUcGxzLmZpcnN0O1xuICB9XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdG9nZ2xpbmcgYW4gYWNjb3JkaW9uIHBhbmVsLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhbmVsQ2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogVGhlIGlkIG9mIHRoZSBhY2NvcmRpb24gcGFuZWwgYmVpbmcgdG9nZ2xlZC5cbiAgICovXG4gIHBhbmVsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5leHQgc3RhdGUgb2YgdGhlIHBhbmVsLlxuICAgKlxuICAgKiBgdHJ1ZWAgaWYgaXQgd2lsbCBiZSBvcGVuZWQsIGBmYWxzZWAgaWYgY2xvc2VkLlxuICAgKi9cbiAgbmV4dFN0YXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDYWxsaW5nIHRoaXMgZnVuY3Rpb24gd2lsbCBwcmV2ZW50IHBhbmVsIHRvZ2dsaW5nLlxuICAgKi9cbiAgcHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlJlZl0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JSZWZEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBPdXRwdXQoKSBuZ2JSZWYgPSBuZXcgRXZlbnRFbWl0dGVyPEhUTUxFbGVtZW50IHwgbnVsbD4oKTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfRWw6IEVsZW1lbnRSZWYpIHt9XG5cbiAgbmdPbkluaXQoKSB7IHRoaXMubmdiUmVmLmVtaXQodGhpcy5fRWwubmF0aXZlRWxlbWVudCk7IH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5uZ2JSZWYuZW1pdChudWxsKTsgfVxufVxuXG4vKipcbiAqIEFjY29yZGlvbiBpcyBhIGNvbGxlY3Rpb24gb2YgY29sbGFwc2libGUgcGFuZWxzIChib290c3RyYXAgY2FyZHMpLlxuICpcbiAqIEl0IGNhbiBlbnN1cmUgb25seSBvbmUgcGFuZWwgaXMgb3BlbmVkIGF0IGEgdGltZSBhbmQgYWxsb3dzIHRvIGN1c3RvbWl6ZSBwYW5lbFxuICogaGVhZGVycy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWFjY29yZGlvbicsXG4gIGV4cG9ydEFzOiAnbmdiQWNjb3JkaW9uJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgaG9zdDogeydjbGFzcyc6ICdhY2NvcmRpb24nLCAncm9sZSc6ICd0YWJsaXN0JywgJ1thdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXSc6ICchY2xvc2VPdGhlclBhbmVscyd9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjdCBuZ2JQYW5lbEhlYWRlciBsZXQtcGFuZWw+XG4gICAgICA8YnV0dG9uIGNsYXNzPVwiYWNjb3JkaW9uLWJ1dHRvblwiIFtuZ2JQYW5lbFRvZ2dsZV09XCJwYW5lbFwiPlxuICAgICAgICB7e3BhbmVsLnRpdGxlfX08bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwicGFuZWwudGl0bGVUcGw/LnRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1wYW5lbCBbbmdGb3JPZl09XCJwYW5lbHNcIj5cbiAgICAgIDxkaXYgW2NsYXNzXT1cIidhY2NvcmRpb24taXRlbSAnICsgKHBhbmVsLmNhcmRDbGFzcyB8fCAnJylcIj5cbiAgICAgICAgPGRpdiByb2xlPVwidGFiXCIgaWQ9XCJ7e3BhbmVsLmlkfX0taGVhZGVyXCIgW2NsYXNzXT1cIidhY2NvcmRpb24taGVhZGVyICcgKyAocGFuZWwudHlwZSA/ICdiZy0nK3BhbmVsLnR5cGU6IHR5cGUgPyAnYmctJyt0eXBlIDogJycpXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLmhlYWRlclRwbD8udGVtcGxhdGVSZWYgfHwgdFwiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBwYW5lbCwgb3BlbmVkOiBwYW5lbC5pc09wZW59XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgaWQ9XCJ7e3BhbmVsLmlkfX1cIiAobmdiUmVmKT1cInBhbmVsLnBhbmVsRGl2ID0gJGV2ZW50XCIgcm9sZT1cInRhYnBhbmVsXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cInBhbmVsLmlkICsgJy1oZWFkZXInXCJcbiAgICAgICAgICAgICAqbmdJZj1cIiFkZXN0cm95T25IaWRlIHx8IHBhbmVsLmlzT3BlbiB8fCBwYW5lbC50cmFuc2l0aW9uUnVubmluZ1wiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24tYm9keVwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmIHx8IG51bGxcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWwpIHBhbmVsczogUXVlcnlMaXN0PE5nYlBhbmVsPjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBhY2NvcmRpb24gd2lsbCBiZSBhbmltYXRlZC5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRpb247XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIGNvbW1hIHNlcGFyYXRlZCBzdHJpbmdzIG9mIHBhbmVsIGlkcyB0aGF0IHNob3VsZCBiZSBvcGVuZWQgKippbml0aWFsbHkqKi5cbiAgICpcbiAgICogRm9yIHN1YnNlcXVlbnQgY2hhbmdlcyB1c2UgbWV0aG9kcyBsaWtlIGBleHBhbmQoKWAsIGBjb2xsYXBzZSgpYCwgZXRjLiBhbmRcbiAgICogdGhlIGAocGFuZWxDaGFuZ2UpYCBldmVudC5cbiAgICovXG4gIEBJbnB1dCgpIGFjdGl2ZUlkczogc3RyaW5nIHwgcmVhZG9ubHkgc3RyaW5nW10gPSBbXTtcblxuICAvKipcbiAgICogIElmIGB0cnVlYCwgb25seSBvbmUgcGFuZWwgY291bGQgYmUgb3BlbmVkIGF0IGEgdGltZS5cbiAgICpcbiAgICogIE9wZW5pbmcgYSBuZXcgcGFuZWwgd2lsbCBjbG9zZSBvdGhlcnMuXG4gICAqL1xuICBASW5wdXQoJ2Nsb3NlT3RoZXJzJykgY2xvc2VPdGhlclBhbmVsczogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBwYW5lbCBjb250ZW50IHdpbGwgYmUgZGV0YWNoZWQgZnJvbSBET00gYW5kIG5vdCBzaW1wbHkgaGlkZGVuIHdoZW4gdGhlIHBhbmVsIGlzIGNvbGxhcHNlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHBhbmVscy5cbiAgICpcbiAgICogQm9vdHN0cmFwIHByb3ZpZGVzIHN0eWxlcyBmb3IgdGhlIGZvbGxvd2luZyB0eXBlczogYCdzdWNjZXNzJ2AsIGAnaW5mbydgLCBgJ3dhcm5pbmcnYCwgYCdkYW5nZXInYCwgYCdwcmltYXJ5J2AsXG4gICAqIGAnc2Vjb25kYXJ5J2AsIGAnbGlnaHQnYCBhbmQgYCdkYXJrJ2AuXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBwYW5lbCB0b2dnbGUgaGFwcGVucy5cbiAgICpcbiAgICogU2VlIFtOZ2JQYW5lbENoYW5nZUV2ZW50XSgjL2NvbXBvbmVudHMvYWNjb3JkaW9uL2FwaSNOZ2JQYW5lbENoYW5nZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuICAgKi9cbiAgQE91dHB1dCgpIHBhbmVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JQYW5lbENoYW5nZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGV4cGFuZGluZyBhbmltYXRpb24gaXMgZmluaXNoZWQgb24gdGhlIHBhbmVsLiBUaGUgcGF5bG9hZCBpcyB0aGUgcGFuZWwgaWQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY29sbGFwc2luZyBhbmltYXRpb24gaXMgZmluaXNoZWQgb24gdGhlIHBhbmVsLCBhbmQgYmVmb3JlIHRoZSBwYW5lbCBlbGVtZW50IGlzIHJlbW92ZWQuXG4gICAqIFRoZSBwYXlsb2FkIGlzIHRoZSBwYW5lbCBpZC5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JBY2NvcmRpb25Db25maWcsIHByaXZhdGUgX25nWm9uZTogTmdab25lLCBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG4gICAgdGhpcy50eXBlID0gY29uZmlnLnR5cGU7XG4gICAgdGhpcy5jbG9zZU90aGVyUGFuZWxzID0gY29uZmlnLmNsb3NlT3RoZXJzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZCBpcyBleHBhbmRlZC5cbiAgICovXG4gIGlzRXhwYW5kZWQocGFuZWxJZDogc3RyaW5nKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsSWQpID4gLTE7IH1cblxuICAvKipcbiAgICogRXhwYW5kcyBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZC5cbiAgICpcbiAgICogSGFzIG5vIGVmZmVjdCBpZiB0aGUgcGFuZWwgaXMgYWxyZWFkeSBleHBhbmRlZCBvciBkaXNhYmxlZC5cbiAgICovXG4gIGV4cGFuZChwYW5lbElkOiBzdHJpbmcpOiB2b2lkIHsgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHRoaXMuX2ZpbmRQYW5lbEJ5SWQocGFuZWxJZCksIHRydWUpOyB9XG5cbiAgLyoqXG4gICAqIEV4cGFuZHMgYWxsIHBhbmVscywgaWYgYFtjbG9zZU90aGVyc11gIGlzIGBmYWxzZWAuXG4gICAqXG4gICAqIElmIGBbY2xvc2VPdGhlcnNdYCBpcyBgdHJ1ZWAsIGl0IHdpbGwgZXhwYW5kIHRoZSBmaXJzdCBwYW5lbCwgdW5sZXNzIHRoZXJlIGlzIGFscmVhZHkgYSBwYW5lbCBvcGVuZWQuXG4gICAqL1xuICBleHBhbmRBbGwoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2VPdGhlclBhbmVscykge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlSWRzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLnBhbmVscy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHRoaXMucGFuZWxzLmZpcnN0LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB0aGlzLl9jaGFuZ2VPcGVuU3RhdGUocGFuZWwsIHRydWUpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ29sbGFwc2VzIGEgcGFuZWwgd2l0aCB0aGUgZ2l2ZW4gaWQuXG4gICAqXG4gICAqIEhhcyBubyBlZmZlY3QgaWYgdGhlIHBhbmVsIGlzIGFscmVhZHkgY29sbGFwc2VkIG9yIGRpc2FibGVkLlxuICAgKi9cbiAgY29sbGFwc2UocGFuZWxJZDogc3RyaW5nKSB7IHRoaXMuX2NoYW5nZU9wZW5TdGF0ZSh0aGlzLl9maW5kUGFuZWxCeUlkKHBhbmVsSWQpLCBmYWxzZSk7IH1cblxuICAvKipcbiAgICogQ29sbGFwc2VzIGFsbCBvcGVuZWQgcGFuZWxzLlxuICAgKi9cbiAgY29sbGFwc2VBbGwoKSB7XG4gICAgdGhpcy5wYW5lbHMuZm9yRWFjaCgocGFuZWwpID0+IHsgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCBmYWxzZSk7IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYSBwYW5lbCB3aXRoIHRoZSBnaXZlbiBpZC5cbiAgICpcbiAgICogSGFzIG5vIGVmZmVjdCBpZiB0aGUgcGFuZWwgaXMgZGlzYWJsZWQuXG4gICAqL1xuICB0b2dnbGUocGFuZWxJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLl9maW5kUGFuZWxCeUlkKHBhbmVsSWQpO1xuICAgIGlmIChwYW5lbCkge1xuICAgICAgdGhpcy5fY2hhbmdlT3BlblN0YXRlKHBhbmVsLCAhcGFuZWwuaXNPcGVuKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gYWN0aXZlIGlkIHVwZGF0ZXNcbiAgICBpZiAoaXNTdHJpbmcodGhpcy5hY3RpdmVJZHMpKSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkcyA9IHRoaXMuYWN0aXZlSWRzLnNwbGl0KC9cXHMqLFxccyovKTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgcGFuZWxzIG9wZW4gc3RhdGVzXG4gICAgdGhpcy5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7IHBhbmVsLmlzT3BlbiA9ICFwYW5lbC5kaXNhYmxlZCAmJiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsLmlkKSA+IC0xOyB9KTtcblxuICAgIC8vIGNsb3NlT3RoZXJzIHVwZGF0ZXNcbiAgICBpZiAodGhpcy5hY3RpdmVJZHMubGVuZ3RoID4gMSAmJiB0aGlzLmNsb3NlT3RoZXJQYW5lbHMpIHtcbiAgICAgIHRoaXMuX2Nsb3NlT3RoZXJzKHRoaXMuYWN0aXZlSWRzWzBdLCBmYWxzZSk7XG4gICAgICB0aGlzLl91cGRhdGVBY3RpdmVJZHMoKTtcbiAgICB9XG5cbiAgICAvLyBTZXR1cCB0aGUgaW5pdGlhbCBjbGFzc2VzIGhlcmVcbiAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICAgIGNvbnN0IHBhbmVsRWxlbWVudCA9IHBhbmVsLnBhbmVsRGl2O1xuICAgICAgICBpZiAocGFuZWxFbGVtZW50KSB7XG4gICAgICAgICAgaWYgKCFwYW5lbC5pbml0Q2xhc3NEb25lKSB7XG4gICAgICAgICAgICBwYW5lbC5pbml0Q2xhc3NEb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIG5nYlJ1blRyYW5zaXRpb24odGhpcy5fbmdab25lLCBwYW5lbEVsZW1lbnQsIG5nYkNvbGxhcHNpbmdUcmFuc2l0aW9uLCB7XG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2UsXG4gICAgICAgICAgICAgIHJ1bm5pbmdUcmFuc2l0aW9uOiAnY29udGludWUnLFxuICAgICAgICAgICAgICBjb250ZXh0OiB7ZGlyZWN0aW9uOiBwYW5lbC5pc09wZW4gPyAnc2hvdycgOiAnaGlkZSd9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gQ2xhc3NlcyBtdXN0IGJlIGluaXRpYWxpemVkIG5leHQgdGltZSBpdCB3aWxsIGJlIGluIHRoZSBkb21cbiAgICAgICAgICBwYW5lbC5pbml0Q2xhc3NEb25lID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hhbmdlT3BlblN0YXRlKHBhbmVsOiBOZ2JQYW5lbCB8IG51bGwsIG5leHRTdGF0ZTogYm9vbGVhbikge1xuICAgIGlmIChwYW5lbCAhPSBudWxsICYmICFwYW5lbC5kaXNhYmxlZCAmJiBwYW5lbC5pc09wZW4gIT09IG5leHRTdGF0ZSkge1xuICAgICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5wYW5lbENoYW5nZS5lbWl0KFxuICAgICAgICAgIHtwYW5lbElkOiBwYW5lbC5pZCwgbmV4dFN0YXRlOiBuZXh0U3RhdGUsIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7IGRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlOyB9fSk7XG5cbiAgICAgIGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICBwYW5lbC5pc09wZW4gPSBuZXh0U3RhdGU7XG4gICAgICAgIHBhbmVsLnRyYW5zaXRpb25SdW5uaW5nID0gdHJ1ZTtcblxuICAgICAgICBpZiAobmV4dFN0YXRlICYmIHRoaXMuY2xvc2VPdGhlclBhbmVscykge1xuICAgICAgICAgIHRoaXMuX2Nsb3NlT3RoZXJzKHBhbmVsLmlkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl91cGRhdGVBY3RpdmVJZHMoKTtcbiAgICAgICAgdGhpcy5fcnVuVHJhbnNpdGlvbnModGhpcy5hbmltYXRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlT3RoZXJzKHBhbmVsSWQ6IHN0cmluZywgZW5hYmxlVHJhbnNpdGlvbiA9IHRydWUpIHtcbiAgICB0aGlzLnBhbmVscy5mb3JFYWNoKHBhbmVsID0+IHtcbiAgICAgIGlmIChwYW5lbC5pZCAhPT0gcGFuZWxJZCAmJiBwYW5lbC5pc09wZW4pIHtcbiAgICAgICAgcGFuZWwuaXNPcGVuID0gZmFsc2U7XG4gICAgICAgIHBhbmVsLnRyYW5zaXRpb25SdW5uaW5nID0gZW5hYmxlVHJhbnNpdGlvbjtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2ZpbmRQYW5lbEJ5SWQocGFuZWxJZDogc3RyaW5nKTogTmdiUGFuZWwgfCBudWxsIHsgcmV0dXJuIHRoaXMucGFuZWxzLmZpbmQocCA9PiBwLmlkID09PSBwYW5lbElkKSB8fCBudWxsOyB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWRzKCkge1xuICAgIHRoaXMuYWN0aXZlSWRzID0gdGhpcy5wYW5lbHMuZmlsdGVyKHBhbmVsID0+IHBhbmVsLmlzT3BlbiAmJiAhcGFuZWwuZGlzYWJsZWQpLm1hcChwYW5lbCA9PiBwYW5lbC5pZCk7XG4gIH1cblxuICBwcml2YXRlIF9ydW5UcmFuc2l0aW9ucyhhbmltYXRpb246IGJvb2xlYW4pIHtcbiAgICAvLyBkZXRlY3RDaGFuZ2VzIGlzIHBlcmZvcm1lZCB0byBlbnN1cmUgdGhhdCBhbGwgcGFuZWxzIGFyZSBpbiB0aGUgZG9tICh2aWEgdHJhbnNpdGlvblJ1bm5pbmcgPSB0cnVlKVxuICAgIC8vIGJlZm9yZSBzdGFydGluZyB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgdGhpcy5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICAvLyBXaGVuIHBhbmVsLnRyYW5zaXRpb25SdW5uaW5nIGlzIHRydWUsIHRoZSB0cmFuc2l0aW9uIG5lZWRzIHRvIGJlIHN0YXJ0ZWQgT1IgcmV2ZXJzZWQsXG4gICAgICAvLyBUaGUgZGlyZWN0aW9uIChzaG93IG9yIGhpZGUpIGlzIGNob29zZW4gYnkgZWFjaCBwYW5lbC5pc09wZW4gc3RhdGVcbiAgICAgIGlmIChwYW5lbC50cmFuc2l0aW9uUnVubmluZykge1xuICAgICAgICBjb25zdCBwYW5lbEVsZW1lbnQgPSBwYW5lbC5wYW5lbERpdjtcbiAgICAgICAgbmdiUnVuVHJhbnNpdGlvbih0aGlzLl9uZ1pvbmUsIHBhbmVsRWxlbWVudCAhLCBuZ2JDb2xsYXBzaW5nVHJhbnNpdGlvbiwge1xuICAgICAgICAgIGFuaW1hdGlvbixcbiAgICAgICAgICBydW5uaW5nVHJhbnNpdGlvbjogJ3N0b3AnLFxuICAgICAgICAgIGNvbnRleHQ6IHtkaXJlY3Rpb246IHBhbmVsLmlzT3BlbiA/ICdzaG93JyA6ICdoaWRlJ31cbiAgICAgICAgfSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICBwYW5lbC50cmFuc2l0aW9uUnVubmluZyA9IGZhbHNlO1xuICAgICAgICAgIGNvbnN0IHtpZH0gPSBwYW5lbDtcbiAgICAgICAgICBpZiAocGFuZWwuaXNPcGVuKSB7XG4gICAgICAgICAgICBwYW5lbC5zaG93bi5lbWl0KCk7XG4gICAgICAgICAgICB0aGlzLnNob3duLmVtaXQoaWQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYW5lbC5oaWRkZW4uZW1pdCgpO1xuICAgICAgICAgICAgdGhpcy5oaWRkZW4uZW1pdChpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHB1dCBvbiBhIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgcGFuZWwgb3BlbmluZyBhbmQgY2xvc2luZy5cbiAqXG4gKiBUbyBiZSB1c2VkIGluc2lkZSB0aGUgW2BOZ2JQYW5lbEhlYWRlcmBdKCMvY29tcG9uZW50cy9hY2NvcmRpb24vYXBpI05nYlBhbmVsSGVhZGVyKVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdidXR0b25bbmdiUGFuZWxUb2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICd0eXBlJzogJ2J1dHRvbicsXG4gICAgJ1tkaXNhYmxlZF0nOiAncGFuZWwuZGlzYWJsZWQnLFxuICAgICdbY2xhc3MuY29sbGFwc2VkXSc6ICchcGFuZWwuaXNPcGVuJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAncGFuZWwuaXNPcGVuJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAncGFuZWwuaWQnLFxuICAgICcoY2xpY2spJzogJ2FjY29yZGlvbi50b2dnbGUocGFuZWwuaWQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsVG9nZ2xlIHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX25nYlBhbmVsVG9nZ2xlOiBOZ2JQYW5lbCB8ICcnO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBuZ2JQYW5lbFRvZ2dsZShwYW5lbDogTmdiUGFuZWwpIHtcbiAgICBpZiAocGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwgPSBwYW5lbDtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgYWNjb3JkaW9uOiBOZ2JBY2NvcmRpb24sIEBPcHRpb25hbCgpIEBIb3N0KCkgcHVibGljIHBhbmVsOiBOZ2JQYW5lbCkge31cbn1cbiJdfQ==