import { Injector, ComponentFactoryResolver } from '@angular/core';
import { NgbModalOptions, NgbModalConfig } from './modal-config';
import { NgbModalRef } from './modal-ref';
import { NgbModalStack } from './modal-stack';
import * as i0 from "@angular/core";
/**
 * A service for opening modal windows.
 *
 * Creating a modal is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 */
export declare class NgbModal {
    private _moduleCFR;
    private _injector;
    private _modalStack;
    private _config;
    constructor(_moduleCFR: ComponentFactoryResolver, _injector: Injector, _modalStack: NgbModalStack, _config: NgbModalConfig);
    /**
     * Opens a new modal window with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveModal` class. You can then
     * use `NgbActiveModal` methods to close / dismiss modals from "inside" of your component.
     *
     * Also see the [`NgbModalOptions`](#/components/modal/api#NgbModalOptions) for the list of supported options.
     */
    open(content: any, options?: NgbModalOptions): NgbModalRef;
    /**
     * Returns an observable that holds the active modal instances.
     */
    get activeInstances(): import("@angular/core").EventEmitter<NgbModalRef[]>;
    /**
     * Dismisses all currently displayed modal windows with the supplied reason.
     *
     * @since 3.1.0
     */
    dismissAll(reason?: any): void;
    /**
     * Indicates if there are currently any open modal windows in the application.
     *
     * @since 3.3.0
     */
    hasOpenModals(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbModal, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbModal>;
}
