import { ElementRef, EventEmitter, NgZone, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class NgbOffcanvasBackdrop implements OnInit {
    private _el;
    private _zone;
    animation: boolean;
    backdropClass: string;
    dismissEvent: EventEmitter<any>;
    constructor(_el: ElementRef<HTMLElement>, _zone: NgZone);
    ngOnInit(): void;
    hide(): Observable<void>;
    dismiss(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbOffcanvasBackdrop, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbOffcanvasBackdrop, "ngb-offcanvas-backdrop", never, { "animation": "animation"; "backdropClass": "backdropClass"; }, { "dismissEvent": "dismiss"; }, never, never>;
}
