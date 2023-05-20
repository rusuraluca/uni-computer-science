import { AfterContentChecked, ChangeDetectorRef, ElementRef, EventEmitter, QueryList, TemplateRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { NgbAccordionConfig } from './accordion-config';
import * as i0 from "@angular/core";
/**
 * The context for the [NgbPanelHeader](#/components/accordion/api#NgbPanelHeader) template
 *
 * @since 4.1.0
 */
export interface NgbPanelHeaderContext {
    /**
     * `True` if current panel is opened
     */
    opened: boolean;
}
/**
 * A directive that wraps an accordion panel header with any HTML markup and a toggling button
 * marked with [`NgbPanelToggle`](#/components/accordion/api#NgbPanelToggle).
 * See the [header customization demo](#/components/accordion/examples#header) for more details.
 *
 * You can also use [`NgbPanelTitle`](#/components/accordion/api#NgbPanelTitle) to customize only the panel title.
 *
 * @since 4.1.0
 */
export declare class NgbPanelHeader {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPanelHeader, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPanelHeader, "ng-template[ngbPanelHeader]", never, {}, {}, never>;
}
/**
 * A directive that wraps only the panel title with HTML markup inside.
 *
 * You can also use [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader) to customize the full panel header.
 */
export declare class NgbPanelTitle {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPanelTitle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPanelTitle, "ng-template[ngbPanelTitle]", never, {}, {}, never>;
}
/**
 * A directive that wraps the accordion panel content.
 */
export declare class NgbPanelContent {
    templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPanelContent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPanelContent, "ng-template[ngbPanelContent]", never, {}, {}, never>;
}
/**
 * A directive that wraps an individual accordion panel with title and collapsible content.
 */
export declare class NgbPanel implements AfterContentChecked {
    /**
     *  If `true`, the panel is disabled an can't be toggled.
     */
    disabled: boolean;
    /**
     *  An optional id for the panel that must be unique on the page.
     *
     *  If not provided, it will be auto-generated in the `ngb-panel-xxx` format.
     */
    id: string;
    isOpen: boolean;
    initClassDone: boolean;
    transitionRunning: boolean;
    /**
     *  The panel title.
     *
     *  You can alternatively use [`NgbPanelTitle`](#/components/accordion/api#NgbPanelTitle) to set panel title.
     */
    title: string;
    /**
     * Type of the current panel.
     *
     * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
     * `'secondary'`, `'light'` and `'dark'`.
     */
    type: string;
    /**
     * An optional class applied to the accordion card element that wraps both panel title and content.
     *
     * @since 5.3.0
     */
    cardClass: string;
    /**
     * An event emitted when the panel is shown, after the transition. It has no payload.
     *
     * @since 8.0.0
     */
    shown: EventEmitter<void>;
    /**
     * An event emitted when the panel is hidden, after the transition. It has no payload.
     *
     * @since 8.0.0
     */
    hidden: EventEmitter<void>;
    titleTpl: NgbPanelTitle;
    headerTpl: NgbPanelHeader;
    contentTpl: NgbPanelContent;
    panelDiv: HTMLElement | null;
    titleTpls: QueryList<NgbPanelTitle>;
    headerTpls: QueryList<NgbPanelHeader>;
    contentTpls: QueryList<NgbPanelContent>;
    ngAfterContentChecked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPanel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPanel, "ngb-panel", never, { "disabled": "disabled"; "id": "id"; "title": "title"; "type": "type"; "cardClass": "cardClass"; }, { "shown": "shown"; "hidden": "hidden"; }, ["titleTpls", "headerTpls", "contentTpls"]>;
}
/**
 * An event emitted right before toggling an accordion panel.
 */
export interface NgbPanelChangeEvent {
    /**
     * The id of the accordion panel being toggled.
     */
    panelId: string;
    /**
     * The next state of the panel.
     *
     * `true` if it will be opened, `false` if closed.
     */
    nextState: boolean;
    /**
     * Calling this function will prevent panel toggling.
     */
    preventDefault: () => void;
}
export declare class NgbRefDirective implements OnInit, OnDestroy {
    private _El;
    ngbRef: EventEmitter<HTMLElement | null>;
    constructor(_El: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbRefDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbRefDirective, "[ngbRef]", never, {}, { "ngbRef": "ngbRef"; }, never>;
}
/**
 * Accordion is a collection of collapsible panels (bootstrap cards).
 *
 * It can ensure only one panel is opened at a time and allows to customize panel
 * headers.
 */
export declare class NgbAccordion implements AfterContentChecked {
    private _ngZone;
    private _changeDetector;
    panels: QueryList<NgbPanel>;
    /**
     * If `true`, accordion will be animated.
     *
     * @since 8.0.0
     */
    animation: any;
    /**
     * An array or comma separated strings of panel ids that should be opened **initially**.
     *
     * For subsequent changes use methods like `expand()`, `collapse()`, etc. and
     * the `(panelChange)` event.
     */
    activeIds: string | readonly string[];
    /**
     *  If `true`, only one panel could be opened at a time.
     *
     *  Opening a new panel will close others.
     */
    closeOtherPanels: boolean;
    /**
     * If `true`, panel content will be detached from DOM and not simply hidden when the panel is collapsed.
     */
    destroyOnHide: boolean;
    /**
     * Type of panels.
     *
     * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
     * `'secondary'`, `'light'` and `'dark'`.
     */
    type: string;
    /**
     * Event emitted right before the panel toggle happens.
     *
     * See [NgbPanelChangeEvent](#/components/accordion/api#NgbPanelChangeEvent) for payload details.
     */
    panelChange: EventEmitter<NgbPanelChangeEvent>;
    /**
     * An event emitted when the expanding animation is finished on the panel. The payload is the panel id.
     *
     * @since 8.0.0
     */
    shown: EventEmitter<string>;
    /**
     * An event emitted when the collapsing animation is finished on the panel, and before the panel element is removed.
     * The payload is the panel id.
     *
     * @since 8.0.0
     */
    hidden: EventEmitter<string>;
    constructor(config: NgbAccordionConfig, _ngZone: NgZone, _changeDetector: ChangeDetectorRef);
    /**
     * Checks if a panel with a given id is expanded.
     */
    isExpanded(panelId: string): boolean;
    /**
     * Expands a panel with a given id.
     *
     * Has no effect if the panel is already expanded or disabled.
     */
    expand(panelId: string): void;
    /**
     * Expands all panels, if `[closeOthers]` is `false`.
     *
     * If `[closeOthers]` is `true`, it will expand the first panel, unless there is already a panel opened.
     */
    expandAll(): void;
    /**
     * Collapses a panel with the given id.
     *
     * Has no effect if the panel is already collapsed or disabled.
     */
    collapse(panelId: string): void;
    /**
     * Collapses all opened panels.
     */
    collapseAll(): void;
    /**
     * Toggles a panel with the given id.
     *
     * Has no effect if the panel is disabled.
     */
    toggle(panelId: string): void;
    ngAfterContentChecked(): void;
    private _changeOpenState;
    private _closeOthers;
    private _findPanelById;
    private _updateActiveIds;
    private _runTransitions;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbAccordion, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbAccordion, "ngb-accordion", ["ngbAccordion"], { "animation": "animation"; "activeIds": "activeIds"; "closeOtherPanels": "closeOthers"; "destroyOnHide": "destroyOnHide"; "type": "type"; }, { "panelChange": "panelChange"; "shown": "shown"; "hidden": "hidden"; }, ["panels"], never>;
}
/**
 * A directive to put on a button that toggles panel opening and closing.
 *
 * To be used inside the [`NgbPanelHeader`](#/components/accordion/api#NgbPanelHeader)
 *
 * @since 4.1.0
 */
export declare class NgbPanelToggle {
    accordion: NgbAccordion;
    panel: NgbPanel;
    static ngAcceptInputType_ngbPanelToggle: NgbPanel | '';
    set ngbPanelToggle(panel: NgbPanel);
    constructor(accordion: NgbAccordion, panel: NgbPanel);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPanelToggle, [null, { optional: true; host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPanelToggle, "button[ngbPanelToggle]", never, { "ngbPanelToggle": "ngbPanelToggle"; }, {}, never>;
}
