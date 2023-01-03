package Model.Types;

import Model.Values.IntValue;

import Model.Values.IValue;

/**
 * Class for Int types
 */
public class IntType implements IType {
    @Override
    public IValue defaultValue() {
        return new IntValue(0);
    }

    @Override
    public boolean equals(IType another) {
        if (another instanceof IntType)
            return true;

        return false;
    }

    @Override
    public String toString() {
        return "int";
    }
}
