import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
/**
 * Utility to handle the scrollbar.
 *
 * It allows to hide the scrollbar and compensate the lack of a vertical scrollbar
 * by adding an equivalent padding on the right of the body, and to revert this change.
 */
export class ScrollBar {
    constructor(_document) {
        this._document = _document;
    }
    /**
     * To be called to hide a potential vertical scrollbar:
     * - if a scrollbar is there and has a width greater than 0, adds some compensation
     * padding to the body to keep the same layout as when the scrollbar is there
     * - adds overflow: hidden
     *
     * @return a callback used to revert the change
     */
    hide() {
        const scrollbarWidth = Math.abs(window.innerWidth - this._document.documentElement.clientWidth);
        const body = this._document.body;
        const bodyStyle = body.style;
        const { overflow, paddingRight } = bodyStyle;
        if (scrollbarWidth > 0) {
            const actualPadding = parseFloat(window.getComputedStyle(body).paddingRight);
            bodyStyle.paddingRight = `${actualPadding + scrollbarWidth}px`;
        }
        bodyStyle.overflow = 'hidden';
        return () => {
            if (scrollbarWidth > 0) {
                bodyStyle.paddingRight = paddingRight;
            }
            bodyStyle.overflow = overflow;
        };
    }
}
ScrollBar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ScrollBar.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: ScrollBar, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYmFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWwvc2Nyb2xsYmFyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLekM7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sU0FBUztJQUNwQixZQUFzQyxTQUFjO1FBQWQsY0FBUyxHQUFULFNBQVMsQ0FBSztJQUFHLENBQUM7SUFFeEQ7Ozs7Ozs7T0FPRztJQUNILElBQUk7UUFDRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEcsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUM3QixNQUFNLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBQyxHQUFHLFNBQVMsQ0FBQztRQUMzQyxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7WUFDdEIsTUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUM3RSxTQUFTLENBQUMsWUFBWSxHQUFHLEdBQUcsYUFBYSxHQUFHLGNBQWMsSUFBSSxDQUFDO1NBQ2hFO1FBQ0QsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDOUIsT0FBTyxHQUFHLEVBQUU7WUFDVixJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3RCLFNBQVMsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO2FBQ3ZDO1lBQ0QsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDaEMsQ0FBQyxDQUFDO0lBQ0osQ0FBQzs7c0dBM0JVLFNBQVMsa0JBQ0EsUUFBUTswR0FEakIsU0FBUyxjQURHLE1BQU07MkZBQ2xCLFNBQVM7a0JBRHJCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFFakIsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3R9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqIFR5cGUgZm9yIHRoZSBjYWxsYmFjayB1c2VkIHRvIHJldmVydCB0aGUgc2Nyb2xsYmFyLiAqL1xuZXhwb3J0IHR5cGUgU2Nyb2xsYmFyUmV2ZXJ0ZXIgPSAoKSA9PiB2b2lkO1xuXG4vKipcbiAqIFV0aWxpdHkgdG8gaGFuZGxlIHRoZSBzY3JvbGxiYXIuXG4gKlxuICogSXQgYWxsb3dzIHRvIGhpZGUgdGhlIHNjcm9sbGJhciBhbmQgY29tcGVuc2F0ZSB0aGUgbGFjayBvZiBhIHZlcnRpY2FsIHNjcm9sbGJhclxuICogYnkgYWRkaW5nIGFuIGVxdWl2YWxlbnQgcGFkZGluZyBvbiB0aGUgcmlnaHQgb2YgdGhlIGJvZHksIGFuZCB0byByZXZlcnQgdGhpcyBjaGFuZ2UuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFNjcm9sbEJhciB7XG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHt9XG5cbiAgLyoqXG4gICAqIFRvIGJlIGNhbGxlZCB0byBoaWRlIGEgcG90ZW50aWFsIHZlcnRpY2FsIHNjcm9sbGJhcjpcbiAgICogLSBpZiBhIHNjcm9sbGJhciBpcyB0aGVyZSBhbmQgaGFzIGEgd2lkdGggZ3JlYXRlciB0aGFuIDAsIGFkZHMgc29tZSBjb21wZW5zYXRpb25cbiAgICogcGFkZGluZyB0byB0aGUgYm9keSB0byBrZWVwIHRoZSBzYW1lIGxheW91dCBhcyB3aGVuIHRoZSBzY3JvbGxiYXIgaXMgdGhlcmVcbiAgICogLSBhZGRzIG92ZXJmbG93OiBoaWRkZW5cbiAgICpcbiAgICogQHJldHVybiBhIGNhbGxiYWNrIHVzZWQgdG8gcmV2ZXJ0IHRoZSBjaGFuZ2VcbiAgICovXG4gIGhpZGUoKTogU2Nyb2xsYmFyUmV2ZXJ0ZXIge1xuICAgIGNvbnN0IHNjcm9sbGJhcldpZHRoID0gTWF0aC5hYnMod2luZG93LmlubmVyV2lkdGggLSB0aGlzLl9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpO1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGNvbnN0IGJvZHlTdHlsZSA9IGJvZHkuc3R5bGU7XG4gICAgY29uc3Qge292ZXJmbG93LCBwYWRkaW5nUmlnaHR9ID0gYm9keVN0eWxlO1xuICAgIGlmIChzY3JvbGxiYXJXaWR0aCA+IDApIHtcbiAgICAgIGNvbnN0IGFjdHVhbFBhZGRpbmcgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJvZHkpLnBhZGRpbmdSaWdodCk7XG4gICAgICBib2R5U3R5bGUucGFkZGluZ1JpZ2h0ID0gYCR7YWN0dWFsUGFkZGluZyArIHNjcm9sbGJhcldpZHRofXB4YDtcbiAgICB9XG4gICAgYm9keVN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChzY3JvbGxiYXJXaWR0aCA+IDApIHtcbiAgICAgICAgYm9keVN0eWxlLnBhZGRpbmdSaWdodCA9IHBhZGRpbmdSaWdodDtcbiAgICAgIH1cbiAgICAgIGJvZHlTdHlsZS5vdmVyZmxvdyA9IG92ZXJmbG93O1xuICAgIH07XG4gIH1cbn1cbiJdfQ==