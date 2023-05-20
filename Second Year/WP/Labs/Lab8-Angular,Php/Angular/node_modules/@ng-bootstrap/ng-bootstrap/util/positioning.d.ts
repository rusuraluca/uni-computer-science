import { Placement as PopperPlacement, Options } from '@popperjs/core';
export declare function getPopperClassPlacement(placement: Placement): PopperPlacement;
export declare function getBootstrapBaseClassPlacement(baseClass: string, placement: PopperPlacement): string;
export declare function getPopperOptions({ placement, baseClass }: PositioningOptions): Partial<Options>;
export declare type Placement = 'auto' | 'top' | 'bottom' | 'start' | 'left' | 'end' | 'right' | 'top-start' | 'top-left' | 'top-end' | 'top-right' | 'bottom-start' | 'bottom-left' | 'bottom-end' | 'bottom-right' | 'start-top' | 'left-top' | 'start-bottom' | 'left-bottom' | 'end-top' | 'right-top' | 'end-bottom' | 'right-bottom';
export declare type PlacementArray = Placement | Array<Placement> | string;
interface PositioningOptions {
    hostElement: HTMLElement;
    targetElement: HTMLElement;
    placement: string | Placement | PlacementArray;
    appendToBody?: boolean;
    baseClass?: string;
    updatePopperOptions?: (options: Partial<Options>) => Partial<Options>;
}
export declare function ngbPositioning(): {
    createPopper(positioningOption: PositioningOptions): void;
    update(): void;
    setOptions(positioningOption: PositioningOptions): void;
    destroy(): void;
};
export {};
