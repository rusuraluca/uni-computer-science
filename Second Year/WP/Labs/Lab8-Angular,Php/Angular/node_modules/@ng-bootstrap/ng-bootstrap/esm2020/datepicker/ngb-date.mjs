import { isInteger } from '../util/util';
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
export class NgbDate {
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * A **static method** that creates a new date object from the `NgbDateStruct`,
     *
     * ex. `NgbDate.from({year: 2000, month: 5, day: 1})`.
     *
     * If the `date` is already of `NgbDate` type, the method will return the same object.
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    /**
     * Checks if the current date is equal to another date.
     */
    equals(other) {
        return other != null && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if the current date is before another date.
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if the current date is after another date.
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZGF0ZXBpY2tlci9uZ2ItZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXZDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxPQUFPLE9BQU87SUE4QmxCLFlBQVksSUFBWSxFQUFFLEtBQWEsRUFBRSxHQUFXO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLElBQUksQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxJQUFJLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sSUFBSSxDQUFDO0lBQzlDLENBQUM7SUFsQkQ7Ozs7OztPQU1HO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUEyQjtRQUNyQyxJQUFJLElBQUksWUFBWSxPQUFPLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDcEUsQ0FBQztJQVFEOztPQUVHO0lBQ0gsTUFBTSxDQUFDLEtBQTRCO1FBQ2pDLE9BQU8sS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsQ0FBQztJQUMzRyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsS0FBNEI7UUFDakMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksRUFBRTtZQUM1QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDOUIsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO2FBQzlEO2lCQUFNO2dCQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2pDO1NBQ0Y7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLEtBQTRCO1FBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUU7WUFDNUIsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQzlCLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQzthQUM5RDtpQkFBTTtnQkFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNqQztTQUNGO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztTQUMvQjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHtpc0ludGVnZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbi8qKlxuICogQSBzaW1wbGUgY2xhc3MgdGhhdCByZXByZXNlbnRzIGEgZGF0ZSB0aGF0IGRhdGVwaWNrZXIgYWxzbyB1c2VzIGludGVybmFsbHkuXG4gKlxuICogSXQgaXMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgTmdiRGF0ZVN0cnVjdGAgaW50ZXJmYWNlIHRoYXQgYWRkcyBzb21lIGNvbnZlbmllbmNlIG1ldGhvZHMsXG4gKiBsaWtlIGAuZXF1YWxzKClgLCBgLmJlZm9yZSgpYCwgZXRjLlxuICpcbiAqIEFsbCBkYXRlcGlja2VyIEFQSXMgY29uc3VtZSBgTmdiRGF0ZVN0cnVjdGAsIGJ1dCByZXR1cm4gYE5nYkRhdGVgLlxuICpcbiAqIEluIG1hbnkgY2FzZXMgaXQgaXMgc2ltcGxlciB0byBtYW5pcHVsYXRlIHRoZXNlIG9iamVjdHMgdG9nZXRoZXIgd2l0aFxuICogW2BOZ2JDYWxlbmRhcmBdKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL2FwaSNOZ2JDYWxlbmRhcikgdGhhbiBuYXRpdmUgSlMgRGF0ZXMuXG4gKlxuICogU2VlIHRoZSBbZGF0ZSBmb3JtYXQgb3ZlcnZpZXddKCMvY29tcG9uZW50cy9kYXRlcGlja2VyL292ZXJ2aWV3I2RhdGUtbW9kZWwpIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHNpbmNlIDMuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ2JEYXRlIGltcGxlbWVudHMgTmdiRGF0ZVN0cnVjdCB7XG4gIC8qKlxuICAgKiBUaGUgeWVhciwgZm9yIGV4YW1wbGUgMjAxNlxuICAgKi9cbiAgeWVhcjogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbW9udGgsIGZvciBleGFtcGxlIDE9SmFuIC4uLiAxMj1EZWMgYXMgaW4gSVNPIDg2MDFcbiAgICovXG4gIG1vbnRoOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBkYXkgb2YgbW9udGgsIHN0YXJ0aW5nIHdpdGggMVxuICAgKi9cbiAgZGF5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEEgKipzdGF0aWMgbWV0aG9kKiogdGhhdCBjcmVhdGVzIGEgbmV3IGRhdGUgb2JqZWN0IGZyb20gdGhlIGBOZ2JEYXRlU3RydWN0YCxcbiAgICpcbiAgICogZXguIGBOZ2JEYXRlLmZyb20oe3llYXI6IDIwMDAsIG1vbnRoOiA1LCBkYXk6IDF9KWAuXG4gICAqXG4gICAqIElmIHRoZSBgZGF0ZWAgaXMgYWxyZWFkeSBvZiBgTmdiRGF0ZWAgdHlwZSwgdGhlIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgc2FtZSBvYmplY3QuXG4gICAqL1xuICBzdGF0aWMgZnJvbShkYXRlPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiBOZ2JEYXRlIHwgbnVsbCB7XG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBOZ2JEYXRlKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheTogbnVtYmVyKSB7XG4gICAgdGhpcy55ZWFyID0gaXNJbnRlZ2VyKHllYXIpID8geWVhciA6IDxhbnk+bnVsbDtcbiAgICB0aGlzLm1vbnRoID0gaXNJbnRlZ2VyKG1vbnRoKSA/IG1vbnRoIDogPGFueT5udWxsO1xuICAgIHRoaXMuZGF5ID0gaXNJbnRlZ2VyKGRheSkgPyBkYXkgOiA8YW55Pm51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IGRhdGUgaXMgZXF1YWwgdG8gYW5vdGhlciBkYXRlLlxuICAgKi9cbiAgZXF1YWxzKG90aGVyPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiBib29sZWFuIHtcbiAgICByZXR1cm4gb3RoZXIgIT0gbnVsbCAmJiB0aGlzLnllYXIgPT09IG90aGVyLnllYXIgJiYgdGhpcy5tb250aCA9PT0gb3RoZXIubW9udGggJiYgdGhpcy5kYXkgPT09IG90aGVyLmRheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZGF0ZSBpcyBiZWZvcmUgYW5vdGhlciBkYXRlLlxuICAgKi9cbiAgYmVmb3JlKG90aGVyPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwpOiBib29sZWFuIHtcbiAgICBpZiAoIW90aGVyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMueWVhciA9PT0gb3RoZXIueWVhcikge1xuICAgICAgaWYgKHRoaXMubW9udGggPT09IG90aGVyLm1vbnRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRheSA9PT0gb3RoZXIuZGF5ID8gZmFsc2UgOiB0aGlzLmRheSA8IG90aGVyLmRheTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoIDwgb3RoZXIubW9udGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnllYXIgPCBvdGhlci55ZWFyO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgZGF0ZSBpcyBhZnRlciBhbm90aGVyIGRhdGUuXG4gICAqL1xuICBhZnRlcihvdGhlcj86IE5nYkRhdGVTdHJ1Y3QgfCBudWxsKTogYm9vbGVhbiB7XG4gICAgaWYgKCFvdGhlcikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGhpcy55ZWFyID09PSBvdGhlci55ZWFyKSB7XG4gICAgICBpZiAodGhpcy5tb250aCA9PT0gb3RoZXIubW9udGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF5ID09PSBvdGhlci5kYXkgPyBmYWxzZSA6IHRoaXMuZGF5ID4gb3RoZXIuZGF5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGggPiBvdGhlci5tb250aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMueWVhciA+IG90aGVyLnllYXI7XG4gICAgfVxuICB9XG59XG4iXX0=