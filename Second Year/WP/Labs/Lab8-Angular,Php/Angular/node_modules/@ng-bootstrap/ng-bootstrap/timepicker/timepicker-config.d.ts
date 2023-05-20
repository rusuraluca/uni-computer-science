import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbTimepicker`](#/components/timepicker/api#NgbTimepicker) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
export declare class NgbTimepickerConfig {
    meridian: boolean;
    spinners: boolean;
    seconds: boolean;
    hourStep: number;
    minuteStep: number;
    secondStep: number;
    disabled: boolean;
    readonlyInputs: boolean;
    size: 'small' | 'medium' | 'large';
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbTimepickerConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbTimepickerConfig>;
}
