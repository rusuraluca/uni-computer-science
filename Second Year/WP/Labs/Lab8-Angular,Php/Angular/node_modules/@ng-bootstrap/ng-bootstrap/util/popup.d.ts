import { ApplicationRef, ComponentRef, Injector, NgZone, Renderer2, TemplateRef, ViewContainerRef, ViewRef } from '@angular/core';
import { Observable } from 'rxjs';
export declare class ContentRef {
    nodes: any[];
    viewRef?: ViewRef | undefined;
    componentRef?: ComponentRef<any> | undefined;
    constructor(nodes: any[], viewRef?: ViewRef | undefined, componentRef?: ComponentRef<any> | undefined);
}
export declare class PopupService<T> {
    private _type;
    private _injector;
    private _viewContainerRef;
    private _renderer;
    private _ngZone;
    private _applicationRef;
    private _windowRef;
    private _contentRef;
    constructor(_type: any, _injector: Injector, _viewContainerRef: ViewContainerRef, _renderer: Renderer2, _ngZone: NgZone, _applicationRef: ApplicationRef);
    open(content?: string | TemplateRef<any>, context?: any, animation?: boolean): {
        windowRef: ComponentRef<T>;
        transition$: Observable<void>;
    };
    close(animation?: boolean): Observable<void>;
    private _getContentRef;
}
