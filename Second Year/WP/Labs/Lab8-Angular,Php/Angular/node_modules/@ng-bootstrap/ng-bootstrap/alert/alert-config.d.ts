import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [NgbAlert](#/components/alert/api#NgbAlert) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all alerts used in the application.
 */
export declare class NgbAlertConfig {
    private _ngbConfig;
    dismissible: boolean;
    type: string;
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbAlertConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbAlertConfig>;
}
