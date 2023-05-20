import { ChangeDetectorRef, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NgbButtonLabel } from './label';
import * as i0 from "@angular/core";
/**
 * Allows to easily create Bootstrap-style radio buttons.
 *
 * Integrates with forms, so the value of a checked button is bound to the underlying form control
 * either in a reactive or template-driven way.
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
export declare class NgbRadioGroup implements ControlValueAccessor {
    private _radios;
    private _value;
    private _disabled;
    get disabled(): boolean;
    set disabled(isDisabled: boolean);
    /**
     * Name of the radio group applied to radio input elements.
     *
     * Will be applied to all radio input elements inside the group,
     * unless [`NgbRadio`](#/components/buttons/api#NgbRadio)'s specify names themselves.
     *
     * If not provided, will be generated in the `ngb-radio-xx` format.
     */
    name: string;
    onChange: (_: any) => void;
    onTouched: () => void;
    onRadioChange(radio: NgbRadio): void;
    onRadioValueUpdate(): void;
    register(radio: NgbRadio): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    unregister(radio: NgbRadio): void;
    writeValue(value: any): void;
    private _updateRadiosValue;
    private _updateRadiosDisabled;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbRadioGroup, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbRadioGroup, "[ngbRadioGroup]", never, { "name": "name"; }, {}, never>;
}
/**
 * A directive that marks an input of type "radio" as a part of the
 * [`NgbRadioGroup`](#/components/buttons/api#NgbRadioGroup).
 *
 * @deprecated 12.0.0 Please use native Angular code instead
 */
export declare class NgbRadio implements OnDestroy {
    private _group;
    private _label;
    private _renderer;
    private _element;
    private _cd;
    static ngAcceptInputType_disabled: boolean | '';
    private _checked;
    private _disabled;
    private _value;
    /**
     * The value for the 'name' property of the input element.
     *
     * All inputs of the radio group should have the same name. If not specified,
     * the name of the enclosing group is used.
     */
    name: string;
    /**
     * The form control value when current radio button is checked.
     */
    set value(value: any);
    /**
     * If `true`, current radio button will be disabled.
     */
    set disabled(isDisabled: boolean);
    set focused(isFocused: boolean);
    get checked(): boolean;
    get disabled(): boolean;
    get value(): any;
    get nameAttr(): string;
    constructor(_group: NgbRadioGroup, _label: NgbButtonLabel, _renderer: Renderer2, _element: ElementRef<HTMLInputElement>, _cd: ChangeDetectorRef);
    ngOnDestroy(): void;
    onChange(): void;
    updateValue(value: any): void;
    updateDisabled(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbRadio, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgbRadio, "[ngbButton][type=radio]", never, { "name": "name"; "value": "value"; "disabled": "disabled"; }, {}, never>;
}
