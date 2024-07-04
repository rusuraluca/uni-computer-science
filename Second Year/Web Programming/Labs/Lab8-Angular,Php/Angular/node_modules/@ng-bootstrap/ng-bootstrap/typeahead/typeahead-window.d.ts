import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { toString } from '../util/util';
import * as i0 from "@angular/core";
/**
 * The context for the typeahead result template in case you want to override the default one.
 */
export interface ResultTemplateContext {
    /**
     * Your typeahead result item.
     */
    result: any;
    /**
     * Search term from the `<input>` used to get current result.
     */
    term: string;
}
export declare class NgbTypeaheadWindow implements OnInit {
    activeIdx: number;
    /**
     *  The id for the typeahead window. The id should be unique and the same
     *  as the associated typeahead's id.
     */
    id: string;
    /**
     * Flag indicating if the first row should be active initially
     */
    focusFirst: boolean;
    /**
     * Typeahead match results to be displayed
     */
    results: any;
    /**
     * Search term used to get current results
     */
    term: string;
    /**
     * A function used to format a given result before display. This function should return a formatted string without any
     * HTML markup
     */
    formatter: typeof toString;
    /**
     * A template to override a matching result default display
     */
    resultTemplate: TemplateRef<ResultTemplateContext>;
    /**
    * A custom class to append to the typeahead window
     *
     * @since 9.1.0
    */
    popupClass: string;
    /**
     * Event raised when user selects a particular result row
     */
    selectEvent: EventEmitter<any>;
    activeChangeEvent: EventEmitter<any>;
    hasActive(): boolean;
    getActive(): any;
    markActive(activeIdx: number): void;
    next(): void;
    prev(): void;
    resetActive(): void;
    select(item: any): void;
    ngOnInit(): void;
    private _activeChanged;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgbTypeaheadWindow, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgbTypeaheadWindow, "ngb-typeahead-window", ["ngbTypeaheadWindow"], { "id": "id"; "focusFirst": "focusFirst"; "results": "results"; "term": "term"; "formatter": "formatter"; "resultTemplate": "resultTemplate"; "popupClass": "popupClass"; }, { "selectEvent": "select"; "activeChangeEvent": "activeChange"; }, never, never>;
}
