import { ContentChild, ContentChildren, Directive, EventEmitter, forwardRef, Inject, Input, Output, Optional } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ngbPositioning } from '../util/positioning';
import { addPopperOffset } from '../util/positioning-util';
import { ngbAutoClose } from '../util/autoclose';
import { Key } from '../util/key';
import { FOCUSABLE_ELEMENTS_SELECTOR } from '../util/focus-trap';
import * as i0 from "@angular/core";
import * as i1 from "./dropdown-config";
export class NgbNavbar {
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
export class NgbDropdownItem {
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
export class NgbDropdownMenu {
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
export class NgbDropdownAnchor {
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
export class NgbDropdownToggle extends NgbDropdownAnchor {
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
export class NgbDropdown {
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
NgbDropdown.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdown, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.NgbDropdownConfig }, { token: DOCUMENT }, { token: i0.NgZone }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: NgbNavbar, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgbDropdown.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbDropdown, selector: "[ngbDropdown]", inputs: { autoClose: "autoClose", dropdownClass: "dropdownClass", _open: ["open", "_open"], placement: "placement", container: "container", display: "display" }, outputs: { openChange: "openChange" }, host: { properties: { "class.show": "isOpen()" } }, queries: [{ propertyName: "_menu", first: true, predicate: NgbDropdownMenu, descendants: true }, { propertyName: "_anchor", first: true, predicate: NgbDropdownAnchor, descendants: true }], exportAs: ["ngbDropdown"], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDropdown, decorators: [{
            type: Directive,
            args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.NgbDropdownConfig }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZHJvcGRvd24vZHJvcGRvd24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFlBQVksRUFDWixlQUFlLEVBQ2YsU0FBUyxFQUVULFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBSU4sUUFBUSxFQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBZSxNQUFNLE1BQU0sQ0FBQztBQUN0RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEMsT0FBTyxFQUE0QixjQUFjLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxFQUFDLFlBQVksRUFBUyxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHaEMsT0FBTyxFQUFDLDJCQUEyQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7OztBQUcvRCxNQUFNLE9BQU8sU0FBUzs7c0dBQVQsU0FBUzswRkFBVCxTQUFTOzJGQUFULFNBQVM7a0JBRHJCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDOztBQUloQzs7Ozs7R0FLRztBQUtILE1BQU0sT0FBTyxlQUFlO0lBZ0IxQixZQUFtQixVQUFtQyxFQUFVLFNBQW9CO1FBQWpFLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQWI1RSxjQUFTLEdBQUcsS0FBSyxDQUFDO0lBYTZELENBQUM7SUFYeEYsSUFDSSxRQUFRLENBQUMsS0FBYztRQUN6QixJQUFJLENBQUMsU0FBUyxH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QVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDakQ7U0FDRjtJQUNILENBQUM7O3dHQXZaVSxXQUFXLG9GQTJFNkQsUUFBUSxzRkFFaEUsU0FBUzs0RkE3RXpCLFdBQVcscVZBUVIsZUFBZSwwRUFDZixpQkFBaUI7MkZBVHBCLFdBQVc7a0JBRHZCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLEVBQUMsY0FBYyxFQUFFLFVBQVUsRUFBQyxFQUFDOzswQkE0RXJCLE1BQU07MkJBQUMsUUFBUTtvR0FFaEUsU0FBUzswQkFBL0IsUUFBUTs0Q0FyRTJDLEtBQUs7c0JBQTVELFlBQVk7dUJBQUMsZUFBZSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztnQkFDWSxPQUFPO3NCQUFoRSxZQUFZO3VCQUFDLGlCQUFpQixFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQztnQkFVdkMsU0FBUztzQkFBakIsS0FBSztnQkFZRyxhQUFhO3NCQUFyQixLQUFLO2dCQUtTLEtBQUs7c0JBQW5CLEtBQUs7dUJBQUMsTUFBTTtnQkFTSixTQUFTO3NCQUFqQixLQUFLO2dCQVFHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBVUcsT0FBTztzQkFBZixLQUFLO2dCQVNJLFVBQVU7c0JBQW5CLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29udGVudENoaWxkLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgT3B0aW9uYWwsXG4gIE9uQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge2Zyb21FdmVudCwgU3ViamVjdCwgU3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge1BsYWNlbWVudCwgUGxhY2VtZW50QXJyYXksIG5nYlBvc2l0aW9uaW5nfSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7YWRkUG9wcGVyT2Zmc2V0fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nLXV0aWwnO1xuaW1wb3J0IHtuZ2JBdXRvQ2xvc2UsIFNPVVJDRX0gZnJvbSAnLi4vdXRpbC9hdXRvY2xvc2UnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcblxuaW1wb3J0IHtOZ2JEcm9wZG93bkNvbmZpZ30gZnJvbSAnLi9kcm9wZG93bi1jb25maWcnO1xuaW1wb3J0IHtGT0NVU0FCTEVfRUxFTUVOVFNfU0VMRUNUT1J9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnLm5hdmJhcid9KVxuZXhwb3J0IGNsYXNzIE5nYk5hdmJhciB7XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgeW91IHNob3VsZCBwdXQgb24gYSBkcm9wZG93biBpdGVtIHRvIGVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uLlxuICogQXJyb3cga2V5cyB3aWxsIG1vdmUgZm9jdXMgYmV0d2VlbiBpdGVtcyBtYXJrZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAqXG4gKiBAc2luY2UgNC4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duSXRlbV0nLFxuICBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLWl0ZW0nLCAnW2NsYXNzLmRpc2FibGVkXSc6ICdkaXNhYmxlZCcsICdbdGFiSW5kZXhdJzogJ2Rpc2FibGVkID8gLTEgOiAwJ31cbn0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25JdGVtIHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBib29sZWFuIHwgJyc7XG5cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBASW5wdXQoKVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IDxhbnk+dmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSB0cnVlOyAgLy8gYWNjZXB0IGFuIGVtcHR5IGF0dHJpYnV0ZSBhcyB0cnVlXG4gICAgLy8gbm90ZTogd2UgZG9uJ3QgdXNlIGEgaG9zdCBiaW5kaW5nIGZvciBkaXNhYmxlZCBiZWNhdXNlIHdoZW4gdXNlZCBvbiBsaW5rcywgaXQgZmFpbHMgYmVjYXVzZSBsaW5rcyBkb24ndCBoYXZlIGFcbiAgICAvLyBkaXNhYmxlZCBwcm9wZXJ0eVxuICAgIC8vIHNldHRpbmcgdGhlIHByb3BlcnR5IHVzaW5nIHRoZSByZW5kZXJlciwgT1RPSCwgd29ya3MgZmluZSBpbiBib3RoIGNhc2VzLlxuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCB0aGlzLl9kaXNhYmxlZCk7XG4gIH1cblxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9kaXNhYmxlZDsgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge31cbn1cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IHdyYXBzIGRyb3Bkb3duIG1lbnUgY29udGVudCBhbmQgZHJvcGRvd24gaXRlbXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bk1lbnVdJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuZHJvcGRvd24tbWVudV0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5zaG93XSc6ICdkcm9wZG93bi5pc09wZW4oKScsXG4gICAgJyhrZXlkb3duLkFycm93VXApJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uQXJyb3dEb3duKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkhvbWUpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uRW5kKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLkVudGVyKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLlNwYWNlKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLlRhYiknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5TaGlmdC5UYWIpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duTWVudSB7XG4gIG5hdGl2ZUVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudCB8IG51bGwgPSAnYm90dG9tJztcbiAgaXNPcGVuID0gZmFsc2U7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JEcm9wZG93bkl0ZW0pIG1lbnVJdGVtczogUXVlcnlMaXN0PE5nYkRyb3Bkb3duSXRlbT47XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duLCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRvIHdoaWNoIGRyb3Bkb3duIG1lbnUgd2lsbCBiZSBhbmNob3JlZC5cbiAqXG4gKiBUaGlzIGlzIGEgc2ltcGxlIHZlcnNpb24gb2YgdGhlIGBOZ2JEcm9wZG93blRvZ2dsZWAgZGlyZWN0aXZlLlxuICogSXQgcGxheXMgdGhlIHNhbWUgcm9sZSwgYnV0IGRvZXNuJ3QgbGlzdGVuIHRvIGNsaWNrIGV2ZW50cyB0byB0b2dnbGUgZHJvcGRvd24gbWVudSB0aHVzIGVuYWJsaW5nIHN1cHBvcnRcbiAqIGZvciBldmVudHMgb3RoZXIgdGhhbiBjbGljay5cbiAqXG4gKiBAc2luY2UgMS4xLjBcbiAqL1xuQERpcmVjdGl2ZShcbiAgICB7c2VsZWN0b3I6ICdbbmdiRHJvcGRvd25BbmNob3JdJywgaG9zdDogeydjbGFzcyc6ICdkcm9wZG93bi10b2dnbGUnLCAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknfX0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25BbmNob3Ige1xuICBuYXRpdmVFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duLCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICB0aGlzLm5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdG8gbWFyayBhbiBlbGVtZW50IHRoYXQgd2lsbCB0b2dnbGUgZHJvcGRvd24gdmlhIHRoZSBgY2xpY2tgIGV2ZW50LlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgYE5nYkRyb3Bkb3duQW5jaG9yYCBhcyBhbiBhbHRlcm5hdGl2ZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duVG9nZ2xlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnZHJvcGRvd24tdG9nZ2xlJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAnZHJvcGRvd24uaXNPcGVuKCknLFxuICAgICcoY2xpY2spJzogJ2Ryb3Bkb3duLnRvZ2dsZSgpJyxcbiAgICAnKGtleWRvd24uQXJyb3dVcCknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5BcnJvd0Rvd24pJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uSG9tZSknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5FbmQpJzogJ2Ryb3Bkb3duLm9uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uVGFiKSc6ICdkcm9wZG93bi5vbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLlNoaWZ0LlRhYiknOiAnZHJvcGRvd24ub25LZXlEb3duKCRldmVudCknXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBOZ2JEcm9wZG93bkFuY2hvciwgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd25Ub2dnbGUpfV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25Ub2dnbGUgZXh0ZW5kcyBOZ2JEcm9wZG93bkFuY2hvciB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JEcm9wZG93bikpIGRyb3Bkb3duLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHN1cGVyKGRyb3Bkb3duLCBlbGVtZW50UmVmKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgcHJvdmlkZXMgY29udGV4dHVhbCBvdmVybGF5cyBmb3IgZGlzcGxheWluZyBsaXN0cyBvZiBsaW5rcyBhbmQgbW9yZS5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiRHJvcGRvd25dJywgZXhwb3J0QXM6ICduZ2JEcm9wZG93bicsIGhvc3Q6IHsnW2NsYXNzLnNob3ddJzogJ2lzT3BlbigpJ319KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfYXV0b0Nsb3NlOiBib29sZWFuIHwgc3RyaW5nO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzcGxheTogc3RyaW5nO1xuICBwcml2YXRlIF9kZXN0cm95Q2xvc2VIYW5kbGVycyQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2JvZHlDb250YWluZXI6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3Bvc2l0aW9uaW5nID0gbmdiUG9zaXRpb25pbmcoKTtcblxuICBAQ29udGVudENoaWxkKE5nYkRyb3Bkb3duTWVudSwge3N0YXRpYzogZmFsc2V9KSBwcml2YXRlIF9tZW51OiBOZ2JEcm9wZG93bk1lbnU7XG4gIEBDb250ZW50Q2hpbGQoTmdiRHJvcGRvd25BbmNob3IsIHtzdGF0aWM6IGZhbHNlfSkgcHJpdmF0ZSBfYW5jaG9yOiBOZ2JEcm9wZG93bkFuY2hvcjtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGRyb3Bkb3duIHNob3VsZCBiZSBjbG9zZWQgd2hlbiBjbGlja2luZyBvbmUgb2YgZHJvcGRvd24gaXRlbXMgb3IgcHJlc3NpbmcgRVNDLlxuICAgKlxuICAgKiAqIGB0cnVlYCAtIHRoZSBkcm9wZG93biB3aWxsIGNsb3NlIG9uIGJvdGggb3V0c2lkZSBhbmQgaW5zaWRlIChtZW51KSBjbGlja3MuXG4gICAqICogYGZhbHNlYCAtIHRoZSBkcm9wZG93biBjYW4gb25seSBiZSBjbG9zZWQgbWFudWFsbHkgdmlhIGBjbG9zZSgpYCBvciBgdG9nZ2xlKClgIG1ldGhvZHMuXG4gICAqICogYFwiaW5zaWRlXCJgIC0gdGhlIGRyb3Bkb3duIHdpbGwgY2xvc2Ugb24gaW5zaWRlIG1lbnUgY2xpY2tzLCBidXQgbm90IG91dHNpZGUgY2xpY2tzLlxuICAgKiAqIGBcIm91dHNpZGVcImAgLSB0aGUgZHJvcGRvd24gd2lsbCBjbG9zZSBvbmx5IG9uIHRoZSBvdXRzaWRlIGNsaWNrcyBhbmQgbm90IG9uIG1lbnUgY2xpY2tzLlxuICAgKi9cbiAgQElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ291dHNpZGUnIHwgJ2luc2lkZSc7XG5cbiAgLyoqXG4gICAqIEEgY3VzdG9tIGNsYXNzIHRoYXQgaXMgYXBwbGllZCBvbmx5IHRvIHRoZSBgbmdiRHJvcGRvd25NZW51YCBwYXJlbnQgZWxlbWVudC5cbiAgICogKiBJbiBjYXNlIG9mIHRoZSBpbmxpbmUgZHJvcGRvd24gaXQgd2lsbCBiZSB0aGUgYDxkaXYgbmdiRHJvcGRvd24+YFxuICAgKiAqIEluIGNhc2Ugb2YgdGhlIGRyb3Bkb3duIHdpdGggIGBjb250YWluZXI9XCJib2R5XCJgIGl0IHdpbGwgYmUgdGhlIGA8ZGl2IGNsYXNzPVwiZHJvcGRvd25cIj5gIGF0dGFjaGVkIHRvIHRoZSBgPGJvZHk+YFxuICAgKlxuICAgKiBVc2VmdWwgbWFpbmx5IHdoZW4gZHJvcGRvd24gaXMgYXR0YWNoZWQgdG8gdGhlIGJvZHkuXG4gICAqIElmIHRoZSBkcm9wZG93biBpcyBpbmxpbmUganVzdCB1c2UgYDxkaXYgbmdiRHJvcGRvd24gY2xhc3M9XCJjdXN0b20tY2xhc3NcIj5gIGluc3RlYWQuXG4gICAqXG4gICAqIEBzaW5jZSA5LjEuMFxuICAgKi9cbiAgQElucHV0KCkgZHJvcGRvd25DbGFzczogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBkcm9wZG93biBtZW51IGlzIG9wZW5lZCBpbml0aWFsbHkuXG4gICAqL1xuICBASW5wdXQoJ29wZW4nKSBfb3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJlZmVycmVkIHBsYWNlbWVudCBvZiB0aGUgZHJvcGRvd24sIGFtb25nIHRoZSBbcG9zc2libGUgdmFsdWVzXSgjL2d1aWRlcy9wb3NpdGlvbmluZyNhcGkpLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBvcmRlciBvZiBwcmVmZXJlbmNlIGlzIGBcImJvdHRvbS1zdGFydCBib3R0b20tZW5kIHRvcC1zdGFydCB0b3AtZW5kXCJgXG4gICAqXG4gICAqIFBsZWFzZSBzZWUgdGhlIFtwb3NpdGlvbmluZyBvdmVydmlld10oIy9wb3NpdGlvbmluZykgZm9yIG1vcmUgZGV0YWlscy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgLyoqXG4gICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBkcm9wZG93biBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICpcbiAgKiBAc2luY2UgNC4xLjBcbiAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBudWxsIHwgJ2JvZHknO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgb3IgZGlzYWJsZSB0aGUgZHluYW1pYyBwb3NpdGlvbmluZy4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgZHluYW1pYyB1bmxlc3MgdGhlIGRyb3Bkb3duIGlzIHVzZWRcbiAgICogaW5zaWRlIGEgQm9vdHN0cmFwIG5hdmJhci4gSWYgeW91IG5lZWQgY3VzdG9tIHBsYWNlbWVudCBmb3IgYSBkcm9wZG93biBpbiBhIG5hdmJhciwgc2V0IGl0IHRvXG4gICAqIGR5bmFtaWMgZXhwbGljaXRseS4gU2VlIHRoZSBbcG9zaXRpb25pbmcgb2YgZHJvcGRvd25dKCMvcG9zaXRpb25pbmcjZHJvcGRvd24pXG4gICAqIGFuZCB0aGUgW25hdmJhciBkZW1vXSgvIy9jb21wb25lbnRzL2Ryb3Bkb3duL2V4YW1wbGVzI25hdmJhcikgZm9yIG1vcmUgZGV0YWlscy5cbiAgICpcbiAgICogQHNpbmNlIDQuMi4wXG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5OiAnZHluYW1pYycgfCAnc3RhdGljJztcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgZHJvcGRvd24gaXMgb3BlbmVkIG9yIGNsb3NlZC5cbiAgICpcbiAgICogVGhlIGV2ZW50IHBheWxvYWQgaXMgYSBgYm9vbGVhbmA6XG4gICAqICogYHRydWVgIC0gdGhlIGRyb3Bkb3duIHdhcyBvcGVuZWRcbiAgICogKiBgZmFsc2VgIC0gdGhlIGRyb3Bkb3duIHdhcyBjbG9zZWRcbiAgICovXG4gIEBPdXRwdXQoKSBvcGVuQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3I6IENoYW5nZURldGVjdG9yUmVmLCBjb25maWc6IE5nYkRyb3Bkb3duQ29uZmlnLCBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudDogYW55LFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgQE9wdGlvbmFsKCkgbmdiTmF2YmFyOiBOZ2JOYXZiYXIpIHtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb25maWcuY29udGFpbmVyO1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcblxuICAgIHRoaXMuZGlzcGxheSA9IG5nYk5hdmJhciA/ICdzdGF0aWMnIDogJ2R5bmFtaWMnO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fcG9zaXRpb25NZW51KCk7IH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLl9hcHBseVBsYWNlbWVudENsYXNzZXMoKTtcbiAgICAgIGlmICh0aGlzLl9vcGVuKSB7XG4gICAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcy5jb250YWluZXIgJiYgdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fYXBwbHlDb250YWluZXIodGhpcy5jb250YWluZXIpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLnBsYWNlbWVudCAmJiAhY2hhbmdlcy5wbGFjZW1lbnQuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nLnNldE9wdGlvbnMoe1xuICAgICAgICBob3N0RWxlbWVudDogdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgIHRhcmdldEVsZW1lbnQ6IHRoaXMuX2JvZHlDb250YWluZXIgfHwgdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LFxuICAgICAgICBwbGFjZW1lbnQ6IHRoaXMucGxhY2VtZW50LFxuICAgICAgICBhcHBlbmRUb0JvZHk6IHRoaXMuY29udGFpbmVyID09PSAnYm9keScsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmRyb3Bkb3duQ2xhc3MpIHtcbiAgICAgIGNvbnN0IHtjdXJyZW50VmFsdWUsIHByZXZpb3VzVmFsdWV9ID0gY2hhbmdlcy5kcm9wZG93bkNsYXNzO1xuICAgICAgdGhpcy5fYXBwbHlDdXN0b21Ecm9wZG93bkNsYXNzKGN1cnJlbnRWYWx1ZSwgcHJldmlvdXNWYWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuYXV0b0Nsb3NlICYmIHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuYXV0b0Nsb3NlID0gY2hhbmdlcy5hdXRvQ2xvc2UuY3VycmVudFZhbHVlO1xuICAgICAgdGhpcy5fc2V0Q2xvc2VIYW5kbGVycygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGRyb3Bkb3duIG1lbnUgaXMgb3Blbi5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW47IH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUuXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9hcHBseUNvbnRhaW5lcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgIHRoaXMuX3NldENsb3NlSGFuZGxlcnMoKTtcbiAgICAgIGlmICh0aGlzLl9hbmNob3IpIHtcbiAgICAgICAgdGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheSA9PT0gJ2R5bmFtaWMnKSB7XG4gICAgICAgICAgdGhpcy5fbmdab25lLm9uU3RhYmxlLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Bvc2l0aW9uaW5nLmNyZWF0ZVBvcHBlcih7XG4gICAgICAgICAgICAgIGhvc3RFbGVtZW50OiB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgdGFyZ2V0RWxlbWVudDogdGhpcy5fYm9keUNvbnRhaW5lciB8fCB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAgIHBsYWNlbWVudDogdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICAgIGFwcGVuZFRvQm9keTogdGhpcy5jb250YWluZXIgPT09ICdib2R5JyxcbiAgICAgICAgICAgICAgdXBkYXRlUG9wcGVyT3B0aW9uczogYWRkUG9wcGVyT2Zmc2V0KFswLCAyXSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0Q2xvc2VIYW5kbGVycygpIHtcbiAgICB0aGlzLl9kZXN0cm95Q2xvc2VIYW5kbGVycyQubmV4dCgpOyAgLy8gZGVzdHJveSBhbnkgZXhpc3RpbmcgY2xvc2UgaGFuZGxlcnNcblxuICAgIG5nYkF1dG9DbG9zZShcbiAgICAgICAgdGhpcy5fbmdab25lLCB0aGlzLl9kb2N1bWVudCwgdGhpcy5hdXRvQ2xvc2UsXG4gICAgICAgIChzb3VyY2U6IFNPVVJDRSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICBpZiAoc291cmNlID09PSBTT1VSQ0UuRVNDQVBFKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgdGhpcy5fZGVzdHJveUNsb3NlSGFuZGxlcnMkLCB0aGlzLl9tZW51ID8gW3RoaXMuX21lbnUubmF0aXZlRWxlbWVudF0gOiBbXSxcbiAgICAgICAgdGhpcy5fYW5jaG9yID8gW3RoaXMuX2FuY2hvci5uYXRpdmVFbGVtZW50XSA6IFtdLCAnLmRyb3Bkb3duLWl0ZW0sLmRyb3Bkb3duLWRpdmlkZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgdGhlIGRyb3Bkb3duIG1lbnUuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgICAgdGhpcy5fcG9zaXRpb25pbmcuZGVzdHJveSgpO1xuICAgICAgdGhpcy5fcmVzZXRDb250YWluZXIoKTtcbiAgICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG4gICAgICB0aGlzLm9wZW5DaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVG9nZ2xlcyB0aGUgZHJvcGRvd24gbWVudS5cbiAgICovXG4gIHRvZ2dsZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuICAgIHRoaXMuX2Rlc3Ryb3lDbG9zZUhhbmRsZXJzJC5uZXh0KCk7XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uICovXG4gICAgY29uc3Qga2V5ID0gZXZlbnQud2hpY2g7XG4gICAgY29uc3QgaXRlbUVsZW1lbnRzID0gdGhpcy5fZ2V0TWVudUVsZW1lbnRzKCk7XG5cbiAgICBsZXQgcG9zaXRpb24gPSAtMTtcbiAgICBsZXQgaXRlbUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgY29uc3QgaXNFdmVudEZyb21Ub2dnbGUgPSB0aGlzLl9pc0V2ZW50RnJvbVRvZ2dsZShldmVudCk7XG5cbiAgICBpZiAoIWlzRXZlbnRGcm9tVG9nZ2xlICYmIGl0ZW1FbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGl0ZW1FbGVtZW50cy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaXRlbS5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgaXRlbUVsZW1lbnQgPSBpdGVtO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtID09PSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XG4gICAgICAgICAgcG9zaXRpb24gPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gY2xvc2luZyBvbiBFbnRlciAvIFNwYWNlXG4gICAgaWYgKGtleSA9PT0gS2V5LlNwYWNlIHx8IGtleSA9PT0gS2V5LkVudGVyKSB7XG4gICAgICBpZiAoaXRlbUVsZW1lbnQgJiYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJykpIHtcbiAgICAgICAgLy8gSXRlbSBpcyBlaXRoZXIgYSBidXR0b24gb3IgYSBsaW5rLCBzbyBjbGljayB3aWxsIGJlIHRyaWdnZXJlZCBieSB0aGUgYnJvd3NlciBvbiBFbnRlciBvciBTcGFjZS5cbiAgICAgICAgLy8gU28gd2UgaGF2ZSB0byByZWdpc3RlciBhIG9uZS10aW1lIGNsaWNrIGhhbmRsZXIgdGhhdCB3aWxsIGZpcmUgYWZ0ZXIgYW55IHVzZXIgZGVmaW5lZCBjbGljayBoYW5kbGVyc1xuICAgICAgICAvLyB0byBjbG9zZSB0aGUgZHJvcGRvd25cbiAgICAgICAgZnJvbUV2ZW50KGl0ZW1FbGVtZW50LCAnY2xpY2snKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNsb3NlKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09IEtleS5UYWIpIHtcbiAgICAgIGlmIChldmVudC50YXJnZXQgJiYgdGhpcy5pc09wZW4oKSAmJiB0aGlzLmF1dG9DbG9zZSkge1xuICAgICAgICBpZiAodGhpcy5fYW5jaG9yLm5hdGl2ZUVsZW1lbnQgPT09IGV2ZW50LnRhcmdldCkge1xuICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknICYmICFldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgLyogVGhpcyBjYXNlIGlzIHNwZWNpYWw6IHVzZXIgaXMgdXNpbmcgW1RhYl0gZnJvbSB0aGUgYW5jaG9yL3RvZ2dsZS5cbiAgICAgICAgICAgICAgIFVzZXIgZXhwZWN0cyB0aGUgbmV4dCBmb2N1c2FibGUgZWxlbWVudCBpbiB0aGUgZHJvcGRvd24gbWVudSB0byBnZXQgZm9jdXMuXG4gICAgICAgICAgICAgICBCdXQgdGhlIG1lbnUgaXMgbm90IGEgc2libGluZyB0byBhbmNob3IvdG9nZ2xlLCBpdCBpcyBhdCB0aGUgZW5kIG9mIHRoZSBib2R5LlxuICAgICAgICAgICAgICAgVHJpY2sgaXMgdG8gc3luY2hyb25vdXNseSBmb2N1cyB0aGUgbWVudSBlbGVtZW50LCBhbmQgbGV0IHRoZSBba2V5ZG93bi5UYWJdIGdvXG4gICAgICAgICAgICAgICBzbyB0aGF0IGJyb3dzZXIgd2lsbCBmb2N1cyB0aGUgcHJvcGVyIGVsZW1lbnQgKGZpcnN0IG9uZSBmb2N1c2FibGUgaW4gdGhlIG1lbnUpICovXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgICAgICAgdGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5fbWVudS5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSB7XG4gICAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFNfU0VMRUNUT1IpO1xuICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBldmVudC50YXJnZXQgPT09IGZvY3VzYWJsZUVsZW1lbnRzWzBdKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFldmVudC5zaGlmdEtleSAmJiBldmVudC50YXJnZXQgPT09IGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNob3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4oZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50LCAnZm9jdXNvdXQnKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoe3JlbGF0ZWRUYXJnZXR9KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhyZWxhdGVkVGFyZ2V0IGFzIEhUTUxFbGVtZW50KSkge1xuICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBvcGVuaW5nIC8gbmF2aWdhdGluZ1xuICAgIGlmIChpc0V2ZW50RnJvbVRvZ2dsZSB8fCBpdGVtRWxlbWVudCkge1xuICAgICAgdGhpcy5vcGVuKCk7XG5cbiAgICAgIGlmIChpdGVtRWxlbWVudHMubGVuZ3RoKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSBLZXkuQXJyb3dEb3duOlxuICAgICAgICAgICAgcG9zaXRpb24gPSBNYXRoLm1pbihwb3NpdGlvbiArIDEsIGl0ZW1FbGVtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgS2V5LkFycm93VXA6XG4gICAgICAgICAgICBpZiAodGhpcy5faXNEcm9wdXAoKSAmJiBwb3NpdGlvbiA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgcG9zaXRpb24gPSBpdGVtRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwb3NpdGlvbiA9IE1hdGgubWF4KHBvc2l0aW9uIC0gMSwgMCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgICAgcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBLZXkuRW5kOlxuICAgICAgICAgICAgcG9zaXRpb24gPSBpdGVtRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1FbGVtZW50c1twb3NpdGlvbl0uZm9jdXMoKTtcbiAgICAgIH1cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaXNEcm9wdXAoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wdXAnKTsgfVxuXG4gIHByaXZhdGUgX2lzRXZlbnRGcm9tVG9nZ2xlKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2FuY2hvci5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRNZW51RWxlbWVudHMoKTogSFRNTEVsZW1lbnRbXSB7XG4gICAgY29uc3QgbWVudSA9IHRoaXMuX21lbnU7XG4gICAgaWYgKG1lbnUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gbWVudS5tZW51SXRlbXMuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0uZGlzYWJsZWQpLm1hcChpdGVtID0+IGl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgX3Bvc2l0aW9uTWVudSgpIHtcbiAgICBjb25zdCBtZW51ID0gdGhpcy5fbWVudTtcbiAgICBpZiAodGhpcy5pc09wZW4oKSAmJiBtZW51KSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5ID09PSAnZHluYW1pYycpIHtcbiAgICAgICAgdGhpcy5fcG9zaXRpb25pbmcudXBkYXRlKCk7XG4gICAgICAgIHRoaXMuX2FwcGx5UGxhY2VtZW50Q2xhc3NlcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fYXBwbHlQbGFjZW1lbnRDbGFzc2VzKHRoaXMuX2dldEZpcnN0UGxhY2VtZW50KHRoaXMucGxhY2VtZW50KSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Rmlyc3RQbGFjZW1lbnQocGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSk6IFBsYWNlbWVudCB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudFswXSA6IHBsYWNlbWVudC5zcGxpdCgnICcpWzBdIGFzIFBsYWNlbWVudDtcbiAgfVxuXG4gIHByaXZhdGUgX3Jlc2V0Q29udGFpbmVyKCkge1xuICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXI7XG4gICAgaWYgKHRoaXMuX21lbnUpIHtcbiAgICAgIGNvbnN0IGRyb3Bkb3duRWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIHJlbmRlcmVyLmFwcGVuZENoaWxkKGRyb3Bkb3duRWxlbWVudCwgZHJvcGRvd25NZW51RWxlbWVudCk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9ib2R5Q29udGFpbmVyKSB7XG4gICAgICByZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLl9kb2N1bWVudC5ib2R5LCB0aGlzLl9ib2R5Q29udGFpbmVyKTtcbiAgICAgIHRoaXMuX2JvZHlDb250YWluZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Q29udGFpbmVyKGNvbnRhaW5lcjogbnVsbCB8ICdib2R5JyA9IG51bGwpIHtcbiAgICB0aGlzLl9yZXNldENvbnRhaW5lcigpO1xuICAgIGlmIChjb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSB0aGlzLl9yZW5kZXJlcjtcbiAgICAgIGNvbnN0IGRyb3Bkb3duTWVudUVsZW1lbnQgPSB0aGlzLl9tZW51Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBib2R5Q29udGFpbmVyID0gdGhpcy5fYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXIgfHwgcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICAgIC8vIE92ZXJyaWRlIHNvbWUgc3R5bGVzIHRvIGhhdmUgdGhlIHBvc2l0aW9uaW5nIHdvcmtpbmdcbiAgICAgIHJlbmRlcmVyLnNldFN0eWxlKGJvZHlDb250YWluZXIsICdwb3NpdGlvbicsICdhYnNvbHV0ZScpO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoZHJvcGRvd25NZW51RWxlbWVudCwgJ3Bvc2l0aW9uJywgJ3N0YXRpYycpO1xuICAgICAgcmVuZGVyZXIuc2V0U3R5bGUoYm9keUNvbnRhaW5lciwgJ3otaW5kZXgnLCAnMTA1NScpO1xuXG4gICAgICByZW5kZXJlci5hcHBlbmRDaGlsZChib2R5Q29udGFpbmVyLCBkcm9wZG93bk1lbnVFbGVtZW50KTtcbiAgICAgIHJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuX2RvY3VtZW50LmJvZHksIGJvZHlDb250YWluZXIpO1xuICAgIH1cblxuICAgIHRoaXMuX2FwcGx5Q3VzdG9tRHJvcGRvd25DbGFzcyh0aGlzLmRyb3Bkb3duQ2xhc3MpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlDdXN0b21Ecm9wZG93bkNsYXNzKG5ld0NsYXNzOiBzdHJpbmcsIG9sZENsYXNzPzogc3RyaW5nKSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IHRoaXMuY29udGFpbmVyID09PSAnYm9keScgPyB0aGlzLl9ib2R5Q29udGFpbmVyIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICBpZiAob2xkQ2xhc3MpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGFyZ2V0RWxlbWVudCwgb2xkQ2xhc3MpO1xuICAgICAgfVxuICAgICAgaWYgKG5ld0NsYXNzKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRhcmdldEVsZW1lbnQsIG5ld0NsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9hcHBseVBsYWNlbWVudENsYXNzZXMocGxhY2VtZW50PzogUGxhY2VtZW50IHwgbnVsbCkge1xuICAgIGNvbnN0IG1lbnUgPSB0aGlzLl9tZW51O1xuICAgIGlmIChtZW51KSB7XG4gICAgICBpZiAoIXBsYWNlbWVudCkge1xuICAgICAgICBwbGFjZW1lbnQgPSB0aGlzLl9nZXRGaXJzdFBsYWNlbWVudCh0aGlzLnBsYWNlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXI7XG4gICAgICBjb25zdCBkcm9wZG93bkVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgY3VycmVudCBwbGFjZW1lbnQgY2xhc3Nlc1xuICAgICAgcmVuZGVyZXIucmVtb3ZlQ2xhc3MoZHJvcGRvd25FbGVtZW50LCAnZHJvcHVwJyk7XG4gICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhkcm9wZG93bkVsZW1lbnQsICdkcm9wZG93bicpO1xuICAgICAgY29uc3Qge25hdGl2ZUVsZW1lbnR9ID0gbWVudTtcbiAgICAgIGlmICh0aGlzLmRpc3BsYXkgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIG1lbnUucGxhY2VtZW50ID0gbnVsbDtcbiAgICAgICAgcmVuZGVyZXIuc2V0QXR0cmlidXRlKG5hdGl2ZUVsZW1lbnQsICdkYXRhLWJzLXBvcHBlcicsICdzdGF0aWMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbnUucGxhY2VtZW50ID0gcGxhY2VtZW50O1xuICAgICAgICByZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUobmF0aXZlRWxlbWVudCwgJ2RhdGEtYnMtcG9wcGVyJyk7XG4gICAgICB9XG5cbiAgICAgIC8qXG4gICAgICAqIGFwcGx5IHRoZSBuZXcgcGxhY2VtZW50XG4gICAgICAqIGluIGNhc2Ugb2YgdG9wIHVzZSB1cC1hcnJvdyBvciBkb3duLWFycm93IG90aGVyd2lzZVxuICAgICAgKi9cbiAgICAgIGNvbnN0IGRyb3Bkb3duQ2xhc3MgPSBwbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xID8gJ2Ryb3B1cCcgOiAnZHJvcGRvd24nO1xuICAgICAgcmVuZGVyZXIuYWRkQ2xhc3MoZHJvcGRvd25FbGVtZW50LCBkcm9wZG93bkNsYXNzKTtcblxuICAgICAgY29uc3QgYm9keUNvbnRhaW5lciA9IHRoaXMuX2JvZHlDb250YWluZXI7XG4gICAgICBpZiAoYm9keUNvbnRhaW5lcikge1xuICAgICAgICByZW5kZXJlci5yZW1vdmVDbGFzcyhib2R5Q29udGFpbmVyLCAnZHJvcHVwJyk7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKGJvZHlDb250YWluZXIsICdkcm9wZG93bicpO1xuICAgICAgICByZW5kZXJlci5hZGRDbGFzcyhib2R5Q29udGFpbmVyLCBkcm9wZG93bkNsYXNzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==