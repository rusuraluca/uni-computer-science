import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject, zip } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { ModalDismissReasons } from './modal-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { isString, reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbModalWindow {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtd2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZGFsL21vZGFsLXdpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUNMLFNBQVMsRUFFVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFJTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsU0FBUyxFQUFjLE9BQU8sRUFBRSxHQUFHLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekQsT0FBTyxFQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RSxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQzVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBdUIsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RixPQUFPLEVBQUMsUUFBUSxFQUFFLE1BQU0sRUFBQyxNQUFNLGNBQWMsQ0FBQzs7QUFzQjlDLE1BQU0sT0FBTyxjQUFjO0lBd0J6QixZQUM4QixTQUFjLEVBQVUsTUFBK0IsRUFBVSxLQUFhO1FBQTlFLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUF5QjtRQUFVLFVBQUssR0FBTCxLQUFLLENBQVE7UUF2QnBHLGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBQy9CLGlCQUFZLEdBQW1CLElBQUksQ0FBQyxDQUFFLGlEQUFpRDtRQU90RixhQUFRLEdBQXFCLElBQUksQ0FBQztRQUdsQyxhQUFR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RSxFQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBRTFCLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csY0FBYztzQkFBdEIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBRWEsWUFBWTtzQkFBOUIsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCB6aXB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHN3aXRjaE1hcCwgdGFrZSwgdGFrZVVudGlsLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7TW9kYWxEaXNtaXNzUmVhc29uc30gZnJvbSAnLi9tb2RhbC1kaXNtaXNzLXJlYXNvbnMnO1xuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9uLCBOZ2JUcmFuc2l0aW9uT3B0aW9uc30gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHtpc1N0cmluZywgcmVmbG93fSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItbW9kYWwtd2luZG93JyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzogJ1wibW9kYWwgZC1ibG9ja1wiICsgKHdpbmRvd0NsYXNzID8gXCIgXCIgKyB3aW5kb3dDbGFzcyA6IFwiXCIpJyxcbiAgICAnW2NsYXNzLmZhZGVdJzogJ2FuaW1hdGlvbicsXG4gICAgJ3JvbGUnOiAnZGlhbG9nJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLW1vZGFsXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ2FyaWFEZXNjcmliZWRCeSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICNkaWFsb2cgW2NsYXNzXT1cIidtb2RhbC1kaWFsb2cnICsgKHNpemUgPyAnIG1vZGFsLScgKyBzaXplIDogJycpICsgKGNlbnRlcmVkID8gJyBtb2RhbC1kaWFsb2ctY2VudGVyZWQnIDogJycpICtcbiAgICAgZnVsbHNjcmVlbkNsYXNzICsgKHNjcm9sbGFibGUgPyAnIG1vZGFsLWRpYWxvZy1zY3JvbGxhYmxlJyA6ICcnKSArIChtb2RhbERpYWxvZ0NsYXNzID8gJyAnICsgbW9kYWxEaWFsb2dDbGFzcyA6ICcnKVwiIHJvbGU9XCJkb2N1bWVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFsnLi9tb2RhbC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiTW9kYWxXaW5kb3cgaW1wbGVtZW50cyBPbkluaXQsXG4gICAgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfY2xvc2VkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2VsV2l0aEZvY3VzOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7ICAvLyBlbGVtZW50IHRoYXQgaXMgZm9jdXNlZCBwcmlvciB0byBtb2RhbCBvcGVuaW5nXG5cbiAgQFZpZXdDaGlsZCgnZGlhbG9nJywge3N0YXRpYzogdHJ1ZX0pIHByaXZhdGUgX2RpYWxvZ0VsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFyaWFEZXNjcmliZWRCeTogc3RyaW5nO1xuICBASW5wdXQoKSBiYWNrZHJvcDogYm9vbGVhbiB8IHN0cmluZyA9IHRydWU7XG4gIEBJbnB1dCgpIGNlbnRlcmVkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGZ1bGxzY3JlZW46IHN0cmluZyB8IGJvb2xlYW47XG4gIEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcbiAgQElucHV0KCkgc2Nyb2xsYWJsZTogc3RyaW5nO1xuICBASW5wdXQoKSBzaXplOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHdpbmRvd0NsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1vZGFsRGlhbG9nQ2xhc3M6IHN0cmluZztcblxuICBAT3V0cHV0KCdkaXNtaXNzJykgZGlzbWlzc0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHNob3duID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgaGlkZGVuID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfem9uZTogTmdab25lKSB7fVxuXG4gIGdldCBmdWxsc2NyZWVuQ2xhc3MoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mdWxsc2NyZWVuID09PSB0cnVlID8gJyBtb2RhbC1mdWxsc2NyZWVuJyA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3RyaW5nKHRoaXMuZnVsbHNjcmVlbikgPyBgIG1vZGFsLWZ1bGxzY3JlZW4tJHt0aGlzLmZ1bGxzY3JlZW59LWRvd25gIDogJyc7XG4gIH1cblxuICBkaXNtaXNzKHJlYXNvbik6IHZvaWQgeyB0aGlzLmRpc21pc3NFdmVudC5lbWl0KHJlYXNvbik7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9lbFdpdGhGb2N1cyA9IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fem9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7IHRoaXMuX3Nob3coKTsgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5fZGlzYWJsZUV2ZW50SGFuZGxpbmcoKTsgfVxuXG4gIGhpZGUoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBjb25zdCB7bmF0aXZlRWxlbWVudH0gPSB0aGlzLl9lbFJlZjtcbiAgICBjb25zdCBjb250ZXh0OiBOZ2JUcmFuc2l0aW9uT3B0aW9uczxhbnk+ID0ge2FuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCd9O1xuXG4gICAgY29uc3Qgd2luZG93VHJhbnNpdGlvbiQgPVxuICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIG5hdGl2ZUVsZW1lbnQsICgpID0+IG5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLCBjb250ZXh0KTtcbiAgICBjb25zdCBkaWFsb2dUcmFuc2l0aW9uJCA9IG5nYlJ1blRyYW5zaXRpb24odGhpcy5fem9uZSwgdGhpcy5fZGlhbG9nRWwubmF0aXZlRWxlbWVudCwgKCkgPT4ge30sIGNvbnRleHQpO1xuXG4gICAgY29uc3QgdHJhbnNpdGlvbnMkID0gemlwKHdpbmRvd1RyYW5zaXRpb24kLCBkaWFsb2dUcmFuc2l0aW9uJCk7XG4gICAgdHJhbnNpdGlvbnMkLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmhpZGRlbi5uZXh0KCk7XG4gICAgICB0aGlzLmhpZGRlbi5jb21wbGV0ZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZGlzYWJsZUV2ZW50SGFuZGxpbmcoKTtcbiAgICB0aGlzLl9yZXN0b3JlRm9jdXMoKTtcblxuICAgIHJldHVybiB0cmFuc2l0aW9ucyQ7XG4gIH1cblxuICBwcml2YXRlIF9zaG93KCkge1xuICAgIGNvbnN0IGNvbnRleHQ6IE5nYlRyYW5zaXRpb25PcHRpb25zPGFueT4gPSB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZSd9O1xuXG4gICAgY29uc3Qgd2luZG93VHJhbnNpdGlvbiQgPVxuICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIChlbGVtZW50OiBIVE1MRWxlbWVudCwgYW5pbWF0aW9uOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgcmVmbG93KGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Nob3cnKTtcbiAgICAgICAgfSwgY29udGV4dCk7XG4gICAgY29uc3QgZGlhbG9nVHJhbnNpdGlvbiQgPSBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2RpYWxvZ0VsLm5hdGl2ZUVsZW1lbnQsICgpID0+IHt9LCBjb250ZXh0KTtcblxuICAgIHppcCh3aW5kb3dUcmFuc2l0aW9uJCwgZGlhbG9nVHJhbnNpdGlvbiQpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnNob3duLm5leHQoKTtcbiAgICAgIHRoaXMuc2hvd24uY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2VuYWJsZUV2ZW50SGFuZGxpbmcoKTtcbiAgICB0aGlzLl9zZXRGb2N1cygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZW5hYmxlRXZlbnRIYW5kbGluZygpIHtcbiAgICBjb25zdCB7bmF0aXZlRWxlbWVudH0gPSB0aGlzLl9lbFJlZjtcbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZyb21FdmVudDxLZXlib2FyZEV2ZW50PihuYXRpdmVFbGVtZW50LCAna2V5ZG93bicpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSxcbiAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGRlcHJlY2F0aW9uL2RlcHJlY2F0aW9uICovXG4gICAgICAgICAgICAgIGZpbHRlcihlID0+IGUud2hpY2ggPT09IEtleS5Fc2NhcGUpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoZXZlbnQgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMua2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuZGlzbWlzcyhNb2RhbERpc21pc3NSZWFzb25zLkVTQykpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmFja2Ryb3AgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgICAgICAgIHRoaXMuX2J1bXBCYWNrZHJvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAvLyBXZSdyZSBsaXN0ZW5pbmcgdG8gJ21vdXNlZG93bicgYW5kICdtb3VzZXVwJyB0byBwcmV2ZW50IG1vZGFsIGZyb20gY2xvc2luZyB3aGVuIHByZXNzaW5nIHRoZSBtb3VzZVxuICAgICAgLy8gaW5zaWRlIHRoZSBtb2RhbCBkaWFsb2cgYW5kIHJlbGVhc2luZyBpdCBvdXRzaWRlXG4gICAgICBsZXQgcHJldmVudENsb3NlID0gZmFsc2U7XG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy5fZGlhbG9nRWwubmF0aXZlRWxlbWVudCwgJ21vdXNlZG93bicpXG4gICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgdGFwKCgpID0+IHByZXZlbnRDbG9zZSA9IGZhbHNlKSxcbiAgICAgICAgICAgICAgc3dpdGNoTWFwKCgpID0+IGZyb21FdmVudDxNb3VzZUV2ZW50PihuYXRpdmVFbGVtZW50LCAnbW91c2V1cCcpLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCB0YWtlKDEpKSksXG4gICAgICAgICAgICAgIGZpbHRlcigoe3RhcmdldH0pID0+IG5hdGl2ZUVsZW1lbnQgPT09IHRhcmdldCkpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7IHByZXZlbnRDbG9zZSA9IHRydWU7IH0pO1xuXG4gICAgICAvLyBXZSdyZSBsaXN0ZW5pbmcgdG8gJ2NsaWNrJyB0byBkaXNtaXNzIG1vZGFsIG9uIG1vZGFsIHdpbmRvdyBjbGljaywgZXhjZXB0IHdoZW46XG4gICAgICAvLyAxLiBjbGlja2luZyBvbiBtb2RhbCBkaWFsb2cgaXRzZWxmXG4gICAgICAvLyAyLiBjbG9zaW5nIHdhcyBwcmV2ZW50ZWQgYnkgbW91c2Vkb3duL3VwIGhhbmRsZXJzXG4gICAgICAvLyAzLiBjbGlja2luZyBvbiBzY3JvbGxiYXIgd2hlbiB0aGUgdmlld3BvcnQgaXMgdG9vIHNtYWxsIGFuZCBtb2RhbCBkb2Vzbid0IGZpdCAoY2xpY2sgaXMgbm90IHRyaWdnZXJlZCBhdCBhbGwpXG4gICAgICBmcm9tRXZlbnQ8TW91c2VFdmVudD4obmF0aXZlRWxlbWVudCwgJ2NsaWNrJykucGlwZSh0YWtlVW50aWwodGhpcy5fY2xvc2VkJCkpLnN1YnNjcmliZSgoe3RhcmdldH0pID0+IHtcbiAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQgPT09IHRhcmdldCkge1xuICAgICAgICAgIGlmICh0aGlzLmJhY2tkcm9wID09PSAnc3RhdGljJykge1xuICAgICAgICAgICAgdGhpcy5fYnVtcEJhY2tkcm9wKCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJhY2tkcm9wID09PSB0cnVlICYmICFwcmV2ZW50Q2xvc2UpIHtcbiAgICAgICAgICAgIHRoaXMuX3pvbmUucnVuKCgpID0+IHRoaXMuZGlzbWlzcyhNb2RhbERpc21pc3NSZWFzb25zLkJBQ0tEUk9QX0NMSUNLKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJldmVudENsb3NlID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc2FibGVFdmVudEhhbmRsaW5nKCkgeyB0aGlzLl9jbG9zZWQkLm5leHQoKTsgfVxuXG4gIHByaXZhdGUgX3NldEZvY3VzKCkge1xuICAgIGNvbnN0IHtuYXRpdmVFbGVtZW50fSA9IHRoaXMuX2VsUmVmO1xuICAgIGlmICghbmF0aXZlRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgY29uc3QgYXV0b0ZvY3VzYWJsZSA9IG5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgW25nYkF1dG9mb2N1c11gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0Rm9jdXNhYmxlID0gZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyhuYXRpdmVFbGVtZW50KVswXTtcblxuICAgICAgY29uc3QgZWxlbWVudFRvRm9jdXMgPSBhdXRvRm9jdXNhYmxlIHx8IGZpcnN0Rm9jdXNhYmxlIHx8IG5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBlbFdpdGhGb2N1cyA9IHRoaXMuX2VsV2l0aEZvY3VzO1xuXG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzO1xuICAgIGlmIChlbFdpdGhGb2N1cyAmJiBlbFdpdGhGb2N1c1snZm9jdXMnXSAmJiBib2R5LmNvbnRhaW5zKGVsV2l0aEZvY3VzKSkge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBlbFdpdGhGb2N1cztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBib2R5O1xuICAgIH1cbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudFRvRm9jdXMuZm9jdXMoKSk7XG4gICAgICB0aGlzLl9lbFdpdGhGb2N1cyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9idW1wQmFja2Ryb3AoKSB7XG4gICAgaWYgKHRoaXMuYmFja2Ryb3AgPT09ICdzdGF0aWMnKSB7XG4gICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsICh7Y2xhc3NMaXN0fSkgPT4ge1xuICAgICAgICBjbGFzc0xpc3QuYWRkKCdtb2RhbC1zdGF0aWMnKTtcbiAgICAgICAgcmV0dXJuICgpID0+IGNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLXN0YXRpYycpO1xuICAgICAgfSwge2FuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sIHJ1bm5pbmdUcmFuc2l0aW9uOiAnY29udGludWUnfSk7XG4gICAgfVxuICB9XG59XG4iXX0=