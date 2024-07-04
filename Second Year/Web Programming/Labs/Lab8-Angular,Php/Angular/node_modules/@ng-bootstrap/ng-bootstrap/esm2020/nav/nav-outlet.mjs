import { ChangeDetectionStrategy, Component, Directive, Input, ViewChildren, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, skip, startWith, takeUntil } from 'rxjs/operators';
import { ngbNavFadeInTransition, ngbNavFadeOutTransition } from './nav-transition';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class NgbNavPane {
    constructor(elRef) {
        this.elRef = elRef;
    }
}
NgbNavPane.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavPane, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
NgbNavPane.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavPane, selector: "[ngbNavPane]", inputs: { item: "item", nav: "nav", role: "role" }, host: { properties: { "id": "item.panelDomId", "class.fade": "nav.animation", "attr.role": "role ? role : nav.roles ? \"tabpanel\" : undefined", "attr.aria-labelledby": "item.domId" }, classAttribute: "tab-pane" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavPane, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngbNavPane]',
                    host: {
                        '[id]': 'item.panelDomId',
                        'class': 'tab-pane',
                        '[class.fade]': 'nav.animation',
                        '[attr.role]': 'role ? role : nav.roles ? "tabpanel" : undefined',
                        '[attr.aria-labelledby]': 'item.domId'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { item: [{
                type: Input
            }], nav: [{
                type: Input
            }], role: [{
                type: Input
            }] } });
