import { ComponentFactoryResolver, Injector } from '@angular/core';
import { NgbOffcanvasConfig, NgbOffcanvasOptions } from './offcanvas-config';
import { NgbOffcanvasRef } from './offcanvas-ref';
import { NgbOffcanvasStack } from './offcanvas-stack';
import * as i0 from "@angular/core";
/**
 * A service for opening an offcanvas.
 *
 * Creating an offcanvas is straightforward: create a component or a template and pass it as an argument to
 * the `.open()` method.
 *
 * @since 12.1.0
 */
export declare class NgbOffcanvas {
    private _moduleCFR;
    private _injector;
    private _offcanvasStack;
    private _config;
    constructor(_moduleCFR: ComponentFactoryResolver, _injector: Injector, _offcanvasStack: NgbOffcanvasStack, _config: NgbOffcanvasConfig);
    /**
     * Opens a new offcanvas panel with the specified content and supplied options.
     *
     * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
     * then instances of those components can be injected with an instance of the `NgbActiveOffcanvas` class. You can then
     * use `NgbActiveOffcanvas` methods to close / dismiss offcanvas from "inside" of your component.
     *
     * Also see the [`NgbOffcanvasOptions`](#/components/offcanvas/api#NgbOffcanvasOptions) for the list of supported
     * options.
     */
    open(content: any, options?: NgbOffcanvasOptions): NgbOffcanvasRef;
    /**
     * Returns an observable that holds the active offcanvas instance.
     */
    get activeInstance(): import("@angular/core").EventEmitter<NgbOffcanvasRef | undefined>;
    /**
     * Dismisses the currently displayed offcanvas with the supplied reason.
     */
    dismiss(reason?: any): void;
    /**
     * Indicates if there is currently an open offcanvas in the application.
     */
    hasOpenOffcanvas(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbOffcanvas, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgbOffcanvas>;
}
