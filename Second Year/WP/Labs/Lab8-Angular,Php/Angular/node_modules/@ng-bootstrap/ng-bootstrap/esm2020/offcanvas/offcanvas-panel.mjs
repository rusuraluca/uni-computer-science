import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import * as i0 from "@angular/core";
export class NgbOffcanvasPanel {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLXBhbmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtcGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxTQUFTLEVBRVQsWUFBWSxFQUNaLE1BQU0sRUFDTixLQUFLLEVBSUwsTUFBTSxFQUNOLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsU0FBUyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNwRCxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RCxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNoRSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBdUIsTUFBTSxrQ0FBa0MsQ0FBQztBQUN4RixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sY0FBYyxDQUFDOztBQWdCcEMsTUFBTSxPQUFPLGlCQUFpQjtJQWlCNUIsWUFDOEIsU0FBYyxFQUFVLE1BQStCLEVBQVUsS0FBYTtRQUE5RSxjQUFTLEdBQVQsU0FBUyxDQUFLO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBaEJwRyxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUMvQixpQkFBWSxHQUFtQixJQUFJLENBQUMsQ0FBRSxxREFBcUQ7UUFLMUYsYUFBUSxHQUFHLElBQUksQ0FBQztRQUVoQixhQUFRLEdBQXVDLE9BQU8sQ0FBQztRQUU3QyxpQkFBWSxHQUFHLElBQUks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QUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBRWEsWUFBWTtzQkFBOUIsTUFBTTt1QkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Z2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50c30gZnJvbSAnLi4vdXRpbC9mb2N1cy10cmFwJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5pbXBvcnQge09mZmNhbnZhc0Rpc21pc3NSZWFzb25zfSBmcm9tICcuL29mZmNhbnZhcy1kaXNtaXNzLXJlYXNvbnMnO1xuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9uLCBOZ2JUcmFuc2l0aW9uT3B0aW9uc30gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHtyZWZsb3d9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1vZmZjYW52YXMtcGFuZWwnLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzdHlsZVVybHM6IFtdLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzc10nOiAnXCJvZmZjYW52YXMgb2ZmY2FudmFzLVwiICsgcG9zaXRpb24gICsgKHBhbmVsQ2xhc3MgPyBcIiBcIiArIHBhbmVsQ2xhc3MgOiBcIlwiKScsXG4gICAgJ3JvbGUnOiAnZGlhbG9nJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICdbYXR0ci5hcmlhLW1vZGFsXSc6ICd0cnVlJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG4gICAgJ1thdHRyLmFyaWEtZGVzY3JpYmVkYnldJzogJ2FyaWFEZXNjcmliZWRCeScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiT2ZmY2FudmFzUGFuZWwgaW1wbGVtZW50cyBPbkluaXQsXG4gICAgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfY2xvc2VkJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgX2VsV2l0aEZvY3VzOiBFbGVtZW50IHwgbnVsbCA9IG51bGw7ICAvLyBlbGVtZW50IHRoYXQgaXMgZm9jdXNlZCBwcmlvciB0byBvZmZjYW52YXMgb3BlbmluZ1xuXG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIGFyaWFEZXNjcmliZWRCeT86IHN0cmluZztcbiAgQElucHV0KCkga2V5Ym9hcmQgPSB0cnVlO1xuICBASW5wdXQoKSBwYW5lbENsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiAnc3RhcnQnIHwgJ2VuZCcgfCAndG9wJyB8ICdib3R0b20nID0gJ3N0YXJ0JztcblxuICBAT3V0cHV0KCdkaXNtaXNzJykgZGlzbWlzc0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIHNob3duID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgaGlkZGVuID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfem9uZTogTmdab25lKSB7fVxuXG4gIGRpc21pc3MocmVhc29uKTogdm9pZCB7IHRoaXMuZGlzbWlzc0V2ZW50LmVtaXQocmVhc29uKTsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2VsV2l0aEZvY3VzID0gdGhpcy5fZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICB0aGlzLl96b25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHsgdGhpcy5fc2hvdygpOyB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkgeyB0aGlzLl9kaXNhYmxlRXZlbnRIYW5kbGluZygpOyB9XG5cbiAgaGlkZSgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IHtuYXRpdmVFbGVtZW50fSA9IHRoaXMuX2VsUmVmO1xuICAgIGNvbnN0IGNvbnRleHQ6IE5nYlRyYW5zaXRpb25PcHRpb25zPGFueT4gPSB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdzdG9wJ307XG5cbiAgICAvLyBUT0RPIHdoZW4gd2UgdGFyZ2V0IEJvb3RzdHJhcCA1LjIrLCB0aGUgc3R5bGUudmlzaWJpbGl0eSBoYW5kbGluZyBjYW4gYmUgcmVtb3ZlZCwgYmVjYXVzZSBCb290c3RyYXAgaGFzIGltcHJvdmVkXG4gICAgLy8gaXRzIENTU1xuICAgIGNvbnN0IG9mZmNhbnZhc1RyYW5zaXRpb24kID0gbmdiUnVuVHJhbnNpdGlvbih0aGlzLl96b25lLCB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCAoZWxlbWVudCkgPT4ge1xuICAgICAgbmF0aXZlRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7XG4gICAgICByZXR1cm4gKCkgPT4gZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgfSwgY29udGV4dCk7XG5cbiAgICBvZmZjYW52YXNUcmFuc2l0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5oaWRkZW4ubmV4dCgpO1xuICAgICAgdGhpcy5oaWRkZW4uY29tcGxldGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2Rpc2FibGVFdmVudEhhbmRsaW5nKCk7XG4gICAgdGhpcy5fcmVzdG9yZUZvY3VzKCk7XG5cbiAgICByZXR1cm4gb2ZmY2FudmFzVHJhbnNpdGlvbiQ7XG4gIH1cblxuICBwcml2YXRlIF9zaG93KCkge1xuICAgIGNvbnN0IGNvbnRleHQ6IE5nYlRyYW5zaXRpb25PcHRpb25zPGFueT4gPSB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZSd9O1xuXG4gICAgLy8gVE9ETyB3aGVuIHdlIHRhcmdldCBCb290c3RyYXAgNS4yKywgdGhlIHN0eWxlLnZpc2liaWxpdHkgaGFuZGxpbmcgY2FuIGJlIHJlbW92ZWQsIGJlY2F1c2UgQm9vdHN0cmFwIGhhcyBpbXByb3ZlZFxuICAgIC8vIGl0cyBDU1NcbiAgICBjb25zdCBvZmZjYW52YXNUcmFuc2l0aW9uJCA9XG4gICAgICAgIG5nYlJ1blRyYW5zaXRpb24odGhpcy5fem9uZSwgdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCwgKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBhbmltYXRpb246IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICByZWZsb3coZWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfSwgY29udGV4dCk7XG5cbiAgICBvZmZjYW52YXNUcmFuc2l0aW9uJC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5zaG93bi5uZXh0KCk7XG4gICAgICB0aGlzLnNob3duLmNvbXBsZXRlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9lbmFibGVFdmVudEhhbmRsaW5nKCk7XG4gICAgdGhpcy5fc2V0Rm9jdXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2VuYWJsZUV2ZW50SGFuZGxpbmcoKSB7XG4gICAgY29uc3Qge25hdGl2ZUVsZW1lbnR9ID0gdGhpcy5fZWxSZWY7XG4gICAgdGhpcy5fem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4obmF0aXZlRWxlbWVudCwgJ2tleWRvd24nKVxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICB0YWtlVW50aWwodGhpcy5fY2xvc2VkJCksXG4gICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuICAgICAgICAgICAgICBmaWx0ZXIoZSA9PiBlLndoaWNoID09PSBLZXkuRXNjYXBlKSlcbiAgICAgICAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmtleWJvYXJkKSB7XG4gICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFldmVudC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl96b25lLnJ1bigoKSA9PiB0aGlzLmRpc21pc3MoT2ZmY2FudmFzRGlzbWlzc1JlYXNvbnMuRVNDKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Rpc2FibGVFdmVudEhhbmRsaW5nKCkgeyB0aGlzLl9jbG9zZWQkLm5leHQoKTsgfVxuXG4gIHByaXZhdGUgX3NldEZvY3VzKCkge1xuICAgIGNvbnN0IHtuYXRpdmVFbGVtZW50fSA9IHRoaXMuX2VsUmVmO1xuICAgIGlmICghbmF0aXZlRWxlbWVudC5jb250YWlucyhkb2N1bWVudC5hY3RpdmVFbGVtZW50KSkge1xuICAgICAgY29uc3QgYXV0b0ZvY3VzYWJsZSA9IG5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcihgW25nYkF1dG9mb2N1c11gKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IGZpcnN0Rm9jdXNhYmxlID0gZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyhuYXRpdmVFbGVtZW50KVswXTtcblxuICAgICAgY29uc3QgZWxlbWVudFRvRm9jdXMgPSBhdXRvRm9jdXNhYmxlIHx8IGZpcnN0Rm9jdXNhYmxlIHx8IG5hdGl2ZUVsZW1lbnQ7XG4gICAgICBlbGVtZW50VG9Gb2N1cy5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Jlc3RvcmVGb2N1cygpIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBlbFdpdGhGb2N1cyA9IHRoaXMuX2VsV2l0aEZvY3VzO1xuXG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzO1xuICAgIGlmIChlbFdpdGhGb2N1cyAmJiBlbFdpdGhGb2N1c1snZm9jdXMnXSAmJiBib2R5LmNvbnRhaW5zKGVsV2l0aEZvY3VzKSkge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBlbFdpdGhGb2N1cztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBib2R5O1xuICAgIH1cbiAgICB0aGlzLl96b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gZWxlbWVudFRvRm9jdXMuZm9jdXMoKSk7XG4gICAgICB0aGlzLl9lbFdpdGhGb2N1cyA9IG51bGw7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==