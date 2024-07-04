import { Observable } from 'rxjs';
import { Renderer2 } from '@angular/core';
export declare class Trigger {
    open: string;
    close?: string | undefined;
    constructor(open: string, close?: string | undefined);
    isManual(): boolean;
}
export declare function parseTriggers(triggers: string, aliases?: {
    hover: string[];
    focus: string[];
}): Trigger[];
export declare function observeTriggers(renderer: Renderer2, nativeElement: HTMLElement, triggers: Trigger[], isOpenedFn: () => boolean): Observable<boolean>;
export declare function triggerDelay(openDelay: number, closeDelay: number, isOpenedFn: () => boolean): (input$: Observable<boolean>) => Observable<boolean>;
export declare function listenToTriggers(renderer: Renderer2, nativeElement: HTMLElement, triggers: string, isOpenedFn: () => boolean, openFn: () => void, closeFn: () => void, openDelay?: number, closeDelay?: number): () => void;
