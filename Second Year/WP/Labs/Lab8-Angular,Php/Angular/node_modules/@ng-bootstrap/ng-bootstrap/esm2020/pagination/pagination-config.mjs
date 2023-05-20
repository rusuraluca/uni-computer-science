import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbPagination`](#/components/pagination/api#NgbPagination) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
export class NgbPaginationConfig {
    constructor() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
}
NgbPaginationConfig.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NgbPaginationConfig.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.3", ngImport: i0, type: NgbPaginationConfig, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGlvbi1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcGFnaW5hdGlvbi9wYWdpbmF0aW9uLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUV6Qzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxtQkFBbUI7SUFEaEM7UUFFRSxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLG1CQUFjLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLGFBQVEsR0FBRyxJQUFJLENBQUM7UUFDaEIsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxXQUFNLEdBQUcsS0FBSyxDQUFDO0tBRWhCOztnSEFUWSxtQkFBbUI7b0hBQW5CLG1CQUFtQixjQURQLE1BQU07MkZBQ2xCLG1CQUFtQjtrQkFEL0IsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEEgY29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgW2BOZ2JQYWdpbmF0aW9uYF0oIy9jb21wb25lbnRzL3BhZ2luYXRpb24vYXBpI05nYlBhZ2luYXRpb24pIGNvbXBvbmVudC5cbiAqXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCB0aGUgcGFnaW5hdGlvbnMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25Db25maWcge1xuICBkaXNhYmxlZCA9IGZhbHNlO1xuICBib3VuZGFyeUxpbmtzID0gZmFsc2U7XG4gIGRpcmVjdGlvbkxpbmtzID0gdHJ1ZTtcbiAgZWxsaXBzZXMgPSB0cnVlO1xuICBtYXhTaXplID0gMDtcbiAgcGFnZVNpemUgPSAxMDtcbiAgcm90YXRlID0gZmFsc2U7XG4gIHNpemU6ICdzbScgfCAnbGcnO1xufVxuIl19