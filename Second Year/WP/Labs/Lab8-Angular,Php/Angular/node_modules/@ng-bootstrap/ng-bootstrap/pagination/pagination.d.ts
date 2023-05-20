import { EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { NgbPaginationConfig } from './pagination-config';
import * as i0 from "@angular/core";
/**
 * A context for the
 * * `NgbPaginationFirst`
 * * `NgbPaginationPrevious`
 * * `NgbPaginationNext`
 * * `NgbPaginationLast`
 * * `NgbPaginationEllipsis`
 * * `NgbPaginationPages`
 *
 * link templates in case you want to override one.
 *
 * @since 4.1.0
 */
export interface NgbPaginationLinkContext {
    /**
     * Page number displayed by the current link.
     */
    currentPage: number;
    /**
     * If `true`, the current link is disabled.
     */
    disabled: boolean;
}
/**
 * A context for the `NgbPaginationNumber` link template in case you want to override one.
 *
 * Extends `NgbPaginationLinkContext`.
 *
 * @since 4.1.0
 */
export interface NgbPaginationNumberContext extends NgbPaginationLinkContext {
    /**
     * The page number, displayed by the current page link.
     */
    $implicit: number;
}
/**
 * A context for the `NgbPaginationPages` pages template in case you want to override
 * the way all pages are displayed.
 *
 * @since 9.1.0
 */
export interface NgbPaginationPagesContext {
    /**
     * The currently selected page number.
     */
    $implicit: number;
    /**
     * If `true`, pagination is disabled.
     */
    disabled: boolean;
    /**
     * Pages numbers that should be rendered starting with 1.
     */
    pages: number[];
}
/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationEllipsis {
    templateRef: TemplateRef<NgbPaginationLinkContext>;
    constructor(templateRef: TemplateRef<NgbPaginationLinkContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationEllipsis, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationEllipsis, "ng-template[ngbPaginationEllipsis]", never, {}, {}, never>;
}
/**
 * A directive to match the 'first' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationFirst {
    templateRef: TemplateRef<NgbPaginationLinkContext>;
    constructor(templateRef: TemplateRef<NgbPaginationLinkContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationFirst, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationFirst, "ng-template[ngbPaginationFirst]", never, {}, {}, never>;
}
/**
 * A directive to match the 'last' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationLast {
    templateRef: TemplateRef<NgbPaginationLinkContext>;
    constructor(templateRef: TemplateRef<NgbPaginationLinkContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationLast, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationLast, "ng-template[ngbPaginationLast]", never, {}, {}, never>;
}
/**
 * A directive to match the 'next' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationNext {
    templateRef: TemplateRef<NgbPaginationLinkContext>;
    constructor(templateRef: TemplateRef<NgbPaginationLinkContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationNext, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationNext, "ng-template[ngbPaginationNext]", never, {}, {}, never>;
}
/**
 * A directive to match the page 'number' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationNumber {
    templateRef: TemplateRef<NgbPaginationNumberContext>;
    constructor(templateRef: TemplateRef<NgbPaginationNumberContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationNumber, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationNumber, "ng-template[ngbPaginationNumber]", never, {}, {}, never>;
}
/**
 * A directive to match the 'previous' link template
 *
 * @since 4.1.0
 */
export declare class NgbPaginationPrevious {
    templateRef: TemplateRef<NgbPaginationLinkContext>;
    constructor(templateRef: TemplateRef<NgbPaginationLinkContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationPrevious, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationPrevious, "ng-template[ngbPaginationPrevious]", never, {}, {}, never>;
}
/**
 * A directive to match the 'pages' whole content
 *
 * @since 9.1.0
 */
export declare class NgbPaginationPages {
    templateRef: TemplateRef<NgbPaginationPagesContext>;
    constructor(templateRef: TemplateRef<NgbPaginationPagesContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationPages, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbPaginationPages, "ng-template[ngbPaginationPages]", never, {}, {}, never>;
}
/**
 * A component that displays page numbers and allows to customize them in several ways.
 */
export declare class NgbPagination implements OnChanges {
    pageCount: number;
    pages: number[];
    tplEllipsis: NgbPaginationEllipsis;
    tplFirst: NgbPaginationFirst;
    tplLast: NgbPaginationLast;
    tplNext: NgbPaginationNext;
    tplNumber: NgbPaginationNumber;
    tplPrevious: NgbPaginationPrevious;
    tplPages: NgbPaginationPages;
    /**
     * If `true`, pagination links will be disabled.
     */
    disabled: boolean;
    /**
     * If `true`, the "First" and "Last" page links are shown.
     */
    boundaryLinks: boolean;
    /**
     * If `true`, the "Next" and "Previous" page links are shown.
     */
    directionLinks: boolean;
    /**
     * If `true`, the ellipsis symbols and first/last page numbers will be shown when `maxSize` > number of pages.
     */
    ellipses: boolean;
    /**
     * Whether to rotate pages when `maxSize` > number of pages.
     *
     * The current page always stays in the middle if `true`.
     */
    rotate: boolean;
    /**
     *  The number of items in your paginated collection.
     *
     *  Note, that this is not the number of pages. Page numbers are calculated dynamically based on
     *  `collectionSize` and `pageSize`. Ex. if you have 100 items in your collection and displaying 20 items per page,
     *  you'll end up with 5 pages.
     */
    collectionSize: number;
    /**
     *  The maximum number of pages to display.
     */
    maxSize: number;
    /**
     *  The current page.
     *
     *  Page numbers start with `1`.
     */
    page: number;
    /**
     *  The number of items per page.
     */
    pageSize: number;
    /**
     *  An event fired when the page is changed. Will fire only if collection size is set and all values are valid.
     *
     *  Event payload is the number of the newly selected page.
     *
     *  Page numbers start with `1`.
     */
    pageChange: EventEmitter<number>;
    /**
     * The pagination display size.
     *
     * Bootstrap currently supports small and large sizes.
     */
    size: 'sm' | 'lg';
    constructor(config: NgbPaginationConfig);
    hasPrevious(): boolean;
    hasNext(): boolean;
    nextDisabled(): boolean;
    previousDisabled(): boolean;
    selectPage(pageNumber: number): void;
    ngOnChanges(changes: SimpleChanges): void;
    isEllipsis(pageNumber: any): boolean;
    /**
     * Appends ellipses and first/last page number to the displayed pages
     */
    private _applyEllipses;
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     */
    private _applyRotation;
    /**
     * Paginates page numbers based on maxSize items per page.
     */
    private _applyPagination;
    private _setPageInRange;
    private _updatePages;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPagination, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbPagination, "ngb-pagination", never, { "disabled": "disabled"; "boundaryLinks": "boundaryLinks"; "directionLinks": "directionLinks"; "ellipses": "ellipses"; "rotate": "rotate"; "collectionSize": "collectionSize"; "maxSize": "maxSize"; "page": "page"; "pageSize": "pageSize"; "size": "size"; }, { "pageChange": "pageChange"; }, ["tplEllipsis", "tplFirst", "tplLast", "tplNext", "tplNumber", "tplPrevious", "tplPages"], never>;
}
