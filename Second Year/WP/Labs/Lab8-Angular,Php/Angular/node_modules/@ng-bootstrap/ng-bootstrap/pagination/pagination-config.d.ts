import * as i0 from "@angular/core";
/**
 * A configuration service for the [`NgbPagination`](#/components/pagination/api#NgbPagination) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
export declare class NgbPaginationConfig {
    disabled: boolean;
    boundaryLinks: boolean;
    directionLinks: boolean;
    ellipses: boolean;
    maxSize: number;
    pageSize: number;
    rotate: boolean;
    size: 'sm' | 'lg';
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbPaginationConfig, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbPaginationConfig>;
}
