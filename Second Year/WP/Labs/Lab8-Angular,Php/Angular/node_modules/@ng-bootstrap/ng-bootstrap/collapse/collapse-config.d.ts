import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [NgbCollapse](#/components/collapse/api#NgbCollapse) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all collapses used in the application.
 */
export declare class NgbCollapseConfig {
    private _ngbConfig;
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCollapseConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCollapseConfig>;
}
