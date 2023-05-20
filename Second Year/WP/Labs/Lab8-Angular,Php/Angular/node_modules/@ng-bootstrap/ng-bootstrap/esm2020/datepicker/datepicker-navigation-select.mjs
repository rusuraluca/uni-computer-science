import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '../util/util';
import * as i0 from "@angular/core";
import * as i1 from "./datepicker-i18n";
import * as i2 from "@angular/common";
import * as i3 from "@angular/forms";
export class NgbDatepickerNavigationSelect {
    constructor(i18n, _renderer) {
        this.i18n = i18n;
        this._renderer = _renderer;
        this.select = new EventEmitter();
        this._month = -1;
        this._year = -1;
    }
    changeMonth(month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }
    changeYear(year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
    ngAfterViewChecked() {
        if (this.date) {
            if (this.date.month !== this._month) {
                this._month = this.date.month;
                this._renderer.setProperty(this.monthSelect.nativeElement, 'value', this._month);
            }
            if (this.date.year !== this._year) {
                this._year = this.date.year;
                this._renderer.setProperty(this.yearSelect.nativeElement, 'value', this._year);
            }
        }
    }
}
NgbDatepickerNavigationSelect.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigationSelect, deps: [{ token: i1.NgbDatepickerI18n }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
NgbDatepickerNavigationSelect.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbDatepickerNavigationSelect, selector: "ngb-datepicker-navigation-select", inputs: { date: "date", disabled: "disabled", months: "months", years: "years" }, outputs: { select: "select" }, viewQueries: [{ propertyName: "monthSelect", first: true, predicate: ["month"], descendants: true, read: ElementRef, static: true }, { propertyName: "yearSelect", first: true, predicate: ["year"], descendants: true, read: ElementRef, static: true }], ngImport: i0, template: `
    <select #month
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-month" aria-label="Select month"
      i18n-title="@@ngb.datepicker.select-month" title="Select month"
      (change)="changeMonth($any($event).target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select #year
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-year" aria-label="Select year"
      i18n-title="@@ngb.datepicker.select-year" title="Select year"
      (change)="changeYear($any($event).target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `, isInline: true, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"], directives: [{ type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i3.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { type: i3.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbDatepickerNavigationSelect, decorators: [{
            type: Component,
            args: [{ selector: 'ngb-datepicker-navigation-select', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: `
    <select #month
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-month" aria-label="Select month"
      i18n-title="@@ngb.datepicker.select-month" title="Select month"
      (change)="changeMonth($any($event).target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m, date?.year)"
                [value]="m">{{ i18n.getMonthShortName(m, date?.year) }}</option>
    </select><select #year
      [disabled]="disabled"
      class="form-select"
      i18n-aria-label="@@ngb.datepicker.select-year" aria-label="Select year"
      i18n-title="@@ngb.datepicker.select-year" title="Select year"
      (change)="changeYear($any($event).target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `, styles: ["ngb-datepicker-navigation-select>.form-select{flex:1 1 auto;padding:0 .5rem;font-size:.875rem;height:1.85rem}ngb-datepicker-navigation-select>.form-select:focus{z-index:1}ngb-datepicker-navigation-select>.form-select::-ms-value{background-color:transparent!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NgbDatepickerI18n }, { type: i0.Renderer2 }]; }, propDecorators: { date: [{
                type: Input
            }], disabled: [{
                type: Input
            }], months: [{
                type: Input
            }], years: [{
                type: Input
            }], select: [{
                type: Output
            }], monthSelect: [{
                type: ViewChild,
                args: ['month', { static: true, read: ElementRef }]
            }], yearSelect: [{
                type: ViewChild,
                args: ['year', { static: true, read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9kYXRlcGlja2VyL2RhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWix1QkFBdUIsRUFDdkIsaUJBQWlCLEVBRWpCLFNBQVMsRUFDVCxVQUFVLEVBRVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7OztBQTJCdkMsTUFBTSxPQUFPLDZCQUE2QjtJQWN4QyxZQUFtQixJQUF1QixFQUFVLFNBQW9CO1FBQXJELFNBQUksR0FBSixJQUFJLENBQW1CO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVztRQVI5RCxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUt2QyxXQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDWixVQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFd0QsQ0FBQztJQUU1RSxXQUFXLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRyxVQUFVLENBQUMsSUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoRyxrQkFBa0I7UUFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUM5QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2xGO1lBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hGO1NBQ0Y7SUFDSCxDQUFDOzswSEEvQlUsNkJBQTZCOzhHQUE3Qiw2QkFBNkIsMFFBUUMsVUFBVSwyR0FDWCxVQUFVLDJDQTVCeEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUOzJGQUVVLDZCQUE2QjtrQkF4QnpDLFNBQVM7K0JBQ0Usa0NBQWtDLG1CQUMzQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFlBRTNCOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCVDtnSUFHUSxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUVJLE1BQU07c0JBQWYsTUFBTTtnQkFFK0MsV0FBVztzQkFBaEUsU0FBUzt1QkFBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUM7Z0JBQ0MsVUFBVTtzQkFBOUQsU0FBUzt1QkFBQyxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlclZpZXdDaGVja2VkLFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIFJlbmRlcmVyMlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge3RvSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc3R5bGVVcmxzOiBbJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdC5zY3NzJ10sXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNlbGVjdCAjbW9udGhcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImZvcm0tc2VsZWN0XCJcbiAgICAgIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIuc2VsZWN0LW1vbnRoXCIgYXJpYS1sYWJlbD1cIlNlbGVjdCBtb250aFwiXG4gICAgICBpMThuLXRpdGxlPVwiQEBuZ2IuZGF0ZXBpY2tlci5zZWxlY3QtbW9udGhcIiB0aXRsZT1cIlNlbGVjdCBtb250aFwiXG4gICAgICAoY2hhbmdlKT1cImNoYW5nZU1vbnRoKCRhbnkoJGV2ZW50KS50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IG0gb2YgbW9udGhzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmdldE1vbnRoRnVsbE5hbWUobSwgZGF0ZT8ueWVhcilcIlxuICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJtXCI+e3sgaTE4bi5nZXRNb250aFNob3J0TmFtZShtLCBkYXRlPy55ZWFyKSB9fTwvb3B0aW9uPlxuICAgIDwvc2VsZWN0PjxzZWxlY3QgI3llYXJcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImZvcm0tc2VsZWN0XCJcbiAgICAgIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIuc2VsZWN0LXllYXJcIiBhcmlhLWxhYmVsPVwiU2VsZWN0IHllYXJcIlxuICAgICAgaTE4bi10aXRsZT1cIkBAbmdiLmRhdGVwaWNrZXIuc2VsZWN0LXllYXJcIiB0aXRsZT1cIlNlbGVjdCB5ZWFyXCJcbiAgICAgIChjaGFuZ2UpPVwiY2hhbmdlWWVhcigkYW55KCRldmVudCkudGFyZ2V0LnZhbHVlKVwiPlxuICAgICAgICA8b3B0aW9uICpuZ0Zvcj1cImxldCB5IG9mIHllYXJzXCIgW3ZhbHVlXT1cInlcIj57eyBpMThuLmdldFllYXJOdW1lcmFscyh5KSB9fTwvb3B0aW9uPlxuICAgIDwvc2VsZWN0PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0IGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCB7XG4gIEBJbnB1dCgpIGRhdGU6IE5nYkRhdGU7XG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBtb250aHM6IG51bWJlcltdO1xuICBASW5wdXQoKSB5ZWFyczogbnVtYmVyW107XG5cbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICBAVmlld0NoaWxkKCdtb250aCcsIHtzdGF0aWM6IHRydWUsIHJlYWQ6IEVsZW1lbnRSZWZ9KSBtb250aFNlbGVjdDogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgneWVhcicsIHtzdGF0aWM6IHRydWUsIHJlYWQ6IEVsZW1lbnRSZWZ9KSB5ZWFyU2VsZWN0OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgX21vbnRoID0gLTE7XG4gIHByaXZhdGUgX3llYXIgPSAtMTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgY2hhbmdlTW9udGgobW9udGg6IHN0cmluZykgeyB0aGlzLnNlbGVjdC5lbWl0KG5ldyBOZ2JEYXRlKHRoaXMuZGF0ZS55ZWFyLCB0b0ludGVnZXIobW9udGgpLCAxKSk7IH1cblxuICBjaGFuZ2VZZWFyKHllYXI6IHN0cmluZykgeyB0aGlzLnNlbGVjdC5lbWl0KG5ldyBOZ2JEYXRlKHRvSW50ZWdlcih5ZWFyKSwgdGhpcy5kYXRlLm1vbnRoLCAxKSk7IH1cblxuICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgaWYgKHRoaXMuZGF0ZSkge1xuICAgICAgaWYgKHRoaXMuZGF0ZS5tb250aCAhPT0gdGhpcy5fbW9udGgpIHtcbiAgICAgICAgdGhpcy5fbW9udGggPSB0aGlzLmRhdGUubW9udGg7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMubW9udGhTZWxlY3QubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdGhpcy5fbW9udGgpO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGF0ZS55ZWFyICE9PSB0aGlzLl95ZWFyKSB7XG4gICAgICAgIHRoaXMuX3llYXIgPSB0aGlzLmRhdGUueWVhcjtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy55ZWFyU2VsZWN0Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRoaXMuX3llYXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19