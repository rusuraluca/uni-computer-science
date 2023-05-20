import { NgbProgressbarConfig } from './progressbar-config';
import * as i0 from "@angular/core";
/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
export declare class NgbProgressbar {
    private _max;
    /**
     * The maximal value to be displayed in the progress bar.
     *
     * Should be a positive number. Will default to 100 otherwise.
     */
    set max(max: number);
    get max(): number;
    /**
     * If `true`, the stripes on the progress bar are animated.
     *
     * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
     */
    animated: boolean;
    /**
     * If `true`, the progress bars will be displayed as striped.
     */
    striped: boolean;
    /**
     * If `true`, the current percentage will be shown in the `xx%` format.
     */
    showValue: boolean;
    /**
     * Optional text variant type of the progress bar.
     *
     * Supports types based on Bootstrap background color variants, like:
     *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
     *
     * @since 5.2.0
     */
    textType: string;
    /**
     * The type of the progress bar.
     *
     * Supports types based on Bootstrap background color variants, like:
     *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
     */
    type: string;
    /**
     * The current value for the progress bar.
     *
     * Should be in the `[0, max]` range.
     */
    value: number;
    /**
     * The height of the progress bar.
     *
     * Accepts any valid CSS height values, ex. `"2rem"`
     */
    height: string;
    constructor(config: NgbProgressbarConfig);
    getValue(): number;
    getPercentValue(): number;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbProgressbar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbProgressbar, "ngb-progressbar", never, { "max": "max"; "animated": "animated"; "striped": "striped"; "showValue": "showValue"; "textType": "textType"; "type": "type"; "value": "value"; "height": "height"; }, {}, never, ["*"]>;
}
