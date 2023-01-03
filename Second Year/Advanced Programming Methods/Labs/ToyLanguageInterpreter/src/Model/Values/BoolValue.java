package Model.Values;

import Model.Types.BoolType;

import Model.Types.IType;

/**
 * Class for Boolean values
 */
public class BoolValue implements IValue {
    private final boolean val;

    public BoolValue(boolean v) {
        this.val = v;
    }

    public boolean getVal() {
        return this.val;
    }

    @Override
    public IType getType() {
        return new BoolType();
    }

    @Override
    public boolean equals(Object another) {
        if (another instanceof BoolValue) {
            BoolValue anotherBool = (BoolValue) another;
            return this.val == anotherBool.getVal();
        }

        return false;
    }

    @Override
    public String toString() {
        return this.val ? "true" : "false";
    }
}
