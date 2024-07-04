import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { regExpEscape, toString, removeAccents } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * A component that helps with text highlighting.
 *
 * If splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
export class NgbHighlight {
    constructor() {
        /**
         * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
         */
        this.highlightClass = 'ngb-highlight';
        /**
         * Boolean option to determine if the highlighting should be sensitive to accents or not.
         *
         * This feature is only available for browsers that implement the `String.normalize` function
         * (typically not Internet Explorer).
         * If you want to use this feature in a browser that does not implement `String.normalize`,
         * you will have to include a polyfill in your application (`unorm` for example).
         *
         * @since 9.1.0
         */
        this.accentSensitive = true;
    }
    ngOnChanges(changes) {
        if (!this.accentSensitive && !String.prototype.normalize) {
            console.warn('The `accentSensitive` input in `ngb-highlight` cannot be set to `false` in a browser ' +
                'that does not implement the `String.normalize` function. ' +
                'You will have to include a polyfill in your application to use this feature in the current browser.');
            this.accentSensitive = true;
        }
        const result = toString(this.result);
        const terms = Array.isArray(this.term) ? this.term : [this.term];
        const prepareTerm = term => this.accentSensitive ? term : removeAccents(term);
        const escapedTerms = terms.map(term => regExpEscape(prepareTerm(toString(term)))).filter(term => term);
        const toSplit = this.accentSensitive ? result : removeAccents(result);
        const parts = escapedTerms.length ? toSplit.split(new RegExp(`(${escapedTerms.join('|')})`, 'gmi')) : [result];
        if (this.accentSensitive) {
            this.parts = parts;
        }
        else {
            let offset = 0;
            this.parts = parts.map(part => result.substring(offset, offset += part.length));
        }
    }
}
NgbHighlight.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbHighlight, deps: [], target: i0.ɵɵFactoryTarget.Component });
NgbHighlight.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbHighlight, selector: "ngb-highlight", inputs: { highlightClass: "highlightClass", result: "result", term: "term", accentSensitive: "accentSensitive" }, usesOnChanges: true, ngImport: i0, template: "<ng-template ngFor [ngForOf]=\"parts\" let-part let-isOdd=\"odd\"><span *ngIf=\"isOdd; else even\" [class]=\"highlightClass\">{{part}}</span><ng-template #even>{{part}}</ng-template></ng-template>", isInline: true, styles: [".ngb-highlight{font-weight:700}\n"], directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbHighlight, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-highlight', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                        `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                        `</ng-template>`, styles: [".ngb-highlight{font-weight:700}\n"] }]
        }], propDecorators: { highlightClass: [{
                type: Input
            }], result: [{
                type: Input
            }], term: [{
                type: Input
            }], accentSensitive: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3R5cGVhaGVhZC9oaWdobGlnaHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQWEsdUJBQXVCLEVBQWlCLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JILE9BQU8sRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7O0FBRW5FOzs7Ozs7O0dBT0c7QUFVSCxNQUFNLE9BQU8sWUFBWTtJQVR6QjtRQVlFOztXQUVHO1FBQ00sbUJBQWMsR0FBRyxlQUFlLENBQUM7UUFnQjFDOzs7Ozs7Ozs7V0FTRztRQUNNLG9CQUFlLEdBQUcsSUFBSSxDQUFDO0tBMEJqQztJQXhCQyxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUN4RCxPQUFPLENBQUMsSUFBSSxDQUNSLHVGQUF1RjtnQkFDdkYsMkRBQTJEO2dCQUMzRCxxR0FBcUcsQ0FBQyxDQUFDO1lBQzNHLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1NBQzdCO1FBQ0QsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVyQyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5RSxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkcsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEUsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRS9HLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUNwQjthQUFNO1lBQ0wsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ2pGO0lBQ0gsQ0FBQzs7eUdBekRVLFlBQVk7NkZBQVosWUFBWTsyRkFBWixZQUFZO2tCQVR4QixTQUFTOytCQUNFLGVBQWUsbUJBQ1IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSSxZQUMzQixnRUFBZ0U7d0JBQ3RFLGtIQUFrSDt3QkFDbEgsZ0JBQWdCOzhCQVNYLGNBQWM7c0JBQXRCLEtBQUs7Z0JBUUcsTUFBTTtzQkFBZCxLQUFLO2dCQU1HLElBQUk7c0JBQVosS0FBSztnQkFZRyxlQUFlO3NCQUF2QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3JlZ0V4cEVzY2FwZSwgdG9TdHJpbmcsIHJlbW92ZUFjY2VudHN9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbi8qKlxuICogQSBjb21wb25lbnQgdGhhdCBoZWxwcyB3aXRoIHRleHQgaGlnaGxpZ2h0aW5nLlxuICpcbiAqIElmIHNwbGl0cyB0aGUgYHJlc3VsdGAgdGV4dCBpbnRvIHBhcnRzIHRoYXQgY29udGFpbiB0aGUgc2VhcmNoZWQgYHRlcm1gIGFuZCBnZW5lcmF0ZXMgdGhlIEhUTUwgbWFya3VwIHRvIHNpbXBsaWZ5XG4gKiBoaWdobGlnaHRpbmc6XG4gKlxuICogRXguIGByZXN1bHQ9XCJBbGFza2FcImAgYW5kIGB0ZXJtPVwiYXNcImAgd2lsbCBwcm9kdWNlIGBBbDxzcGFuIGNsYXNzPVwibmdiLWhpZ2hsaWdodFwiPmFzPC9zcGFuPmthYC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWhpZ2hsaWdodCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZTogYDxuZy10ZW1wbGF0ZSBuZ0ZvciBbbmdGb3JPZl09XCJwYXJ0c1wiIGxldC1wYXJ0IGxldC1pc09kZD1cIm9kZFwiPmAgK1xuICAgICAgYDxzcGFuICpuZ0lmPVwiaXNPZGQ7IGVsc2UgZXZlblwiIFtjbGFzc109XCJoaWdobGlnaHRDbGFzc1wiPnt7cGFydH19PC9zcGFuPjxuZy10ZW1wbGF0ZSAjZXZlbj57e3BhcnR9fTwvbmctdGVtcGxhdGU+YCArXG4gICAgICBgPC9uZy10ZW1wbGF0ZT5gLCAgLy8gdGVtcGxhdGUgbmVlZHMgdG8gYmUgZm9ybWF0dGVkIGluIGEgY2VydGFpbiB3YXkgc28gd2UgZG9uJ3QgYWRkIGVtcHR5IHRleHQgbm9kZXNcbiAgc3R5bGVVcmxzOiBbJy4vaGlnaGxpZ2h0LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JIaWdobGlnaHQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwYXJ0czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3MgZm9yIGA8c3Bhbj5gIGVsZW1lbnRzIHdyYXBwaW5nIHRoZSBgdGVybWAgaW5zaWRlIHRoZSBgcmVzdWx0YC5cbiAgICovXG4gIEBJbnB1dCgpIGhpZ2hsaWdodENsYXNzID0gJ25nYi1oaWdobGlnaHQnO1xuXG4gIC8qKlxuICAgKiBUaGUgdGV4dCBoaWdobGlnaHRpbmcgaXMgYWRkZWQgdG8uXG4gICAqXG4gICAqIElmIHRoZSBgdGVybWAgaXMgZm91bmQgaW5zaWRlIHRoaXMgdGV4dCwgaXQgd2lsbCBiZSBoaWdobGlnaHRlZC5cbiAgICogSWYgdGhlIGB0ZXJtYCBjb250YWlucyBhcnJheSB0aGVuIGFsbCB0aGUgaXRlbXMgZnJvbSBpdCB3aWxsIGJlIGhpZ2hsaWdodGVkIGluc2lkZSB0aGUgdGV4dC5cbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdD86IHN0cmluZyB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSB0ZXJtIG9yIGFycmF5IG9mIHRlcm1zIHRvIGJlIGhpZ2hsaWdodGVkLlxuICAgKiBTaW5jZSB2ZXJzaW9uIGB2NC4yLjBgIHRlcm0gY291bGQgYmUgYSBgc3RyaW5nW11gXG4gICAqL1xuICBASW5wdXQoKSB0ZXJtOiBzdHJpbmcgfCByZWFkb25seSBzdHJpbmdbXTtcblxuICAvKipcbiAgICogQm9vbGVhbiBvcHRpb24gdG8gZGV0ZXJtaW5lIGlmIHRoZSBoaWdobGlnaHRpbmcgc2hvdWxkIGJlIHNlbnNpdGl2ZSB0byBhY2NlbnRzIG9yIG5vdC5cbiAgICpcbiAgICogVGhpcyBmZWF0dXJlIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBicm93c2VycyB0aGF0IGltcGxlbWVudCB0aGUgYFN0cmluZy5ub3JtYWxpemVgIGZ1bmN0aW9uXG4gICAqICh0eXBpY2FsbHkgbm90IEludGVybmV0IEV4cGxvcmVyKS5cbiAgICogSWYgeW91IHdhbnQgdG8gdXNlIHRoaXMgZmVhdHVyZSBpbiBhIGJyb3dzZXIgdGhhdCBkb2VzIG5vdCBpbXBsZW1lbnQgYFN0cmluZy5ub3JtYWxpemVgLFxuICAgKiB5b3Ugd2lsbCBoYXZlIHRvIGluY2x1ZGUgYSBwb2x5ZmlsbCBpbiB5b3VyIGFwcGxpY2F0aW9uIChgdW5vcm1gIGZvciBleGFtcGxlKS5cbiAgICpcbiAgICogQHNpbmNlIDkuMS4wXG4gICAqL1xuICBASW5wdXQoKSBhY2NlbnRTZW5zaXRpdmUgPSB0cnVlO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMuYWNjZW50U2Vuc2l0aXZlICYmICFTdHJpbmcucHJvdG90eXBlLm5vcm1hbGl6ZSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICdUaGUgYGFjY2VudFNlbnNpdGl2ZWAgaW5wdXQgaW4gYG5nYi1oaWdobGlnaHRgIGNhbm5vdCBiZSBzZXQgdG8gYGZhbHNlYCBpbiBhIGJyb3dzZXIgJyArXG4gICAgICAgICAgJ3RoYXQgZG9lcyBub3QgaW1wbGVtZW50IHRoZSBgU3RyaW5nLm5vcm1hbGl6ZWAgZnVuY3Rpb24uICcgK1xuICAgICAgICAgICdZb3Ugd2lsbCBoYXZlIHRvIGluY2x1ZGUgYSBwb2x5ZmlsbCBpbiB5b3VyIGFwcGxpY2F0aW9uIHRvIHVzZSB0aGlzIGZlYXR1cmUgaW4gdGhlIGN1cnJlbnQgYnJvd3Nlci4nKTtcbiAgICAgIHRoaXMuYWNjZW50U2Vuc2l0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gdG9TdHJpbmcodGhpcy5yZXN1bHQpO1xuXG4gICAgY29uc3QgdGVybXMgPSBBcnJheS5pc0FycmF5KHRoaXMudGVybSkgPyB0aGlzLnRlcm0gOiBbdGhpcy50ZXJtXTtcbiAgICBjb25zdCBwcmVwYXJlVGVybSA9IHRlcm0gPT4gdGhpcy5hY2NlbnRTZW5zaXRpdmUgPyB0ZXJtIDogcmVtb3ZlQWNjZW50cyh0ZXJtKTtcbiAgICBjb25zdCBlc2NhcGVkVGVybXMgPSB0ZXJtcy5tYXAodGVybSA9PiByZWdFeHBFc2NhcGUocHJlcGFyZVRlcm0odG9TdHJpbmcodGVybSkpKSkuZmlsdGVyKHRlcm0gPT4gdGVybSk7XG4gICAgY29uc3QgdG9TcGxpdCA9IHRoaXMuYWNjZW50U2Vuc2l0aXZlID8gcmVzdWx0IDogcmVtb3ZlQWNjZW50cyhyZXN1bHQpO1xuXG4gICAgY29uc3QgcGFydHMgPSBlc2NhcGVkVGVybXMubGVuZ3RoID8gdG9TcGxpdC5zcGxpdChuZXcgUmVnRXhwKGAoJHtlc2NhcGVkVGVybXMuam9pbignfCcpfSlgLCAnZ21pJykpIDogW3Jlc3VsdF07XG5cbiAgICBpZiAodGhpcy5hY2NlbnRTZW5zaXRpdmUpIHtcbiAgICAgIHRoaXMucGFydHMgPSBwYXJ0cztcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9mZnNldCA9IDA7XG4gICAgICB0aGlzLnBhcnRzID0gcGFydHMubWFwKHBhcnQgPT4gcmVzdWx0LnN1YnN0cmluZyhvZmZzZXQsIG9mZnNldCArPSBwYXJ0Lmxlbmd0aCkpO1xuICAgIH1cbiAgfVxufVxuIl19