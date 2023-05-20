import * as i0 from "@angular/core";
/** Type for the callback used to revert the scrollbar. */
export declare type ScrollbarReverter = () => void;
/**
 * Utility to handle the scrollbar.
 *
 * It allows to hide the scrollbar and compensate the lack of a vertical scrollbar
 * by adding an equivalent padding on the right of the body, and to revert this change.
 */
export declare class ScrollBar {
    private _document;
    constructor(_document: any);
    /**
     * To be called to hide a potential vertical scrollbar:
     * - if a scrollbar is there and has a width greater than 0, adds some compensation
     * padding to the body to keep the same layout as when the scrollbar is there
     * - adds overflow: hidden
     *
     * @return a callback used to revert the change
     */
    hide(): ScrollbarReverter;
    static ɵfac: i0.ɵɵFactoryDeclaration<ScrollBar, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ScrollBar>;
}
