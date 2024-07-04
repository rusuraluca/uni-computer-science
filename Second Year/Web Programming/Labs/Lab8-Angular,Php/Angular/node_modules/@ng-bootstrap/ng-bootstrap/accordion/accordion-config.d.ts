import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [NgbAccordion](#/components/accordion/api#NgbAccordion) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all accordions used in the application.
 */
export declare class NgbAccordionConfig {
    private _ngbConfig;
    closeOthers: boolean;
    type: string;
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbAccordionConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbAccordionConfig>;
}
