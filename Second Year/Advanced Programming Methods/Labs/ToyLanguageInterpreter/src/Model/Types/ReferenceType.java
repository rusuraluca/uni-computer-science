package Model.Types;

import Model.Values.IValue;
import Model.Values.ReferenceValue;

/**
 * Class for Reference types
 */
public class ReferenceType implements IType {
    private final IType inner;

    public ReferenceType(IType inner) {
        this.inner = inner;
    }

    public IType getInner() {
        return this.inner;
    }

    @Override
    public IValue defaultValue() {
        return new ReferenceValue(0, inner);
    }

    @Override
    public boolean equals(IType another) {
        if (another instanceof ReferenceType)
            return inner.equals(((ReferenceType) another).getInner());

        return false;
    }

    @Override
    public String toString() {
        return String.format("ref(%s)", inner);
    }
}
