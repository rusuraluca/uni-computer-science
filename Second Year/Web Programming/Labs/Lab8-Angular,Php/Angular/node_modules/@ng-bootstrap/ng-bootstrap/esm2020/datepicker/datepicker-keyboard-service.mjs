import { Injectable } from '@angular/core';
import { Key } from '../util/key';
import * as i0 from "@angular/core";
/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/datepicker/overview#keyboard-shortcuts)
 *
 * @since 5.2.0
 */
export class NgbDatepickerKeyboardService {
    /**
     * Processes a keyboard event.
     */
    processKey(event, datepicker) {
        const { state, calendar } = datepicker;
        /* eslint-disable-next-line deprecation/deprecation */
        switch (event.which) {
            case Key.PageUp:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case Key.PageDown:
                datepicker.focusDate(calendar.getNext(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
                break;
            case Key.End:
                datepicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
                break;
            case Key.Home:
                datepicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
                break;
            case Key.ArrowLeft:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', 1));
                break;
            case Key.ArrowUp:
                datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case Key.ArrowRight:
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', 1));
                break;
            case Key.ArrowDown:
                datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', calendar.getDaysPerWeek()));
                break;
            case Key.Enter:
            case Key.Space:
                datepicker.focusSelect();
                break;
            default:
                return;
        }
        event.preventDefault();
        event.stopPropagation();
    }
}
NgbDatepickerKeyboardService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbDatepickerKeyboardService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerKeyboardService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1rZXlib2FyZC1zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGFBQWEsQ0FBQzs7QUFFaEM7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLDRCQUE0QjtJQUN2Qzs7T0FFRztJQUNILFVBQVUsQ0FBQyxLQUFvQixFQUFFLFVBQXlCO1FBQ3hELE1BQU0sRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3JDLHNEQUFzRDtRQUN0RCxRQUFRLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDbkIsS0FBSyxHQUFHLENBQUMsTUFBTTtnQkFDYixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RixNQUFNO1lBQ1IsS0FBSyxHQUFHLENBQUMsUUFBUTtnQkFDZixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RixNQUFNO1lBQ1IsS0FBSyxHQUFHLENBQUMsR0FBRztnQkFDVixVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEUsTUFBTTtZQUNSLEtBQUssR0FBRyxDQUFDLElBQUk7Z0JBQ1gsVUFBVSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZFLE1BQU07WUFDUixLQUFLLEdBQUcsQ0FBQyxTQUFTO2dCQUNoQixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTTtZQUNSLEtBQUssR0FBRyxDQUFDLE9BQU87Z0JBQ2QsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzFGLE1BQU07WUFDUixLQUFLLEdBQUcsQ0FBQyxVQUFVO2dCQUNqQixVQUFVLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsTUFBTTtZQUNSLEtBQUssR0FBRyxDQUFDLFNBQVM7Z0JBQ2hCLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxRixNQUFNO1lBQ1IsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ2YsS0FBSyxHQUFHLENBQUMsS0FBSztnQkFDWixVQUFVLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3pCLE1BQU07WUFDUjtnQkFDRSxPQUFPO1NBQ1Y7UUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzFCLENBQUM7O3lIQXpDVSw0QkFBNEI7NkhBQTVCLDRCQUE0QixjQURoQixNQUFNOzJGQUNsQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5cbi8qKlxuICogQSBzZXJ2aWNlIHRoYXQgcmVwcmVzZW50cyB0aGUga2V5Ym9hcmQgbmF2aWdhdGlvbi5cbiAqXG4gKiBEZWZhdWx0IGtleWJvYXJkIHNob3J0Y3V0cyBbYXJlIGRvY3VtZW50ZWQgaW4gdGhlIG92ZXJ2aWV3XSgjL2NvbXBvbmVudHMvZGF0ZXBpY2tlci9vdmVydmlldyNrZXlib2FyZC1zaG9ydGN1dHMpXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJLZXlib2FyZFNlcnZpY2Uge1xuICAvKipcbiAgICogUHJvY2Vzc2VzIGEga2V5Ym9hcmQgZXZlbnQuXG4gICAqL1xuICBwcm9jZXNzS2V5KGV2ZW50OiBLZXlib2FyZEV2ZW50LCBkYXRlcGlja2VyOiBOZ2JEYXRlcGlja2VyKSB7XG4gICAgY29uc3Qge3N0YXRlLCBjYWxlbmRhcn0gPSBkYXRlcGlja2VyO1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZXByZWNhdGlvbi9kZXByZWNhdGlvbiAqL1xuICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgS2V5LlBhZ2VVcDpcbiAgICAgICAgZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0UHJldihzdGF0ZS5mb2N1c2VkRGF0ZSwgZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIDEpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5QYWdlRG93bjpcbiAgICAgICAgZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0TmV4dChzdGF0ZS5mb2N1c2VkRGF0ZSwgZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIDEpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgIGRhdGVwaWNrZXIuZm9jdXNEYXRlKGV2ZW50LnNoaWZ0S2V5ID8gc3RhdGUubWF4RGF0ZSA6IHN0YXRlLmxhc3REYXRlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICBkYXRlcGlja2VyLmZvY3VzRGF0ZShldmVudC5zaGlmdEtleSA/IHN0YXRlLm1pbkRhdGUgOiBzdGF0ZS5maXJzdERhdGUpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgS2V5LkFycm93TGVmdDpcbiAgICAgICAgZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0UHJldihzdGF0ZS5mb2N1c2VkRGF0ZSwgJ2QnLCAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0UHJldihzdGF0ZS5mb2N1c2VkRGF0ZSwgJ2QnLCBjYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXkuQXJyb3dSaWdodDpcbiAgICAgICAgZGF0ZXBpY2tlci5mb2N1c0RhdGUoY2FsZW5kYXIuZ2V0TmV4dChzdGF0ZS5mb2N1c2VkRGF0ZSwgJ2QnLCAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBLZXkuQXJyb3dEb3duOlxuICAgICAgICBkYXRlcGlja2VyLmZvY3VzRGF0ZShjYWxlbmRhci5nZXROZXh0KHN0YXRlLmZvY3VzZWREYXRlLCAnZCcsIGNhbGVuZGFyLmdldERheXNQZXJXZWVrKCkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEtleS5FbnRlcjpcbiAgICAgIGNhc2UgS2V5LlNwYWNlOlxuICAgICAgICBkYXRlcGlja2VyLmZvY3VzU2VsZWN0KCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG59XG4iXX0=