package Model.Values;

import Model.Types.IntType;

import Model.Types.IType;

/**
 * Class for Int values
 */
public class IntValue implements IValue {
    private final int val;

    public IntValue(int v) {
        this.val = v;
    }

    public int getValue() {
        return this.val;
    }

    @Override
    public IType getType() {
        return new IntType();
    }

    @Override
    public boolean equals(Object another) {
        if (another instanceof IntValue) {
            IntValue anotherInt = (IntValue) another;
            return this.val == anotherInt.getValue();
        }
        return false;
    }

    @Override
    public String toString() {
        return String.format("%d", this.val);
    }
}
