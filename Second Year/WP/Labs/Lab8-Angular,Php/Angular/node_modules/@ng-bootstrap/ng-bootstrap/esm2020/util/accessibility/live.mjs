import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export const ARIA_LIVE_DELAY = new InjectionToken('live announcer delay', { providedIn: 'root', factory: ARIA_LIVE_DELAY_FACTORY });
export function ARIA_LIVE_DELAY_FACTORY() {
    return 100;
}
function getLiveElement(document, lazyCreate = false) {
    let element = document.body.querySelector('#ngb-live');
    if (element == null && lazyCreate) {
        element = document.createElement('div');
        element.setAttribute('id', 'ngb-live');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('aria-atomic', 'true');
        element.classList.add('visually-hidden');
        document.body.appendChild(element);
    }
    return element;
}
export class Live {
    constructor(_document, _delay) {
        this._document = _document;
        this._delay = _delay;
    }
    ngOnDestroy() {
        const element = getLiveElement(this._document);
        if (element) {
            // if exists, it will always be attached to the <body>
            element.parentElement.removeChild(element);
        }
    }
    say(message) {
        const element = getLiveElement(this._document, true);
        const delay = this._delay;
        if (element != null) {
            element.textContent = '';
            const setText = () => element.textContent = message;
            if (delay === null) {
                setText();
            }
            else {
                setTimeout(setText, delay);
            }
        }
    }
}
Live.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, deps: [{ token: DOCUMENT }, { token: ARIA_LIVE_DELAY }], target: i0.ɵɵFactoryTarget.Injectable });
Live.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: Live, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ARIA_LIVE_DELAY]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy91dGlsL2FjY2Vzc2liaWxpdHkvbGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDNUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOztBQU96QyxNQUFNLENBQUMsTUFBTSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQzdDLHNCQUFzQixFQUFFLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQyxDQUFDO0FBQ3BGLE1BQU0sVUFBVSx1QkFBdUI7SUFDckMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBR0QsU0FBUyxjQUFjLENBQUMsUUFBYSxFQUFFLFVBQVUsR0FBRyxLQUFLO0lBQ3ZELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBZ0IsQ0FBQztJQUV0RSxJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO1FBQ2pDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFekMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEM7SUFFRCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBS0QsTUFBTSxPQUFPLElBQUk7SUFDZixZQUFzQyxTQUFjLEVBQW1DLE1BQVc7UUFBNUQsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUFtQyxXQUFNLEdBQU4sTUFBTSxDQUFLO0lBQUcsQ0FBQztJQUV0RyxXQUFXO1FBQ1QsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sRUFBRTtZQUNYLHNEQUFzRDtZQUN0RCxPQUFPLENBQUMsYUFBZSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7SUFFRCxHQUFHLENBQUMsT0FBZTtRQUNqQixNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTFCLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztZQUN6QixNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztZQUNwRCxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7Z0JBQ2xCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM1QjtTQUNGO0lBQ0gsQ0FBQzs7aUdBeEJVLElBQUksa0JBQ0ssUUFBUSxhQUFrQyxlQUFlO3FHQURsRSxJQUFJLGNBRFEsTUFBTTsyRkFDbEIsSUFBSTtrQkFEaEIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OzBCQUVqQixNQUFNOzJCQUFDLFFBQVE7OzBCQUEyQixNQUFNOzJCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9uRGVzdHJveX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5cblxuLy8gdXNlZnVsbmVzcyAoYW5kIGRlZmF1bHQgdmFsdWUpIG9mIGRlbGF5IGRvY3VtZW50ZWQgaW4gTWF0ZXJpYWwncyBDREtcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL21hdGVyaWFsMi9ibG9iLzY0MDVkYTliOGU4NTMyYTdlNWM4NTRjOTIwZWUxODE1YzI3NWQ3MzQvc3JjL2Nkay9hMTF5L2xpdmUtYW5ub3VuY2VyL2xpdmUtYW5ub3VuY2VyLnRzI0w1MFxuZXhwb3J0IHR5cGUgQVJJQV9MSVZFX0RFTEFZX1RZUEUgPSBudW1iZXIgfCBudWxsO1xuZXhwb3J0IGNvbnN0IEFSSUFfTElWRV9ERUxBWSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxBUklBX0xJVkVfREVMQVlfVFlQRT4oXG4gICAgJ2xpdmUgYW5ub3VuY2VyIGRlbGF5Jywge3Byb3ZpZGVkSW46ICdyb290JywgZmFjdG9yeTogQVJJQV9MSVZFX0RFTEFZX0ZBQ1RPUll9KTtcbmV4cG9ydCBmdW5jdGlvbiBBUklBX0xJVkVfREVMQVlfRkFDVE9SWSgpOiBudW1iZXIge1xuICByZXR1cm4gMTAwO1xufVxuXG5cbmZ1bmN0aW9uIGdldExpdmVFbGVtZW50KGRvY3VtZW50OiBhbnksIGxhenlDcmVhdGUgPSBmYWxzZSk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gIGxldCBlbGVtZW50ID0gZG9jdW1lbnQuYm9keS5xdWVyeVNlbGVjdG9yKCcjbmdiLWxpdmUnKSBhcyBIVE1MRWxlbWVudDtcblxuICBpZiAoZWxlbWVudCA9PSBudWxsICYmIGxhenlDcmVhdGUpIHtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCAnbmdiLWxpdmUnKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWF0b21pYycsICd0cnVlJyk7XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3Zpc3VhbGx5LWhpZGRlbicpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTGl2ZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnksIEBJbmplY3QoQVJJQV9MSVZFX0RFTEFZKSBwcml2YXRlIF9kZWxheTogYW55KSB7fVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMaXZlRWxlbWVudCh0aGlzLl9kb2N1bWVudCk7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIC8vIGlmIGV4aXN0cywgaXQgd2lsbCBhbHdheXMgYmUgYXR0YWNoZWQgdG8gdGhlIDxib2R5PlxuICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50ICEucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgc2F5KG1lc3NhZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBnZXRMaXZlRWxlbWVudCh0aGlzLl9kb2N1bWVudCwgdHJ1ZSk7XG4gICAgY29uc3QgZGVsYXkgPSB0aGlzLl9kZWxheTtcblxuICAgIGlmIChlbGVtZW50ICE9IG51bGwpIHtcbiAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICAgIGNvbnN0IHNldFRleHQgPSAoKSA9PiBlbGVtZW50LnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICAgIGlmIChkZWxheSA9PT0gbnVsbCkge1xuICAgICAgICBzZXRUZXh0KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KHNldFRleHQsIGRlbGF5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==