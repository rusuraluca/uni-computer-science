import { NgbDate } from '../ngb-date';
/**
 * Returns the equivalent JS date value for a give input Buddhist date.
 * `date` is an Buddhist date to be converted to Gregorian.
 */
export declare function toGregorian(date: NgbDate): Date;
/**
 * Returns the equivalent Buddhist date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to Buddhist.
 * utc to local
 */
export declare function fromGregorian(gdate: Date): NgbDate;
