import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbNav`](#/components/nav/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 *
 * @since 5.2.0
 */
export declare class NgbNavConfig {
    private _ngbConfig;
    destroyOnHide: boolean;
    orientation: 'horizontal' | 'vertical';
    roles: 'tablist' | false;
    keyboard: boolean | 'changeWithArrows';
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbNavConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbNavConfig>;
}
