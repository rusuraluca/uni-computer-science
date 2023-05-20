import { NgZone } from '@angular/core';
import { OperatorFunction } from 'rxjs';
export declare function toInteger(value: any): number;
export declare function toString(value: any): string;
export declare function getValueInRange(value: number, max: number, min?: number): number;
export declare function isString(value: any): value is string;
export declare function isNumber(value: any): value is number;
export declare function isInteger(value: any): value is number;
export declare function isDefined(value: any): boolean;
export declare function isPromise<T>(v: any): v is Promise<T>;
export declare function padNumber(value: number): string;
export declare function regExpEscape(text: any): any;
export declare function hasClassName(element: any, className: string): boolean;
export declare function closest(element: HTMLElement, selector?: string): HTMLElement | null;
/**
 * Force a browser reflow
 * @param element element where to apply the reflow
 */
export declare function reflow(element: HTMLElement): DOMRect;
/**
 * Creates an observable where all callbacks are executed inside a given zone
 *
 * @param zone
 */
export declare function runInZone<T>(zone: NgZone): OperatorFunction<T, T>;
export declare function removeAccents(str: string): string;
