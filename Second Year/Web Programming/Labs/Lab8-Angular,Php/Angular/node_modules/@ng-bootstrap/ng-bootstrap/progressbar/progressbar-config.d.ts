import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbProgressbar`](#/components/progressbar/api#NgbProgressbar) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
export declare class NgbProgressbarConfig {
    max: number;
    animated: boolean;
    striped: boolean;
    textType: string;
    type: string;
    showValue: boolean;
    height: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbProgressbarConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbProgressbarConfig>;
}
