import { PlacementArray } from '../util/positioning';
import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbPopover`](#/components/popover/api#NgbPopover) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
export declare class NgbPopoverConfig {
    private _ngbConfig;
    autoClose: boolean | 'inside' | 'outside';
    placement: PlacementArray;
    triggers: string;
    container: string;
    disablePopover: boolean;
    popoverClass: string;
    openDelay: number;
    closeDelay: number;
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPopoverConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbPopoverConfig>;
}
