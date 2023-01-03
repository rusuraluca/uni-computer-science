package Model.Values;

import Model.Types.IType;
import Model.Types.ReferenceType;

import java.util.Objects;

/**
 * Class for Reference values
 */
public class ReferenceValue implements IValue {
    private final int address;
    private final IType locationType;

    public ReferenceValue(int address, IType locationType) {
        this.address = address;
        this.locationType = locationType;
    }

    public int getAddress() {
        return this.address;
    }

    public IType getLocationType() {
        return this.locationType;
    }

    @Override
    public IType getType() {
        return new ReferenceType(locationType);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReferenceValue that = (ReferenceValue) o;
        return address == that.address && Objects.equals(locationType, that.locationType);
    }

    @Override
    public String toString() {
        return String.format("ref(%d, %s)", address, locationType);
    }
}

