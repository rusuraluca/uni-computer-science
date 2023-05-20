import { Attribute, ContentChildren, Directive, EventEmitter, forwardRef, Inject, Input, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDefined } from '../util/util';
import { Key } from '../util/key';
import * as i0 from "@angular/core";
import * as i1 from "./nav-config";
const isValidNavId = (id) => isDefined(id) && id !== '';
let navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
export class NgbNavContent {
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
export class NgbNavItem {
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
export class NgbNav {
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
NgbNav.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNav, deps: [{ token: 'role', attribute: true }, { token: i1.NgbNavConfig }, { token: i0.ChangeDetectorRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive });
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
                }] }, { type: i1.NgbNavConfig }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
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
export class NgbNavLink {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL25hdi9uYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFFVCxlQUFlLEVBQ2YsU0FBUyxFQUVULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBSVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7O0FBRWhDLE1BQU0sWUFBWSxHQUFHLENBQUMsRUFBTyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUU3RCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFpQm5COzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7SUFBRyxDQUFDOzswR0FEekMsYUFBYTs4RkFBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsNEJBQTRCLEVBQUM7O0FBTW5EOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sVUFBVTtJQW1EckIsWUFBOEMsR0FBRyxFQUFTLFVBQTJCO1FBQTNCLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBMUNyRjs7OztXQUlHO1FBQ00sYUFBUSxHQUFHLEtBQUssQ0FBQztRQW1CMUI7Ozs7V0FJRztRQUNPLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTNDOzs7O1dBSUc7UUFDTyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQU8xQywyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDbEIsQ0FBQztJQUVELHFCQUFxQjtRQUNuQiw4RkFBOEY7UUFDOUYsOEVBQThFO1FBQzlFLGlFQUFpRTtRQUNqRSwyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztJQUMzQyxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxVQUFVLEVBQUUsRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELElBQUksTUFBTSxLQUFLLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFdkQsSUFBSSxFQUFFLEtBQUssT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVuRSxJQUFJLFVBQVUsS0FBSyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVsRCxZQUFZO1FBQ1YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDekcsQ0FBQzs7dUdBOUVVLFVBQVUsa0JBbURELFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7MkZBbkRqQyxVQUFVLGlTQWlESixhQUFhOzJGQWpEbkIsVUFBVTtrQkFEdEIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsRUFBQyxrQkFBa0IsRUFBRSxNQUFNLEVBQUMsRUFBQzs7MEJBb0RsRixNQUFNOzJCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7cUVBNUNuQyxhQUFhO3NCQUFyQixLQUFLO2dCQU9HLFFBQVE7c0JBQWhCLEtBQUs7Z0JBUUcsS0FBSztzQkFBYixLQUFLO2dCQVNlLEdBQUc7c0JBQXZCLEtBQUs7dUJBQUMsWUFBWTtnQkFPVCxLQUFLO3NCQUFkLE1BQU07Z0JBT0csTUFBTTtzQkFBZixNQUFNO2dCQUkrQyxXQUFXO3NCQUFoRSxlQUFlO3VCQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7O0FBaUN0RDs7OztHQUlHO0FBaUJILE1BQU0sT0FBTyxNQUFNO0lBb0ZqQixZQUM4QixJQUFZLEVBQUUsTUFBb0IsRUFBVSxHQUFzQixFQUNsRSxTQUFjO1FBRGQsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFnQyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNsRSxjQUFTLEdBQVQsU0FBUyxDQUFLO1FBMUU1Qzs7Ozs7V0FLRztRQUNPLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQTBDbkQ7Ozs7OztXQU1HO1FBQ08sVUFBSyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFFMUM7Ozs7OztXQU1HO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFLM0MsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFDL0IsbUJBQWMsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztRQVlsRDs7Ozs7O1dBTUc7UUFDTyxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFkMUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBV0QsS0FBSyxDQUFDLElBQWdCO1FBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFvQjtRQUM1QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUM5QyxPQUFPO1NBQ1I7UUFDRCxzREFBc0Q7UUFDdEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUN4QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RSxNQUFNLEVBQUMsTUFBTSxFQUFDLEdBQUcsWUFBWSxDQUFDO1FBRTlCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWxCLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtnQkFDN0QsUUFBUSxHQUFHLEtBQUssQ0FBQzthQUNsQjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxNQUFNLEVBQUU7WUFDVixRQUFRLEdBQUcsRUFBRTtnQkFDWCxLQUFLLEdBQUcsQ0FBQyxTQUFTO29CQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssVUFBVSxFQUFFO3dCQUNuQyxPQUFPO3FCQUNSO29CQUNELFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM1QyxNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDLFVBQVU7b0JBQ2pCLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7d0JBQ25DLE9BQU87cUJBQ1I7b0JBQ0QsUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztvQkFDbkMsTUFBTTtnQkFDUixLQUFLLEdBQUcsQ0FBQyxTQUFTO29CQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssWUFBWSxFQUFFO3dCQUNyQyxPQUFPO3FCQUNSO29CQUNELFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7b0JBQ25DLE1BQU07Z0JBQ1IsS0FBSyxHQUFHLENBQUMsT0FBTztvQkFDZCxJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssWUFBWSxFQUFFO3dCQUNyQyxPQUFPO3FCQUNSO29CQUNELFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO29CQUM1QyxNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDLElBQUk7b0JBQ1gsUUFBUSxHQUFHLENBQUMsQ0FBQztvQkFDYixNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDLEdBQUc7b0JBQ1YsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ3RCLE1BQU07YUFDVDtZQUNELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxrQkFBa0IsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFbkQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxFQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDN0QsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQzFCO1NBQ0Y7UUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUcsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFDLFFBQVEsRUFBZ0I7UUFDbkMsSUFBSSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDO0lBRUQsV0FBVyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRS9CLGVBQWUsQ0FBQyxNQUFXLEVBQUUsYUFBYSxHQUFHLElBQUk7UUFDdkQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBRTtZQUM1QixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztZQUU3QixJQUFJLGFBQWEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsRUFBRSxHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7YUFDNUc7WUFFRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2pDO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsVUFBZSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEcsWUFBWSxDQUFDLE1BQVc7UUFDOUIsT0FBTyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDM0UsQ0FBQzs7bUdBdE5VLE1BQU0sa0JBcUZGLE1BQU0sMkZBQ1QsUUFBUTt1RkF0RlQsTUFBTSwrMEJBOEVBLFVBQVUsMkVBQ08sVUFBVTsyRkEvRWpDLE1BQU07a0JBaEJsQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxVQUFVO29CQUNwQixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsSUFBSSxFQUFFO3dCQUNKLGFBQWEsRUFBRSxNQUFNO3dCQUNyQixxQkFBcUIsRUFBRSw0QkFBNEI7d0JBQ25ELHlCQUF5QixFQUFFLDRFQUE0RTt3QkFDdkcsYUFBYSxFQUFFLDZDQUE2Qzt3QkFDNUQscUJBQXFCLEVBQUUsbUJBQW1CO3dCQUMxQyxzQkFBc0IsRUFBRSxtQkFBbUI7d0JBQzNDLHFCQUFxQixFQUFFLG1CQUFtQjt3QkFDMUMsbUJBQW1CLEVBQUUsbUJBQW1CO3dCQUN4QyxnQkFBZ0IsRUFBRSxtQkFBbUI7d0JBQ3JDLGVBQWUsRUFBRSxtQkFBbUI7cUJBQ3JDO2lCQUNGOzswQkFzRk0sU0FBUzsyQkFBQyxNQUFNOzswQkFDaEIsTUFBTTsyQkFBQyxRQUFROzRDQTVFWCxRQUFRO3NCQUFoQixLQUFLO2dCQVFJLGNBQWM7c0JBQXZCLE1BQU07Z0JBT0UsU0FBUztzQkFBakIsS0FBSztnQkFNRyxhQUFhO3NCQUFyQixLQUFLO2dCQU9HLFdBQVc7c0JBQW5CLEtBQUs7Z0JBT0csS0FBSztzQkFBYixLQUFLO2dCQWFHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBU0ksS0FBSztzQkFBZCxNQUFNO2dCQVNHLE1BQU07c0JBQWYsTUFBTTtnQkFFc0IsS0FBSztzQkFBakMsZUFBZTt1QkFBQyxVQUFVO2dCQUN5QyxLQUFLO3NCQUF4RSxlQUFlO3VCQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBc0J4RCxTQUFTO3NCQUFsQixNQUFNOztBQXFIVDs7OztHQUlHO0FBa0JILE1BQU0sT0FBTyxVQUFVO0lBQ3JCLFlBQzhCLElBQVksRUFBUyxPQUFtQixFQUFTLEdBQVcsRUFDL0UsS0FBaUI7UUFERSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFDL0UsVUFBSyxHQUFMLEtBQUssQ0FBWTtJQUFHLENBQUM7SUFFaEMsZUFBZTtRQUNiLHdHQUF3RztRQUN4RyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQztJQUM5RSxDQUFDOzt1R0FSVSxVQUFVLGtCQUVOLE1BQU0sOEJBQXVDLFVBQVUsYUFBYyxNQUFNOzJGQUYvRSxVQUFVOzJGQUFWLFVBQVU7a0JBakJ0QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxlQUFlO29CQUN6QixJQUFJLEVBQUU7d0JBQ0osTUFBTSxFQUFFLGVBQWU7d0JBQ3ZCLGtCQUFrQixFQUFFLE1BQU07d0JBQzFCLGtCQUFrQixFQUFFLG1CQUFtQjt3QkFDdkMsYUFBYSxFQUFFLDZDQUE2Qzt3QkFDNUQsTUFBTSxFQUFFLEVBQUU7d0JBQ1YsZ0JBQWdCLEVBQUUsZ0JBQWdCO3dCQUNsQyxrQkFBa0IsRUFBRSxrQkFBa0I7d0JBQ3RDLGlCQUFpQixFQUFFLG1DQUFtQzt3QkFDdEQsc0JBQXNCLEVBQUUsb0RBQW9EO3dCQUM1RSxzQkFBc0IsRUFBRSxnQkFBZ0I7d0JBQ3hDLHNCQUFzQixFQUFFLGtCQUFrQjt3QkFDMUMsU0FBUyxFQUFFLDZDQUE2QztxQkFDekQ7aUJBQ0Y7OzBCQUdNLFNBQVM7MkJBQUMsTUFBTTs4QkFBdUMsVUFBVSxZQUFjLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtpc0RlZmluZWR9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYk5hdkNvbmZpZ30gZnJvbSAnLi9uYXYtY29uZmlnJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5cbmNvbnN0IGlzVmFsaWROYXZJZCA9IChpZDogYW55KSA9PiBpc0RlZmluZWQoaWQpICYmIGlkICE9PSAnJztcblxubGV0IG5hdkNvdW50ZXIgPSAwO1xuXG4vKipcbiAqIENvbnRleHQgcGFzc2VkIHRvIHRoZSBuYXYgY29udGVudCB0ZW1wbGF0ZS5cbiAqXG4gKiBTZWUgW3RoaXMgZGVtb10oIy9jb21wb25lbnRzL25hdi9leGFtcGxlcyNrZWVwLWNvbnRlbnQpIGFzIHRoZSBleGFtcGxlLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk5hdkNvbnRlbnRDb250ZXh0IHtcbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgY3VycmVudCBuYXYgY29udGVudCBpcyB2aXNpYmxlIGFuZCBhY3RpdmVcbiAgICovXG4gICRpbXBsaWNpdDogYm9vbGVhbjtcbn1cblxuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIG11c3QgYmUgdXNlZCB0byB3cmFwIGNvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBuYXYuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiTmF2Q29udGVudF0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZDb250ZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG5cbi8qKlxuICogVGhlIGRpcmVjdGl2ZSB1c2VkIHRvIGdyb3VwIG5hdiBsaW5rIGFuZCByZWxhdGVkIG5hdiBjb250ZW50LiBBcyB3ZWxsIGFzIHNldCBuYXYgaWRlbnRpZmllciBhbmQgc29tZSBvcHRpb25zLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JOYXZJdGVtXScsIGV4cG9ydEFzOiAnbmdiTmF2SXRlbScsIGhvc3Q6IHsnW2NsYXNzLm5hdi1pdGVtXSc6ICd0cnVlJ319KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkl0ZW0gaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkluaXQge1xuICBwcml2YXRlIF9uYXY6IE5nYk5hdjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBub24tYWN0aXZlIGN1cnJlbnQgbmF2IGl0ZW0gY29udGVudCB3aWxsIGJlIHJlbW92ZWQgZnJvbSBET01cbiAgICogT3RoZXJ3aXNlIGl0IHdpbGwganVzdCBiZSBoaWRkZW5cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGU7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgdGhlIGN1cnJlbnQgbmF2IGl0ZW0gaXMgZGlzYWJsZWQgYW5kIGNhbid0IGJlIHRvZ2dsZWQgYnkgdXNlci5cbiAgICpcbiAgICogTmV2ZXJ0aGVsZXNzIGRpc2FibGVkIG5hdiBjYW4gYmUgc2VsZWN0ZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgdGhlIGAuc2VsZWN0KClgIG1ldGhvZCBhbmQgdGhlIGBbYWN0aXZlSWRdYCBiaW5kaW5nLlxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogVGhlIGlkIHVzZWQgZm9yIHRoZSBET00gZWxlbWVudHMuXG4gICAqIE11c3QgYmUgdW5pcXVlIGluc2lkZSB0aGUgZG9jdW1lbnQgaW4gY2FzZSB5b3UgaGF2ZSBtdWx0aXBsZSBgbmdiTmF2YHMgb24gdGhlIHBhZ2UuXG4gICAqXG4gICAqIEF1dG9nZW5lcmF0ZWQgYXMgYG5nYi1uYXYtWFhYYCBpZiBub3QgcHJvdmlkZWQuXG4gICAqL1xuICBASW5wdXQoKSBkb21JZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgdXNlZCBhcyBhIG1vZGVsIGZvciBhY3RpdmUgbmF2LlxuICAgKiBJdCBjYW4gYmUgYW55dGhpbmcsIGJ1dCBtdXN0IGJlIHVuaXF1ZSBpbnNpZGUgb25lIGBuZ2JOYXZgLlxuICAgKlxuICAgKiBUaGUgb25seSBsaW1pdGF0aW9uIGlzIHRoYXQgaXQgaXMgbm90IHBvc3NpYmxlIHRvIGhhdmUgdGhlIGAnJ2AgKGVtcHR5IHN0cmluZykgYXMgaWQsXG4gICAqIGJlY2F1c2UgYCBuZ2JOYXZJdGVtIGAsIGBuZ2JOYXZJdGVtPScnYCBhbmQgYFtuZ2JOYXZJdGVtXT1cIicnXCJgIGFyZSBpbmRpc3Rpbmd1aXNoYWJsZVxuICAgKi9cbiAgQElucHV0KCduZ2JOYXZJdGVtJykgX2lkOiBhbnk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZmFkZSBpbiB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIG9uIHRoZSByZWxhdGVkIG5hdiBjb250ZW50XG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGZhZGUgb3V0IHRyYW5zaXRpb24gaXMgZmluaXNoZWQgb24gdGhlIHJlbGF0ZWQgbmF2IGNvbnRlbnRcbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIGNvbnRlbnRUcGw6IE5nYk5hdkNvbnRlbnQgfCBudWxsO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiTmF2Q29udGVudCwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGNvbnRlbnRUcGxzOiBRdWVyeUxpc3Q8TmdiTmF2Q29udGVudD47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYk5hdikpIG5hdiwgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY8YW55Pikge1xuICAgIC8vIFRPRE86IGNmIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMwMTA2XG4gICAgdGhpcy5fbmF2ID0gbmF2O1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIFdlIGFyZSB1c2luZyBAQ29udGVudENoaWxkcmVuIGluc3RlYWQgb2YgQENvbnRlbnRDaGlsZCBhcyBpbiB0aGUgQW5ndWxhciB2ZXJzaW9uIGJlaW5nIHVzZWRcbiAgICAvLyBvbmx5IEBDb250ZW50Q2hpbGRyZW4gYWxsb3dzIHVzIHRvIHNwZWNpZnkgdGhlIHtkZXNjZW5kYW50czogZmFsc2V9IG9wdGlvbi5cbiAgICAvLyBXaXRob3V0IHtkZXNjZW5kYW50czogZmFsc2V9IHdlIGFyZSBoaXR0aW5nIGJ1Z3MgZGVzY3JpYmVkIGluOlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2lzc3Vlcy8yMjQwXG4gICAgdGhpcy5jb250ZW50VHBsID0gdGhpcy5jb250ZW50VHBscy5maXJzdDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICghaXNEZWZpbmVkKHRoaXMuZG9tSWQpKSB7XG4gICAgICB0aGlzLmRvbUlkID0gYG5nYi1uYXYtJHtuYXZDb3VudGVyKyt9YDtcbiAgICB9XG4gIH1cblxuICBnZXQgYWN0aXZlKCkgeyByZXR1cm4gdGhpcy5fbmF2LmFjdGl2ZUlkID09PSB0aGlzLmlkOyB9XG5cbiAgZ2V0IGlkKCkgeyByZXR1cm4gaXNWYWxpZE5hdklkKHRoaXMuX2lkKSA/IHRoaXMuX2lkIDogdGhpcy5kb21JZDsgfVxuXG4gIGdldCBwYW5lbERvbUlkKCkgeyByZXR1cm4gYCR7dGhpcy5kb21JZH0tcGFuZWxgOyB9XG5cbiAgaXNQYW5lbEluRG9tKCkge1xuICAgIHJldHVybiAoaXNEZWZpbmVkKHRoaXMuZGVzdHJveU9uSGlkZSkgPyAhdGhpcy5kZXN0cm95T25IaWRlIDogIXRoaXMuX25hdi5kZXN0cm95T25IaWRlKSB8fCB0aGlzLmFjdGl2ZTtcbiAgfVxufVxuXG5cbi8qKlxuICogQSBuYXYgZGlyZWN0aXZlIHRoYXQgaGVscHMgd2l0aCBpbXBsZW1lbnRpbmcgdGFiYmVkIG5hdmlnYXRpb24gY29tcG9uZW50cy5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYk5hdl0nLFxuICBleHBvcnRBczogJ25nYk5hdicsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm5hdl0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5mbGV4LWNvbHVtbl0nOiBgb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCdgLFxuICAgICdbYXR0ci5hcmlhLW9yaWVudGF0aW9uXSc6IGBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyAmJiByb2xlcyA9PT0gJ3RhYmxpc3QnID8gJ3ZlcnRpY2FsJyA6IHVuZGVmaW5lZGAsXG4gICAgJ1thdHRyLnJvbGVdJzogYHJvbGUgPyByb2xlIDogcm9sZXMgPyAndGFibGlzdCcgOiB1bmRlZmluZWRgLFxuICAgICcoa2V5ZG93bi5hcnJvd0xlZnQpJzogJ29uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uYXJyb3dSaWdodCknOiAnb25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5hcnJvd0Rvd24pJzogJ29uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uYXJyb3dVcCknOiAnb25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5Ib21lKSc6ICdvbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkVuZCknOiAnb25LZXlEb3duKCRldmVudCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vcmllbnRhdGlvbjogc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcm9sZXM6IGJvb2xlYW4gfCBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgbmF2IHRoYXQgc2hvdWxkIGJlIGFjdGl2ZVxuICAgKlxuICAgKiBZb3UgY291bGQgYWxzbyB1c2UgdGhlIGAuc2VsZWN0KClgIG1ldGhvZCBhbmQgdGhlIGAobmF2Q2hhbmdlKWAgZXZlbnRcbiAgICovXG4gIEBJbnB1dCgpIGFjdGl2ZUlkOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBldmVudCBlbWl0dGVkIGFmdGVyIHRoZSBhY3RpdmUgbmF2IGNoYW5nZXNcbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIHRoZSBuZXdseSBhY3RpdmUgbmF2IGlkXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIHByZXZlbnQgbmF2IGNoYW5nZSwgeW91IHNob3VsZCB1c2UgYChuYXZDaGFuZ2UpYCBldmVudFxuICAgKi9cbiAgQE91dHB1dCgpIGFjdGl2ZUlkQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbmF2IGNoYW5nZSB3aWxsIGJlIGFuaW1hdGVkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogSWYgYHRydWVgLCBub24tYWN0aXZlIG5hdiBjb250ZW50IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIERPTVxuICAgKiBPdGhlcndpc2UgaXQgd2lsbCBqdXN0IGJlIGhpZGRlblxuICAgKi9cbiAgQElucHV0KCkgZGVzdHJveU9uSGlkZTtcblxuICAvKipcbiAgICogVGhlIG9yaWVudGF0aW9uIG9mIG5hdnMuXG4gICAqXG4gICAqIFVzaW5nIGB2ZXJ0aWNhbGAgd2lsbCBhbHNvIGFkZCB0aGUgYGFyaWEtb3JpZW50YXRpb25gIGF0dHJpYnV0ZVxuICAgKi9cbiAgQElucHV0KCkgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCc7XG5cbiAgLyoqXG4gICAqIFJvbGUgYXR0cmlidXRlIGdlbmVyYXRpbmcgc3RyYXRlZ3k6XG4gICAqIC0gYGZhbHNlYCAtIG5vIHJvbGUgYXR0cmlidXRlcyB3aWxsIGJlIGdlbmVyYXRlZFxuICAgKiAtIGAndGFibGlzdCdgIC0gJ3RhYmxpc3QnLCAndGFiJyBhbmQgJ3RhYnBhbmVsJyB3aWxsIGJlIGdlbmVyYXRlZCAoZGVmYXVsdClcbiAgICovXG4gIEBJbnB1dCgpIHJvbGVzOiAndGFibGlzdCcgfCBmYWxzZTtcblxuICAvKipcbiAgICogS2V5Ym9hcmQgc3VwcG9ydCBmb3IgbmF2IGZvY3VzL3NlbGVjdGlvbiB1c2luZyBhcnJvdyBrZXlzLlxuICAgKlxuICAgKiAqIGBmYWxzZWAgLSBubyBrZXlib2FyZCBzdXBwb3J0LlxuICAgKiAqIGB0cnVlYCAtIG5hdnMgd2lsbCBiZSBmb2N1c2VkIHVzaW5nIGtleWJvYXJkIGFycm93IGtleXNcbiAgICogKiBgJ2NoYW5nZVdpdGhBcnJvd3MnYCAtICBuYXYgd2lsbCBiZSBzZWxlY3RlZCB1c2luZyBrZXlib2FyZCBhcnJvdyBrZXlzXG4gICAqXG4gICAqIFNlZSB0aGUgW2xpc3Qgb2YgYXZhaWxhYmxlIGtleWJvYXJkIHNob3J0Y3V0c10oIy9jb21wb25lbnRzL25hdi9vdmVydmlldyNrZXlib2FyZC1zaG9ydGN1dHMpLlxuICAgKlxuICAgKiBAc2luY2UgNi4xLjBcbiAqL1xuICBASW5wdXQoKSBrZXlib2FyZDogYm9vbGVhbiB8ICdjaGFuZ2VXaXRoQXJyb3dzJztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBmYWRlIGluIHRyYW5zaXRpb24gaXMgZmluaXNoZWQgZm9yIG9uZSBvZiB0aGUgaXRlbXMuXG4gICAqXG4gICAqIFBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIHRoZSBuYXYgaWQgdGhhdCB3YXMganVzdCBzaG93bi5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBmYWRlIG91dCB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIGZvciBvbmUgb2YgdGhlIGl0ZW1zLlxuICAgKlxuICAgKiBQYXlsb2FkIG9mIHRoZSBldmVudCBpcyB0aGUgbmF2IGlkIHRoYXQgd2FzIGp1c3QgaGlkZGVuLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYk5hdkl0ZW0pIGl0ZW1zOiBRdWVyeUxpc3Q8TmdiTmF2SXRlbT47XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBOZ2JOYXZMaW5rKSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgbGlua3M6IFF1ZXJ5TGlzdDxOZ2JOYXZMaW5rPjtcblxuICBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIG5hdkl0ZW1DaGFuZ2UkID0gbmV3IFN1YmplY3Q8TmdiTmF2SXRlbSB8IG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAQXR0cmlidXRlKCdyb2xlJykgcHVibGljIHJvbGU6IHN0cmluZywgY29uZmlnOiBOZ2JOYXZDb25maWcsIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLmFuaW1hdGlvbiA9IGNvbmZpZy5hbmltYXRpb247XG4gICAgdGhpcy5kZXN0cm95T25IaWRlID0gY29uZmlnLmRlc3Ryb3lPbkhpZGU7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IGNvbmZpZy5vcmllbnRhdGlvbjtcbiAgICB0aGlzLnJvbGVzID0gY29uZmlnLnJvbGVzO1xuICAgIHRoaXMua2V5Ym9hcmQgPSBjb25maWcua2V5Ym9hcmQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG5hdiBjaGFuZ2UgZXZlbnQgZW1pdHRlZCByaWdodCBiZWZvcmUgdGhlIG5hdiBjaGFuZ2UgaGFwcGVucyBvbiB1c2VyIGNsaWNrLlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IHdvbid0IGJlIGVtaXR0ZWQgaWYgbmF2IGlzIGNoYW5nZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgYFthY3RpdmVJZF1gIG9yIGAuc2VsZWN0KClgLlxuICAgKlxuICAgKiBTZWUgW2BOZ2JOYXZDaGFuZ2VFdmVudGBdKCMvY29tcG9uZW50cy9uYXYvYXBpI05nYk5hdkNoYW5nZUV2ZW50KSBmb3IgcGF5bG9hZCBkZXRhaWxzLlxuICAgKi9cbiAgQE91dHB1dCgpIG5hdkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiTmF2Q2hhbmdlRXZlbnQ+KCk7XG5cbiAgY2xpY2soaXRlbTogTmdiTmF2SXRlbSkge1xuICAgIGlmICghaXRlbS5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlSWQoaXRlbS5pZCk7XG4gICAgfVxuICB9XG5cbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMucm9sZXMgIT09ICd0YWJsaXN0JyB8fCAhdGhpcy5rZXlib2FyZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVwcmVjYXRpb24vZGVwcmVjYXRpb24gKi9cbiAgICBjb25zdCBrZXkgPSBldmVudC53aGljaDtcbiAgICBjb25zdCBlbmFibGVkTGlua3MgPSB0aGlzLmxpbmtzLmZpbHRlcihsaW5rID0+ICFsaW5rLm5hdkl0ZW0uZGlzYWJsZWQpO1xuICAgIGNvbnN0IHtsZW5ndGh9ID0gZW5hYmxlZExpbmtzO1xuXG4gICAgbGV0IHBvc2l0aW9uID0gLTE7XG5cbiAgICBlbmFibGVkTGlua3MuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChsaW5rLmVsUmVmLm5hdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpbmRleDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgS2V5LkFycm93TGVmdDpcbiAgICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb3NpdGlvbiA9IChwb3NpdGlvbiAtIDEgKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd1JpZ2h0OlxuICAgICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvc2l0aW9uID0gKHBvc2l0aW9uICsgMSkgJSBsZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvc2l0aW9uID0gKHBvc2l0aW9uICsgMSkgJSBsZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93VXA6XG4gICAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb3NpdGlvbiA9IChwb3NpdGlvbiAtIDEgKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuRW5kOlxuICAgICAgICAgIHBvc2l0aW9uID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmtleWJvYXJkID09PSAnY2hhbmdlV2l0aEFycm93cycpIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoZW5hYmxlZExpbmtzW3Bvc2l0aW9uXS5uYXZJdGVtLmlkKTtcbiAgICAgIH1cbiAgICAgIGVuYWJsZWRMaW5rc1twb3NpdGlvbl0uZWxSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBuYXYgd2l0aCB0aGUgZ2l2ZW4gaWQgYW5kIHNob3dzIGl0cyBhc3NvY2lhdGVkIHBhbmUuXG4gICAqIEFueSBvdGhlciBuYXYgdGhhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCBiZWNvbWVzIHVuc2VsZWN0ZWQgYW5kIGl0cyBhc3NvY2lhdGVkIHBhbmUgaXMgaGlkZGVuLlxuICAgKi9cbiAgc2VsZWN0KGlkOiBhbnkpIHsgdGhpcy5fdXBkYXRlQWN0aXZlSWQoaWQsIGZhbHNlKTsgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIWlzRGVmaW5lZCh0aGlzLmFjdGl2ZUlkKSkge1xuICAgICAgY29uc3QgbmV4dElkID0gdGhpcy5pdGVtcy5maXJzdCA/IHRoaXMuaXRlbXMuZmlyc3QuaWQgOiBudWxsO1xuICAgICAgaWYgKGlzVmFsaWROYXZJZChuZXh0SWQpKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkKG5leHRJZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtcy5jaGFuZ2VzLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbm90aWZ5SXRlbUNoYW5nZWQodGhpcy5hY3RpdmVJZCkpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoe2FjdGl2ZUlkfTogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChhY3RpdmVJZCAmJiAhYWN0aXZlSWQuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX25vdGlmeUl0ZW1DaGFuZ2VkKGFjdGl2ZUlkLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuZGVzdHJveSQubmV4dCgpOyB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWQobmV4dElkOiBhbnksIGVtaXROYXZDaGFuZ2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSWQgIT09IG5leHRJZCkge1xuICAgICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGVtaXROYXZDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5uYXZDaGFuZ2UuZW1pdCh7YWN0aXZlSWQ6IHRoaXMuYWN0aXZlSWQsIG5leHRJZCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSWQgPSBuZXh0SWQ7XG4gICAgICAgIHRoaXMuYWN0aXZlSWRDaGFuZ2UuZW1pdChuZXh0SWQpO1xuICAgICAgICB0aGlzLl9ub3RpZnlJdGVtQ2hhbmdlZChuZXh0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX25vdGlmeUl0ZW1DaGFuZ2VkKG5leHRJdGVtSWQ6IGFueSkgeyB0aGlzLm5hdkl0ZW1DaGFuZ2UkLm5leHQodGhpcy5fZ2V0SXRlbUJ5SWQobmV4dEl0ZW1JZCkpOyB9XG5cbiAgcHJpdmF0ZSBfZ2V0SXRlbUJ5SWQoaXRlbUlkOiBhbnkpOiBOZ2JOYXZJdGVtIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gaXRlbUlkKSB8fCBudWxsO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwdXQgb24gdGhlIG5hdiBsaW5rLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdhW25nYk5hdkxpbmtdJyxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ25hdkl0ZW0uZG9tSWQnLFxuICAgICdbY2xhc3MubmF2LWxpbmtdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubmF2LWl0ZW1dJzogJ2hhc05hdkl0ZW1DbGFzcygpJyxcbiAgICAnW2F0dHIucm9sZV0nOiBgcm9sZSA/IHJvbGUgOiBuYXYucm9sZXMgPyAndGFiJyA6IHVuZGVmaW5lZGAsXG4gICAgJ2hyZWYnOiAnJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnbmF2SXRlbS5hY3RpdmUnLFxuICAgICdbY2xhc3MuZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbmF2SXRlbS5kaXNhYmxlZCA/IC0xIDogdW5kZWZpbmVkJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnbmF2SXRlbS5pc1BhbmVsSW5Eb20oKSA/IG5hdkl0ZW0ucGFuZWxEb21JZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICduYXZJdGVtLmFjdGl2ZScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICcoY2xpY2spJzogJ25hdi5jbGljayhuYXZJdGVtKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2TGluayB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEF0dHJpYnV0ZSgncm9sZScpIHB1YmxpYyByb2xlOiBzdHJpbmcsIHB1YmxpYyBuYXZJdGVtOiBOZ2JOYXZJdGVtLCBwdWJsaWMgbmF2OiBOZ2JOYXYsXG4gICAgICBwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgaGFzTmF2SXRlbUNsYXNzKCkge1xuICAgIC8vIHdpdGggYWx0ZXJuYXRpdmUgbWFya3VwIHdlIGhhdmUgdG8gYWRkIGAubmF2LWl0ZW1gIGNsYXNzLCBiZWNhdXNlIGBuZ2JOYXZJdGVtYCBpcyBvbiB0aGUgbmctY29udGFpbmVyXG4gICAgcmV0dXJuIHRoaXMubmF2SXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFO1xuICB9XG59XG5cblxuLyoqXG4gKiBUaGUgcGF5bG9hZCBvZiB0aGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBuYXYgY2hhbmdlIGhhcHBlbnMgb24gdXNlciBjbGljay5cbiAqXG4gKiBUaGlzIGV2ZW50IHdvbid0IGJlIGVtaXR0ZWQgaWYgbmF2IGlzIGNoYW5nZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgYFthY3RpdmVJZF1gIG9yIGAuc2VsZWN0KClgLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk5hdkNoYW5nZUV2ZW50PFQgPSBhbnk+IHtcbiAgLyoqXG4gICAqIElkIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIG5hdi5cbiAgICovXG4gIGFjdGl2ZUlkOiBUO1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgbmV3bHkgc2VsZWN0ZWQgbmF2LlxuICAgKi9cbiAgbmV4dElkOiBUO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgcHJldmVudCBuYXYgY2hhbmdlIGlmIGNhbGxlZC5cbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuIl19