import { DOCUMENT } from '@angular/common';
import { EventEmitter, Inject, Injectable, Injector, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ngbFocusTrap } from '../util/focus-trap';
import { ContentRef } from '../util/popup';
import { isDefined, isString } from '../util/util';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbActiveModal, NgbModalRef } from './modal-ref';
import { NgbModalWindow } from './modal-window';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../util/scrollbar";
export class NgbModalStack {
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
NgbModalStack.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, deps: [{ token: i0.ApplicationRef }, { token: i0.Injector }, { token: DOCUMENT }, { token: i1.ScrollBar }, { token: i0.RendererFactory2 }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable });
NgbModalStack.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbModalStack, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ApplicationRef }, { type: i0.Injector }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i1.ScrollBar }, { type: i0.RendererFactory2 }, { type: i0.NgZone }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kYWwvbW9kYWwtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFJTCxZQUFZLEVBQ1osTUFBTSxFQUNOLFVBQVUsRUFDVixRQUFRLEVBR1IsV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDakQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFbEQsT0FBTyxFQUFDLGNBQWMsRUFBRSxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBR3BDLE1BQU0sT0FBTyxhQUFhO0lBYXhCLFlBQ1ksZUFBK0IsRUFBVSxTQUFtQixFQUE0QixTQUFjLEVBQ3RHLFVBQXFCLEVBQVUsZ0JBQWtDLEVBQVUsT0FBZTtRQUQxRixvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQTRCLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDdEcsZUFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBZDlGLGdDQUEyQixHQUFHLElBQUksT0FBTyxFQUFRLENB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Q0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzdDO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRU8sbUJBQW1CLENBQUMsYUFBMkM7UUFDckUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO1FBRXhDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3ZELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNkLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3pDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzswR0FwT1UsYUFBYSx3RUFjMEQsUUFBUTs4R0FkL0UsYUFBYSxjQURELE1BQU07MkZBQ2xCLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFlNkMsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFwcGxpY2F0aW9uUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIEluamVjdG9yLFxuICBOZ1pvbmUsXG4gIFJlbmRlcmVyRmFjdG9yeTIsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJqZWN0fSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtuZ2JGb2N1c1RyYXB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQge0NvbnRlbnRSZWZ9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHtTY3JvbGxCYXJ9IGZyb20gJy4uL3V0aWwvc2Nyb2xsYmFyJztcbmltcG9ydCB7aXNEZWZpbmVkLCBpc1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiTW9kYWxCYWNrZHJvcH0gZnJvbSAnLi9tb2RhbC1iYWNrZHJvcCc7XG5pbXBvcnQge05nYk1vZGFsT3B0aW9uc30gZnJvbSAnLi9tb2RhbC1jb25maWcnO1xuaW1wb3J0IHtOZ2JBY3RpdmVNb2RhbCwgTmdiTW9kYWxSZWZ9IGZyb20gJy4vbW9kYWwtcmVmJztcbmltcG9ydCB7TmdiTW9kYWxXaW5kb3d9IGZyb20gJy4vbW9kYWwtd2luZG93JztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFN0YWNrIHtcbiAgcHJpdmF0ZSBfYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9hcmlhSGlkZGVuVmFsdWVzOiBNYXA8RWxlbWVudCwgc3RyaW5nIHwgbnVsbD4gPSBuZXcgTWFwKCk7XG4gIHByaXZhdGUgX3Njcm9sbEJhclJlc3RvcmVGbjogbnVsbCB8ICgoKSA9PiB2b2lkKSA9IG51bGw7XG4gIHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYW5pbWF0aW9uJywgJ2JhY2tkcm9wQ2xhc3MnXTtcbiAgcHJpdmF0ZSBfbW9kYWxSZWZzOiBOZ2JNb2RhbFJlZltdID0gW107XG4gIHByaXZhdGUgX3dpbmRvd0F0dHJpYnV0ZXMgPSBbXG4gICAgJ2FuaW1hdGlvbicsICdhcmlhTGFiZWxsZWRCeScsICdhcmlhRGVzY3JpYmVkQnknLCAnYmFja2Ryb3AnLCAnY2VudGVyZWQnLCAnZnVsbHNjcmVlbicsICdrZXlib2FyZCcsICdzY3JvbGxhYmxlJyxcbiAgICAnc2l6ZScsICd3aW5kb3dDbGFzcycsICdtb2RhbERpYWxvZ0NsYXNzJ1xuICBdO1xuICBwcml2YXRlIF93aW5kb3dDbXB0czogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PltdID0gW107XG4gIHByaXZhdGUgX2FjdGl2ZUluc3RhbmNlczogRXZlbnRFbWl0dGVyPE5nYk1vZGFsUmVmW10+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksXG4gICAgICBwcml2YXRlIF9zY3JvbGxCYXI6IFNjcm9sbEJhciwgcHJpdmF0ZSBfcmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkyLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge1xuICAgIC8vIFRyYXAgZm9jdXMgb24gYWN0aXZlIFdpbmRvd0NtcHRcbiAgICB0aGlzLl9hY3RpdmVXaW5kb3dDbXB0SGFzQ2hhbmdlZC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX3dpbmRvd0NtcHRzLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBhY3RpdmVXaW5kb3dDbXB0ID0gdGhpcy5fd2luZG93Q21wdHNbdGhpcy5fd2luZG93Q21wdHMubGVuZ3RoIC0gMV07XG4gICAgICAgIG5nYkZvY3VzVHJhcCh0aGlzLl9uZ1pvbmUsIGFjdGl2ZVdpbmRvd0NtcHQubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5fYWN0aXZlV2luZG93Q21wdEhhc0NoYW5nZWQpO1xuICAgICAgICB0aGlzLl9yZXZlcnRBcmlhSGlkZGVuKCk7XG4gICAgICAgIHRoaXMuX3NldEFyaWFIaWRkZW4oYWN0aXZlV2luZG93Q21wdC5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jlc3RvcmVTY3JvbGxCYXIoKSB7XG4gICAgY29uc3Qgc2Nyb2xsQmFyUmVzdG9yZUZuID0gdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuO1xuICAgIGlmIChzY3JvbGxCYXJSZXN0b3JlRm4pIHtcbiAgICAgIHRoaXMuX3Njcm9sbEJhclJlc3RvcmVGbiA9IG51bGw7XG4gICAgICBzY3JvbGxCYXJSZXN0b3JlRm4oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9oaWRlU2Nyb2xsQmFyKCkge1xuICAgIGlmICghdGhpcy5fc2Nyb2xsQmFyUmVzdG9yZUZuKSB7XG4gICAgICB0aGlzLl9zY3JvbGxCYXJSZXN0b3JlRm4gPSB0aGlzLl9zY3JvbGxCYXIuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4obW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsIGNvbnRlbnQ6IGFueSwgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTpcbiAgICAgIE5nYk1vZGFsUmVmIHtcbiAgICBjb25zdCBjb250YWluZXJFbCA9IG9wdGlvbnMuY29udGFpbmVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBvcHRpb25zLmNvbnRhaW5lciA6IGlzRGVmaW5lZChvcHRpb25zLmNvbnRhaW5lcikgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5jb250YWluZXIpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5fcmVuZGVyZXJGYWN0b3J5LmNyZWF0ZVJlbmRlcmVyKG51bGwsIG51bGwpO1xuXG4gICAgaWYgKCFjb250YWluZXJFbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc3BlY2lmaWVkIG1vZGFsIGNvbnRhaW5lciBcIiR7b3B0aW9ucy5jb250YWluZXIgfHwgJ2JvZHknfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIERPTS5gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9oaWRlU2Nyb2xsQmFyKCk7XG5cbiAgICBjb25zdCBhY3RpdmVNb2RhbCA9IG5ldyBOZ2JBY3RpdmVNb2RhbCgpO1xuICAgIGNvbnN0IGNvbnRlbnRSZWYgPVxuICAgICAgICB0aGlzLl9nZXRDb250ZW50UmVmKG1vZHVsZUNGUiwgb3B0aW9ucy5pbmplY3RvciB8fCBjb250ZW50SW5qZWN0b3IsIGNvbnRlbnQsIGFjdGl2ZU1vZGFsLCBvcHRpb25zKTtcblxuICAgIGxldCBiYWNrZHJvcENtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbEJhY2tkcm9wPnwgdW5kZWZpbmVkID1cbiAgICAgICAgb3B0aW9ucy5iYWNrZHJvcCAhPT0gZmFsc2UgPyB0aGlzLl9hdHRhY2hCYWNrZHJvcChtb2R1bGVDRlIsIGNvbnRhaW5lckVsKSA6IHVuZGVmaW5lZDtcbiAgICBsZXQgd2luZG93Q21wdFJlZjogQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiA9IHRoaXMuX2F0dGFjaFdpbmRvd0NvbXBvbmVudChtb2R1bGVDRlIsIGNvbnRhaW5lckVsLCBjb250ZW50UmVmKTtcbiAgICBsZXQgbmdiTW9kYWxSZWY6IE5nYk1vZGFsUmVmID0gbmV3IE5nYk1vZGFsUmVmKHdpbmRvd0NtcHRSZWYsIGNvbnRlbnRSZWYsIGJhY2tkcm9wQ21wdFJlZiwgb3B0aW9ucy5iZWZvcmVEaXNtaXNzKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyTW9kYWxSZWYobmdiTW9kYWxSZWYpO1xuICAgIHRoaXMuX3JlZ2lzdGVyV2luZG93Q21wdCh3aW5kb3dDbXB0UmVmKTtcblxuICAgIC8vIFdlIGhhdmUgdG8gY2xlYW51cCBET00gYWZ0ZXIgdGhlIGxhc3QgbW9kYWwgd2hlbiBCT1RIICdoaWRkZW4nIHdhcyBlbWl0dGVkIGFuZCAncmVzdWx0JyBwcm9taXNlIHdhcyByZXNvbHZlZDpcbiAgICAvLyAtIHdpdGggYW5pbWF0aW9ucyBPRkYsICdoaWRkZW4nIGVtaXRzIHN5bmNocm9ub3VzbHksIHRoZW4gJ3Jlc3VsdCcgaXMgcmVzb2x2ZWQgYXN5bmNocm9ub3VzbHlcbiAgICAvLyAtIHdpdGggYW5pbWF0aW9ucyBPTiwgJ3Jlc3VsdCcgaXMgcmVzb2x2ZWQgYXN5bmNocm9ub3VzbHksIHRoZW4gJ2hpZGRlbicgZW1pdHMgYXN5bmNocm9ub3VzbHlcbiAgICBuZ2JNb2RhbFJlZi5oaWRkZW4ucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHRydWUpLnRoZW4oKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLl9tb2RhbFJlZnMubGVuZ3RoKSB7XG4gICAgICAgIHJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2RvY3VtZW50LmJvZHksICdtb2RhbC1vcGVuJyk7XG4gICAgICAgIHRoaXMuX3Jlc3RvcmVTY3JvbGxCYXIoKTtcbiAgICAgICAgdGhpcy5fcmV2ZXJ0QXJpYUhpZGRlbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIGFjdGl2ZU1vZGFsLmNsb3NlID0gKHJlc3VsdDogYW55KSA9PiB7IG5nYk1vZGFsUmVmLmNsb3NlKHJlc3VsdCk7IH07XG4gICAgYWN0aXZlTW9kYWwuZGlzbWlzcyA9IChyZWFzb246IGFueSkgPT4geyBuZ2JNb2RhbFJlZi5kaXNtaXNzKHJlYXNvbik7IH07XG5cbiAgICB0aGlzLl9hcHBseVdpbmRvd09wdGlvbnMod2luZG93Q21wdFJlZi5pbnN0YW5jZSwgb3B0aW9ucyk7XG4gICAgaWYgKHRoaXMuX21vZGFsUmVmcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2RvY3VtZW50LmJvZHksICdtb2RhbC1vcGVuJyk7XG4gICAgfVxuXG4gICAgaWYgKGJhY2tkcm9wQ21wdFJlZiAmJiBiYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UpIHtcbiAgICAgIHRoaXMuX2FwcGx5QmFja2Ryb3BPcHRpb25zKGJhY2tkcm9wQ21wdFJlZi5pbnN0YW5jZSwgb3B0aW9ucyk7XG4gICAgICBiYWNrZHJvcENtcHRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgICB3aW5kb3dDbXB0UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gbmdiTW9kYWxSZWY7XG4gIH1cblxuICBnZXQgYWN0aXZlSW5zdGFuY2VzKCkgeyByZXR1cm4gdGhpcy5fYWN0aXZlSW5zdGFuY2VzOyB9XG5cbiAgZGlzbWlzc0FsbChyZWFzb24/OiBhbnkpIHsgdGhpcy5fbW9kYWxSZWZzLmZvckVhY2gobmdiTW9kYWxSZWYgPT4gbmdiTW9kYWxSZWYuZGlzbWlzcyhyZWFzb24pKTsgfVxuXG4gIGhhc09wZW5Nb2RhbHMoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9tb2RhbFJlZnMubGVuZ3RoID4gMDsgfVxuXG4gIHByaXZhdGUgX2F0dGFjaEJhY2tkcm9wKG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250YWluZXJFbDogYW55KTogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+IHtcbiAgICBsZXQgYmFja2Ryb3BGYWN0b3J5ID0gbW9kdWxlQ0ZSLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nYk1vZGFsQmFja2Ryb3ApO1xuICAgIGxldCBiYWNrZHJvcENtcHRSZWYgPSBiYWNrZHJvcEZhY3RvcnkuY3JlYXRlKHRoaXMuX2luamVjdG9yKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGJhY2tkcm9wQ21wdFJlZi5ob3N0Vmlldyk7XG4gICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQoYmFja2Ryb3BDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHJldHVybiBiYWNrZHJvcENtcHRSZWY7XG4gIH1cblxuICBwcml2YXRlIF9hdHRhY2hXaW5kb3dDb21wb25lbnQobW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRhaW5lckVsOiBhbnksIGNvbnRlbnRSZWY6IGFueSk6XG4gICAgICBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+IHtcbiAgICBsZXQgd2luZG93RmFjdG9yeSA9IG1vZHVsZUNGUi5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ2JNb2RhbFdpbmRvdyk7XG4gICAgbGV0IHdpbmRvd0NtcHRSZWYgPSB3aW5kb3dGYWN0b3J5LmNyZWF0ZSh0aGlzLl9pbmplY3RvciwgY29udGVudFJlZi5ub2Rlcyk7XG4gICAgdGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyh3aW5kb3dDbXB0UmVmLmhvc3RWaWV3KTtcbiAgICBjb250YWluZXJFbC5hcHBlbmRDaGlsZCh3aW5kb3dDbXB0UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHJldHVybiB3aW5kb3dDbXB0UmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlXaW5kb3dPcHRpb25zKHdpbmRvd0luc3RhbmNlOiBOZ2JNb2RhbFdpbmRvdywgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fd2luZG93QXR0cmlidXRlcy5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChpc0RlZmluZWQob3B0aW9uc1tvcHRpb25OYW1lXSkpIHtcbiAgICAgICAgd2luZG93SW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSBvcHRpb25zW29wdGlvbk5hbWVdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlCYWNrZHJvcE9wdGlvbnMoYmFja2Ryb3BJbnN0YW5jZTogTmdiTW9kYWxCYWNrZHJvcCwgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5fYmFja2Ryb3BBdHRyaWJ1dGVzLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgaWYgKGlzRGVmaW5lZChvcHRpb25zW29wdGlvbk5hbWVdKSkge1xuICAgICAgICBiYWNrZHJvcEluc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldENvbnRlbnRSZWYoXG4gICAgICBtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBhY3RpdmVNb2RhbDogTmdiQWN0aXZlTW9kYWwsXG4gICAgICBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMpOiBDb250ZW50UmVmIHtcbiAgICBpZiAoIWNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbXSk7XG4gICAgfSBlbHNlIGlmIChjb250ZW50IGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGcm9tVGVtcGxhdGVSZWYoY29udGVudCwgYWN0aXZlTW9kYWwpO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoY29udGVudCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGcm9tU3RyaW5nKGNvbnRlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRnJvbUNvbXBvbmVudChtb2R1bGVDRlIsIGNvbnRlbnRJbmplY3RvciwgY29udGVudCwgYWN0aXZlTW9kYWwsIG9wdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUZyb21UZW1wbGF0ZVJlZihjb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+LCBhY3RpdmVNb2RhbDogTmdiQWN0aXZlTW9kYWwpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb250ZXh0ID0ge1xuICAgICAgJGltcGxpY2l0OiBhY3RpdmVNb2RhbCxcbiAgICAgIGNsb3NlKHJlc3VsdCkgeyBhY3RpdmVNb2RhbC5jbG9zZShyZXN1bHQpOyB9LFxuICAgICAgZGlzbWlzcyhyZWFzb24pIHsgYWN0aXZlTW9kYWwuZGlzbWlzcyhyZWFzb24pOyB9XG4gICAgfTtcbiAgICBjb25zdCB2aWV3UmVmID0gY29udGVudC5jcmVhdGVFbWJlZGRlZFZpZXcoY29udGV4dCk7XG4gICAgdGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyh2aWV3UmVmKTtcbiAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW3ZpZXdSZWYucm9vdE5vZGVzXSwgdmlld1JlZik7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVGcm9tU3RyaW5nKGNvbnRlbnQ6IHN0cmluZyk6IENvbnRlbnRSZWYge1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZVRleHROb2RlKGAke2NvbnRlbnR9YCk7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFtbY29tcG9uZW50XV0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRnJvbUNvbXBvbmVudChcbiAgICAgIG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250ZW50SW5qZWN0b3I6IEluamVjdG9yLCBjb250ZW50OiBhbnksIGNvbnRleHQ6IE5nYkFjdGl2ZU1vZGFsLFxuICAgICAgb3B0aW9uczogTmdiTW9kYWxPcHRpb25zKTogQ29udGVudFJlZiB7XG4gICAgY29uc3QgY29udGVudENtcHRGYWN0b3J5ID0gbW9kdWxlQ0ZSLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KGNvbnRlbnQpO1xuICAgIGNvbnN0IG1vZGFsQ29udGVudEluamVjdG9yID1cbiAgICAgICAgSW5qZWN0b3IuY3JlYXRlKHtwcm92aWRlcnM6IFt7cHJvdmlkZTogTmdiQWN0aXZlTW9kYWwsIHVzZVZhbHVlOiBjb250ZXh0fV0sIHBhcmVudDogY29udGVudEluamVjdG9yfSk7XG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gY29udGVudENtcHRGYWN0b3J5LmNyZWF0ZShtb2RhbENvbnRlbnRJbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50TmF0aXZlRWwgPSBjb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICBpZiAob3B0aW9ucy5zY3JvbGxhYmxlKSB7XG4gICAgICAoY29tcG9uZW50TmF0aXZlRWwgYXMgSFRNTEVsZW1lbnQpLmNsYXNzTGlzdC5hZGQoJ2NvbXBvbmVudC1ob3N0LXNjcm9sbGFibGUnKTtcbiAgICB9XG4gICAgdGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhjb21wb25lbnRSZWYuaG9zdFZpZXcpO1xuICAgIC8vIEZJWE1FOiB3ZSBzaG91bGQgaGVyZSBnZXQgcmlkIG9mIHRoZSBjb21wb25lbnQgbmF0aXZlRWxlbWVudFxuICAgIC8vIGFuZCB1c2UgYFtBcnJheS5mcm9tKGNvbXBvbmVudE5hdGl2ZUVsLmNoaWxkTm9kZXMpXWAgaW5zdGVhZCBhbmQgcmVtb3ZlIHRoZSBhYm92ZSBDU1MgY2xhc3MuXG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFtbY29tcG9uZW50TmF0aXZlRWxdXSwgY29tcG9uZW50UmVmLmhvc3RWaWV3LCBjb21wb25lbnRSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0QXJpYUhpZGRlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgcGFyZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgIGlmIChwYXJlbnQgJiYgZWxlbWVudCAhPT0gdGhpcy5fZG9jdW1lbnQuYm9keSkge1xuICAgICAgQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZvckVhY2goc2libGluZyA9PiB7XG4gICAgICAgIGlmIChzaWJsaW5nICE9PSBlbGVtZW50ICYmIHNpYmxpbmcubm9kZU5hbWUgIT09ICdTQ1JJUFQnKSB7XG4gICAgICAgICAgdGhpcy5fYXJpYUhpZGRlblZhbHVlcy5zZXQoc2libGluZywgc2libGluZy5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykpO1xuICAgICAgICAgIHNpYmxpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9zZXRBcmlhSGlkZGVuKHBhcmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmV2ZXJ0QXJpYUhpZGRlbigpIHtcbiAgICB0aGlzLl9hcmlhSGlkZGVuVmFsdWVzLmZvckVhY2goKHZhbHVlLCBlbGVtZW50KSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fYXJpYUhpZGRlblZhbHVlcy5jbGVhcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJNb2RhbFJlZihuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYpIHtcbiAgICBjb25zdCB1bnJlZ2lzdGVyTW9kYWxSZWYgPSAoKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX21vZGFsUmVmcy5pbmRleE9mKG5nYk1vZGFsUmVmKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX21vZGFsUmVmcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLl9hY3RpdmVJbnN0YW5jZXMuZW1pdCh0aGlzLl9tb2RhbFJlZnMpO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5fbW9kYWxSZWZzLnB1c2gobmdiTW9kYWxSZWYpO1xuICAgIHRoaXMuX2FjdGl2ZUluc3RhbmNlcy5lbWl0KHRoaXMuX21vZGFsUmVmcyk7XG4gICAgbmdiTW9kYWxSZWYucmVzdWx0LnRoZW4odW5yZWdpc3Rlck1vZGFsUmVmLCB1bnJlZ2lzdGVyTW9kYWxSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVnaXN0ZXJXaW5kb3dDbXB0KG5nYldpbmRvd0NtcHQ6IENvbXBvbmVudFJlZjxOZ2JNb2RhbFdpbmRvdz4pIHtcbiAgICB0aGlzLl93aW5kb3dDbXB0cy5wdXNoKG5nYldpbmRvd0NtcHQpO1xuICAgIHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcblxuICAgIG5nYldpbmRvd0NtcHQub25EZXN0cm95KCgpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fd2luZG93Q21wdHMuaW5kZXhPZihuZ2JXaW5kb3dDbXB0KTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX3dpbmRvd0NtcHRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIHRoaXMuX2FjdGl2ZVdpbmRvd0NtcHRIYXNDaGFuZ2VkLm5leHQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19