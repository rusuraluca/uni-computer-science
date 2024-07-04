import { NgbDateStruct } from '../ngb-date-struct';
import { NgbDateNativeAdapter } from './ngb-date-native-adapter';
import * as i0 from "@angular/core";
/**
 * Same as [`NgbDateNativeAdapter`](#/components/datepicker/api#NgbDateNativeAdapter), but with UTC dates.
 *
 * @since 3.2.0
 */
export declare class NgbDateNativeUTCAdapter extends NgbDateNativeAdapter {
    protected _fromNativeDate(date: Date): NgbDateStruct;
    protected _toNativeDate(date: NgbDateStruct): Date;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbDateNativeUTCAdapter, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbDateNativeUTCAdapter>;
}
