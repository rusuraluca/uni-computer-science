import { arrow, createPopperLite, flip, preventOverflow, } from '@popperjs/core';
const placementSeparator = /\s+/;
const spacesRegExp = /  +/gi;
const startPrimaryPlacement = /^start/;
const endPrimaryPlacement = /^end/;
const startSecondaryPlacement = /-(top|left)$/;
const endSecondaryPlacement = /-(bottom|right)$/;
export function getPopperClassPlacement(placement) {
    const newPlacement = placement.replace(startPrimaryPlacement, 'left')
        .replace(endPrimaryPlacement, 'right')
        .replace(startSecondaryPlacement, '-start')
        .replace(endSecondaryPlacement, '-end');
    return newPlacement;
}
const popperStartPrimaryPlacement = /^left/;
const popperEndPrimaryPlacement = /^right/;
const popperStartSecondaryPlacement = /^start/;
const popperEndSecondaryPlacement = /^end/;
export function getBootstrapBaseClassPlacement(baseClass, placement) {
    let [primary, secondary] = placement.split('-');
    const newPrimary = primary.replace(popperStartPrimaryPlacement, 'start').replace(popperEndPrimaryPlacement, 'end');
    let classnames = [newPrimary];
    if (secondary) {
        let newSecondary = secondary;
        if (primary === 'left' || primary === 'right') {
            newSecondary =
                newSecondary.replace(popperStartSecondaryPlacement, 'top').replace(popperEndSecondaryPlacement, 'bottom');
        }
        classnames.push(`${newPrimary}-${newSecondary}`);
    }
    if (baseClass) {
        classnames = classnames.map((classname) => `${baseClass}-${classname}`);
    }
    return classnames.join(' ');
}
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'start', 'end',
 *   'top-start', 'top-end',
 *   'bottom-start', 'bottom-end',
 *   'start-top', 'start-bottom',
 *   'end-top', 'end-bottom'.
 * */
