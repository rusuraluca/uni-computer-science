import { NgbTransitionStartFn } from '../util/transition/ngbTransition';
/**
 * Defines the carousel slide transition direction.
 */
export declare enum NgbSlideEventDirection {
    START = "start",
    END = "end"
}
export interface NgbCarouselCtx {
    /**
     * <span class="badge bg-info text-dark">since 12.0.0</span> Possible values are `'start' | 'end'`.
     *
     * <span class="badge bg-secondary">before 12.0.0</span> Possible values were `'left' | 'right'`.
     */
    direction: 'start' | 'end';
}
export declare const ngbCarouselTransitionIn: NgbTransitionStartFn<NgbCarouselCtx>;
export declare const ngbCarouselTransitionOut: NgbTransitionStartFn<NgbCarouselCtx>;
