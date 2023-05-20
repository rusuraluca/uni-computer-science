import { NgbTransitionStartFn } from './ngbTransition';
export interface NgbCollapseCtx {
    direction: 'show' | 'hide';
    maxHeight?: string;
}
export declare const ngbCollapsingTransition: NgbTransitionStartFn<NgbCollapseCtx>;