export function getPopperOptions({ placement, baseClass }) {
    let placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
    // No need to consider left and right here, as start and end are enough, and it is used for 'auto' placement only
    const allowedPlacements = [
        'top', 'bottom', 'start', 'end', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'start-top', 'start-bottom',
        'end-top', 'end-bottom'
    ];
    // replace auto placement with other placements
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        allowedPlacements.forEach(function (obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, obj);
            }
        });
    }
    const popperPlacements = placementVals.map((_placement) => { return getPopperClassPlacement(_placement); });
    let mainPlacement = popperPlacements.shift();
    const bsModifier = {
        name: 'bootstrapClasses',
        enabled: !!baseClass,
        phase: 'write',
        fn({ state }) {
            const bsClassRegExp = new RegExp(baseClass + '-[a-z]+', 'gi');
            const popperElement = state.elements.popper;
            const popperPlacement = state.placement;
            let className = popperElement.className;
            // Remove old bootstrap classes
            className = className.replace(bsClassRegExp, '');
            // Add current placements
            className += ` ${getBootstrapBaseClassPlacement(baseClass, popperPlacement)}`;
            // Remove multiple spaces
            className = className.trim().replace(spacesRegExp, ' ');
            // Reassign
            popperElement.className = className;
        },
    };
    return {
        placement: mainPlacement,
        modifiers: [
            bsModifier,
            flip,
            preventOverflow,
            arrow,
            {
                enabled: true,
                name: 'flip',
                options: {
                    fallbackPlacements: popperPlacements,
                },
            },
            {
                enabled: true,
                name: 'preventOverflow',
                phase: 'main',
                fn: function () { },
            },
        ]
    };
}
function noop(arg) {
    return arg;
}
export function ngbPositioning() {
    let popperInstance = null;
    return {
        createPopper(positioningOption) {
            if (!popperInstance) {
                const updatePopperOptions = positioningOption.updatePopperOptions || noop;
                let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
                popperInstance =
                    createPopperLite(positioningOption.hostElement, positioningOption.targetElement, popperOptions);
            }
        },
        update() {
            if (popperInstance) {
                popperInstance.update();
            }
        },
        setOptions(positioningOption) {
            if (popperInstance) {
                const updatePopperOptions = positioningOption.updatePopperOptions || noop;
                let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
                popperInstance.setOptions(popperOptions);
            }
        },
        destroy() {
            if (popperInstance) {
                popperInstance.destroy();
                popperInstance = null;
            }
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb25pbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdXRpbC9wb3NpdGlvbmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsS0FBSyxFQUNMLGdCQUFnQixFQUNoQixJQUFJLEVBSUosZUFBZSxHQUVoQixNQUFNLGdCQUFnQixDQUFDO0FBRXhCLE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQztBQUU3QixNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQztBQUN2QyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQztBQUNuQyxNQUFNLHVCQUF1QixHQUFHLGNBQWMsQ0FBQztBQUMvQyxNQUFNLHFCQUFxQixHQUFHLGtCQUFrQixDQUFDO0FBQ2pELE1BQU0sVUFBVSx1QkFBdUIsQ0FBQyxTQUFvQjtJQUMxRCxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQztTQUMzQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO1NBQ3JDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxRQUFRLENBQUM7U0FDMUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBb0IsQ0FBQztJQUNwRixPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsTUFBTSwyQkFBMkIsR0FBRyxPQUFPLENBQUM7QUFDNUMsTUFBTSx5QkFBeUIsR0FBRyxRQUFRLENBQUM7QUFDM0MsTUFBTSw2QkFBNkIsR0FBRyxRQUFRLENBQUM7QUFDL0MsTUFBTSwyQkFBMkIsR0FBRyxNQUFNLENBQUM7QUFDM0MsTUFBTSxVQUFVLDhCQUE4QixDQUFDLFNBQWlCLEVBQUUsU0FBMEI7SUFDMUYsSUFBSSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFD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QkFDMUUsSUFBSSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUM3RSxjQUFjO29CQUNWLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDckc7UUFDSCxDQUFDO1FBQ0QsTUFBTTtZQUNKLElBQUksY0FBYyxFQUFFO2dCQUNsQixjQUFjLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDekI7UUFDSCxDQUFDO1FBQ0QsVUFBVSxDQUFDLGlCQUFxQztZQUM5QyxJQUFJLGNBQWMsRUFBRTtnQkFDbEIsTUFBTSxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUM7Z0JBQzFFLElBQUksYUFBYSxHQUFHLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDN0UsY0FBYyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUM7UUFDRCxPQUFPO1lBQ0wsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDekIsY0FBYyxHQUFHLElBQUksQ0FBQzthQUN2QjtRQUNILENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFycm93LFxuICBjcmVhdGVQb3BwZXJMaXRlLFxuICBmbGlwLFxuICBJbnN0YW5jZSxcbiAgTW9kaWZpZXIsXG4gIFBsYWNlbWVudCBhcyBQb3BwZXJQbGFjZW1lbnQsXG4gIHByZXZlbnRPdmVyZmxvdyxcbiAgT3B0aW9ucyxcbn0gZnJvbSAnQHBvcHBlcmpzL2NvcmUnO1xuXG5jb25zdCBwbGFjZW1lbnRTZXBhcmF0b3IgPSAvXFxzKy87XG5jb25zdCBzcGFjZXNSZWdFeHAgPSAvICArL2dpO1xuXG5jb25zdCBzdGFydFByaW1hcnlQbGFjZW1lbnQgPSAvXnN0YXJ0LztcbmNvbnN0IGVuZFByaW1hcnlQbGFjZW1lbnQgPSAvXmVuZC87XG5jb25zdCBzdGFydFNlY29uZGFyeVBsYWNlbWVudCA9IC8tKHRvcHxsZWZ0KSQvO1xuY29uc3QgZW5kU2Vjb25kYXJ5UGxhY2VtZW50ID0gLy0oYm90dG9tfHJpZ2h0KSQvO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvcHBlckNsYXNzUGxhY2VtZW50KHBsYWNlbWVudDogUGxhY2VtZW50KTogUG9wcGVyUGxhY2VtZW50IHtcbiAgY29uc3QgbmV3UGxhY2VtZW50ID0gcGxhY2VtZW50LnJlcGxhY2Uoc3RhcnRQcmltYXJ5UGxhY2VtZW50LCAnbGVmdCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShlbmRQcmltYXJ5UGxhY2VtZW50LCAncmlnaHQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2Uoc3RhcnRTZWNvbmRhcnlQbGFjZW1lbnQsICctc3RhcnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoZW5kU2Vjb25kYXJ5UGxhY2VtZW50LCAnLWVuZCcpIGFzIFBvcHBlclBsYWNlbWVudDtcbiAgcmV0dXJuIG5ld1BsYWNlbWVudDtcbn1cblxuY29uc3QgcG9wcGVyU3RhcnRQcmltYXJ5UGxhY2VtZW50ID0gL15sZWZ0LztcbmNvbnN0IHBvcHBlckVuZFByaW1hcnlQbGFjZW1lbnQgPSAvXnJpZ2h0LztcbmNvbnN0IHBvcHBlclN0YXJ0U2Vjb25kYXJ5UGxhY2VtZW50ID0gL15zdGFydC87XG5jb25zdCBwb3BwZXJFbmRTZWNvbmRhcnlQbGFjZW1lbnQgPSAvXmVuZC87XG5leHBvcnQgZnVuY3Rpb24gZ2V0Qm9vdHN0cmFwQmFzZUNsYXNzUGxhY2VtZW50KGJhc2VDbGFzczogc3RyaW5nLCBwbGFjZW1lbnQ6IFBvcHBlclBsYWNlbWVudCk6IHN0cmluZyB7XG4gIGxldCBbcHJpbWFyeSwgc2Vjb25kYXJ5XSA9IHBsYWNlbWVudC5zcGxpdCgnLScpO1xuICBjb25zdCBuZXdQcmltYXJ5ID0gcHJpbWFyeS5yZXBsYWNlKHBvcHBlclN0YXJ0UHJpbWFyeVBsYWNlbWVudCwgJ3N0YXJ0JykucmVwbGFjZShwb3BwZXJFbmRQcmltYXJ5UGxhY2VtZW50LCAnZW5kJyk7XG4gIGxldCBjbGFzc25hbWVzID0gW25ld1ByaW1hcnldO1xuICBpZiAoc2Vjb25kYXJ5KSB7XG4gICAgbGV0IG5ld1NlY29uZGFyeSA9IHNlY29uZGFyeTtcbiAgICBpZiAocHJpbWFyeSA9PT0gJ2xlZnQnIHx8IHByaW1hcnkgPT09ICdyaWdodCcpIHtcbiAgICAgIG5ld1NlY29uZGFyeSA9XG4gICAgICAgICAgbmV3U2Vjb25kYXJ5LnJlcGxhY2UocG9wcGVyU3RhcnRTZWNvbmRhcnlQbGFjZW1lbnQsICd0b3AnKS5yZXBsYWNlKHBvcHBlckVuZFNlY29uZGFyeVBsYWNlbWVudCwgJ2JvdHRvbScpO1xuICAgIH1cbiAgICBjbGFzc25hbWVzLnB1c2goYCR7bmV3UHJpbWFyeX0tJHtuZXdTZWNvbmRhcnl9YCBhcyBQbGFjZW1lbnQpO1xuICB9XG4gIGlmIChiYXNlQ2xhc3MpIHtcbiAgICBjbGFzc25hbWVzID0gY2xhc3NuYW1lcy5tYXAoKGNsYXNzbmFtZSkgPT4gYCR7YmFzZUNsYXNzfS0ke2NsYXNzbmFtZX1gKTtcbiAgfVxuICByZXR1cm4gY2xhc3NuYW1lcy5qb2luKCcgJyk7XG59XG5cbi8qXG4gKiBBY2NlcHQgdGhlIHBsYWNlbWVudCBhcnJheSBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGUgcGxhY2VtZW50IGRlcGVuZGVudCBvbiB0aGUgdmlld3BvcnQuXG4gKiBSZXR1cm5zIHRoZSBhcHBsaWVkIHBsYWNlbWVudC5cbiAqIEluIGNhc2Ugb2YgYXV0byBwbGFjZW1lbnQsIHBsYWNlbWVudHMgYXJlIHNlbGVjdGVkIGluIG9yZGVyXG4gKiAgICd0b3AnLCAnYm90dG9tJywgJ3N0YXJ0JywgJ2VuZCcsXG4gKiAgICd0b3Atc3RhcnQnLCAndG9wLWVuZCcsXG4gKiAgICdib3R0b20tc3RhcnQnLCAnYm90dG9tLWVuZCcsXG4gKiAgICdzdGFydC10b3AnLCAnc3RhcnQtYm90dG9tJyxcbiAqICAgJ2VuZC10b3AnLCAnZW5kLWJvdHRvbScuXG4gKiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBvcHBlck9wdGlvbnMoe3BsYWNlbWVudCwgYmFzZUNsYXNzfTogUG9zaXRpb25pbmdPcHRpb25zKTogUGFydGlhbDxPcHRpb25zPiB7XG4gIGxldCBwbGFjZW1lbnRWYWxzOiBBcnJheTxQbGFjZW1lbnQ+ID1cbiAgICAgIEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudCA6IHBsYWNlbWVudC5zcGxpdChwbGFjZW1lbnRTZXBhcmF0b3IpIGFzIEFycmF5PFBsYWNlbWVudD47XG5cbiAgLy8gTm8gbmVlZCB0byBjb25zaWRlciBsZWZ0IGFuZCByaWdodCBoZXJlLCBhcyBzdGFydCBhbmQgZW5kIGFyZSBlbm91Z2gsIGFuZCBpdCBpcyB1c2VkIGZvciAnYXV0bycgcGxhY2VtZW50IG9ubHlcbiAgY29uc3QgYWxsb3dlZFBsYWNlbWVudHMgPSBbXG4gICAgJ3RvcCcsICdib3R0b20nLCAnc3RhcnQnLCAnZW5kJywgJ3RvcC1zdGFydCcsICd0b3AtZW5kJywgJ2JvdHRvbS1zdGFydCcsICdib3R0b20tZW5kJywgJ3N0YXJ0LXRvcCcsICdzdGFydC1ib3R0b20nLFxuICAgICdlbmQtdG9wJywgJ2VuZC1ib3R0b20nXG4gIF07XG5cbiAgLy8gcmVwbGFjZSBhdXRvIHBsYWNlbWVudCB3aXRoIG90aGVyIHBsYWNlbWVudHNcbiAgbGV0IGhhc0F1dG8gPSBwbGFjZW1lbnRWYWxzLmZpbmRJbmRleCh2YWwgPT4gdmFsID09PSAnYXV0bycpO1xuICBpZiAoaGFzQXV0byA+PSAwKSB7XG4gICAgYWxsb3dlZFBsYWNlbWVudHMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChwbGFjZW1lbnRWYWxzLmZpbmQodmFsID0+IHZhbC5zZWFyY2goJ14nICsgb2JqKSAhPT0gLTEpID09IG51bGwpIHtcbiAgICAgICAgcGxhY2VtZW50VmFscy5zcGxpY2UoaGFzQXV0bysrLCAxLCBvYmogYXMgUGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHBvcHBlclBsYWNlbWVudHMgPSBwbGFjZW1lbnRWYWxzLm1hcCgoX3BsYWNlbWVudCkgPT4geyByZXR1cm4gZ2V0UG9wcGVyQ2xhc3NQbGFjZW1lbnQoX3BsYWNlbWVudCk7IH0pO1xuXG4gIGxldCBtYWluUGxhY2VtZW50ID0gcG9wcGVyUGxhY2VtZW50cy5zaGlmdCgpO1xuXG4gIGNvbnN0IGJzTW9kaWZpZXI6IFBhcnRpYWw8TW9kaWZpZXI8YW55LCBhbnk+PiA9IHtcbiAgICBuYW1lOiAnYm9vdHN0cmFwQ2xhc3NlcycsXG4gICAgZW5hYmxlZDogISFiYXNlQ2xhc3MsXG4gICAgcGhhc2U6ICd3cml0ZScsXG4gICAgZm4oe3N0YXRlfSkge1xuICAgICAgY29uc3QgYnNDbGFzc1JlZ0V4cCA9IG5ldyBSZWdFeHAoYmFzZUNsYXNzICsgJy1bYS16XSsnLCAnZ2knKTtcblxuICAgICAgY29uc3QgcG9wcGVyRWxlbWVudDogSFRNTEVsZW1lbnQgPSBzdGF0ZS5lbGVtZW50cy5wb3BwZXIgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBwb3BwZXJQbGFjZW1lbnQgPSBzdGF0ZS5wbGFjZW1lbnQ7XG5cbiAgICAgIGxldCBjbGFzc05hbWUgPSBwb3BwZXJFbGVtZW50LmNsYXNzTmFtZTtcblxuICAgICAgLy8gUmVtb3ZlIG9sZCBib290c3RyYXAgY2xhc3Nlc1xuICAgICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lLnJlcGxhY2UoYnNDbGFzc1JlZ0V4cCwgJycpO1xuXG4gICAgICAvLyBBZGQgY3VycmVudCBwbGFjZW1lbnRzXG4gICAgICBjbGFzc05hbWUgKz0gYCAke2dldEJvb3RzdHJhcEJhc2VDbGFzc1BsYWNlbWVudChiYXNlQ2xhc3MgISwgcG9wcGVyUGxhY2VtZW50KX1gO1xuXG4gICAgICAvLyBSZW1vdmUgbXVsdGlwbGUgc3BhY2VzXG4gICAgICBjbGFzc05hbWUgPSBjbGFzc05hbWUudHJpbSgpLnJlcGxhY2Uoc3BhY2VzUmVnRXhwLCAnICcpO1xuXG4gICAgICAvLyBSZWFzc2lnblxuICAgICAgcG9wcGVyRWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYWNlbWVudDogbWFpblBsYWNlbWVudCxcbiAgICBtb2RpZmllcnM6IFtcbiAgICAgIGJzTW9kaWZpZXIsXG4gICAgICBmbGlwLFxuICAgICAgcHJldmVudE92ZXJmbG93LFxuICAgICAgYXJyb3csXG4gICAgICB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIG5hbWU6ICdmbGlwJyxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGZhbGxiYWNrUGxhY2VtZW50czogcG9wcGVyUGxhY2VtZW50cyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIG5hbWU6ICdwcmV2ZW50T3ZlcmZsb3cnLFxuICAgICAgICBwaGFzZTogJ21haW4nLFxuICAgICAgICBmbjogZnVuY3Rpb24oKSB7fSxcbiAgICAgIH0sXG4gICAgXVxuICB9O1xufVxuXG5leHBvcnQgdHlwZSBQbGFjZW1lbnQgPSAnYXV0bycgfCAndG9wJyB8ICdib3R0b20nIHwgJ3N0YXJ0JyB8ICdsZWZ0JyB8ICdlbmQnIHwgJ3JpZ2h0JyB8ICd0b3Atc3RhcnQnIHwgJ3RvcC1sZWZ0JyB8XG4gICAgJ3RvcC1lbmQnIHwgJ3RvcC1yaWdodCcgfCAnYm90dG9tLXN0YXJ0JyB8ICdib3R0b20tbGVmdCcgfCAnYm90dG9tLWVuZCcgfCAnYm90dG9tLXJpZ2h0JyB8ICdzdGFydC10b3AnIHxcbiAgICAnbGVmdC10b3AnIHwgJ3N0YXJ0LWJvdHRvbScgfCAnbGVmdC1ib3R0b20nIHwgJ2VuZC10b3AnIHwgJ3JpZ2h0LXRvcCcgfCAnZW5kLWJvdHRvbScgfCAncmlnaHQtYm90dG9tJztcblxuZXhwb3J0IHR5cGUgUGxhY2VtZW50QXJyYXkgPSBQbGFjZW1lbnQgfCBBcnJheTxQbGFjZW1lbnQ+fCBzdHJpbmc7XG5cbmludGVyZmFjZSBQb3NpdGlvbmluZ09wdGlvbnMge1xuICBob3N0RWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBwbGFjZW1lbnQ6IHN0cmluZyB8IFBsYWNlbWVudCB8IFBsYWNlbWVudEFycmF5O1xuICBhcHBlbmRUb0JvZHk/OiBib29sZWFuO1xuICBiYXNlQ2xhc3M/OiBzdHJpbmc7XG4gIHVwZGF0ZVBvcHBlck9wdGlvbnM/OiAob3B0aW9uczogUGFydGlhbDxPcHRpb25zPikgPT4gUGFydGlhbDxPcHRpb25zPjtcbn1cblxuZnVuY3Rpb24gbm9vcChhcmcpIHtcbiAgcmV0dXJuIGFyZztcbn1cbmV4cG9ydCBmdW5jdGlvbiBuZ2JQb3NpdGlvbmluZygpIHtcbiAgbGV0IHBvcHBlckluc3RhbmNlOiBJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUG9wcGVyKHBvc2l0aW9uaW5nT3B0aW9uOiBQb3NpdGlvbmluZ09wdGlvbnMpIHtcbiAgICAgIGlmICghcG9wcGVySW5zdGFuY2UpIHtcbiAgICAgICAgY29uc3QgdXBkYXRlUG9wcGVyT3B0aW9ucyA9IHBvc2l0aW9uaW5nT3B0aW9uLnVwZGF0ZVBvcHBlck9wdGlvbnMgfHwgbm9vcDtcbiAgICAgICAgbGV0IHBvcHBlck9wdGlvbnMgPSB1cGRhdGVQb3BwZXJPcHRpb25zKGdldFBvcHBlck9wdGlvbnMocG9zaXRpb25pbmdPcHRpb24pKTtcbiAgICAgICAgcG9wcGVySW5zdGFuY2UgPVxuICAgICAgICAgICAgY3JlYXRlUG9wcGVyTGl0ZShwb3NpdGlvbmluZ09wdGlvbi5ob3N0RWxlbWVudCwgcG9zaXRpb25pbmdPcHRpb24udGFyZ2V0RWxlbWVudCwgcG9wcGVyT3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGUoKSB7XG4gICAgICBpZiAocG9wcGVySW5zdGFuY2UpIHtcbiAgICAgICAgcG9wcGVySW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBzZXRPcHRpb25zKHBvc2l0aW9uaW5nT3B0aW9uOiBQb3NpdGlvbmluZ09wdGlvbnMpIHtcbiAgICAgIGlmIChwb3BwZXJJbnN0YW5jZSkge1xuICAgICAgICBjb25zdCB1cGRhdGVQb3BwZXJPcHRpb25zID0gcG9zaXRpb25pbmdPcHRpb24udXBkYXRlUG9wcGVyT3B0aW9ucyB8fCBub29wO1xuICAgICAgICBsZXQgcG9wcGVyT3B0aW9ucyA9IHVwZGF0ZVBvcHBlck9wdGlvbnMoZ2V0UG9wcGVyT3B0aW9ucyhwb3NpdGlvbmluZ09wdGlvbikpO1xuICAgICAgICBwb3BwZXJJbnN0YW5jZS5zZXRPcHRpb25zKHBvcHBlck9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0sXG4gICAgZGVzdHJveSgpIHtcbiAgICAgIGlmIChwb3BwZXJJbnN0YW5jZSkge1xuICAgICAgICBwb3BwZXJJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgIHBvcHBlckluc3RhbmNlID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXX0=