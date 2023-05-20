import { NgbDateStruct } from '../ngb-date-struct';
import * as i0 from "@angular/core";
export declare function NGB_DATEPICKER_DATE_ADAPTER_FACTORY(): NgbDateStructAdapter;
/**
 * An abstract service that does the conversion between the internal datepicker `NgbDateStruct` model and
 * any provided user date model `D`, ex. a string, a native date, etc.
 *
 * The adapter is used **only** for conversion when binding datepicker to a form control,
 * ex. `[(ngModel)]="userDateModel"`. Here `userDateModel` can be of any type.
 *
 * The default datepicker implementation assumes we use `NgbDateStruct` as a user model.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details
 * and the [custom adapter demo](#/components/datepicker/examples#adapter) for an example.
 */
export declare abstract class NgbDateAdapter<D> {
    /**
     * Converts a user-model date of type `D` to an `NgbDateStruct` for internal use.
     */
    abstract fromModel(value: D | null): NgbDateStruct | null;
    /**
     * Converts an internal `NgbDateStruct` date to a user-model date of type `D`.
     */
    abstract toModel(date: NgbDateStruct | null): D | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDateAdapter<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDateAdapter<any>>;
}
export declare class NgbDateStructAdapter extends NgbDateAdapter<NgbDateStruct> {
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    fromModel(date: NgbDateStruct | null): NgbDateStruct | null;
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    toModel(date: NgbDateStruct | null): NgbDateStruct | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDateStructAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDateStructAdapter>;
}
