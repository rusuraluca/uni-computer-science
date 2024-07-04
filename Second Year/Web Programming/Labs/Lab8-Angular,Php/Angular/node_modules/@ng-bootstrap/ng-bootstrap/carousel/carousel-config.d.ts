import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [NgbCarousel](#/components/carousel/api#NgbCarousel) component.
 *
 * You can inject this service, typically in your root component, and customize its properties
 * to provide default values for all carousels used in the application.
 */
export declare class NgbCarouselConfig {
    private _ngbConfig;
    interval: number;
    wrap: boolean;
    keyboard: boolean;
    pauseOnHover: boolean;
    pauseOnFocus: boolean;
    showNavigationArrows: boolean;
    showNavigationIndicators: boolean;
    private _animation;
    constructor(_ngbConfig: NgbConfig);
    get animation(): boolean;
    set animation(animation: boolean);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbCarouselConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbCarouselConfig>;
}
