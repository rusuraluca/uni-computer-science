import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs/operators';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import * as i0 from "@angular/core";
export class NgbOffcanvasBackdrop {
    constructor(_el, _zone) {
        this._el = _el;
        this._zone = _zone;
        this.dismissEvent = new EventEmitter();
    }
    ngOnInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            ngbRunTransition(this._zone, this._el.nativeElement, (element, animation) => {
                if (animation) {
                    reflow(element);
                }
                element.classList.add('show');
            }, { animation: this.animation, runningTransition: 'continue' });
        });
    }
    hide() {
        return ngbRunTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), { animation: this.animation, runningTransition: 'stop' });
    }
    dismiss() { this.dismissEvent.emit(OffcanvasDismissReasons.BACKDROP_CLICK); }
}
NgbOffcanvasBackdrop.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasBackdrop, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbOffcanvasBackdrop.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbOffcanvasBackdrop, selector: "ngb-offcanvas-backdrop", inputs: { animation: "animation", backdropClass: "backdropClass" }, outputs: { dismissEvent: "dismiss" }, host: { listeners: { "mousedown": "dismiss()" }, properties: { "class": "\"offcanvas-backdrop\" + (backdropClass ? \" \" + backdropClass : \"\")", "class.show": "!animation", "class.fade": "animation" } }, ngImport: i0, template: '', isInline: true, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbOffcanvasBackdrop, decorators: [{
            type: Component,
            args: [{
                    selector: 'ngb-offcanvas-backdrop',
                    encapsulation: ViewEncapsulation.None,
                    template: '',
                    host: {
                        '[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
                        '[class.show]': '!animation',
                        '[class.fade]': 'animation',
                        '(mousedown)': 'dismiss()'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }]; }, propDecorators: { animation: [{
                type: Input
            }], backdropClass: [{
                type: Input
            }], dismissEvent: [{
                type: Output,
                args: ['dismiss']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmY2FudmFzLWJhY2tkcm9wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL29mZmNhbnZhcy9vZmZjYW52YXMtYmFja2Ryb3AudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBYyxZQUFZLEVBQUUsS0FBSyxFQUFrQixNQUFNLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHcEgsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sNkJBQTZCLENBQUM7O0FBYXBFLE1BQU0sT0FBTyxvQkFBb0I7SUFNL0IsWUFBb0IsR0FBNEIsRUFBVSxLQUFhO1FBQW5ELFFBQUcsR0FBSCxHQUFHLENBQXlCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUZwRCxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFFcUIsQ0FBQztJQUUzRSxRQUFRO1FBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDOUQsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQW9CLEVBQUUsU0FBa0IsRUFBRSxFQUFFO2dCQUNoRyxJQUFJLFNBQVMsRUFBRTtvQkFDYixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ2pCO2dCQUNELE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hDLENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSTtRQUNGLE9BQU8sZ0JBQWdCLENBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUM3RSxFQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVELE9BQU8sS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7O2lIQXpCbEUsb0JBQW9CO3FHQUFwQixvQkFBb0Isc1hBUnJCLEVBQUU7MkZBUUQsb0JBQW9CO2tCQVhoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLG1FQUFtRTt3QkFDOUUsY0FBYyxFQUFFLFlBQVk7d0JBQzVCLGNBQWMsRUFBRSxXQUFXO3dCQUMzQixhQUFhLEVBQUUsV0FBVztxQkFDM0I7aUJBQ0Y7c0hBRVUsU0FBUztzQkFBakIsS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUVhLFlBQVk7c0JBQTlCLE1BQU07dUJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtuZ2JSdW5UcmFuc2l0aW9ufSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge3JlZmxvd30gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7T2ZmY2FudmFzRGlzbWlzc1JlYXNvbnN9IGZyb20gJy4vb2ZmY2FudmFzLWRpc21pc3MtcmVhc29ucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1vZmZjYW52YXMtYmFja2Ryb3AnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZTogJycsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6ICdcIm9mZmNhbnZhcy1iYWNrZHJvcFwiICsgKGJhY2tkcm9wQ2xhc3MgPyBcIiBcIiArIGJhY2tkcm9wQ2xhc3MgOiBcIlwiKScsXG4gICAgJ1tjbGFzcy5zaG93XSc6ICchYW5pbWF0aW9uJyxcbiAgICAnW2NsYXNzLmZhZGVdJzogJ2FuaW1hdGlvbicsXG4gICAgJyhtb3VzZWRvd24pJzogJ2Rpc21pc3MoKSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JPZmZjYW52YXNCYWNrZHJvcCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xuXG4gIEBPdXRwdXQoJ2Rpc21pc3MnKSBkaXNtaXNzRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWw6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LCBwcml2YXRlIF96b25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fem9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX3pvbmUsIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsIChlbGVtZW50OiBIVE1MRWxlbWVudCwgYW5pbWF0aW9uOiBib29sZWFuKSA9PiB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICByZWZsb3coZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzaG93Jyk7XG4gICAgICB9LCB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdjb250aW51ZSd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGhpZGUoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5nYlJ1blRyYW5zaXRpb24oXG4gICAgICAgIHRoaXMuX3pvbmUsIHRoaXMuX2VsLm5hdGl2ZUVsZW1lbnQsICh7Y2xhc3NMaXN0fSkgPT4gY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpLFxuICAgICAgICB7YW5pbWF0aW9uOiB0aGlzLmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdzdG9wJ30pO1xuICB9XG5cbiAgZGlzbWlzcygpIHsgdGhpcy5kaXNtaXNzRXZlbnQuZW1pdChPZmZjYW52YXNEaXNtaXNzUmVhc29ucy5CQUNLRFJPUF9DTElDSyk7IH1cbn1cbiJdfQ==