import { AfterViewInit, ChangeDetectorRef, ElementRef, NgZone } from '@angular/core';
import { NgbNav, NgbNavItem } from './nav';
import * as i0 from "@angular/core";
export declare class NgbNavPane {
    elRef: ElementRef<HTMLElement>;
    item: NgbNavItem;
    nav: NgbNav;
    role: string;
    constructor(elRef: ElementRef<HTMLElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbNavPane, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbNavPane, "[ngbNavPane]", never, { "item": "item"; "nav": "nav"; "role": "role"; }, {}, never>;
}
/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
export declare class NgbNavOutlet implements AfterViewInit {
    private _cd;
    private _ngZone;
    private _activePane;
    private _panes;
    /**
     * A role to set on the nav pane
     */
    paneRole: any;
    /**
     * Reference to the `NgbNav`
     */
    nav: NgbNav;
    constructor(_cd: ChangeDetectorRef, _ngZone: NgZone);
    isPanelTransitioning(item: NgbNavItem): boolean;
    ngAfterViewInit(): void;
    private _updateActivePane;
    private _getPaneForItem;
    private _getActivePane;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbNavOutlet, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbNavOutlet, "[ngbNavOutlet]", never, { "paneRole": "paneRole"; "nav": "ngbNavOutlet"; }, {}, never, never>;
}
