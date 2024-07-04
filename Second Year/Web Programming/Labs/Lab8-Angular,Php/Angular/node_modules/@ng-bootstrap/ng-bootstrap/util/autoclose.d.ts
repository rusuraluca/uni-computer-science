import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
export declare const enum SOURCE {
    ESCAPE = 0,
    CLICK = 1
}
export declare function ngbAutoClose(zone: NgZone, document: any, type: boolean | 'inside' | 'outside', close: (source: SOURCE) => void, closed$: Observable<any>, insideElements: HTMLElement[], ignoreElements?: HTMLElement[], insideSelector?: string): void;
