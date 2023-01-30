package Model.Value;

import Model.Types.IntType;
import Model.Types.Type;

public class IntValue implements Value{
    private final int value;

    public IntValue(int value) {
        this.value = value;
    }

    @Override
    public Type getType() {
        return new IntType();
    }

    @Override
    public boolean equals(Object anotherValue) {
        if (!(anotherValue instanceof IntValue))
            return false;
        IntValue castValue = (IntValue) anotherValue;
        return this.value == castValue.value;
    }

    @Override
    public Value deepCopy() {
        return new IntValue(value);
    }

    public int getValue() {
        return this.value;
    }

    @Override
    public String toString() {
        return String.format("%d", this.value);
    }
}