/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
export class NgbNavOutlet {
    constructor(_cd, _ngZone) {
        this._cd = _cd;
        this._ngZone = _ngZone;
        this._activePane = null;
    }
    isPanelTransitioning(item) { return this._activePane?.item === item; }
    ngAfterViewInit() {
        // initial display
        this._updateActivePane();
        // this will be emitted for all 3 types of nav changes: .select(), [activeId] or (click)
        this.nav.navItemChange$
            .pipe(takeUntil(this.nav.destroy$), startWith(this._activePane?.item || null), distinctUntilChanged(), skip(1))
            .subscribe(nextItem => {
            const options = { animation: this.nav.animation, runningTransition: 'stop' };
            // next panel we're switching to will only appear in DOM after the change detection is done
            // and `this._panes` will be updated
            this._cd.detectChanges();
            // fading out
            if (this._activePane) {
                ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeOutTransition, options)
                    .subscribe(() => {
                    const activeItem = this._activePane?.item;
                    this._activePane = this._getPaneForItem(nextItem);
                    // mark for check when transition finishes as outlet or parent containers might be OnPush
                    // without this the panes that have "faded out" will stay in DOM
                    this._cd.markForCheck();
                    // fading in
                    if (this._activePane) {
                        // we have to add the '.active' class before running the transition,
                        // because it should be in place before `ngbRunTransition` does `reflow()`
                        this._activePane.elRef.nativeElement.classList.add('active');
                        ngbRunTransition(this._ngZone, this._activePane.elRef.nativeElement, ngbNavFadeInTransition, options)
                            .subscribe(() => {
                            if (nextItem) {
                                nextItem.shown.emit();
                                this.nav.shown.emit(nextItem.id);
                            }
                        });
                    }
                    if (activeItem) {
                        activeItem.hidden.emit();
                        this.nav.hidden.emit(activeItem.id);
                    }
                });
            }
            else {
                this._updateActivePane();
            }
        });
    }
    _updateActivePane() {
        this._activePane = this._getActivePane();
        this._activePane?.elRef.nativeElement.classList.add('show');
        this._activePane?.elRef.nativeElement.classList.add('active');
    }
    _getPaneForItem(item) {
        return this._panes && this._panes.find(pane => pane.item === item) || null;
    }
    _getActivePane() {
        return this._panes && this._panes.find(pane => pane.item.active) || null;
    }
}
NgbNavOutlet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavOutlet, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NgbNavOutlet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.3", type: NgbNavOutlet, selector: "[ngbNavOutlet]", inputs: { paneRole: "paneRole", nav: ["ngbNavOutlet", "nav"] }, host: { properties: { "class.tab-content": "true" } }, viewQueries: [{ propertyName: "_panes", predicate: NgbNavPane, descendants: true }], ngImport: i0, template: `
    <ng-template ngFor let-item [ngForOf]="nav.items">
      <div ngbNavPane *ngIf="item.isPanelInDom() || isPanelTransitioning(item)" [item]="item" [nav]="nav" [role]="paneRole">
        <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                     [ngTemplateOutletContext]="{$implicit: item.active || isPanelTransitioning(item)}"></ng-template>
      </div>
    </ng-template>
  `, isInline: true, directives: [{ type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: NgbNavPane, selector: "[ngbNavPane]", inputs: ["item", "nav", "role"] }, { type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbNavOutlet, decorators: [{
            type: Component,
            args: [{
                    selector: '[ngbNavOutlet]',
                    host: { '[class.tab-content]': 'true' },
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: `
    <ng-template ngFor let-item [ngForOf]="nav.items">
      <div ngbNavPane *ngIf="item.isPanelInDom() || isPanelTransitioning(item)" [item]="item" [nav]="nav" [role]="paneRole">
        <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                     [ngTemplateOutletContext]="{$implicit: item.active || isPanelTransitioning(item)}"></ng-template>
      </div>
    </ng-template>
  `
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { _panes: [{
                type: ViewChildren,
                args: [NgbNavPane]
            }], paneRole: [{
                type: Input
            }], nav: [{
                type: Input,
                args: ['ngbNavOutlet']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LW91dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uYXYvbmF2LW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxTQUFTLEVBRVQsS0FBSyxFQUdMLFlBQVksRUFDWixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLG9CQUFvQixFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEYsT0FBTyxFQUFDLHNCQUFzQixFQUFFLHVCQUF1QixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDakYsT0FBTyxFQUFDLGdCQUFnQixFQUF1QixNQUFNLGtDQUFrQyxDQUFDOzs7QUFheEYsTUFBTSxPQUFPLFVBQVU7SUFLckIsWUFBbUIsS0FBOEI7UUFBOUIsVUFBSyxHQUFMLEtBQUssQ0FBeUI7SUFBRyxDQUFDOzt1R0FMMUMsVUFBVTsyRkFBVixVQUFVOzJGQUFWLFVBQVU7a0JBVnRCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLElBQUksRUFBRTt3QkFDSixNQUFNLEVBQUUsaUJBQWlCO3dCQUN6QixPQUFPLEVBQUUsVUFBVTt3QkFDbkIsY0FBYyxFQUFFLGVBQWU7d0JBQy9CLGFBQWEsRUFBRSxrREFBa0Q7d0JBQ2pFLHdCQUF3QixFQUFFLFlBQVk7cUJBQ3ZDO2lCQUNGO2lHQUVVLElBQUk7c0JBQVosS0FBSztnQkFDRyxHQUFHO3NCQUFYLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLOztBQUtSOzs7O0dBSUc7QUFlSCxNQUFNLE9BQU8sWUFBWTtJQWV2QixZQUFvQixHQUFzQixFQUFVLE9BQWU7UUFBL0MsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBZDNELGdCQUFXLEdBQXNCLElBQUksQ0FB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UUFBUSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVPLGVBQWUsQ0FBQyxJQUF1QjtRQUM3QyxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQztJQUM3RSxDQUFDO0lBRU8sY0FBYztRQUNwQixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQztJQUMzRSxDQUFDOzt5R0FqRlUsWUFBWTs2RkFBWixZQUFZLHdNQUdULFVBQVUsZ0RBWmQ7Ozs7Ozs7R0FPVCxrT0F6QlUsVUFBVTsyRkEyQlYsWUFBWTtrQkFkeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixJQUFJLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUM7b0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsUUFBUSxFQUFFOzs7Ozs7O0dBT1Q7aUJBQ0Y7NkhBSW1DLE1BQU07c0JBQXZDLFlBQVk7dUJBQUMsVUFBVTtnQkFLZixRQUFRO3NCQUFoQixLQUFLO2dCQUtpQixHQUFHO3NCQUF6QixLQUFLO3VCQUFDLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBRdWVyeUxpc3QsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Rpc3RpbmN0VW50aWxDaGFuZ2VkLCBza2lwLCBzdGFydFdpdGgsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge25nYk5hdkZhZGVJblRyYW5zaXRpb24sIG5nYk5hdkZhZGVPdXRUcmFuc2l0aW9ufSBmcm9tICcuL25hdi10cmFuc2l0aW9uJztcbmltcG9ydCB7bmdiUnVuVHJhbnNpdGlvbiwgTmdiVHJhbnNpdGlvbk9wdGlvbnN9IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7TmdiTmF2LCBOZ2JOYXZJdGVtfSBmcm9tICcuL25hdic7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JOYXZQYW5lXScsXG4gIGhvc3Q6IHtcbiAgICAnW2lkXSc6ICdpdGVtLnBhbmVsRG9tSWQnLFxuICAgICdjbGFzcyc6ICd0YWItcGFuZScsXG4gICAgJ1tjbGFzcy5mYWRlXSc6ICduYXYuYW5pbWF0aW9uJyxcbiAgICAnW2F0dHIucm9sZV0nOiAncm9sZSA/IHJvbGUgOiBuYXYucm9sZXMgPyBcInRhYnBhbmVsXCIgOiB1bmRlZmluZWQnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ2l0ZW0uZG9tSWQnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2UGFuZSB7XG4gIEBJbnB1dCgpIGl0ZW06IE5nYk5hdkl0ZW07XG4gIEBJbnB1dCgpIG5hdjogTmdiTmF2O1xuICBASW5wdXQoKSByb2xlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGVsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge31cbn1cblxuLyoqXG4gKiBUaGUgb3V0bGV0IHdoZXJlIGN1cnJlbnRseSBhY3RpdmUgbmF2IGNvbnRlbnQgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1tuZ2JOYXZPdXRsZXRdJyxcbiAgaG9zdDogeydbY2xhc3MudGFiLWNvbnRlbnRdJzogJ3RydWUnfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cIm5hdi5pdGVtc1wiPlxuICAgICAgPGRpdiBuZ2JOYXZQYW5lICpuZ0lmPVwiaXRlbS5pc1BhbmVsSW5Eb20oKSB8fCBpc1BhbmVsVHJhbnNpdGlvbmluZyhpdGVtKVwiIFtpdGVtXT1cIml0ZW1cIiBbbmF2XT1cIm5hdlwiIFtyb2xlXT1cInBhbmVSb2xlXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmIHx8IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGl0ZW0uYWN0aXZlIHx8IGlzUGFuZWxUcmFuc2l0aW9uaW5nKGl0ZW0pfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdk91dGxldCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIF9hY3RpdmVQYW5lOiBOZ2JOYXZQYW5lIHwgbnVsbCA9IG51bGw7XG5cbiAgQFZpZXdDaGlsZHJlbihOZ2JOYXZQYW5lKSBwcml2YXRlIF9wYW5lczogUXVlcnlMaXN0PE5nYk5hdlBhbmU+O1xuXG4gIC8qKlxuICAgKiBBIHJvbGUgdG8gc2V0IG9uIHRoZSBuYXYgcGFuZVxuICAgKi9cbiAgQElucHV0KCkgcGFuZVJvbGU7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgYE5nYk5hdmBcbiAgICovXG4gIEBJbnB1dCgnbmdiTmF2T3V0bGV0JykgbmF2OiBOZ2JOYXY7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBpc1BhbmVsVHJhbnNpdGlvbmluZyhpdGVtOiBOZ2JOYXZJdGVtKSB7IHJldHVybiB0aGlzLl9hY3RpdmVQYW5lID8uaXRlbSA9PT0gaXRlbTsgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBpbml0aWFsIGRpc3BsYXlcbiAgICB0aGlzLl91cGRhdGVBY3RpdmVQYW5lKCk7XG5cbiAgICAvLyB0aGlzIHdpbGwgYmUgZW1pdHRlZCBmb3IgYWxsIDMgdHlwZXMgb2YgbmF2IGNoYW5nZXM6IC5zZWxlY3QoKSwgW2FjdGl2ZUlkXSBvciAoY2xpY2spXG4gICAgdGhpcy5uYXYubmF2SXRlbUNoYW5nZSRcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLm5hdi5kZXN0cm95JCksIHN0YXJ0V2l0aCh0aGlzLl9hY3RpdmVQYW5lID8uaXRlbSB8fCBudWxsKSwgZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgc2tpcCgxKSlcbiAgICAgIC5zdWJzY3JpYmUobmV4dEl0ZW0gPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uczogTmdiVHJhbnNpdGlvbk9wdGlvbnM8dW5kZWZpbmVkPiA9IHthbmltYXRpb246IHRoaXMubmF2LmFuaW1hdGlvbiwgcnVubmluZ1RyYW5zaXRpb246ICdzdG9wJ307XG5cbiAgICAgIC8vIG5leHQgcGFuZWwgd2UncmUgc3dpdGNoaW5nIHRvIHdpbGwgb25seSBhcHBlYXIgaW4gRE9NIGFmdGVyIHRoZSBjaGFuZ2UgZGV0ZWN0aW9uIGlzIGRvbmVcbiAgICAgIC8vIGFuZCBgdGhpcy5fcGFuZXNgIHdpbGwgYmUgdXBkYXRlZFxuICAgICAgdGhpcy5fY2QuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgICAvLyBmYWRpbmcgb3V0XG4gICAgICBpZiAodGhpcy5fYWN0aXZlUGFuZSkge1xuICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX25nWm9uZSwgdGhpcy5fYWN0aXZlUGFuZS5lbFJlZi5uYXRpdmVFbGVtZW50LCBuZ2JOYXZGYWRlT3V0VHJhbnNpdGlvbiwgb3B0aW9ucylcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gdGhpcy5fYWN0aXZlUGFuZSA/Lml0ZW07XG4gICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVBhbmUgPSB0aGlzLl9nZXRQYW5lRm9ySXRlbShuZXh0SXRlbSk7XG5cbiAgICAgICAgICAgICAgLy8gbWFyayBmb3IgY2hlY2sgd2hlbiB0cmFuc2l0aW9uIGZpbmlzaGVzIGFzIG91dGxldCBvciBwYXJlbnQgY29udGFpbmVycyBtaWdodCBiZSBPblB1c2hcbiAgICAgICAgICAgICAgLy8gd2l0aG91dCB0aGlzIHRoZSBwYW5lcyB0aGF0IGhhdmUgXCJmYWRlZCBvdXRcIiB3aWxsIHN0YXkgaW4gRE9NXG4gICAgICAgICAgICAgIHRoaXMuX2NkLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAgICAgICAgIC8vIGZhZGluZyBpblxuICAgICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUGFuZSkge1xuICAgICAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gYWRkIHRoZSAnLmFjdGl2ZScgY2xhc3MgYmVmb3JlIHJ1bm5pbmcgdGhlIHRyYW5zaXRpb24sXG4gICAgICAgICAgICAgICAgLy8gYmVjYXVzZSBpdCBzaG91bGQgYmUgaW4gcGxhY2UgYmVmb3JlIGBuZ2JSdW5UcmFuc2l0aW9uYCBkb2VzIGByZWZsb3coKWBcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVQYW5lLmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbmdiUnVuVHJhbnNpdGlvbih0aGlzLl9uZ1pvbmUsIHRoaXMuX2FjdGl2ZVBhbmUuZWxSZWYubmF0aXZlRWxlbWVudCwgbmdiTmF2RmFkZUluVHJhbnNpdGlvbiwgb3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0SXRlbS5zaG93bi5lbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdi5zaG93bi5lbWl0KG5leHRJdGVtLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVJdGVtLmhpZGRlbi5lbWl0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5uYXYuaGlkZGVuLmVtaXQoYWN0aXZlSXRlbS5pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlUGFuZSgpO1xuICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBY3RpdmVQYW5lKCkge1xuICAgIHRoaXMuX2FjdGl2ZVBhbmUgPSB0aGlzLl9nZXRBY3RpdmVQYW5lKCk7XG4gICAgdGhpcy5fYWN0aXZlUGFuZSA/LmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIHRoaXMuX2FjdGl2ZVBhbmUgPy5lbFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFuZUZvckl0ZW0oaXRlbTogTmdiTmF2SXRlbSB8IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZXMgJiYgdGhpcy5fcGFuZXMuZmluZChwYW5lID0+IHBhbmUuaXRlbSA9PT0gaXRlbSkgfHwgbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFjdGl2ZVBhbmUoKTogTmdiTmF2UGFuZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYW5lcyAmJiB0aGlzLl9wYW5lcy5maW5kKHBhbmUgPT4gcGFuZS5pdGVtLmFjdGl2ZSkgfHwgbnVsbDtcbiAgfVxufVxuIl19