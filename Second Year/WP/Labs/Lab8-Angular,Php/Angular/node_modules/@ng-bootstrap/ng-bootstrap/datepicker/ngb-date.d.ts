import { NgbDateStruct } from './ngb-date-struct';
/**
 * A simple class that represents a date that datepicker also uses internally.
 *
 * It is the implementation of the `NgbDateStruct` interface that adds some convenience methods,
 * like `.equals()`, `.before()`, etc.
 *
 * All datepicker APIs consume `NgbDateStruct`, but return `NgbDate`.
 *
 * In many cases it is simpler to manipulate these objects together with
 * [`NgbCalendar`](#/components/datepicker/api#NgbCalendar) than native JS Dates.
 *
 * See the [date format overview](#/components/datepicker/overview#date-model) for more details.
 *
 * @since 3.0.0
 */
export declare class NgbDate implements NgbDateStruct {
    /**
     * The year, for example 2016
     */
    year: number;
    /**
     * The month, for example 1=Jan ... 12=Dec as in ISO 8601
     */
    month: number;
    /**
     * The day of month, starting with 1
     */
    day: number;
    /**
     * A **static method** that creates a new date object from the `NgbDateStruct`,
     *
     * ex. `NgbDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `NgbDate` type, the method will return the same object.
     */
    static from(date?: NgbDateStruct | null): NgbDate | null;
    constructor(year: number, month: number, day: number);
    /**
     * Checks if the current date is equal to another date.
     */
    equals(other?: NgbDateStruct | null): boolean;
    /**
     * Checks if the current date is before another date.
     */
    before(other?: NgbDateStruct | null): boolean;
    /**
     * Checks if the current date is after another date.
     */
    after(other?: NgbDateStruct | null): boolean;
}
