import { offset as offsetModifier } from '@popperjs/core';
export function addPopperOffset(offset) {
    return (options) => {
        options.modifiers.push(offsetModifier, {
            name: 'offset',
            options: {
                offset: () => offset,
            },
        });
        return options;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb25pbmctdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy91dGlsL3Bvc2l0aW9uaW5nLXV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sSUFBSSxjQUFjLEVBQVUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRSxNQUFNLFVBQVUsZUFBZSxDQUFDLE1BQWdCO0lBQzlDLE9BQU8sQ0FBQyxPQUFnQixFQUFFLEVBQUU7UUFDMUIsT0FBTyxDQUFDLFNBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZDLElBQUksRUFBRSxRQUFRO1lBQ2QsT0FBTyxFQUFFO2dCQUNQLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7b2Zmc2V0IGFzIG9mZnNldE1vZGlmaWVyLCBPcHRpb25zfSBmcm9tICdAcG9wcGVyanMvY29yZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRQb3BwZXJPZmZzZXQob2Zmc2V0OiBudW1iZXJbXSkge1xuICByZXR1cm4gKG9wdGlvbnM6IE9wdGlvbnMpID0+IHtcbiAgICBvcHRpb25zLm1vZGlmaWVycyAhLnB1c2gob2Zmc2V0TW9kaWZpZXIsIHtcbiAgICAgIG5hbWU6ICdvZmZzZXQnLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBvZmZzZXQ6ICgpID0+IG9mZnNldCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfTtcbn1cbiJdfQ==