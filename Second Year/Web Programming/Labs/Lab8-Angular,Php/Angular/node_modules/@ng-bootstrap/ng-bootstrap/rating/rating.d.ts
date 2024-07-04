import { ChangeDetectorRef, EventEmitter, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import { NgbRatingConfig } from './rating-config';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * The context for the custom star display template defined in the `starTemplate`.
 */
export interface StarTemplateContext {
    /**
     * The star fill percentage, an integer in the `[0, 100]` range.
     */
    fill: number;
    /**
     * Index of the star, starts with `0`.
     */
    index: number;
}
/**
 * A directive that helps visualising and interacting with a star rating bar.
 */
export declare class NgbRating implements ControlValueAccessor, OnInit, OnChanges {
    private _changeDetectorRef;
    contexts: StarTemplateContext[];
    disabled: boolean;
    nextRate: number;
    /**
     * The maximal rating that can be given.
     */
    max: number;
    /**
     * The current rating. Could be a decimal value like `3.75`.
     */
    rate: number;
    /**
     * If `true`, the rating can't be changed.
     */
    readonly: boolean;
    /**
     * If `true`, the rating can be reset to `0` by mouse clicking currently set rating.
     */
    resettable: boolean;
    /**
     * The template to override the way each star is displayed.
     *
     * Alternatively put an `<ng-template>` as the only child of your `<ngb-rating>` element
     */
    starTemplate: TemplateRef<StarTemplateContext>;
    starTemplateFromContent: TemplateRef<StarTemplateContext>;
    /**
     * An event emitted when the user is hovering over a given rating.
     *
     * Event payload equals to the rating being hovered over.
     */
    hover: EventEmitter<number>;
    /**
     * An event emitted when the user stops hovering over a given rating.
     *
     * Event payload equals to the rating of the last item being hovered over.
     */
    leave: EventEmitter<number>;
    /**
     * An event emitted when the rating is changed.
     *
     * Event payload equals to the newly selected rating.
     */
    rateChange: EventEmitter<number>;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(config: NgbRatingConfig, _changeDetectorRef: ChangeDetectorRef);
    ariaValueText(): string;
    isInteractive(): boolean;
    enter(value: number): void;
    handleBlur(): void;
    handleClick(value: number): void;
    handleKeyDown(event: KeyboardEvent): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    reset(): void;
    setDisabledState(isDisabled: boolean): void;
    update(value: number, internalChange?: boolean): void;
    writeValue(value: any): void;
    private _updateState;
    private _updateMax;
    private _setupContexts;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbRating, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbRating, "ngb-rating", never, { "max": "max"; "rate": "rate"; "readonly": "readonly"; "resettable": "resettable"; "starTemplate": "starTemplate"; }, { "hover": "hover"; "leave": "leave"; "rateChange": "rateChange"; }, ["starTemplateFromContent"], never>;
}
