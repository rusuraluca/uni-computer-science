import { Component, ContentChild, Directive, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "./pagination-config";
import * as i2 from "@angular/common";
/**
 * A directive to match the 'ellipsis' link template
 *
 * @since 4.1.0
 */
export class NgbPaginationEllipsis {
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
export class NgbPaginationFirst {
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
export class NgbPaginationLast {
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
export class NgbPaginationNext {
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
export class NgbPaginationNumber {
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
export class NgbPaginationPrevious {
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
export class NgbPaginationPages {
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
export class NgbPagination {
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
NgbPagination.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPagination, deps: [{ token: i1.NgbPaginationConfig }], target: i0.ɵɵFactoryTarget.Component });
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
        }], ctorParameters: function () { return [{ type: i1.NgbPaginationConfig }]; }, propDecorators: { tplEllipsis: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wYWdpbmF0aW9uL3BhZ2luYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLHVCQUF1QixFQUd4QixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsZUFBZSxFQUFFLFFBQVEsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7OztBQWlFdkQ7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxxQkFBcUI7SUFDaEMsWUFBbUIsV0FBa0Q7UUFBbEQsZ0JBQVcsR0FBWCxXQUFXLENBQXVDO0lBQUcsQ0FBQzs7a0hBRDlELHFCQUFxQjtzR0FBckIscUJBQXFCOzJGQUFyQixxQkFBcUI7a0JBRGpDLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsb0NBQW9DLEVBQUM7O0FBSzNEOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sa0JBQWtCO0lBQzdCLFlBQW1CLFdBQWtEO1FBQWxELGdCQUFXLEdBQVgsV0FBVyxDQUF1QztJQUFHLENBQUM7OytHQUQ5RCxrQkFBa0I7bUdBQWxCLGtCQUFrQjsyRkFBbEIsa0JBQWtCO2tCQUQ5QixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLGlDQUFpQyxFQUFDOztBQUt4RDs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFtQixXQUFrRDtRQUFsRCxnQkFBVyxHQUFYLFdBQVcsQ0FBdUM7SUFBRyxDQUFDOzs4R0FEOUQsaUJBQWlCO2tHQUFqQixpQkFBaUI7MkZBQWpCLGlCQUFpQjtrQkFEN0IsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxnQ0FBZ0MsRUFBQzs7QUFLdkQ7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBbUIsV0FBa0Q7UUFBbEQsZ0JBQVcsR0FB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QkFBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBQ0UsT0FBTztzQkFBeEQsWUFBWTt1QkFBQyxpQkFBaUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBQ0ksU0FBUztzQkFBNUQsWUFBWTt1QkFBQyxtQkFBbUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBQ0ksV0FBVztzQkFBaEUsWUFBWTt1QkFBQyxxQkFBcUIsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBQ0QsUUFBUTtzQkFBMUQsWUFBWTt1QkFBQyxrQkFBa0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7Z0JBS3hDLFFBQVE7c0JBQWhCLEtBQUs7Z0JBS0csYUFBYTtzQkFBckIsS0FBSztnQkFLRyxjQUFjO3NCQUF0QixLQUFLO2dCQUtHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBT0csTUFBTTtzQkFBZCxLQUFLO2dCQVNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBS0csT0FBTztzQkFBZixLQUFLO2dCQU9HLElBQUk7c0JBQVosS0FBSztnQkFLRyxRQUFRO3NCQUFoQixLQUFLO2dCQVNJLFVBQVU7c0JBQW5CLE1BQU07Z0JBT0UsSUFBSTtzQkFBWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkNoYW5nZXMsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Z2V0VmFsdWVJblJhbmdlLCBpc051bWJlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiUGFnaW5hdGlvbkNvbmZpZ30gZnJvbSAnLi9wYWdpbmF0aW9uLWNvbmZpZyc7XG5cbi8qKlxuICogQSBjb250ZXh0IGZvciB0aGVcbiAqICogYE5nYlBhZ2luYXRpb25GaXJzdGBcbiAqICogYE5nYlBhZ2luYXRpb25QcmV2aW91c2BcbiAqICogYE5nYlBhZ2luYXRpb25OZXh0YFxuICogKiBgTmdiUGFnaW5hdGlvbkxhc3RgXG4gKiAqIGBOZ2JQYWdpbmF0aW9uRWxsaXBzaXNgXG4gKiAqIGBOZ2JQYWdpbmF0aW9uUGFnZXNgXG4gKlxuICogbGluayB0ZW1wbGF0ZXMgaW4gY2FzZSB5b3Ugd2FudCB0byBvdmVycmlkZSBvbmUuXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiUGFnaW5hdGlvbkxpbmtDb250ZXh0IHtcbiAgLyoqXG4gICAqIFBhZ2UgbnVtYmVyIGRpc3BsYXllZCBieSB0aGUgY3VycmVudCBsaW5rLlxuICAgKi9cbiAgY3VycmVudFBhZ2U6IG51bWJlcjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCB0aGUgY3VycmVudCBsaW5rIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG59XG5cbi8qKlxuICogQSBjb250ZXh0IGZvciB0aGUgYE5nYlBhZ2luYXRpb25OdW1iZXJgIGxpbmsgdGVtcGxhdGUgaW4gY2FzZSB5b3Ugd2FudCB0byBvdmVycmlkZSBvbmUuXG4gKlxuICogRXh0ZW5kcyBgTmdiUGFnaW5hdGlvbkxpbmtDb250ZXh0YC5cbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JQYWdpbmF0aW9uTnVtYmVyQ29udGV4dCBleHRlbmRzIE5nYlBhZ2luYXRpb25MaW5rQ29udGV4dCB7XG4gIC8qKlxuICAgKiBUaGUgcGFnZSBudW1iZXIsIGRpc3BsYXllZCBieSB0aGUgY3VycmVudCBwYWdlIGxpbmsuXG4gICAqL1xuICAkaW1wbGljaXQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBIGNvbnRleHQgZm9yIHRoZSBgTmdiUGFnaW5hdGlvblBhZ2VzYCBwYWdlcyB0ZW1wbGF0ZSBpbiBjYXNlIHlvdSB3YW50IHRvIG92ZXJyaWRlXG4gKiB0aGUgd2F5IGFsbCBwYWdlcyBhcmUgZGlzcGxheWVkLlxuICpcbiAqIEBzaW5jZSA5LjEuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhZ2luYXRpb25QYWdlc0NvbnRleHQge1xuICAvKipcbiAgICogVGhlIGN1cnJlbnRseSBzZWxlY3RlZCBwYWdlIG51bWJlci5cbiAgICovXG4gICRpbXBsaWNpdDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHBhZ2luYXRpb24gaXMgZGlzYWJsZWQuXG4gICAqL1xuICBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogUGFnZXMgbnVtYmVycyB0aGF0IHNob3VsZCBiZSByZW5kZXJlZCBzdGFydGluZyB3aXRoIDEuXG4gICAqL1xuICBwYWdlczogbnVtYmVyW107XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWF0Y2ggdGhlICdlbGxpcHNpcycgbGluayB0ZW1wbGF0ZVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhZ2luYXRpb25FbGxpcHNpc10nfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYWdpbmF0aW9uRWxsaXBzaXMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nYlBhZ2luYXRpb25MaW5rQ29udGV4dD4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWF0Y2ggdGhlICdmaXJzdCcgbGluayB0ZW1wbGF0ZVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhZ2luYXRpb25GaXJzdF0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYWdpbmF0aW9uRmlyc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nYlBhZ2luYXRpb25MaW5rQ29udGV4dD4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWF0Y2ggdGhlICdsYXN0JyBsaW5rIHRlbXBsYXRlXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFnaW5hdGlvbkxhc3RdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbkxhc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nYlBhZ2luYXRpb25MaW5rQ29udGV4dD4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWF0Y2ggdGhlICduZXh0JyBsaW5rIHRlbXBsYXRlXG4gKlxuICogQHNpbmNlIDQuMS4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFnaW5hdGlvbk5leHRdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbk5leHQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nYlBhZ2luYXRpb25MaW5rQ29udGV4dD4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWF0Y2ggdGhlIHBhZ2UgJ251bWJlcicgbGluayB0ZW1wbGF0ZVxuICpcbiAqIEBzaW5jZSA0LjEuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhZ2luYXRpb25OdW1iZXJdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbk51bWJlciB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdiUGFnaW5hdGlvbk51bWJlckNvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAncHJldmlvdXMnIGxpbmsgdGVtcGxhdGVcbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYWdpbmF0aW9uUHJldmlvdXNdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvblByZXZpb3VzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uTGlua0NvbnRleHQ+KSB7fVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIG1hdGNoIHRoZSAncGFnZXMnIHdob2xlIGNvbnRlbnRcbiAqXG4gKiBAc2luY2UgOS4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYWdpbmF0aW9uUGFnZXNdJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvblBhZ2VzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ2JQYWdpbmF0aW9uUGFnZXNDb250ZXh0Pikge31cbn1cblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGRpc3BsYXlzIHBhZ2UgbnVtYmVycyBhbmQgYWxsb3dzIHRvIGN1c3RvbWl6ZSB0aGVtIGluIHNldmVyYWwgd2F5cy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXBhZ2luYXRpb24nLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDogeydyb2xlJzogJ25hdmlnYXRpb24nfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2ZpcnN0PjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGkxOG49XCJAQG5nYi5wYWdpbmF0aW9uLmZpcnN0XCI+JmxhcXVvOyZsYXF1bzs8L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI3ByZXZpb3VzPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGkxOG49XCJAQG5nYi5wYWdpbmF0aW9uLnByZXZpb3VzXCI+JmxhcXVvOzwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjbmV4dD48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5uZXh0XCI+JnJhcXVvOzwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSAjbGFzdD48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5sYXN0XCI+JnJhcXVvOyZyYXF1bzs8L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI2VsbGlwc2lzPi4uLjwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNkZWZhdWx0TnVtYmVyIGxldC1wYWdlIGxldC1jdXJyZW50UGFnZT1cImN1cnJlbnRQYWdlXCI+XG4gICAgICB7eyBwYWdlIH19XG4gICAgICA8c3BhbiAqbmdJZj1cInBhZ2UgPT09IGN1cnJlbnRQYWdlXCIgY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIj4oY3VycmVudCk8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8bmctdGVtcGxhdGUgI2RlZmF1bHRQYWdlcyBsZXQtcGFnZSBsZXQtcGFnZXM9XCJwYWdlc1wiIGxldC1kaXNhYmxlZD1cImRpc2FibGVkXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IHBhZ2VOdW1iZXIgb2YgcGFnZXNcIiBjbGFzcz1cInBhZ2UtaXRlbVwiIFtjbGFzcy5hY3RpdmVdPVwicGFnZU51bWJlciA9PT0gcGFnZVwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJpc0VsbGlwc2lzKHBhZ2VOdW1iZXIpIHx8IGRpc2FibGVkXCIgW2F0dHIuYXJpYS1jdXJyZW50XT1cIihwYWdlTnVtYmVyID09PSBwYWdlID8gJ3BhZ2UnIDogbnVsbClcIj5cbiAgICAgICAgPGEgKm5nSWY9XCJpc0VsbGlwc2lzKHBhZ2VOdW1iZXIpXCIgY2xhc3M9XCJwYWdlLWxpbmtcIiB0YWJpbmRleD1cIi0xXCIgYXJpYS1kaXNhYmxlZD1cInRydWVcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsRWxsaXBzaXM/LnRlbXBsYXRlUmVmIHx8IGVsbGlwc2lzXCJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2Rpc2FibGVkOiB0cnVlLCBjdXJyZW50UGFnZTogcGFnZX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICAgIDxhICpuZ0lmPVwiIWlzRWxsaXBzaXMocGFnZU51bWJlcilcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWYgKGNsaWNrKT1cInNlbGVjdFBhZ2UocGFnZU51bWJlcik7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCJcbiAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/ICctMScgOiBudWxsXCIgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJkaXNhYmxlZCA/ICd0cnVlJyA6IG51bGxcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsTnVtYmVyPy50ZW1wbGF0ZVJlZiB8fCBkZWZhdWx0TnVtYmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwie2Rpc2FibGVkOiBkaXNhYmxlZCwgJGltcGxpY2l0OiBwYWdlTnVtYmVyLCBjdXJyZW50UGFnZTogcGFnZX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPHVsIFtjbGFzc109XCIncGFnaW5hdGlvbicgKyAoc2l6ZSA/ICcgcGFnaW5hdGlvbi0nICsgc2l6ZSA6ICcnKVwiPlxuICAgICAgPGxpICpuZ0lmPVwiYm91bmRhcnlMaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCJcbiAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cInByZXZpb3VzRGlzYWJsZWQoKVwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiRmlyc3RcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLmZpcnN0LWFyaWFcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWZcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0UGFnZSgxKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIiBbYXR0ci50YWJpbmRleF09XCJwcmV2aW91c0Rpc2FibGVkKCkgPyAnLTEnIDogbnVsbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJwcmV2aW91c0Rpc2FibGVkKCkgPyAndHJ1ZScgOiBudWxsXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRwbEZpcnN0Py50ZW1wbGF0ZVJlZiB8fCBmaXJzdFwiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGlzYWJsZWQ6IHByZXZpb3VzRGlzYWJsZWQoKSwgY3VycmVudFBhZ2U6IHBhZ2V9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cblxuICAgICAgPGxpICpuZ0lmPVwiZGlyZWN0aW9uTGlua3NcIiBjbGFzcz1cInBhZ2UtaXRlbVwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJwcmV2aW91c0Rpc2FibGVkKClcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIlByZXZpb3VzXCIgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IucGFnaW5hdGlvbi5wcmV2aW91cy1hcmlhXCIgY2xhc3M9XCJwYWdlLWxpbmtcIiBocmVmXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdFBhZ2UocGFnZS0xKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KClcIiBbYXR0ci50YWJpbmRleF09XCJwcmV2aW91c0Rpc2FibGVkKCkgPyAnLTEnIDogbnVsbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJwcmV2aW91c0Rpc2FibGVkKCkgPyAndHJ1ZScgOiBudWxsXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRwbFByZXZpb3VzPy50ZW1wbGF0ZVJlZiB8fCBwcmV2aW91c1wiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGlzYWJsZWQ6IHByZXZpb3VzRGlzYWJsZWQoKX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRwbFBhZ2VzPy50ZW1wbGF0ZVJlZiB8fCBkZWZhdWx0UGFnZXNcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IHBhZ2UsIHBhZ2VzOiBwYWdlcywgZGlzYWJsZWQ6IGRpc2FibGVkIH1cIlxuICAgICAgPlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxsaSAqbmdJZj1cImRpcmVjdGlvbkxpbmtzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuZGlzYWJsZWRdPVwibmV4dERpc2FibGVkKClcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIk5leHRcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLm5leHQtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3RQYWdlKHBhZ2UrMSk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCIgW2F0dHIudGFiaW5kZXhdPVwibmV4dERpc2FibGVkKCkgPyAnLTEnIDogbnVsbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJuZXh0RGlzYWJsZWQoKSA/ICd0cnVlJyA6IG51bGxcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsTmV4dD8udGVtcGxhdGVSZWYgfHwgbmV4dFwiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGlzYWJsZWQ6IG5leHREaXNhYmxlZCgpLCBjdXJyZW50UGFnZTogcGFnZX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuXG4gICAgICA8bGkgKm5nSWY9XCJib3VuZGFyeUxpbmtzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuZGlzYWJsZWRdPVwibmV4dERpc2FibGVkKClcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIkxhc3RcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLmxhc3QtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3RQYWdlKHBhZ2VDb3VudCk7ICRldmVudC5wcmV2ZW50RGVmYXVsdCgpXCIgW2F0dHIudGFiaW5kZXhdPVwibmV4dERpc2FibGVkKCkgPyAnLTEnIDogbnVsbFwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1kaXNhYmxlZF09XCJuZXh0RGlzYWJsZWQoKSA/ICd0cnVlJyA6IG51bGxcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidHBsTGFzdD8udGVtcGxhdGVSZWYgfHwgbGFzdFwiXG4gICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7ZGlzYWJsZWQ6IG5leHREaXNhYmxlZCgpLCBjdXJyZW50UGFnZTogcGFnZX1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgIDwvdWw+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbiBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIHBhZ2VDb3VudCA9IDA7XG4gIHBhZ2VzOiBudW1iZXJbXSA9IFtdO1xuXG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbkVsbGlwc2lzLCB7c3RhdGljOiBmYWxzZX0pIHRwbEVsbGlwc2lzOiBOZ2JQYWdpbmF0aW9uRWxsaXBzaXM7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbkZpcnN0LCB7c3RhdGljOiBmYWxzZX0pIHRwbEZpcnN0OiBOZ2JQYWdpbmF0aW9uRmlyc3Q7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbkxhc3QsIHtzdGF0aWM6IGZhbHNlfSkgdHBsTGFzdDogTmdiUGFnaW5hdGlvbkxhc3Q7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbk5leHQsIHtzdGF0aWM6IGZhbHNlfSkgdHBsTmV4dDogTmdiUGFnaW5hdGlvbk5leHQ7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvbk51bWJlciwge3N0YXRpYzogZmFsc2V9KSB0cGxOdW1iZXI6IE5nYlBhZ2luYXRpb25OdW1iZXI7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvblByZXZpb3VzLCB7c3RhdGljOiBmYWxzZX0pIHRwbFByZXZpb3VzOiBOZ2JQYWdpbmF0aW9uUHJldmlvdXM7XG4gIEBDb250ZW50Q2hpbGQoTmdiUGFnaW5hdGlvblBhZ2VzLCB7c3RhdGljOiBmYWxzZX0pIHRwbFBhZ2VzOiBOZ2JQYWdpbmF0aW9uUGFnZXM7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgcGFnaW5hdGlvbiBsaW5rcyB3aWxsIGJlIGRpc2FibGVkLlxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIFwiRmlyc3RcIiBhbmQgXCJMYXN0XCIgcGFnZSBsaW5rcyBhcmUgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBib3VuZGFyeUxpbmtzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBcIk5leHRcIiBhbmQgXCJQcmV2aW91c1wiIHBhZ2UgbGlua3MgYXJlIHNob3duLlxuICAgKi9cbiAgQElucHV0KCkgZGlyZWN0aW9uTGlua3M6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGVsbGlwc2lzIHN5bWJvbHMgYW5kIGZpcnN0L2xhc3QgcGFnZSBudW1iZXJzIHdpbGwgYmUgc2hvd24gd2hlbiBgbWF4U2l6ZWAgPiBudW1iZXIgb2YgcGFnZXMuXG4gICAqL1xuICBASW5wdXQoKSBlbGxpcHNlczogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byByb3RhdGUgcGFnZXMgd2hlbiBgbWF4U2l6ZWAgPiBudW1iZXIgb2YgcGFnZXMuXG4gICAqXG4gICAqIFRoZSBjdXJyZW50IHBhZ2UgYWx3YXlzIHN0YXlzIGluIHRoZSBtaWRkbGUgaWYgYHRydWVgLlxuICAgKi9cbiAgQElucHV0KCkgcm90YXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiAgVGhlIG51bWJlciBvZiBpdGVtcyBpbiB5b3VyIHBhZ2luYXRlZCBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiAgTm90ZSwgdGhhdCB0aGlzIGlzIG5vdCB0aGUgbnVtYmVyIG9mIHBhZ2VzLiBQYWdlIG51bWJlcnMgYXJlIGNhbGN1bGF0ZWQgZHluYW1pY2FsbHkgYmFzZWQgb25cbiAgICogIGBjb2xsZWN0aW9uU2l6ZWAgYW5kIGBwYWdlU2l6ZWAuIEV4LiBpZiB5b3UgaGF2ZSAxMDAgaXRlbXMgaW4geW91ciBjb2xsZWN0aW9uIGFuZCBkaXNwbGF5aW5nIDIwIGl0ZW1zIHBlciBwYWdlLFxuICAgKiAgeW91J2xsIGVuZCB1cCB3aXRoIDUgcGFnZXMuXG4gICAqL1xuICBASW5wdXQoKSBjb2xsZWN0aW9uU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgVGhlIG1heGltdW0gbnVtYmVyIG9mIHBhZ2VzIHRvIGRpc3BsYXkuXG4gICAqL1xuICBASW5wdXQoKSBtYXhTaXplOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqICBUaGUgY3VycmVudCBwYWdlLlxuICAgKlxuICAgKiAgUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggYDFgLlxuICAgKi9cbiAgQElucHV0KCkgcGFnZSA9IDE7XG5cbiAgLyoqXG4gICAqICBUaGUgbnVtYmVyIG9mIGl0ZW1zIHBlciBwYWdlLlxuICAgKi9cbiAgQElucHV0KCkgcGFnZVNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogIEFuIGV2ZW50IGZpcmVkIHdoZW4gdGhlIHBhZ2UgaXMgY2hhbmdlZC4gV2lsbCBmaXJlIG9ubHkgaWYgY29sbGVjdGlvbiBzaXplIGlzIHNldCBhbmQgYWxsIHZhbHVlcyBhcmUgdmFsaWQuXG4gICAqXG4gICAqICBFdmVudCBwYXlsb2FkIGlzIHRoZSBudW1iZXIgb2YgdGhlIG5ld2x5IHNlbGVjdGVkIHBhZ2UuXG4gICAqXG4gICAqICBQYWdlIG51bWJlcnMgc3RhcnQgd2l0aCBgMWAuXG4gICAqL1xuICBAT3V0cHV0KCkgcGFnZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPih0cnVlKTtcblxuICAvKipcbiAgICogVGhlIHBhZ2luYXRpb24gZGlzcGxheSBzaXplLlxuICAgKlxuICAgKiBCb290c3RyYXAgY3VycmVudGx5IHN1cHBvcnRzIHNtYWxsIGFuZCBsYXJnZSBzaXplcy5cbiAgICovXG4gIEBJbnB1dCgpIHNpemU6ICdzbScgfCAnbGcnO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiUGFnaW5hdGlvbkNvbmZpZykge1xuICAgIHRoaXMuZGlzYWJsZWQgPSBjb25maWcuZGlzYWJsZWQ7XG4gICAgdGhpcy5ib3VuZGFyeUxpbmtzID0gY29uZmlnLmJvdW5kYXJ5TGlua3M7XG4gICAgdGhpcy5kaXJlY3Rpb25MaW5rcyA9IGNvbmZpZy5kaXJlY3Rpb25MaW5rcztcbiAgICB0aGlzLmVsbGlwc2VzID0gY29uZmlnLmVsbGlwc2VzO1xuICAgIHRoaXMubWF4U2l6ZSA9IGNvbmZpZy5tYXhTaXplO1xuICAgIHRoaXMucGFnZVNpemUgPSBjb25maWcucGFnZVNpemU7XG4gICAgdGhpcy5yb3RhdGUgPSBjb25maWcucm90YXRlO1xuICAgIHRoaXMuc2l6ZSA9IGNvbmZpZy5zaXplO1xuICB9XG5cbiAgaGFzUHJldmlvdXMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2UgPiAxOyB9XG5cbiAgaGFzTmV4dCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZSA8IHRoaXMucGFnZUNvdW50OyB9XG5cbiAgbmV4dERpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMuaGFzTmV4dCgpIHx8IHRoaXMuZGlzYWJsZWQ7IH1cblxuICBwcmV2aW91c0Rpc2FibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMuaGFzUHJldmlvdXMoKSB8fCB0aGlzLmRpc2FibGVkOyB9XG5cbiAgc2VsZWN0UGFnZShwYWdlTnVtYmVyOiBudW1iZXIpOiB2b2lkIHsgdGhpcy5fdXBkYXRlUGFnZXMocGFnZU51bWJlcik7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7IHRoaXMuX3VwZGF0ZVBhZ2VzKHRoaXMucGFnZSk7IH1cblxuICBpc0VsbGlwc2lzKHBhZ2VOdW1iZXIpOiBib29sZWFuIHsgcmV0dXJuIHBhZ2VOdW1iZXIgPT09IC0xOyB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZHMgZWxsaXBzZXMgYW5kIGZpcnN0L2xhc3QgcGFnZSBudW1iZXIgdG8gdGhlIGRpc3BsYXllZCBwYWdlc1xuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlFbGxpcHNlcyhzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmVsbGlwc2VzKSB7XG4gICAgICBpZiAoc3RhcnQgPiAwKSB7XG4gICAgICAgIC8vIFRoZSBmaXJzdCBwYWdlIHdpbGwgYWx3YXlzIGJlIGluY2x1ZGVkLiBJZiB0aGUgZGlzcGxheWVkIHJhbmdlXG4gICAgICAgIC8vIHN0YXJ0cyBhZnRlciB0aGUgdGhpcmQgcGFnZSwgdGhlbiBhZGQgZWxsaXBzaXMuIEJ1dCBpZiB0aGUgcmFuZ2VcbiAgICAgICAgLy8gc3RhcnRzIG9uIHRoZSB0aGlyZCBwYWdlLCB0aGVuIGFkZCB0aGUgc2Vjb25kIHBhZ2UgaW5zdGVhZCBvZlxuICAgICAgICAvLyBhbiBlbGxpcHNpcywgYmVjYXVzZSB0aGUgZWxsaXBzaXMgd291bGQgb25seSBoaWRlIGEgc2luZ2xlIHBhZ2UuXG4gICAgICAgIGlmIChzdGFydCA+IDIpIHtcbiAgICAgICAgICB0aGlzLnBhZ2VzLnVuc2hpZnQoLTEpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0ID09PSAyKSB7XG4gICAgICAgICAgdGhpcy5wYWdlcy51bnNoaWZ0KDIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFnZXMudW5zaGlmdCgxKTtcbiAgICAgIH1cbiAgICAgIGlmIChlbmQgPCB0aGlzLnBhZ2VDb3VudCkge1xuICAgICAgICAvLyBUaGUgbGFzdCBwYWdlIHdpbGwgYWx3YXlzIGJlIGluY2x1ZGVkLiBJZiB0aGUgZGlzcGxheWVkIHJhbmdlXG4gICAgICAgIC8vIGVuZHMgYmVmb3JlIHRoZSB0aGlyZC1sYXN0IHBhZ2UsIHRoZW4gYWRkIGVsbGlwc2lzLiBCdXQgaWYgdGhlIHJhbmdlXG4gICAgICAgIC8vIGVuZHMgb24gdGhpcmQtbGFzdCBwYWdlLCB0aGVuIGFkZCB0aGUgc2Vjb25kLWxhc3QgcGFnZSBpbnN0ZWFkIG9mXG4gICAgICAgIC8vIGFuIGVsbGlwc2lzLCBiZWNhdXNlIHRoZSBlbGxpcHNpcyB3b3VsZCBvbmx5IGhpZGUgYSBzaW5nbGUgcGFnZS5cbiAgICAgICAgaWYgKGVuZCA8ICh0aGlzLnBhZ2VDb3VudCAtIDIpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlcy5wdXNoKC0xKTtcbiAgICAgICAgfSBlbHNlIGlmIChlbmQgPT09ICh0aGlzLnBhZ2VDb3VudCAtIDIpKSB7XG4gICAgICAgICAgdGhpcy5wYWdlcy5wdXNoKHRoaXMucGFnZUNvdW50IC0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKHRoaXMucGFnZUNvdW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyB2aXNpYmxlLlxuICAgKiBDdXJyZW50bHkgc2VsZWN0ZWQgcGFnZSBzdGF5cyBpbiB0aGUgbWlkZGxlOlxuICAgKlxuICAgKiBFeC4gZm9yIHNlbGVjdGVkIHBhZ2UgPSA2OlxuICAgKiBbNSwqNiosN10gZm9yIG1heFNpemUgPSAzXG4gICAqIFs0LDUsKjYqLDddIGZvciBtYXhTaXplID0gNFxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlSb3RhdGlvbigpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcbiAgICBsZXQgbGVmdE9mZnNldCA9IE1hdGguZmxvb3IodGhpcy5tYXhTaXplIC8gMik7XG4gICAgbGV0IHJpZ2h0T2Zmc2V0ID0gdGhpcy5tYXhTaXplICUgMiA9PT0gMCA/IGxlZnRPZmZzZXQgLSAxIDogbGVmdE9mZnNldDtcblxuICAgIGlmICh0aGlzLnBhZ2UgPD0gbGVmdE9mZnNldCkge1xuICAgICAgLy8gdmVyeSBiZWdpbm5pbmcsIG5vIHJvdGF0aW9uIC0+IFswLi5tYXhTaXplXVxuICAgICAgZW5kID0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYWdlQ291bnQgLSB0aGlzLnBhZ2UgPCBsZWZ0T2Zmc2V0KSB7XG4gICAgICAvLyB2ZXJ5IGVuZCwgbm8gcm90YXRpb24gLT4gW2xlbi1tYXhTaXplLi5sZW5dXG4gICAgICBzdGFydCA9IHRoaXMucGFnZUNvdW50IC0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb3RhdGVcbiAgICAgIHN0YXJ0ID0gdGhpcy5wYWdlIC0gbGVmdE9mZnNldCAtIDE7XG4gICAgICBlbmQgPSB0aGlzLnBhZ2UgKyByaWdodE9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhZ2luYXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyBwZXIgcGFnZS5cbiAgICovXG4gIHByaXZhdGUgX2FwcGx5UGFnaW5hdGlvbigpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBsZXQgcGFnZSA9IE1hdGguY2VpbCh0aGlzLnBhZ2UgLyB0aGlzLm1heFNpemUpIC0gMTtcbiAgICBsZXQgc3RhcnQgPSBwYWdlICogdGhpcy5tYXhTaXplO1xuICAgIGxldCBlbmQgPSBzdGFydCArIHRoaXMubWF4U2l6ZTtcblxuICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gIH1cblxuICBwcml2YXRlIF9zZXRQYWdlSW5SYW5nZShuZXdQYWdlTm8pIHtcbiAgICBjb25zdCBwcmV2UGFnZU5vID0gdGhpcy5wYWdlO1xuICAgIHRoaXMucGFnZSA9IGdldFZhbHVlSW5SYW5nZShuZXdQYWdlTm8sIHRoaXMucGFnZUNvdW50LCAxKTtcblxuICAgIGlmICh0aGlzLnBhZ2UgIT09IHByZXZQYWdlTm8gJiYgaXNOdW1iZXIodGhpcy5jb2xsZWN0aW9uU2l6ZSkpIHtcbiAgICAgIHRoaXMucGFnZUNoYW5nZS5lbWl0KHRoaXMucGFnZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUGFnZXMobmV3UGFnZTogbnVtYmVyKSB7XG4gICAgdGhpcy5wYWdlQ291bnQgPSBNYXRoLmNlaWwodGhpcy5jb2xsZWN0aW9uU2l6ZSAvIHRoaXMucGFnZVNpemUpO1xuXG4gICAgaWYgKCFpc051bWJlcih0aGlzLnBhZ2VDb3VudCkpIHtcbiAgICAgIHRoaXMucGFnZUNvdW50ID0gMDtcbiAgICB9XG5cbiAgICAvLyBmaWxsLWluIG1vZGVsIG5lZWRlZCB0byByZW5kZXIgcGFnZXNcbiAgICB0aGlzLnBhZ2VzLmxlbmd0aCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gdGhpcy5wYWdlQ291bnQ7IGkrKykge1xuICAgICAgdGhpcy5wYWdlcy5wdXNoKGkpO1xuICAgIH1cblxuICAgIC8vIHNldCBwYWdlIHdpdGhpbiAxLi5tYXggcmFuZ2VcbiAgICB0aGlzLl9zZXRQYWdlSW5SYW5nZShuZXdQYWdlKTtcblxuICAgIC8vIGFwcGx5IG1heFNpemUgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKHRoaXMubWF4U2l6ZSA+IDAgJiYgdGhpcy5wYWdlQ291bnQgPiB0aGlzLm1heFNpemUpIHtcbiAgICAgIGxldCBzdGFydCA9IDA7XG4gICAgICBsZXQgZW5kID0gdGhpcy5wYWdlQ291bnQ7XG5cbiAgICAgIC8vIGVpdGhlciBwYWdpbmF0aW5nIG9yIHJvdGF0aW5nIHBhZ2UgbnVtYmVyc1xuICAgICAgaWYgKHRoaXMucm90YXRlKSB7XG4gICAgICAgIFtzdGFydCwgZW5kXSA9IHRoaXMuX2FwcGx5Um90YXRpb24oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFtzdGFydCwgZW5kXSA9IHRoaXMuX2FwcGx5UGFnaW5hdGlvbigpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBhZ2VzID0gdGhpcy5wYWdlcy5zbGljZShzdGFydCwgZW5kKTtcblxuICAgICAgLy8gYWRkaW5nIGVsbGlwc2VzXG4gICAgICB0aGlzLl9hcHBseUVsbGlwc2VzKHN0YXJ0LCBlbmQpO1xuICAgIH1cbiAgfVxufVxuIl19