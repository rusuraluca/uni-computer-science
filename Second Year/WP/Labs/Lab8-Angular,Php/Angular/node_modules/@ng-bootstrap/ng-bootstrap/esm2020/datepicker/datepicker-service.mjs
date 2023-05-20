import { NgbDate } from './ngb-date';
import { Injectable } from '@angular/core';
import { isInteger, toInteger } from '../util/util';
import { Subject } from 'rxjs';
import { buildMonths, checkDateInRange, checkMinBeforeMax, generateSelectBoxMonths, generateSelectBoxYears, isChangedDate, isChangedMonth, isDateSelectable, nextMonthDisabled, prevMonthDisabled } from './datepicker-tools';
import { filter } from 'rxjs/operators';
import { TranslationWidth } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "./ngb-calendar";
import * as i2 from "./datepicker-i18n";
export class NgbDatepickerService {
    constructor(_calendar, _i18n) {
        this._calendar = _calendar;
        this._i18n = _i18n;
        this._VALIDATORS = {
            dayTemplateData: (dayTemplateData) => {
                if (this._state.dayTemplateData !== dayTemplateData) {
                    return { dayTemplateData };
                }
            },
            displayMonths: (displayMonths) => {
                displayMonths = toInteger(displayMonths);
                if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
                    return { displayMonths };
                }
            },
            disabled: (disabled) => {
                if (this._state.disabled !== disabled) {
                    return { disabled };
                }
            },
            firstDayOfWeek: (firstDayOfWeek) => {
                firstDayOfWeek = toInteger(firstDayOfWeek);
                if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
                    return { firstDayOfWeek };
                }
            },
            focusVisible: (focusVisible) => {
                if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
                    return { focusVisible };
                }
            },
            markDisabled: (markDisabled) => {
                if (this._state.markDisabled !== markDisabled) {
                    return { markDisabled };
                }
            },
            maxDate: (date) => {
                const maxDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.maxDate, maxDate)) {
                    return { maxDate };
                }
            },
            minDate: (date) => {
                const minDate = this.toValidDate(date, null);
                if (isChangedDate(this._state.minDate, minDate)) {
                    return { minDate };
                }
            },
            navigation: (navigation) => {
                if (this._state.navigation !== navigation) {
                    return { navigation };
                }
            },
            outsideDays: (outsideDays) => {
                if (this._state.outsideDays !== outsideDays) {
                    return { outsideDays };
                }
            },
            weekdays: (weekdays) => {
                const weekdayWidth = weekdays === true || weekdays === false ? TranslationWidth.Short : weekdays;
                const weekdaysVisible = weekdays === true || weekdays === false ? weekdays : true;
                if (this._state.weekdayWidth !== weekdayWidth || this._state.weekdaysVisible !== weekdaysVisible) {
                    return { weekdayWidth, weekdaysVisible };
                }
            }
        };
        this._model$ = new Subject();
        this._dateSelect$ = new Subject();
        this._state = {
            dayTemplateData: null,
            markDisabled: null,
            maxDate: null,
            minDate: null,
            disabled: false,
            displayMonths: 1,
            firstDate: null,
            firstDayOfWeek: 1,
            lastDate: null,
            focusDate: null,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectedDate: null,
            selectBoxes: { years: [], months: [] },
            weekdayWidth: TranslationWidth.Short,
            weekdaysVisible: true
        };
    }
    get model$() { return this._model$.pipe(filter(model => model.months.length > 0)); }
    get dateSelect$() { return this._dateSelect$.pipe(filter(date => date !== null)); }
    set(options) {
        let patch = Object.keys(options)
            .map(key => this._VALIDATORS[key](options[key]))
            .reduce((obj, part) => ({ ...obj, ...part }), {});
        if (Object.keys(patch).length > 0) {
            this._nextState(patch);
        }
    }
    focus(date) {
        const focusedDate = this.toValidDate(date, null);
        if (focusedDate != null && !this._state.disabled && isChangedDate(this._state.focusDate, focusedDate)) {
            this._nextState({ focusDate: date });
        }
    }
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    open(date) {
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (firstDate != null && !this._state.disabled &&
            (!this._state.firstDate || isChangedMonth(this._state.firstDate, firstDate))) {
            this._nextState({ firstDate });
        }
    }
    select(date, options = {}) {
        const selectedDate = this.toValidDate(date, null);
        if (selectedDate != null && !this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._dateSelect$.next(selectedDate);
            }
        }
    }
    toValidDate(date, defaultValue) {
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    getMonth(struct) {
        for (let month of this._state.months) {
            if (struct.month === month.number && struct.year === month.year) {
                return month;
            }
        }
        throw new Error(`month ${struct.month} of year ${struct.year} not found`);
    }
    _nextState(patch) {
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex =
                        !disabled && focusDate && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden = outsideDays === 'hidden' || outsideDays === 'collapsed' ||
                            (displayMonths > 1 && day.date.after(months[0].firstDate) &&
                                day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    _updateState(patch) {
        // patching fields
        const state = Object.assign({}, this._state, patch);
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // terminate early if only focus visibility was changed
        if ('focusVisible' in patch) {
            return state;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 && state.focusDate && !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            const forceRebuild = 'dayTemplateData' in patch || 'firstDayOfWeek' in patch || 'markDisabled' in patch ||
                'minDate' in patch || 'maxDate' in patch || 'disabled' in patch || 'outsideDays' in patch ||
                'weekdaysVisible' in patch;
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months[0].firstDate;
            state.lastDate = months[months.length - 1].lastDate;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (!state.focusDate || state.focusDate.before(state.firstDate) || state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            // adjusting months/years for the select box navigation
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months =
                        generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
}
NgbDatepickerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService, deps: [{ token: i1.NgbCalendar }, { token: i2.NgbDatepickerI18n }], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgbCalendar }, { type: i2.NgbDatepickerI18n }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFHbkMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUNsRCxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFDTCxXQUFXLEVBQ1gsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLGFBQWEsRUFDYixjQUFjLEVBQ2QsZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixpQkFBaUIsRUFDbEIsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFdEMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7QUFrQmpELE1BQU0sT0FBTyxvQkFBb0I7SUEyRy9CLFlBQW9CLFNBQXNCLEVBQVUsS0FBd0I7UUFBeEQsY0FBUyxHQUFULFNBQVMsQ0FBYTtRQUFVLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBMUdwRSxnQkFBVyxHQUNpRztZQUM5RyxlQUFlLEVBQUUsQ0FBQyxlQUFtQyxFQUFFLEVBQUU7Z0JBQ3ZELElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLEtBQUssZUFBZSxFQUFFO29CQUNuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLENBQUM7aUJBQzFCO1lBQ0gsQ0FBQztZQUNELGFBQWEsRUFBRSxDQUFDLGFBQXFCLEVBQUUsRUFBRTtnQkFDdkMsYUFBYSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMs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QUFTLElBQUksS0FBSyxJQUFJLFNBQVMsSUFBSSxLQUFLLElBQUksVUFBVSxJQUFJLEtBQUssQ0FBQyxFQUFFO2dCQUNwRyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekcsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDekc7U0FDRjtRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7aUhBOVNVLG9CQUFvQjtxSEFBcEIsb0JBQW9COzJGQUFwQixvQkFBb0I7a0JBRGhDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nYkNhbGVuZGFyfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge0RhdGVwaWNrZXJWaWV3TW9kZWwsIE5nYkRheVRlbXBsYXRlRGF0YSwgTmdiTWFya0Rpc2FibGVkfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc0ludGVnZXIsIHRvSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBidWlsZE1vbnRocyxcbiAgY2hlY2tEYXRlSW5SYW5nZSxcbiAgY2hlY2tNaW5CZWZvcmVNYXgsXG4gIGdlbmVyYXRlU2VsZWN0Qm94TW9udGhzLFxuICBnZW5lcmF0ZVNlbGVjdEJveFllYXJzLFxuICBpc0NoYW5nZWREYXRlLFxuICBpc0NoYW5nZWRNb250aCxcbiAgaXNEYXRlU2VsZWN0YWJsZSxcbiAgbmV4dE1vbnRoRGlzYWJsZWQsXG4gIHByZXZNb250aERpc2FibGVkXG59IGZyb20gJy4vZGF0ZXBpY2tlci10b29scyc7XG5cbmltcG9ydCB7ZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5pbXBvcnQge1RyYW5zbGF0aW9uV2lkdGh9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cblxuZXhwb3J0IHR5cGUgRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHMgPSBQYXJ0aWFsPHtcbiAgZGF5VGVtcGxhdGVEYXRhOiBOZ2JEYXlUZW1wbGF0ZURhdGEsXG4gIGRpc3BsYXlNb250aHM6IG51bWJlcixcbiAgZGlzYWJsZWQ6IGJvb2xlYW4sXG4gIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIsXG4gIGZvY3VzVmlzaWJsZTogYm9vbGVhbixcbiAgbWFya0Rpc2FibGVkOiBOZ2JNYXJrRGlzYWJsZWQsXG4gIG1heERhdGU6IE5nYkRhdGUgfCBudWxsLFxuICBtaW5EYXRlOiBOZ2JEYXRlIHwgbnVsbCxcbiAgbmF2aWdhdGlvbjogJ3NlbGVjdCcgfCAnYXJyb3dzJyB8ICdub25lJyxcbiAgb3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbicsXG4gIHdlZWtkYXlzOiBUcmFuc2xhdGlvbldpZHRoIHwgYm9vbGVhblxufT47XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyU2VydmljZSB7XG4gIHByaXZhdGUgX1ZBTElEQVRPUlM6XG4gICAgICB7W0sgaW4ga2V5b2YgRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHNdOiAodjogRGF0ZXBpY2tlclNlcnZpY2VJbnB1dHNbS10pID0+IFBhcnRpYWw8RGF0ZXBpY2tlclZpZXdNb2RlbD58IHZvaWR9ID0ge1xuICAgICAgICBkYXlUZW1wbGF0ZURhdGE6IChkYXlUZW1wbGF0ZURhdGE6IE5nYkRheVRlbXBsYXRlRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5kYXlUZW1wbGF0ZURhdGEgIT09IGRheVRlbXBsYXRlRGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHtkYXlUZW1wbGF0ZURhdGF9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlzcGxheU1vbnRoczogKGRpc3BsYXlNb250aHM6IG51bWJlcikgPT4ge1xuICAgICAgICAgIGRpc3BsYXlNb250aHMgPSB0b0ludGVnZXIoZGlzcGxheU1vbnRocyk7XG4gICAgICAgICAgaWYgKGlzSW50ZWdlcihkaXNwbGF5TW9udGhzKSAmJiBkaXNwbGF5TW9udGhzID4gMCAmJiB0aGlzLl9zdGF0ZS5kaXNwbGF5TW9udGhzICE9PSBkaXNwbGF5TW9udGhzKSB7XG4gICAgICAgICAgICByZXR1cm4ge2Rpc3BsYXlNb250aHN9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGlzYWJsZWQ6IChkaXNhYmxlZDogYm9vbGVhbikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5kaXNhYmxlZCAhPT0gZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7ZGlzYWJsZWR9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmlyc3REYXlPZldlZWs6IChmaXJzdERheU9mV2VlazogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgZmlyc3REYXlPZldlZWsgPSB0b0ludGVnZXIoZmlyc3REYXlPZldlZWspO1xuICAgICAgICAgIGlmIChpc0ludGVnZXIoZmlyc3REYXlPZldlZWspICYmIGZpcnN0RGF5T2ZXZWVrID49IDAgJiYgdGhpcy5fc3RhdGUuZmlyc3REYXlPZldlZWsgIT09IGZpcnN0RGF5T2ZXZWVrKSB7XG4gICAgICAgICAgICByZXR1cm4ge2ZpcnN0RGF5T2ZXZWVrfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvY3VzVmlzaWJsZTogKGZvY3VzVmlzaWJsZTogYm9vbGVhbikgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZS5mb2N1c1Zpc2libGUgIT09IGZvY3VzVmlzaWJsZSAmJiAhdGhpcy5fc3RhdGUuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7Zm9jdXNWaXNpYmxlfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1hcmtEaXNhYmxlZDogKG1hcmtEaXNhYmxlZDogTmdiTWFya0Rpc2FibGVkKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuX3N0YXRlLm1hcmtEaXNhYmxlZCAhPT0gbWFya0Rpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4ge21hcmtEaXNhYmxlZH07XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtYXhEYXRlOiAoZGF0ZTogTmdiRGF0ZSB8IG51bGwpID0+IHtcbiAgICAgICAgICBjb25zdCBtYXhEYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCBudWxsKTtcbiAgICAgICAgICBpZiAoaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5tYXhEYXRlLCBtYXhEYXRlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHttYXhEYXRlfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1pbkRhdGU6IChkYXRlOiBOZ2JEYXRlIHwgbnVsbCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1pbkRhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuICAgICAgICAgIGlmIChpc0NoYW5nZWREYXRlKHRoaXMuX3N0YXRlLm1pbkRhdGUsIG1pbkRhdGUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge21pbkRhdGV9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbmF2aWdhdGlvbjogKG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5fc3RhdGUubmF2aWdhdGlvbiAhPT0gbmF2aWdhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHtuYXZpZ2F0aW9ufTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG91dHNpZGVEYXlzOiAob3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbicpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5fc3RhdGUub3V0c2lkZURheXMgIT09IG91dHNpZGVEYXlzKSB7XG4gICAgICAgICAgICByZXR1cm4ge291dHNpZGVEYXlzfTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdlZWtkYXlzOiAod2Vla2RheXM6IGJvb2xlYW4gfCBUcmFuc2xhdGlvbldpZHRoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgd2Vla2RheVdpZHRoID0gd2Vla2RheXMgPT09IHRydWUgfHwgd2Vla2RheXMgPT09IGZhbHNlID8gVHJhbnNsYXRpb25XaWR0aC5TaG9ydCA6IHdlZWtkYXlzO1xuICAgICAgICAgIGNvbnN0IHdlZWtkYXlzVmlzaWJsZSA9IHdlZWtkYXlzID09PSB0cnVlIHx8IHdlZWtkYXlzID09PSBmYWxzZSA/IHdlZWtkYXlzIDogdHJ1ZTtcbiAgICAgICAgICBpZiAodGhpcy5fc3RhdGUud2Vla2RheVdpZHRoICE9PSB3ZWVrZGF5V2lkdGggfHwgdGhpcy5fc3RhdGUud2Vla2RheXNWaXNpYmxlICE9PSB3ZWVrZGF5c1Zpc2libGUpIHtcbiAgICAgICAgICAgIHJldHVybiB7d2Vla2RheVdpZHRoLCB3ZWVrZGF5c1Zpc2libGV9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICBwcml2YXRlIF9tb2RlbCQgPSBuZXcgU3ViamVjdDxEYXRlcGlja2VyVmlld01vZGVsPigpO1xuXG4gIHByaXZhdGUgX2RhdGVTZWxlY3QkID0gbmV3IFN1YmplY3Q8TmdiRGF0ZT4oKTtcblxuICBwcml2YXRlIF9zdGF0ZTogRGF0ZXBpY2tlclZpZXdNb2RlbCA9IHtcbiAgICBkYXlUZW1wbGF0ZURhdGE6IG51bGwsXG4gICAgbWFya0Rpc2FibGVkOiBudWxsLFxuICAgIG1heERhdGU6IG51bGwsXG4gICAgbWluRGF0ZTogbnVsbCxcbiAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgZGlzcGxheU1vbnRoczogMSxcbiAgICBmaXJzdERhdGU6IG51bGwsXG4gICAgZmlyc3REYXlPZldlZWs6IDEsXG4gICAgbGFzdERhdGU6IG51bGwsXG4gICAgZm9jdXNEYXRlOiBudWxsLFxuICAgIGZvY3VzVmlzaWJsZTogZmFsc2UsXG4gICAgbW9udGhzOiBbXSxcbiAgICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyxcbiAgICBvdXRzaWRlRGF5czogJ3Zpc2libGUnLFxuICAgIHByZXZEaXNhYmxlZDogZmFsc2UsXG4gICAgbmV4dERpc2FibGVkOiBmYWxzZSxcbiAgICBzZWxlY3RlZERhdGU6IG51bGwsXG4gICAgc2VsZWN0Qm94ZXM6IHt5ZWFyczogW10sIG1vbnRoczogW119LFxuICAgIHdlZWtkYXlXaWR0aDogVHJhbnNsYXRpb25XaWR0aC5TaG9ydCxcbiAgICB3ZWVrZGF5c1Zpc2libGU6IHRydWVcbiAgfTtcblxuICBnZXQgbW9kZWwkKCk6IE9ic2VydmFibGU8RGF0ZXBpY2tlclZpZXdNb2RlbD4geyByZXR1cm4gdGhpcy5fbW9kZWwkLnBpcGUoZmlsdGVyKG1vZGVsID0+IG1vZGVsLm1vbnRocy5sZW5ndGggPiAwKSk7IH1cblxuICBnZXQgZGF0ZVNlbGVjdCQoKTogT2JzZXJ2YWJsZTxOZ2JEYXRlPiB7IHJldHVybiB0aGlzLl9kYXRlU2VsZWN0JC5waXBlKGZpbHRlcihkYXRlID0+IGRhdGUgIT09IG51bGwpKTsgfVxuXG4gIHNldChvcHRpb25zOiBEYXRlcGlja2VyU2VydmljZUlucHV0cykge1xuICAgIGxldCBwYXRjaCA9IE9iamVjdC5rZXlzKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IHRoaXMuX1ZBTElEQVRPUlNba2V5XShvcHRpb25zW2tleV0pKVxuICAgICAgICAgICAgICAgICAgICAucmVkdWNlKChvYmosIHBhcnQpID0+ICh7Li4ub2JqLCAuLi5wYXJ0fSksIHt9KTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhwYXRjaCkubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHBhdGNoKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgX2kxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGZvY3VzKGRhdGU/OiBOZ2JEYXRlIHwgbnVsbCkge1xuICAgIGNvbnN0IGZvY3VzZWREYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCBudWxsKTtcbiAgICBpZiAoZm9jdXNlZERhdGUgIT0gbnVsbCAmJiAhdGhpcy5fc3RhdGUuZGlzYWJsZWQgJiYgaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIGZvY3VzZWREYXRlKSkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtmb2N1c0RhdGU6IGRhdGV9KTtcbiAgICB9XG4gIH1cblxuICBmb2N1c1NlbGVjdCgpIHtcbiAgICBpZiAoaXNEYXRlU2VsZWN0YWJsZSh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIHRoaXMuX3N0YXRlKSkge1xuICAgICAgdGhpcy5zZWxlY3QodGhpcy5fc3RhdGUuZm9jdXNEYXRlLCB7ZW1pdEV2ZW50OiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbihkYXRlPzogTmdiRGF0ZSB8IG51bGwpIHtcbiAgICBjb25zdCBmaXJzdERhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIHRoaXMuX2NhbGVuZGFyLmdldFRvZGF5KCkpO1xuICAgIGlmIChmaXJzdERhdGUgIT0gbnVsbCAmJiAhdGhpcy5fc3RhdGUuZGlzYWJsZWQgJiZcbiAgICAgICAgKCF0aGlzLl9zdGF0ZS5maXJzdERhdGUgfHwgaXNDaGFuZ2VkTW9udGgodGhpcy5fc3RhdGUuZmlyc3REYXRlLCBmaXJzdERhdGUpKSkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtmaXJzdERhdGV9KTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3QoZGF0ZT86IE5nYkRhdGUgfCBudWxsLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSkge1xuICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG4gICAgaWYgKHNlbGVjdGVkRGF0ZSAhPSBudWxsICYmICF0aGlzLl9zdGF0ZS5kaXNhYmxlZCkge1xuICAgICAgaWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUuc2VsZWN0ZWREYXRlLCBzZWxlY3RlZERhdGUpKSB7XG4gICAgICAgIHRoaXMuX25leHRTdGF0ZSh7c2VsZWN0ZWREYXRlfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmVtaXRFdmVudCAmJiBpc0RhdGVTZWxlY3RhYmxlKHNlbGVjdGVkRGF0ZSwgdGhpcy5fc3RhdGUpKSB7XG4gICAgICAgIHRoaXMuX2RhdGVTZWxlY3QkLm5leHQoc2VsZWN0ZWREYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b1ZhbGlkRGF0ZShkYXRlPzogTmdiRGF0ZVN0cnVjdCB8IG51bGwsIGRlZmF1bHRWYWx1ZT86IE5nYkRhdGUgfCBudWxsKTogTmdiRGF0ZSB8IG51bGwge1xuICAgIGNvbnN0IG5nYkRhdGUgPSBOZ2JEYXRlLmZyb20oZGF0ZSk7XG4gICAgaWYgKGRlZmF1bHRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSB0aGlzLl9jYWxlbmRhci5nZXRUb2RheSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSA/IG5nYkRhdGUgOiBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICBnZXRNb250aChzdHJ1Y3Q6IE5nYkRhdGVTdHJ1Y3QpIHtcbiAgICBmb3IgKGxldCBtb250aCBvZiB0aGlzLl9zdGF0ZS5tb250aHMpIHtcbiAgICAgIGlmIChzdHJ1Y3QubW9udGggPT09IG1vbnRoLm51bWJlciAmJiBzdHJ1Y3QueWVhciA9PT0gbW9udGgueWVhcikge1xuICAgICAgICByZXR1cm4gbW9udGg7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgbW9udGggJHtzdHJ1Y3QubW9udGh9IG9mIHllYXIgJHtzdHJ1Y3QueWVhcn0gbm90IGZvdW5kYCk7XG4gIH1cblxuICBwcml2YXRlIF9uZXh0U3RhdGUocGF0Y2g6IFBhcnRpYWw8RGF0ZXBpY2tlclZpZXdNb2RlbD4pIHtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuX3VwZGF0ZVN0YXRlKHBhdGNoKTtcbiAgICB0aGlzLl9wYXRjaENvbnRleHRzKG5ld1N0YXRlKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG5ld1N0YXRlO1xuICAgIHRoaXMuX21vZGVsJC5uZXh0KHRoaXMuX3N0YXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3BhdGNoQ29udGV4dHMoc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwpIHtcbiAgICBjb25zdCB7bW9udGhzLCBkaXNwbGF5TW9udGhzLCBzZWxlY3RlZERhdGUsIGZvY3VzRGF0ZSwgZm9jdXNWaXNpYmxlLCBkaXNhYmxlZCwgb3V0c2lkZURheXN9ID0gc3RhdGU7XG4gICAgc3RhdGUubW9udGhzLmZvckVhY2gobW9udGggPT4ge1xuICAgICAgbW9udGgud2Vla3MuZm9yRWFjaCh3ZWVrID0+IHtcbiAgICAgICAgd2Vlay5kYXlzLmZvckVhY2goZGF5ID0+IHtcblxuICAgICAgICAgIC8vIHBhdGNoIGZvY3VzIGZsYWdcbiAgICAgICAgICBpZiAoZm9jdXNEYXRlKSB7XG4gICAgICAgICAgICBkYXkuY29udGV4dC5mb2N1c2VkID0gZm9jdXNEYXRlLmVxdWFscyhkYXkuZGF0ZSkgJiYgZm9jdXNWaXNpYmxlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNhbGN1bGF0aW5nIHRhYmluZGV4XG4gICAgICAgICAgZGF5LnRhYmluZGV4ID1cbiAgICAgICAgICAgICAgIWRpc2FibGVkICYmIGZvY3VzRGF0ZSAmJiBkYXkuZGF0ZS5lcXVhbHMoZm9jdXNEYXRlKSAmJiBmb2N1c0RhdGUubW9udGggPT09IG1vbnRoLm51bWJlciA/IDAgOiAtMTtcblxuICAgICAgICAgIC8vIG92ZXJyaWRlIGNvbnRleHQgZGlzYWJsZWRcbiAgICAgICAgICBpZiAoZGlzYWJsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRheS5jb250ZXh0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBwYXRjaCBzZWxlY3Rpb24gZmxhZ1xuICAgICAgICAgIGlmIChzZWxlY3RlZERhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF5LmNvbnRleHQuc2VsZWN0ZWQgPSBzZWxlY3RlZERhdGUgIT09IG51bGwgJiYgc2VsZWN0ZWREYXRlLmVxdWFscyhkYXkuZGF0ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gdmlzaWJpbGl0eVxuICAgICAgICAgIGlmIChtb250aC5udW1iZXIgIT09IGRheS5kYXRlLm1vbnRoKSB7XG4gICAgICAgICAgICBkYXkuaGlkZGVuID0gb3V0c2lkZURheXMgPT09ICdoaWRkZW4nIHx8IG91dHNpZGVEYXlzID09PSAnY29sbGFwc2VkJyB8fFxuICAgICAgICAgICAgICAgIChkaXNwbGF5TW9udGhzID4gMSAmJiBkYXkuZGF0ZS5hZnRlcihtb250aHNbMF0uZmlyc3REYXRlKSAmJlxuICAgICAgICAgICAgICAgICBkYXkuZGF0ZS5iZWZvcmUobW9udGhzW2Rpc3BsYXlNb250aHMgLSAxXS5sYXN0RGF0ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0YXRlKHBhdGNoOiBQYXJ0aWFsPERhdGVwaWNrZXJWaWV3TW9kZWw+KTogRGF0ZXBpY2tlclZpZXdNb2RlbCB7XG4gICAgLy8gcGF0Y2hpbmcgZmllbGRzXG4gICAgY29uc3Qgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zdGF0ZSwgcGF0Y2gpO1xuXG4gICAgbGV0IHN0YXJ0RGF0ZSA9IHN0YXRlLmZpcnN0RGF0ZTtcblxuICAgIC8vIG1pbi9tYXggZGF0ZXMgY2hhbmdlZFxuICAgIGlmICgnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoKSB7XG4gICAgICBjaGVja01pbkJlZm9yZU1heChzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXRlLmZvY3VzRGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZm9jdXNEYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXRlLmZpcnN0RGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXJ0RGF0ZSA9IHN0YXRlLmZvY3VzRGF0ZTtcbiAgICB9XG5cbiAgICAvLyBkaXNhYmxlZFxuICAgIGlmICgnZGlzYWJsZWQnIGluIHBhdGNoKSB7XG4gICAgICBzdGF0ZS5mb2N1c1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsIHJlYnVpbGQgdmlhICdzZWxlY3QoKSdcbiAgICBpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgdGhpcy5fc3RhdGUubW9udGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc3RhcnREYXRlID0gc3RhdGUuc2VsZWN0ZWREYXRlO1xuICAgIH1cblxuICAgIC8vIHRlcm1pbmF0ZSBlYXJseSBpZiBvbmx5IGZvY3VzIHZpc2liaWxpdHkgd2FzIGNoYW5nZWRcbiAgICBpZiAoJ2ZvY3VzVmlzaWJsZScgaW4gcGF0Y2gpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG5cbiAgICAvLyBmb2N1cyBkYXRlIGNoYW5nZWRcbiAgICBpZiAoJ2ZvY3VzRGF0ZScgaW4gcGF0Y2gpIHtcbiAgICAgIHN0YXRlLmZvY3VzRGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZm9jdXNEYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXJ0RGF0ZSA9IHN0YXRlLmZvY3VzRGF0ZTtcblxuICAgICAgLy8gbm90aGluZyB0byByZWJ1aWxkIGlmIG9ubHkgZm9jdXMgY2hhbmdlZCBhbmQgaXQgaXMgc3RpbGwgdmlzaWJsZVxuICAgICAgaWYgKHN0YXRlLm1vbnRocy5sZW5ndGggIT09IDAgJiYgc3RhdGUuZm9jdXNEYXRlICYmICFzdGF0ZS5mb2N1c0RhdGUuYmVmb3JlKHN0YXRlLmZpcnN0RGF0ZSkgJiZcbiAgICAgICAgICAhc3RhdGUuZm9jdXNEYXRlLmFmdGVyKHN0YXRlLmxhc3REYXRlKSkge1xuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmlyc3QgZGF0ZSBjaGFuZ2VkXG4gICAgaWYgKCdmaXJzdERhdGUnIGluIHBhdGNoKSB7XG4gICAgICBzdGF0ZS5maXJzdERhdGUgPSBjaGVja0RhdGVJblJhbmdlKHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICBzdGFydERhdGUgPSBzdGF0ZS5maXJzdERhdGU7XG4gICAgfVxuXG4gICAgLy8gcmVidWlsZGluZyBtb250aHNcbiAgICBpZiAoc3RhcnREYXRlKSB7XG4gICAgICBjb25zdCBmb3JjZVJlYnVpbGQgPSAnZGF5VGVtcGxhdGVEYXRhJyBpbiBwYXRjaCB8fCAnZmlyc3REYXlPZldlZWsnIGluIHBhdGNoIHx8ICdtYXJrRGlzYWJsZWQnIGluIHBhdGNoIHx8XG4gICAgICAgICAgJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCAnZGlzYWJsZWQnIGluIHBhdGNoIHx8ICdvdXRzaWRlRGF5cycgaW4gcGF0Y2ggfHxcbiAgICAgICAgICAnd2Vla2RheXNWaXNpYmxlJyBpbiBwYXRjaDtcblxuICAgICAgY29uc3QgbW9udGhzID0gYnVpbGRNb250aHModGhpcy5fY2FsZW5kYXIsIHN0YXJ0RGF0ZSwgc3RhdGUsIHRoaXMuX2kxOG4sIGZvcmNlUmVidWlsZCk7XG5cbiAgICAgIC8vIHVwZGF0aW5nIG1vbnRocyBhbmQgYm91bmRhcnkgZGF0ZXNcbiAgICAgIHN0YXRlLm1vbnRocyA9IG1vbnRocztcbiAgICAgIHN0YXRlLmZpcnN0RGF0ZSA9IG1vbnRoc1swXS5maXJzdERhdGU7XG4gICAgICBzdGF0ZS5sYXN0RGF0ZSA9IG1vbnRoc1ttb250aHMubGVuZ3RoIC0gMV0ubGFzdERhdGU7XG5cbiAgICAgIC8vIHJlc2V0IHNlbGVjdGVkIGRhdGUgaWYgJ21hcmtEaXNhYmxlZCcgcmV0dXJucyB0cnVlXG4gICAgICBpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgIWlzRGF0ZVNlbGVjdGFibGUoc3RhdGUuc2VsZWN0ZWREYXRlLCBzdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWREYXRlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gYWRqdXN0aW5nIGZvY3VzIGFmdGVyIG1vbnRocyB3ZXJlIGJ1aWx0XG4gICAgICBpZiAoJ2ZpcnN0RGF0ZScgaW4gcGF0Y2gpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5mb2N1c0RhdGUgfHwgc3RhdGUuZm9jdXNEYXRlLmJlZm9yZShzdGF0ZS5maXJzdERhdGUpIHx8IHN0YXRlLmZvY3VzRGF0ZS5hZnRlcihzdGF0ZS5sYXN0RGF0ZSkpIHtcbiAgICAgICAgICBzdGF0ZS5mb2N1c0RhdGUgPSBzdGFydERhdGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gYWRqdXN0aW5nIG1vbnRocy95ZWFycyBmb3IgdGhlIHNlbGVjdCBib3ggbmF2aWdhdGlvblxuICAgICAgY29uc3QgeWVhckNoYW5nZWQgPSAhdGhpcy5fc3RhdGUuZmlyc3REYXRlIHx8IHRoaXMuX3N0YXRlLmZpcnN0RGF0ZS55ZWFyICE9PSBzdGF0ZS5maXJzdERhdGUueWVhcjtcbiAgICAgIGNvbnN0IG1vbnRoQ2hhbmdlZCA9ICF0aGlzLl9zdGF0ZS5maXJzdERhdGUgfHwgdGhpcy5fc3RhdGUuZmlyc3REYXRlLm1vbnRoICE9PSBzdGF0ZS5maXJzdERhdGUubW9udGg7XG4gICAgICBpZiAoc3RhdGUubmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgLy8geWVhcnMgLT4gIGJvdW5kYXJpZXMgKG1pbi9tYXggd2VyZSBjaGFuZ2VkKVxuICAgICAgICBpZiAoJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCBzdGF0ZS5zZWxlY3RCb3hlcy55ZWFycy5sZW5ndGggPT09IDAgfHwgeWVhckNoYW5nZWQpIHtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RCb3hlcy55ZWFycyA9IGdlbmVyYXRlU2VsZWN0Qm94WWVhcnMoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vbnRocyAtPiB3aGVuIGN1cnJlbnQgeWVhciBvciBib3VuZGFyaWVzIGNoYW5nZVxuICAgICAgICBpZiAoJ21pbkRhdGUnIGluIHBhdGNoIHx8ICdtYXhEYXRlJyBpbiBwYXRjaCB8fCBzdGF0ZS5zZWxlY3RCb3hlcy5tb250aHMubGVuZ3RoID09PSAwIHx8IHllYXJDaGFuZ2VkKSB7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0Qm94ZXMubW9udGhzID1cbiAgICAgICAgICAgICAgZ2VuZXJhdGVTZWxlY3RCb3hNb250aHModGhpcy5fY2FsZW5kYXIsIHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlLnNlbGVjdEJveGVzID0ge3llYXJzOiBbXSwgbW9udGhzOiBbXX07XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0aW5nIG5hdmlnYXRpb24gYXJyb3dzIC0+IGJvdW5kYXJpZXMgY2hhbmdlIChtaW4vbWF4KSBvciBtb250aC95ZWFyIGNoYW5nZXNcbiAgICAgIGlmICgoc3RhdGUubmF2aWdhdGlvbiA9PT0gJ2Fycm93cycgfHwgc3RhdGUubmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpICYmXG4gICAgICAgICAgKG1vbnRoQ2hhbmdlZCB8fCB5ZWFyQ2hhbmdlZCB8fCAnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoIHx8ICdkaXNhYmxlZCcgaW4gcGF0Y2gpKSB7XG4gICAgICAgIHN0YXRlLnByZXZEaXNhYmxlZCA9IHN0YXRlLmRpc2FibGVkIHx8IHByZXZNb250aERpc2FibGVkKHRoaXMuX2NhbGVuZGFyLCBzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUpO1xuICAgICAgICBzdGF0ZS5uZXh0RGlzYWJsZWQgPSBzdGF0ZS5kaXNhYmxlZCB8fCBuZXh0TW9udGhEaXNhYmxlZCh0aGlzLl9jYWxlbmRhciwgc3RhdGUubGFzdERhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuIl19