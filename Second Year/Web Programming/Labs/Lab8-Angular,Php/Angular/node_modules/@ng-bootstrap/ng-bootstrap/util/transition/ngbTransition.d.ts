import { NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';
export declare type NgbTransitionStartFn<T = any> = (element: HTMLElement, animation: boolean, context: T) => NgbTransitionEndFn | void;
export declare type NgbTransitionEndFn = () => void;
export interface NgbTransitionOptions<T> {
    animation: boolean;
    runningTransition: 'continue' | 'stop';
    context?: T;
}
export interface NgbTransitionCtx<T> {
    transition$: Subject<any>;
    complete: () => void;
    context: T;
}
export declare const ngbRunTransition: <T>(zone: NgZone, element: HTMLElement, startFn: NgbTransitionStartFn<T>, options: NgbTransitionOptions<T>) => Observable<void>;
export declare const ngbCompleteTransition: (element: HTMLElement) => void;
