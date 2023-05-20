import { InjectionToken, OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
export declare type ARIA_LIVE_DELAY_TYPE = number | null;
export declare const ARIA_LIVE_DELAY: InjectionToken<ARIA_LIVE_DELAY_TYPE>;
export declare function ARIA_LIVE_DELAY_FACTORY(): number;
export declare class Live implements OnDestroy {
    private _document;
    private _delay;
    constructor(_document: any, _delay: any);
    ngOnDestroy(): void;
    say(message: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Live, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<Live>;
}
