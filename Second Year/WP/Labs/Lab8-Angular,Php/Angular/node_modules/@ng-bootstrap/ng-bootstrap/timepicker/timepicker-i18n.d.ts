import * as i0 from "@angular/core";
export declare function NGB_TIMEPICKER_I18N_FACTORY(locale: any): NgbTimepickerI18nDefault;
/**
 * Type of the service supplying day periods (for example, 'AM' and 'PM') to NgbTimepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 */
export declare abstract class NgbTimepickerI18n {
    /**
     * Returns the name for the period before midday.
     */
    abstract getMorningPeriod(): string;
    /**
     * Returns the name for the period after midday.
     */
    abstract getAfternoonPeriod(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbTimepickerI18n, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbTimepickerI18n>;
}
export declare class NgbTimepickerI18nDefault extends NgbTimepickerI18n {
    private _periods;
    constructor(locale: string);
    getMorningPeriod(): string;
    getAfternoonPeriod(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbTimepickerI18nDefault, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbTimepickerI18nDefault>;
}
